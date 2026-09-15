// 독후감 제출 → AI 평가 처리 흐름 (POST /api/submissions), 재시도/폴백 루프 포함
function buildSubmissionFlowDiagram() {
  const width = 820;
  const height = 1000;

  const nodes = [
    { id: "n1", x: 250, y: 60, w: 320, h: 50, color: "web", title: "학생: 감상문 작성 후 제출 (WEB)" },
    {
      id: "n2",
      x: 250,
      y: 140,
      w: 320,
      h: 60,
      color: "was",
      title: "POST /api/submissions",
      lines: ["studentId/책 제목/감상문(20자 이상) 검증"]
    },
    { id: "n3", x: 250, y: 230, w: 320, h: 50, color: "accent", title: "evaluateWithLLM() 호출" },
    {
      id: "n4",
      x: 250,
      y: 310,
      w: 320,
      h: 60,
      color: "db",
      title: "레퍼런스 조회",
      lines: ["getRubricContext/getCurriculumContext (학년군 기준)"]
    },
    {
      id: "n5",
      x: 250,
      y: 400,
      w: 320,
      h: 60,
      color: "accent",
      title: "프롬프트 조립",
      lines: ["buildEvaluationMessages (few-shot + 학생글)"]
    },
    {
      id: "n6",
      x: 250,
      y: 490,
      w: 320,
      h: 60,
      color: "llm",
      title: "LLM 호출",
      lines: ["chatCompletion (guided_json, temperature 0.2)"]
    },
    { id: "n7", kind: "diamond", x: 250, y: 580, w: 320, h: 100, color: "neutral", lines: ["스키마 · evidence", "검증 통과?"] },
    {
      id: "n8",
      x: 610,
      y: 580,
      w: 170,
      h: 100,
      color: "danger",
      title: "규칙 기반 폴백",
      lines: ["evaluator.js 재사용", "modelVersion:", "rule-based-fallback"]
    },
    {
      id: "n9",
      x: 250,
      y: 710,
      w: 320,
      h: 60,
      color: "accent",
      title: "평가 결과 확정 (LLM)",
      lines: ["scores/feedback/evidence/confidence"]
    },
    { id: "n10", x: 250, y: 800, w: 320, h: 60, color: "db", title: "DB 저장", lines: ["createSubmission → book_reflections + literacy_evaluations"] },
    {
      id: "n11",
      x: 250,
      y: 890,
      w: 320,
      h: 60,
      color: "web",
      title: "응답 반환",
      lines: ["대시보드 · 타임라인 · AI 진단에 즉시 반영"]
    }
  ];

  const edges = [
    { from: "n1", to: "n2", color: "gray" },
    { from: "n2", to: "n3", color: "blue" },
    { from: "n3", to: "n4", color: "purple" },
    { from: "n4", to: "n5", color: "purple", label: "루브릭 + 성취기준 컨텍스트" },
    { from: "n5", to: "n6", color: "orange", label: "system+user 메시지" },
    { from: "n6", to: "n7", color: "default", label: "JSON 파싱(extractJson)" },
    { from: "n7", to: "n8", fromSide: "right", toSide: "left", color: "red", label: "3회 모두 실패" },
    { from: "n7", to: "n9", color: "green", label: "검증 통과" },
    {
      from: "n7",
      to: "n5",
      fromSide: "left",
      toSide: "left",
      color: "red",
      dashed: true,
      points: [
        [140, 630],
        [140, 430]
      ],
      label: ["재시도", "(최대 3회,", "repairNote 포함)"],
      labelPoint: [175, 525]
    },
    { from: "n9", to: "n10", color: "green", toPoint: [370, 800] },
    {
      from: "n8",
      to: "n10",
      color: "default",
      fromSide: "bottom",
      points: [
        [695, 750],
        [450, 750]
      ],
      toPoint: [450, 800],
      label: "규칙기반 결과",
      labelPoint: [600, 762]
    },
    { from: "n10", to: "n11", color: "blue" }
  ];

  return {
    width,
    height,
    title: "독후감 제출 · AI 평가 처리 흐름",
    subtitle: "POST /api/submissions 요청 처리 시퀀스 (evaluateWithLLM)",
    nodes,
    edges
  };
}

module.exports = { buildSubmissionFlowDiagram };
