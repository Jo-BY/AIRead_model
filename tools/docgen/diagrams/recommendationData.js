// 추천 데이터 흐름/구조: 평가이력 → 최약점 지표 → 후보 조회(교과서/도서 스키마) → LLM 폐쇄형 선택 → 최종 추천
function buildRecommendationDataDiagram() {
  const width = 900;
  const height = 940;
  const mainX = 280;
  const mainW = 340;

  const nodes = [
    { id: "n1", x: mainX, y: 50, w: mainW, h: 60, color: "db", title: "학생 평가 이력 (N회)", lines: ["book_reflections ⋈ literacy_evaluations"] },
    { id: "n2", x: mainX, y: 140, w: mainW, h: 60, color: "neutral", title: "지표별 최근/이전 평균·기울기 계산" },
    { id: "n3", x: mainX, y: 230, w: mainW, h: 60, color: "accent", title: "최약점 지표(weakest) 판별" },
    {
      id: "n4",
      x: mainX,
      y: 320,
      w: mainW,
      h: 50,
      color: "db",
      title: "getRecommendationCandidates(gradeBand, weakestIndicator)"
    },
    {
      id: "entTextbook",
      kind: "entity",
      x: 110,
      y: 400,
      w: 330,
      color: "db",
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
      id: "entBook",
      kind: "entity",
      x: 460,
      y: 400,
      w: 330,
      color: "db",
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
      id: "n5",
      x: mainX,
      y: 630,
      w: mainW,
      h: 60,
      color: "llm",
      title: "LLM 폐쇄형 선택",
      lines: ["recommendedTextbookIds/recommendedBookIds"]
    },
    {
      id: "n6",
      x: mainX,
      y: 720,
      w: mainW,
      h: 60,
      color: "neutral",
      title: "pickCandidatesByIds",
      lines: ["candidate 밖 id는 서버에서 강제 제거"]
    },
    {
      id: "n7",
      x: mainX,
      y: 810,
      w: mainW,
      h: 70,
      color: "was",
      title: "최종 추천 결과",
      lines: ["recommendations.textbooks[]", "recommendations.books[]"]
    }
  ];

  const edges = [
    { from: "n1", to: "n2", color: "blue" },
    { from: "n2", to: "n3", color: "blue" },
    { from: "n3", to: "n4", color: "blue" },
    { from: "n4", to: "entTextbook", fromSide: "bottomLeft", toSide: "top", color: "db", label: "교과서 후보" },
    { from: "n4", to: "entBook", fromSide: "bottomRight", toSide: "top", color: "db", label: "도서 후보" },
    { from: "entTextbook", to: "n5", fromSide: "bottom", toSide: "top", color: "default", toPoint: [380, 630] },
    { from: "entBook", to: "n5", fromSide: "bottom", toSide: "top", color: "default", toPoint: [520, 630] },
    { from: "n5", to: "n6", color: "orange" },
    { from: "n6", to: "n7", color: "green" }
  ];

  return {
    width,
    height,
    title: "추천 도서 · 교과서 데이터 흐름",
    subtitle: "최약점 지표 판별 → 후보 조회 → LLM 폐쇄형 선택 → 최종 추천",
    nodes,
    edges
  };
}

module.exports = { buildRecommendationDataDiagram };
