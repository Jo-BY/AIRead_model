// AIRead ERD 문서 3~4장: 상용 DB 전환 제안 + 부록.
const { AlignmentType } = require("docx");
const { h1, h2, h3, p, bullet, note, dataTable, tableSpacer, codeBlock } = require("./lib/docxHelpers");
const { img, colTable } = require("./erd-doc-sections-1");

async function buildProductionProposal() {
  return [
    h1("3. 상용 DB 전환 제안"),
    h2("3.1 제안 배경 및 목표"),
    p("현재 SQLite 기반 구조는 로컬/단일 서버 운영에는 충분하지만, 실제 서비스 확장(다중 학교, 다중 서버 인스턴스, 관리형 백업/복제)을 고려하면 다음과 같은 한계가 있다."),
    dataTable(
      [
        { header: "현재 한계", width: 40 },
        { header: "전환 목표", width: 60 }
      ],
      [
        ["단일 파일 SQLite, 동시 다중 쓰기 시 잠금 경합 발생 가능", "PostgreSQL 등 클라이언트/서버형 RDBMS로 전환해 동시성 제어 강화"],
        ["다중 서버 인스턴스(수평 확장) 구조로 확장 불가 (파일 하나를 공유해야 함)", "네트워크 기반 DB 서버로 여러 WAS 인스턴스가 하나의 DB에 안전하게 접속"],
        ["교사 로그인이 TEACHER_PASSWORD 단일 공유 비밀번호 (해시 없음)", "users 테이블 + password_hash/password_salt(bcrypt) 기반 개별 계정 인증"],
        ["school/class_name이 모든 행에 평문 문자열로 반복 저장(비정규화)", "schools/classes 테이블로 정규화, 여러 학교를 대상으로 하는 멀티테넌시 대비"],
        ["feedback_json/evidence_json 등이 TEXT 컬럼(문자열)이라 서버 측 검색·인덱싱 불가", "PostgreSQL JSONB 컬럼으로 전환해 부분 검색·GIN 인덱싱 지원"],
        ["관리형 백업/복제/모니터링 기능 부재 (파일 백업을 직접 관리해야 함)", "RDS/Cloud SQL/Supabase/Neon 등 관리형 서비스의 자동 백업·복제 활용"]
      ]
    ),
    tableSpacer(),
    h2("3.2 제안 ERD - 인증/조직/트랜잭션 도메인"),
    p(
      "레퍼런스 도메인(literacy_rubric/curriculum_standards/recommended_textbooks/recommended_books)과 discussion_*, ai_diagnoses 테이블은 구조 변경 없이 타입만 PostgreSQL로 전환하면 되므로, 아래 제안 다이어그램은 실질적인 구조 변경이 발생하는 인증/조직/트랜잭션 도메인에 집중한다."
    ),
    ...(await img("erd-production.png", { targetWidth: 900, caption: "그림 3-1. 상용 DB 전환 제안 ERD (PostgreSQL 기준)" })),
    h3("3.2.1 신규 테이블: schools"),
    colTable([
      ["id", "BIGSERIAL", "N", "자동 증가", "PK", "학교 고유 ID"],
      ["name", "TEXT", "N", "-", "", "학교명"],
      ["region", "TEXT", "Y", "NULL", "", "지역 (시/도 교육청 단위 집계용)"],
      ["created_at", "TIMESTAMPTZ", "N", "now()", "", "생성 시각"]
    ]),
    h3("3.2.2 신규 테이블: classes"),
    colTable([
      ["id", "BIGSERIAL", "N", "자동 증가", "PK", "학급 고유 ID"],
      ["school_id", "BIGINT", "N", "-", "FK", "→ schools.id"],
      ["grade", "SMALLINT", "N", "-", "", "학년(1~6)"],
      ["class_name", "TEXT", "N", "-", "", "반 이름"],
      ["school_year", "SMALLINT", "Y", "NULL", "", "학년도 (연도별 반 편성 구분)"],
      ["created_at", "TIMESTAMPTZ", "N", "now()", "", "생성 시각"]
    ]),
    h3("3.2.3 신규 테이블: users (학생 + 교사 통합 계정)"),
    colTable([
      ["id", "BIGSERIAL", "N", "자동 증가", "PK", "사용자 고유 ID"],
      ["role", "TEXT", "N", "-", "", "student / teacher / admin"],
      ["name", "TEXT", "N", "-", "", "이름"],
      ["password_hash", "TEXT", "N", "-", "", "bcrypt 해시"],
      ["password_salt", "TEXT", "N", "-", "", "bcrypt salt (라이브러리에 따라 해시에 포함될 수 있어 선택적)"],
      ["email", "TEXT", "Y", "NULL", "", "이메일 (교사 계정 복구용, 학생은 NULL 허용)"],
      ["school_id", "BIGINT", "Y", "NULL", "FK", "→ schools.id (교사 소속)"],
      ["class_id", "BIGINT", "Y", "NULL", "FK", "→ classes.id (학생 소속)"],
      ["student_number", "SMALLINT", "Y", "NULL", "", "출석 번호 (학생 전용)"],
      ["created_at / updated_at", "TIMESTAMPTZ", "N", "now()", "", "생성/수정 시각"],
      ["last_login_at", "TIMESTAMPTZ", "Y", "NULL", "", "마지막 로그인 시각"]
    ]),
    note(
      "학생/교사를 하나의 users 테이블로 통합하고 role 컬럼으로 구분하는 것을 제안한다. 현재 코드처럼 완전히 별도 로그인 로직을 유지하고 싶다면 students/teachers 2개 테이블로 분리하는 대안도 가능하다 - 이 경우 school_id/class_id를 각각의 테이블에 알맞게 재배치한다."
    ),
    h3("3.2.4 기존 테이블 변경 사항"),
    dataTable(
      [
        { header: "테이블", width: 20 },
        { header: "변경 내용", width: 80 }
      ],
      [
        ["assignments", "teacher_id(BIGINT FK→users.id), class_id(BIGINT FK→classes.id) 컬럼 추가 - 어떤 교사가 어느 학급 대상으로 생성했는지 추적"],
        ["book_reflections", "student_id 참조 대상이 student_accounts.id → users.id로 변경 (구조 자체는 동일)"],
        ["assignment_submissions", "comprehension~vocab_grammar 5개 개별 INTEGER 컬럼을 scores(JSONB) 컬럼 하나로 통합 - 평가 지표가 추가/변경되어도 스키마 변경 없이 확장 가능. feedback_json/evidence_json도 각각 feedback/evidence(JSONB)로 전환"],
        ["literacy_evaluations", "assignment_submissions와 동일하게 scores/feedback/evidence를 JSONB로 통합"]
      ]
    ),
    tableSpacer(),
    h2("3.3 마이그레이션 절차"),
    dataTable(
      [
        { header: "단계", width: 8, alignment: AlignmentType.CENTER },
        { header: "작업", width: 30 },
        { header: "세부 내용", width: 62 }
      ],
      [
        ["1", "스키마 이관", "본 문서 3.2절 제안 스키마 기준으로 PostgreSQL DDL 작성 (4.1절 예시 참고). INTEGER PK AUTOINCREMENT → BIGSERIAL, TEXT(JSON 문자열) → JSONB로 전환"],
        ["2", "데이터 이관", "기존 literacy.db의 각 테이블을 CSV로 export 후 PostgreSQL COPY 명령으로 import, 또는 pgloader 같은 SQLite→PostgreSQL 전용 마이그레이션 툴 사용. JSON 문자열 컬럼은 이관 시 ::jsonb 캐스팅"],
        ["3", "레퍼런스 데이터 재시드", "DB/seed_reference_data.js를 PostgreSQL 드라이버 기준으로 포팅해 literacy_rubric/curriculum_standards/recommended_* 재시드"],
        ["4", "애플리케이션 코드 변경", "DB/database.js의 better-sqlite3 동기 API(.prepare().get()/.all()/.run())를 pg Pool 기반 비동기 API로 교체. server.js 라우트는 이미 대부분 async 함수라 await 추가만으로 대응 가능. db.transaction()은 BEGIN/COMMIT/ROLLBACK 또는 라이브러리 트랜잭션 헬퍼로 대체"],
        ["5", "연동 설정", "DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/DB_SSL 환경변수(또는 단일 DATABASE_URL) 추가, 커넥션 풀(max connections) 설정"],
        ["6", "인덱스 재생성", "모든 FK 컬럼(student_id, assignment_id, reflection_id, session_id, class_id, school_id 등)에 인덱스 생성 - SQLite는 소규모 데이터에서 생략해도 무방했으나 상용 환경에서는 필수"],
        ["7", "인증 전환", "TEACHER_PASSWORD 단일 비밀번호 로그인을 users 테이블 기반 bcrypt 인증으로 교체, 기존 교사 계정을 위한 초기 비밀번호 발급/변경 절차 마련"],
        ["8", "점진적 검증", "이관 직후 로컬 SQLite와 신규 PostgreSQL의 응답 결과를 동일 요청으로 비교(회귀 테스트) 후 트래픽 전환"]
      ]
    ),
    tableSpacer(),
    h2("3.4 권장 기술 스택"),
    dataTable(
      [
        { header: "구분", width: 22 },
        { header: "권장", width: 30 },
        { header: "비고", width: 48 }
      ],
      [
        ["DBMS", "PostgreSQL 15 이상", "JSONB, 강력한 동시성 제어, 관리형 서비스 생태계가 풍부"],
        ["Node 드라이버", "pg (node-postgres) 또는 postgres.js", "pg는 가장 널리 쓰이는 표준 드라이버, Pool로 커넥션 풀링 지원"],
        ["쿼리 빌더/ORM", "Prisma 또는 Drizzle ORM (택1)", "Prisma: 스키마 선언+마이그레이션 자동화 강점 / Drizzle: SQL에 가까운 타입세이프 쿼리, 경량"],
        ["마이그레이션 툴", "node-pg-migrate 또는 Prisma Migrate", "버전 관리되는 마이그레이션 파일로 스키마 변경 이력 관리"],
        ["커넥션 풀링", "pg.Pool (앱 내장) 또는 PgBouncer (외부)", "서버리스/다중 인스턴스 환경에서는 PgBouncer 등 외부 풀러 권장"],
        ["관리형 호스팅 후보", "Supabase, Neon, AWS RDS, GCP Cloud SQL, Render Postgres", "무료/저비용 티어부터 시작 가능한 Supabase·Neon이 소규모 전환에 적합"]
      ]
    ),
    tableSpacer()
  ];
}

