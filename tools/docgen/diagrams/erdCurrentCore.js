// 현재 SQLite ERD (1/2) - 핵심 트랜잭션 도메인: 학생/제출/평가/과제
function buildErdCoreDiagram() {
  const width = 1320;
  const height = 1040;

  const nodes = [
    {
      id: "student_accounts",
      kind: "entity",
      x: 60,
      y: 70,
      w: 300,
      color: "db",
      title: "student_accounts",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "school", type: "TEXT" },
        { name: "grade", type: "INTEGER" },
        { name: "class_name", type: "TEXT" },
        { name: "student_number", type: "INTEGER" },
        { name: "created_at", type: "TEXT" }
      ]
    },
    {
      id: "assignments",
      kind: "entity",
      x: 970,
      y: 70,
      w: 290,
      color: "db",
      title: "assignments",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "book_title", type: "TEXT" },
        { name: "book_author", type: "TEXT" },
        { name: "summary_text", type: "TEXT" },
        { name: "objective", type: "TEXT" },
        { name: "due_date", type: "TEXT" },
        { name: "created_at", type: "TEXT" }
      ]
    },
    {
      id: "book_reflections",
      kind: "entity",
      x: 60,
      y: 330,
      w: 300,
      color: "db",
      title: "book_reflections",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "student_id", type: "INTEGER", key: "FK" },
        { name: "book_title", type: "TEXT" },
        { name: "book_author", type: "TEXT" },
        { name: "reflection_text", type: "TEXT" },
        { name: "created_at", type: "TEXT" },
        { name: "assignment_id", type: "INTEGER", key: "FK" }
      ]
    },
    {
      id: "assignment_submissions",
      kind: "entity",
      x: 950,
      y: 330,
      w: 310,
      color: "db",
      title: "assignment_submissions",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "student_id", type: "INTEGER", key: "FK" },
        { name: "assignment_id", type: "INTEGER", key: "FK" },
        { name: "answer_text", type: "TEXT" },
        { name: "total_score", type: "INTEGER" },
        { name: "comprehension", type: "INTEGER" },
        { name: "inference", type: "INTEGER" },
        { name: "critical_thinking", type: "INTEGER" },
        { name: "expression", type: "INTEGER" },
        { name: "vocab_grammar", type: "INTEGER" },
        { name: "feedback_json", type: "TEXT" },
        { name: "created_at", type: "TEXT" },
        { name: "evidence_json", type: "TEXT" },
        { name: "model_version", type: "TEXT" },
        { name: "prompt_version", type: "TEXT" },
        { name: "confidence", type: "TEXT" },
        { name: "needs_review", type: "INTEGER" }
      ]
    },
    {
      id: "literacy_evaluations",
      kind: "entity",
      x: 460,
      y: 580,
      w: 320,
      color: "db",
      title: "literacy_evaluations",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "reflection_id", type: "INTEGER", key: "FK" },
        { name: "total_score", type: "INTEGER" },
        { name: "comprehension", type: "INTEGER" },
        { name: "inference", type: "INTEGER" },
        { name: "critical_thinking", type: "INTEGER" },
        { name: "expression", type: "INTEGER" },
        { name: "vocab_grammar", type: "INTEGER" },
        { name: "feedback_json", type: "TEXT" },
        { name: "created_at", type: "TEXT" },
        { name: "evidence_json", type: "TEXT" },
        { name: "model_version", type: "TEXT" },
        { name: "prompt_version", type: "TEXT" },
        { name: "confidence", type: "TEXT" },
        { name: "needs_review", type: "INTEGER" }
      ]
    },
    {
      id: "legend",
      kind: "note",
      x: 60,
      y: 970,
      w: 500,
      h: 60,
      title: "표기 규칙",
      lines: ["PK = 기본키(빨강 굵게) · FK = 외래키(파랑 굵게) · 선 위 라벨 = 카디널리티(1:N)"]
    }
  ];

  const edges = [
    { from: "student_accounts", to: "book_reflections", fromSide: "bottom", toSide: "top", color: "db", label: "1:N" },
    { from: "assignments", to: "assignment_submissions", fromSide: "bottom", toSide: "top", color: "db", label: "1:N" },
    {
      from: "student_accounts",
      to: "assignment_submissions",
      fromSide: "right",
      toSide: "left",
      color: "db",
      points: [
        [700, 161],
        [700, 486]
      ],
      label: "1:N",
      labelPoint: [700, 320]
    },
    {
      from: "book_reflections",
      to: "assignments",
      fromSide: "top",
      toSide: "bottom",
      color: "db",
      dashed: true,
      points: [
        [300, 290],
        [1115, 290]
      ],
      label: "N:1 (nullable)",
      labelPoint: [700, 278]
    },
    {
      from: "book_reflections",
      to: "literacy_evaluations",
      fromSide: "bottom",
      toSide: "top",
      color: "db",
      points: [
        [210, 545],
        [620, 545]
      ],
      label: "1:1",
      labelPoint: [400, 533]
    }
  ];

  return {
    width,
    height,
    title: "현재 SQLite ERD (1/2) - 핵심 트랜잭션 도메인",
    subtitle: "student_accounts · book_reflections · literacy_evaluations · assignments · assignment_submissions",
    nodes,
    edges
  };
}

module.exports = { buildErdCoreDiagram };
