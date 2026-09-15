// AI 진단/추천 처리 흐름 (GET /api/my-ai-diagnosis) - 캐시 반환/빈 상태/LLM 서사 생성 분기 포함
function buildDiagnosisFlowDiagram() {
  const width = 860;
  const height = 1250;
  const mainX = 250;
  const mainW = 340;

  const nodes = [
    { id: "n1", x: mainX, y: 50, w: mainW, h: 60, color: "was", title: "GET /api/my-ai-diagnosis", lines: ["studentId, forceRefresh 파라미터"] },
    { id: "n2", kind: "diamond", x: mainX, y: 140, w: mainW, h: 90, lines: ["forceRefresh=false &&", "저장된 결과 존재?"] },
    { id: "n3", x: 660, y: 140, w: 170, h: 90, color: "db", title: "즉시 반환", lines: ["getLatestAiDiagnosis", "(LLM 미호출, 캐시)"] },
    { id: "n4", x: mainX, y: 260, w: mainW, h: 60, color: "db", title: "getDashboard(300, studentId)", lines: ["전체 평가 이력(rows) 조회"] },
    { id: "n5", kind: "diamond", x: mainX, y: 350, w: mainW, h: 90, lines: ["평가 이력", "attempts = 0 ?"] },
    { id: "n6", x: 660, y: 350, w: 170, h: 90, color: "neutral", title: "빈 상태 안내", lines: ["기록 2건 이상 필요", "(LLM 미호출)"] },
    {
      id: "n7",
      x: mainX,
      y: 470,
      w: mainW,
      h: 74,
      color: "neutral",
      title: "타임라인 · 지표 통계 계산",
      lines: ["평균/추세(slope)/최약점·최강점", "가장 향상된 지표(mostImproved)"]
    },
    { id: "n8", x: mainX, y: 574, w: mainW, h: 60, color: "db", title: "추천 후보 조회", lines: ["getRecommendationCandidates(약점지표)"] },
    { id: "n9", x: mainX, y: 664, w: mainW, h: 60, color: "accent", title: "diagnoseWithLLM 호출", lines: ["서사+추천 프롬프트 (최대 3회 재시도)"] },
    { id: "n10", kind: "diamond", x: mainX, y: 754, w: mainW, h: 90, lines: ["스키마 검증", "통과?"] },
    { id: "n11", x: 660, y: 754, w: 170, h: 90, color: "danger", title: "템플릿 폴백", lines: ["templateFallbackNarrative", "confidence: low"] },
    {
      id: "n12",
      x: mainX,
      y: 874,
      w: mainW,
      h: 60,
      color: "accent",
      title: "폐쇄형 추천 필터링",
      lines: ["pickCandidatesByIds - candidate 밖 id 제거"]
    },
    { id: "n13", x: mainX, y: 964, w: mainW, h: 60, color: "accent", title: "finalizeDiagnosis", lines: ["서사(headline/overview/actionPlan) + 추천 결합"] },
    { id: "n14", x: mainX, y: 1054, w: mainW, h: 60, color: "db", title: "DB 저장 (attempts > 0)", lines: ["createAiDiagnosis → ai_diagnoses 테이블"] },
    { id: "n15", x: mainX, y: 1144, w: mainW, h: 60, color: "web", title: "응답 반환", lines: ["AI 진단/추천 화면 렌더 + 히스토리 목록 갱신"] }
  ];

  const edges = [
    { from: "n1", to: "n2", color: "blue" },
    { from: "n2", to: "n3", fromSide: "right", toSide: "left", color: "green", label: "예" },
    { from: "n2", to: "n4", fromSide: "bottom", toSide: "top", color: "default", label: "아니오" },
    { from: "n4", to: "n5", color: "blue" },
    { from: "n5", to: "n6", fromSide: "right", toSide: "left", color: "green", label: "예 (0건)" },
    { from: "n5", to: "n7", fromSide: "bottom", toSide: "top", color: "default", label: "아니오 (1건 이상)" },
    { from: "n7", to: "n8", color: "blue" },
    { from: "n8", to: "n9", color: "blue" },
    { from: "n9", to: "n10", color: "orange" },
    { from: "n10", to: "n11", fromSide: "right", toSide: "left", color: "red", label: "3회 실패" },
    { from: "n10", to: "n12", fromSide: "bottom", toSide: "top", color: "green", label: "검증 통과" },
    { from: "n12", to: "n13", color: "blue" },
    {
      from: "n11",
      to: "n13",
      fromSide: "bottom",
      color: "red",
      points: [
        [745, 900],
        [420, 900]
      ],
      toPoint: [420, 964],
      label: "폴백 서사도 동일 병합",
      labelPoint: [600, 912]
    },
    { from: "n13", to: "n14", color: "green" },
    { from: "n14", to: "n15", color: "blue" }
  ];

  return {
    width,
    height,
    title: "AI 진단/추천 처리 흐름",
    subtitle: "GET /api/my-ai-diagnosis 요청 처리 시퀀스 (buildStudentDiagnosis)",
    nodes,
    edges
  };
}

module.exports = { buildDiagnosisFlowDiagram };
