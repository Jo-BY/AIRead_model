// 상용 DB 전환 제안 ERD - 인증/조직/트랜잭션 도메인 (PostgreSQL 기준 정규화 제안)
function buildErdProductionDiagram() {
  const width = 1320;
  const height = 900;

  const nodes = [
    {
      id: "schools",
      kind: "entity",
      x: 35,
      y: 70,
      w: 260,
      color: "accent",
      title: "schools (신규)",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "region", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "classes",
      kind: "entity",
      x: 335,
      y: 70,
      w: 280,
      color: "accent",
      title: "classes (신규)",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "school_id", type: "BIGINT", key: "FK" },
        { name: "grade", type: "SMALLINT" },
        { name: "class_name", type: "TEXT" },
        { name: "school_year", type: "SMALLINT" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "users",
      kind: "entity",
      x: 655,
      y: 70,
      w: 340,
      color: "accent",
      title: "users (신규, 학생+교사 통합)",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "role", type: "TEXT" },
        { name: "name", type: "TEXT" },
        { name: "password_hash", type: "TEXT" },
        { name: "password_salt", type: "TEXT" },
        { name: "email", type: "TEXT" },
        { name: "school_id", type: "BIGINT", key: "FK" },
        { name: "class_id", type: "BIGINT", key: "FK" },
        { name: "student_number", type: "SMALLINT" },
        { name: "created_at", type: "TIMESTAMPTZ" },
        { name: "updated_at", type: "TIMESTAMPTZ" },
        { name: "last_login_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "assignments",
      kind: "entity",
      x: 35,
      y: 398,
      w: 290,
      color: "db",
      title: "assignments (개선)",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "teacher_id", type: "BIGINT", key: "FK" },
        { name: "class_id", type: "BIGINT", key: "FK" },
        { name: "book_title", type: "TEXT" },
        { name: "book_author", type: "TEXT" },
        { name: "summary_text", type: "TEXT" },
        { name: "objective", type: "TEXT" },
        { name: "due_date", type: "DATE" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "book_reflections",
      kind: "entity",
      x: 355,
      y: 398,
      w: 290,
      color: "db",
      title: "book_reflections",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "student_id", type: "BIGINT", key: "FK" },
        { name: "book_title", type: "TEXT" },
        { name: "book_author", type: "TEXT" },
        { name: "reflection_text", type: "TEXT" },
        { name: "assignment_id", type: "BIGINT", key: "FK" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "assignment_submissions",
      kind: "entity",
      x: 675,
      y: 398,
      w: 310,
      color: "db",
      title: "assignment_submissions",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "student_id", type: "BIGINT", key: "FK" },
        { name: "assignment_id", type: "BIGINT", key: "FK" },
        { name: "answer_text", type: "TEXT" },
        { name: "total_score", type: "SMALLINT" },
        { name: "scores", type: "JSONB" },
        { name: "feedback", type: "JSONB" },
        { name: "evidence", type: "JSONB" },
        { name: "model_version", type: "TEXT" },
        { name: "prompt_version", type: "TEXT" },
        { name: "confidence", type: "TEXT" },
        { name: "needs_review", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "literacy_evaluations",
      kind: "entity",
      x: 1015,
      y: 398,
      w: 270,
      color: "db",
      title: "literacy_evaluations",
      rows: [
        { name: "id", type: "BIGSERIAL", key: "PK" },
        { name: "reflection_id", type: "BIGINT", key: "FK" },
        { name: "total_score", type: "SMALLINT" },
        { name: "scores", type: "JSONB" },
        { name: "feedback", type: "JSONB" },
        { name: "evidence", type: "JSONB" },
        { name: "model_version", type: "TEXT" },
        { name: "prompt_version", type: "TEXT" },
        { name: "confidence", type: "TEXT" },
        { name: "needs_review", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMPTZ" }
      ]
    },
    {
      id: "noteAuth",
      kind: "note",
      x: 35,
      y: 750,
      w: 400,
      h: 110,
      title: "① 인증 보안 개선",
      lines: ["password_hash+password_salt(bcrypt) 도입으로", "TEACHER_PASSWORD 단일 공유 비밀번호 방식 대체"]
    },
    {
      id: "noteTenant",
      kind: "note",
      x: 460,
      y: 750,
      w: 400,
      h: 110,
      title: "② 멀티테넌시 대비",
      lines: ["schools/classes 정규화로 여러 학교 확장 대비", "(기존 school/class_name 평문 컬럼 제거)"]
    },
    {
      id: "noteJson",
      kind: "note",
      x: 885,
      y: 750,
      w: 400,
      h: 110,
      title: "③ 유연한 JSON 컬럼",
      lines: ["PostgreSQL 기준 feedback/evidence/scores는", "JSONB 권장 (부분 검색·GIN 인덱싱 용이)"]
    }
  ];

  const edges = [
    { from: "schools", to: "classes", fromSide: "right", toSide: "left", color: "accent", label: "1:N" },
    { from: "classes", to: "users", fromSide: "right", toSide: "left", color: "accent", label: "1:N" },
    {
      from: "schools",
      to: "users",
      color: "accent",
      dashed: true,
      fromPoint: [165, 190],
      points: [[165, 250]],
      toPoint: [655, 250],
      label: "1:N (교사 소속)",
      labelPoint: [400, 262]
    },
    {
      from: "users",
      to: "assignments",
      color: "purple",
      dashed: true,
      fromPoint: [690, 358],
      points: [
        [690, 378],
        [180, 378]
      ],
      toPoint: [180, 398],
      label: "teacher_id (교사 작성)",
      labelPoint: [430, 366]
    },
    {
      from: "classes",
      to: "assignments",
      color: "purple",
      dashed: true,
      fromPoint: [475, 232],
      points: [
        [475, 270],
        [180, 270]
      ],
      toPoint: [180, 398],
      label: "class_id (대상 학급)",
      labelPoint: [300, 282]
    },
    {
      from: "users",
      to: "book_reflections",
      color: "green",
      fromPoint: [825, 358],
      toPoint: [500, 398],
      label: "student_id",
      labelPoint: [770, 366]
    },
    {
      from: "users",
      to: "assignment_submissions",
      color: "green",
      fromPoint: [960, 358],
      toPoint: [830, 398],
      label: "student_id",
      labelPoint: [940, 375]
    },
    {
      from: "assignments",
      to: "book_reflections",
      fromSide: "right",
      toSide: "left",
      color: "default",
      dashed: true
    },
    {
      from: "assignments",
      to: "assignment_submissions",
      color: "default",
      fromPoint: [180, 623],
      points: [[180, 650]],
      toPoint: [675, 650],
      label: "assignment_id"
    },
    {
      from: "book_reflections",
      to: "literacy_evaluations",
      color: "green",
      fromPoint: [645, 450],
      points: [
        [645, 380],
        [1150, 380]
      ],
      toPoint: [1150, 398],
      label: "1:1",
      labelPoint: [1100, 368]
    }
  ];

  return {
    width,
    height,
    title: "상용 DB 전환 제안 ERD - 인증/조직/트랜잭션 도메인",
    subtitle: "PostgreSQL 기준 정규화 제안 (보라 = 신규 테이블, 초록 = 기존 테이블 개선)",
    nodes,
    edges
  };
}

module.exports = { buildErdProductionDiagram };