function buildErdAppendix() {
  return [
    h1("4. 부록"),
    h2("4.1 PostgreSQL DDL 예시"),
    p("제안 스키마 중 신규 테이블 3종의 DDL 예시이다. 나머지 테이블은 기존 SQLite DDL(2장)에서 타입만 아래 매핑표를 적용해 변환한다."),
    codeBlock([
      "CREATE TABLE schools (",
      "  id BIGSERIAL PRIMARY KEY,",
      "  name TEXT NOT NULL,",
      "  region TEXT,",
      "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
      ");",
      "",
      "CREATE TABLE classes (",
      "  id BIGSERIAL PRIMARY KEY,",
      "  school_id BIGINT NOT NULL REFERENCES schools(id),",
      "  grade SMALLINT NOT NULL,",
      "  class_name TEXT NOT NULL,",
      "  school_year SMALLINT,",
      "  created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
      ");",
      "CREATE INDEX idx_classes_school_id ON classes(school_id);",
      "",
      "CREATE TABLE users (",
      "  id BIGSERIAL PRIMARY KEY,",
      "  role TEXT NOT NULL CHECK (role IN ('student','teacher','admin')),",
      "  name TEXT NOT NULL,",
      "  password_hash TEXT NOT NULL,",
      "  password_salt TEXT NOT NULL,",
      "  email TEXT,",
      "  school_id BIGINT REFERENCES schools(id),",
      "  class_id BIGINT REFERENCES classes(id),",
      "  student_number SMALLINT,",
      "  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),",
      "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),",
      "  last_login_at TIMESTAMPTZ",
      ");",
      "CREATE UNIQUE INDEX idx_users_class_student_number ON users(class_id, student_number) WHERE role = 'student';"
    ]),
    h2("4.2 타입 매핑표 (SQLite → PostgreSQL)"),
    dataTable(
      [
        { header: "SQLite 타입/패턴", width: 40 },
        { header: "PostgreSQL 타입", width: 30 },
        { header: "비고", width: 30 }
      ],
      [
        ["INTEGER PRIMARY KEY AUTOINCREMENT", "BIGSERIAL PRIMARY KEY", "-"],
        ["INTEGER (일반 컬럼)", "INTEGER 또는 SMALLINT", "점수(1~5)류는 SMALLINT로 축소 가능"],
        ["TEXT", "TEXT 또는 VARCHAR(n)", "길이 제한이 필요한 경우만 VARCHAR"],
        ["TEXT (JSON 문자열 저장)", "JSONB", "*_json 접미사 컬럼(feedback_json, evidence_json 등) 전체 대상"],
        ["INTEGER (0/1 불리언 용도)", "BOOLEAN", "verified, needs_review 등"],
        ["TEXT DEFAULT CURRENT_TIMESTAMP", "TIMESTAMPTZ DEFAULT now()", "타임존 포함 저장 권장"]
      ]
    ),
    tableSpacer(),
    h2("4.3 환경변수 매핑표"),
    dataTable(
      [
        { header: "현재 (SQLite)", width: 30 },
        { header: "전환 후 (PostgreSQL 예시)", width: 40 },
        { header: "비고", width: 30 }
      ],
      [
        ["DB_DIR / DB_PATH", "DATABASE_URL (또는 DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME)", "연결 문자열 1개로 통합하는 것을 권장 (postgres://user:pass@host:port/db)"],
        ["(없음)", "DB_SSL", "관리형 서비스는 대부분 SSL 필수 (예: Supabase, RDS)"],
        ["(없음)", "DB_POOL_MAX", "커넥션 풀 최대 개수 (서버리스 환경은 낮게, 상시 서버는 트래픽에 맞게 설정)"],
        ["TEACHER_PASSWORD", "(제거, users 테이블 기반 인증으로 대체)", "환경변수 공유 비밀번호 방식 폐지"]
      ]
    ),
    tableSpacer(),
    h2("4.4 관련 문서"),
    bullet("AIRead_설계문서.docx - 시스템 구조, 서비스 프로세스, LLM 상세 구조"),
    bullet("AIRead_API기능정의서.xlsx - REST API 상세 명세"),
    bullet("DB/database.js - 현재 SQLite 스키마 원본"),
    bullet("DB/seed_reference_data.js - 레퍼런스 데이터 시드 스크립트")
  ];
}

module.exports = { buildProductionProposal, buildErdAppendix };
