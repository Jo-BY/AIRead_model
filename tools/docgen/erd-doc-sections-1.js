// AIRead ERD 및 DB 설계서(.docx) 생성 스크립트.
// 실행: node tools/docgen/generate-erd-doc.js  → docs/AIRead_ERD_DB설계서.docx
const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  PageOrientation,
  convertInchesToTwip,
  AlignmentType,
  HeadingLevel
} = require("docx");
const { h1, h2, h3, p, bullet, note, imageParagraph, dataTable, tableSpacer, codeBlock, pageNumberFooter, titlePage } = require("./lib/docxHelpers");

const ASSETS = path.join(__dirname, "assets");
const OUT_PATH = path.join(__dirname, "..", "..", "docs", "AIRead_ERD_DB설계서.docx");

async function img(filename, opts = {}) {
  return imageParagraph(path.join(ASSETS, filename), opts);
}

function colTable(rows) {
  return dataTable(
    [
      { header: "컬럼명", width: 22 },
      { header: "타입", width: 14, alignment: AlignmentType.CENTER },
      { header: "NULL", width: 8, alignment: AlignmentType.CENTER },
      { header: "기본값", width: 14, alignment: AlignmentType.CENTER },
      { header: "키", width: 8, alignment: AlignmentType.CENTER },
      { header: "설명", width: 34 }
    ],
    rows
  );
}

// ---------------------------------------------------------------------------
// 1. 개요
// ---------------------------------------------------------------------------
function buildOverview() {
  return [
    h1("1. 개요"),
    p(
      "본 문서는 AIRead 서비스의 현재 데이터베이스(SQLite, DB/database.js) 구조를 ERD와 테이블 명세로 정리하고, 추후 상용 DB 서버(PostgreSQL 기준)를 세팅하고 연동할 때 참고할 수 있도록 전환 제안 스키마를 함께 제공한다."
    ),
    h2("1.1 현재 DB 환경"),
    dataTable(
      [
        { header: "항목", width: 30 },
        { header: "내용", width: 70 }
      ],
      [
        ["DBMS", "SQLite 3 (better-sqlite3 11.7.0, 동기 API, 단일 파일)"],
        ["파일 경로", "DB/data/literacy.db (기본값, DB_DIR/DB_PATH 환경변수로 재정의 가능)"],
        ["스키마 관리", "DB/database.js의 initDatabase()가 서버 시작 시 CREATE TABLE IF NOT EXISTS + ALTER TABLE(ensureColumn)로 자동 마이그레이션"],
        ["테이블 수", "12개 (트랜잭션 5 + 레퍼런스 4 + 부가기능 3)"],
        ["제약", "단일 프로세스·단일 파일 기반이라 다중 서버 인스턴스 확장, 동시 다중 쓰기, 관리형 백업/복제에 근본적 한계가 있음"]
      ]
    ),
    tableSpacer(),
    h2("1.2 문서 구성"),
    bullet("2장: 현재 SQLite 스키마의 ERD와 테이블별 상세 컬럼 명세"),
    bullet("3장: 상용 DB(PostgreSQL) 전환 제안 ERD, 마이그레이션 절차, 권장 기술 스택"),
    bullet("4장: 부록 - DDL 예시, 환경변수 매핑표")
  ];
}

