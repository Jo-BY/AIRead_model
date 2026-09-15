// 현재 SQLite ERD (2/2) - 레퍼런스 & 부가기능 도메인: 루브릭/성취기준/추천/토론/AI진단
function buildErdReferenceDiagram() {
  const width = 1320;
  const height = 920;

  const nodes = [
    {
      id: "literacy_rubric",
      kind: "entity",
      x: 35,
      y: 70,
      w: 290,
      color: "accent",
      title: "literacy_rubric",
      rows: [
        { name: "id", type: "TEXT", key: "PK" },
        { name: "indicator_key", type: "TEXT" },
        { name: "indicator_name", type: "TEXT" },
        { name: "grade_band", type: "TEXT" },
        { name: "level", type: "INTEGER" },
        { name: "descriptor", type: "TEXT" },
        { name: "source", type: "TEXT" }
      ]
    },
    {
      id: "curriculum_standards",
      kind: "entity",
      x: 355,
      y: 70,
      w: 290,
      color: "accent",
      title: "curriculum_standards",
      rows: [
        { name: "id", type: "TEXT", key: "PK" },
        { name: "code", type: "TEXT" },
        { name: "grade_band", type: "TEXT" },
        { name: "domain", type: "TEXT" },
        { name: "description", type: "TEXT" },
        { name: "indicator_keys_json", type: "TEXT" },
        { name: "verified", type: "INTEGER" },
        { name: "source", type: "TEXT" }
      ]
    },
    {
      id: "recommended_textbooks",
      kind: "entity",
      x: 675,
      y: 70,
      w: 290,
      color: "accent",
      title: "recommended_textbooks",
      rows: [
        { name: "id", type: "TEXT", key: "PK" },
        { name: "indicator_key", type: "TEXT" },
        { name: "grade_band", type: "TEXT" },
        { name: "type", type: "TEXT" },
        { name: "subject", type: "TEXT" },
        { name: "unit", type: "TEXT" },
        { name: "linked_standard_codes_json", type: "TEXT" },
        { name: "verified", type: "INTEGER" }
      ]
    },
    {
      id: "recommended_books",
      kind: "entity",
      x: 995,
      y: 70,
      w: 290,
      color: "accent",
      title: "recommended_books",
      rows: [
        { name: "id", type: "TEXT", key: "PK" },
        { name: "indicator_key", type: "TEXT" },
        { name: "grade_band", type: "TEXT" },
        { name: "title", type: "TEXT" },
        { name: "author", type: "TEXT" },
        { name: "reason", type: "TEXT" },
        { name: "source", type: "TEXT" }
      ]
    },
    {
      id: "discussion_sessions",
      kind: "entity",
      x: 60,
      y: 340,
      w: 300,
      color: "was",
      title: "discussion_sessions",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "student_id", type: "INTEGER", key: "FK*" },
        { name: "book_title", type: "TEXT" },
        { name: "book_author", type: "TEXT" },
        { name: "created_at", type: "TEXT" },
        { name: "updated_at", type: "TEXT" }
      ]
    },
    {
      id: "discussion_messages",
      kind: "entity",
      x: 430,
      y: 340,
      w: 300,
      color: "was",
      title: "discussion_messages",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "session_id", type: "INTEGER", key: "FK" },
        { name: "role", type: "TEXT" },
        { name: "content", type: "TEXT" },
        { name: "created_at", type: "TEXT" }
      ]
    },
    {
      id: "ai_diagnoses",
      kind: "entity",
      x: 800,
      y: 340,
      w: 380,
      color: "was",
      title: "ai_diagnoses",
      rows: [
        { name: "id", type: "INTEGER", key: "PK" },
        { name: "student_id", type: "INTEGER", key: "FK*" },
        { name: "attempt_count", type: "INTEGER" },
        { name: "school", type: "TEXT" },
        { name: "grade", type: "INTEGER" },
        { name: "class_name", type: "TEXT" },
        { name: "headline", type: "TEXT" },
        { name: "overview", type: "TEXT" },
        { name: "timeline_insights_json", type: "TEXT" },
        { name: "indicator_insights_json", type: "TEXT" },
        { name: "action_plan_json", type: "TEXT" },
        { name: "textbook_recommendations_json", type: "TEXT" },
        { name: "book_recommendations_json", type: "TEXT" },
        { name: "weakest_indicator", type: "TEXT" },
        { name: "strongest_indicator", type: "TEXT" },
        { name: "confidence", type: "TEXT" },
        { name: "needs_review", type: "INTEGER" },
        { name: "model_version", type: "TEXT" },
        { name: "prompt_version", type: "TEXT" },
        { name: "created_at", type: "TEXT" }
      ]
    },
    {
      id: "note1",
      kind: "note",
      x: 60,
      y: 830,
      w: 700,
      h: 60,
      title: "FK* 표시 안내",
      lines: ["discussion_sessions.student_id, ai_diagnoses.student_id → student_accounts.id", "(핵심 트랜잭션 ERD의 student_accounts 참조, 본 다이어그램에는 미표시)"]
    },
    {
      id: "note2",
      kind: "note",
      x: 800,
      y: 830,
      w: 460,
      h: 60,
      title: "참고",
      lines: ["literacy_rubric/curriculum_standards/recommended_*는 FK 없이", "grade_band·indicator_key 값으로만 SQL 필터 조회(런타임 조인)"]
    }
  ];

  const edges = [{ from: "discussion_sessions", to: "discussion_messages", fromSide: "right", toSide: "left", color: "was", label: "1:N" }];

  return {
    width,
    height,
    title: "현재 SQLite ERD (2/2) - 레퍼런스 & 부가기능 도메인",
    subtitle: "literacy_rubric · curriculum_standards · recommended_textbooks/books · discussion_* · ai_diagnoses",
    nodes,
    edges
  };
}

module.exports = { buildErdReferenceDiagram };