// ---------------------------------------------------------------------------
// 2. 현재 데이터베이스 구조
// ---------------------------------------------------------------------------
async function buildCurrentSchema() {
  return [
    h1("2. 현재 데이터베이스 구조 (SQLite)"),
    h2("2.1 핵심 트랜잭션 도메인"),
    p("학생 계정, 독후감 제출, 평가 결과, 교사 과제 관련 5개 테이블이다."),
    ...(await img("erd-current-core.png", { targetWidth: 900, caption: "그림 2-1. 현재 SQLite ERD - 핵심 트랜잭션 도메인" })),
    h3("2.1.1 student_accounts (학생 계정)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "학생 계정 고유 ID"],
      ["name", "TEXT", "N", "-", "", "학생 이름"],
      ["school", "TEXT", "N", "-", "", "학교명"],
      ["grade", "INTEGER", "N", "1", "", "학년(1~6)"],
      ["class_name", "TEXT", "N", "-", "", "반 이름 (예: 1반)"],
      ["student_number", "INTEGER", "N", "-", "", "출석 번호"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "계정 생성 시각"]
    ]),
    note("UNIQUE INDEX idx_student_accounts_unique(school, grade, class_name, student_number) - 동일 인적사항 조합의 중복 계정 생성을 방지 (로그인 시 조회/생성 기준 키)."),
    h3("2.1.2 book_reflections (독후감 제출)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "제출 고유 ID"],
      ["student_id", "INTEGER", "N", "-", "FK", "→ student_accounts.id"],
      ["book_title", "TEXT", "N", "-", "", "책 제목"],
      ["book_author", "TEXT", "Y", "-", "", "저자"],
      ["reflection_text", "TEXT", "N", "-", "", "감상문 본문"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "제출 시각"],
      ["assignment_id", "INTEGER", "Y", "NULL", "FK", "→ assignments.id (자기주도 제출은 NULL, 교사 과제 제출만 값 존재)"]
    ]),
    h3("2.1.3 literacy_evaluations (평가 결과)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "평가 고유 ID"],
      ["reflection_id", "INTEGER", "N", "-", "FK", "→ book_reflections.id (1:1)"],
      ["total_score", "INTEGER", "N", "-", "", "총점(0~100)"],
      ["comprehension", "INTEGER", "N", "-", "", "내용 이해 점수(1~5)"],
      ["inference", "INTEGER", "N", "-", "", "추론/해석 점수(1~5)"],
      ["critical_thinking", "INTEGER", "N", "-", "", "비판/평가 점수(1~5)"],
      ["expression", "INTEGER", "N", "-", "", "표현/구성 점수(1~5)"],
      ["vocab_grammar", "INTEGER", "N", "-", "", "어휘/문장 사용 점수(1~5)"],
      ["feedback_json", "TEXT", "N", "-", "", "지표별 피드백 (JSON 문자열)"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "평가 시각"],
      ["evidence_json", "TEXT", "Y", "NULL", "", "지표별 근거 인용 (JSON, LLM 경로만 존재)"],
      ["model_version", "TEXT", "Y", "NULL", "", "사용 모델명 또는 rule-based-fallback"],
      ["prompt_version", "TEXT", "Y", "NULL", "", "프롬프트 버전 (예: airead-literacy-v1.2)"],
      ["confidence", "TEXT", "Y", "NULL", "", "채점 확신도 (low/medium/high)"],
      ["needs_review", "INTEGER", "N", "0", "", "교사 재검토 필요 여부 (0/1)"]
    ]),
    h3("2.1.4 assignments (교사 과제)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "과제 고유 ID"],
      ["book_title", "TEXT", "N", "-", "", "과제 도서 제목"],
      ["book_author", "TEXT", "Y", "-", "", "저자"],
      ["summary_text", "TEXT", "N", "-", "", "책 요약본"],
      ["objective", "TEXT", "N", "-", "", "과제 목표"],
      ["due_date", "TEXT", "N", "-", "", "제출 기한"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "과제 생성 시각"]
    ]),
    h3("2.1.5 assignment_submissions (과제 제출)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "제출 고유 ID"],
      ["student_id", "INTEGER", "N", "-", "FK", "→ student_accounts.id"],
      ["assignment_id", "INTEGER", "N", "-", "FK", "→ assignments.id"],
      ["answer_text", "TEXT", "N", "-", "", "과제 답안"],
      ["total_score ~ vocab_grammar", "INTEGER", "N", "-", "", "literacy_evaluations와 동일 구조의 점수 컬럼(중복 저장)"],
      ["feedback_json / evidence_json", "TEXT", "N/Y", "-/NULL", "", "동일 구조의 피드백/근거 JSON"],
      ["model_version / prompt_version / confidence", "TEXT", "Y", "NULL", "", "평가 메타 정보"],
      ["needs_review", "INTEGER", "N", "0", "", "교사 재검토 필요 여부"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "제출 시각"]
    ]),
    note(
      "assignment_submissions는 literacy_evaluations와 점수 컬럼 구조가 중복된다. createAssignmentSubmission()이 book_reflections+literacy_evaluations에도 동시에 INSERT하므로, 같은 평가 결과가 2곳에 이중 저장되는 비정규화 구조이다 (교사 과제 조회 전용 테이블과 통합 대시보드 조회용 테이블을 분리 유지하기 위한 설계)."
    ),
    tableSpacer(),
    h2("2.2 레퍼런스 & 부가기능 도메인"),
    p("루브릭·성취기준·추천 데이터 4개 테이블과 AI 독서토론·AI 진단 이력 3개 테이블이다."),
    ...(await img("erd-current-reference.png", { targetWidth: 900, caption: "그림 2-2. 현재 SQLite ERD - 레퍼런스 & 부가기능 도메인" })),
    h3("2.2.1 literacy_rubric / curriculum_standards / recommended_textbooks / recommended_books"),
    p("4개 테이블 모두 FK 없이 grade_band·indicator_key 값으로만 SQL 필터 조회되는 참조 전용(reference-only) 테이블이다. 상세 컬럼은 설계 문서 4~5~6장을 참고한다."),
    dataTable(
      [
        { header: "테이블", width: 26 },
        { header: "PK", width: 10, alignment: AlignmentType.CENTER },
        { header: "레코드 수", width: 12, alignment: AlignmentType.CENTER },
        { header: "설명" , width: 52}
      ],
      [
        ["literacy_rubric", "id(TEXT)", "75건", "지표×학년군×5단계 행동지표 (설계문서 4장)"],
        ["curriculum_standards", "id(TEXT)", "30건", "2022 개정 국어과 교육과정 성취기준 매핑 (설계문서 6장)"],
        ["recommended_textbooks", "id(TEXT)", "30건", "지표×학년군별 추천 교과서 단원 (설계문서 5장)"],
        ["recommended_books", "id(TEXT)", "30건", "지표×학년군별 추천 도서 (설계문서 5장)"]
      ]
    ),
    tableSpacer(),
    h3("2.2.2 discussion_sessions (AI 독서토론 세션)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "세션 고유 ID"],
      ["student_id", "INTEGER", "N", "-", "FK", "→ student_accounts.id"],
      ["book_title", "TEXT", "N", "-", "", "토론 주제 도서 제목"],
      ["book_author", "TEXT", "Y", "-", "", "저자"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "세션 생성 시각"],
      ["updated_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "마지막 메시지 시각 (메시지 추가 시 갱신)"]
    ]),
    h3("2.2.3 discussion_messages (대화 메시지)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "메시지 고유 ID"],
      ["session_id", "INTEGER", "N", "-", "FK", "→ discussion_sessions.id"],
      ["role", "TEXT", "N", "-", "", "user 또는 assistant"],
      ["content", "TEXT", "N", "-", "", "메시지 본문 (최대 1000자, 서버 검증)"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "작성 시각"]
    ]),
    h3("2.2.4 ai_diagnoses (AI 진단/추천 이력)"),
    colTable([
      ["id", "INTEGER", "N", "AUTOINCREMENT", "PK", "진단 이력 고유 ID"],
      ["student_id", "INTEGER", "N", "-", "FK", "→ student_accounts.id"],
      ["attempt_count", "INTEGER", "N", "0", "", "진단 시점까지의 누적 평가 건수"],
      ["school / grade / class_name", "TEXT/INTEGER", "Y", "NULL", "", "진단 시점 학생 소속 스냅샷"],
      ["headline / overview", "TEXT", "Y", "NULL", "", "진단 제목/개요 서사"],
      ["timeline_insights_json / indicator_insights_json / action_plan_json", "TEXT", "Y", "NULL", "", "타임라인·지표·실행계획 서사 (JSON 배열)"],
      ["textbook_recommendations_json / book_recommendations_json", "TEXT", "Y", "NULL", "", "추천 결과 스냅샷 (JSON 배열)"],
      ["weakest_indicator / strongest_indicator", "TEXT", "Y", "NULL", "", "최약점/최강점 지표 라벨"],
      ["confidence / needs_review / model_version / prompt_version", "TEXT/INTEGER", "Y", "NULL/0", "", "진단 메타 정보"],
      ["created_at", "TEXT", "N", "CURRENT_TIMESTAMP", "", "진단 생성 시각 (히스토리 조회의 정렬 기준)"]
    ]),
    tableSpacer(),
    h2("2.3 외래키(FK) 관계 요약"),
    dataTable(
      [
        { header: "자식 테이블.컬럼", width: 34 },
        { header: "부모 테이블.컬럼", width: 26 },
        { header: "카디널리티", width: 14, alignment: AlignmentType.CENTER },
        { header: "NULL 허용", width: 12, alignment: AlignmentType.CENTER },
        { header: "비고", width: 14 }
      ],
      [
        ["book_reflections.student_id", "student_accounts.id", "N:1", "N", "-"],
        ["book_reflections.assignment_id", "assignments.id", "N:1", "Y", "자기주도 제출 시 NULL"],
        ["literacy_evaluations.reflection_id", "book_reflections.id", "1:1", "N", "-"],
        ["assignment_submissions.student_id", "student_accounts.id", "N:1", "N", "-"],
        ["assignment_submissions.assignment_id", "assignments.id", "N:1", "N", "-"],
        ["discussion_sessions.student_id", "student_accounts.id", "N:1", "N", "-"],
        ["discussion_messages.session_id", "discussion_sessions.id", "N:1", "N", "-"],
        ["ai_diagnoses.student_id", "student_accounts.id", "N:1", "N", "-"]
      ]
    ),
    tableSpacer(),
    note(
      "better-sqlite3는 db.pragma(\"foreign_keys = ON\")으로 FK 제약을 활성화하지만, 스키마에 ON DELETE/ON UPDATE 규칙이 명시되어 있지 않아 기본 동작(RESTRICT에 가까움)을 따른다. 명시적 CASCADE 규칙이 필요하면 상용 DB 전환 시 함께 정의하는 것을 권장한다(3장 참고)."
    )
  ];
}

module.exports = { buildOverview, buildCurrentSchema, img, colTable, ASSETS, OUT_PATH };
