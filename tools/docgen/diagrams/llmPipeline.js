// LLM 상세 파이프라인: 공통 오케스트레이션(검색→프롬프트→호출→검증→재시도→폴백) 구조
function buildLlmPipelineDiagram() {
  const width = 960;
  const height = 1140;

  const nodes = [
    { id: "e1", x: 50, y: 90, w: 260, h: 50, color: "was", title: "evaluateWithLLM()" },
    { id: "e2", x: 350, y: 90, w: 260, h: 50, color: "was", title: "diagnoseWithLLM()" },
    { id: "e3", x: 650, y: 90, w: 260, h: 50, color: "was", title: "chatDiscussionReply()" },

    {
      id: "n1",
      x: 230,
      y: 190,
      w: 420,
      h: 70,
      color: "db",
      title: "① Retrieval (referenceRetriever.js)",
      lines: ["SQL 필터 기반 조회 (별도 벡터DB 불필요)", "rubric · 성취기준 · 추천후보(교과서/도서)"]
    },
    {
      id: "n2",
      x: 230,
      y: 300,
      w: 420,
      h: 90,
      color: "accent",
      title: "② Prompt Builder",
      lines: ["역할고정 · 그라운딩 · evidence-first · 폐쇄형추천", "스키마강제 · few-shot · 인젝션 방어", "학생 입력은 <student_text> 태그로 데이터화"]
    },
    {
      id: "n3",
      x: 230,
      y: 430,
      w: 420,
      h: 80,
      color: "llm",
      title: "③ LLM Client (llmClient.js)",
      lines: ["POST {baseUrl}/chat/completions (OpenAI 호환)", "guided_json은 provider=vllm 일 때만 전송", "AbortController 타임아웃 (LLM_TIMEOUT_MS)"]
    },
    {
      id: "n0",
      x: 700,
      y: 430,
      w: 210,
      h: 80,
      color: "llm",
      title: "모델 프리셋 해석",
      lines: ["LLM_MODEL → provider/baseUrl", "qwen2.5-7b(vLLM) 기본값", "gemma3-12b(Ollama)"]
    },
    {
      id: "n4",
      x: 230,
      y: 550,
      w: 420,
      h: 70,
      color: "neutral",
      title: "④ 응답 검증 (responseSchema.js)",
      lines: ["ajv 스키마 · additionalProperties:false"]
    },
    {
      id: "n5",
      x: 230,
      y: 650,
      w: 420,
      h: 80,
      color: "neutral",
      title: "⑤ 추가 안전장치",
      lines: ["평가: isEvidenceGrounded (원문 부분일치 검증)", "진단: pickCandidatesByIds (candidate 밖 id 제거)"]
    },
    { id: "n6", kind: "diamond", x: 230, y: 760, w: 420, h: 100, lines: ["모든 검증", "통과?"] },
    { id: "n7", kind: "diamond", x: 700, y: 760, w: 200, h: 100, lines: ["재시도 가능?", "(attempt < 3)"] },
    {
      id: "n8",
      x: 230,
      y: 900,
      w: 420,
      h: 60,
      color: "accent",
      title: "정상 응답 반환",
      lines: ["modelVersion = LLM_MODEL_NAME"]
    },
    {
      id: "n9",
      x: 700,
      y: 900,
      w: 210,
      h: 90,
      color: "danger",
      title: "폴백 실행",
      lines: ["evaluator.js 규칙기반 /", "templateFallbackNarrative /", "고정 문구(독서토론)"]
    },
    {
      id: "n10",
      x: 230,
      y: 1010,
      w: 420,
      h: 60,
      color: "was",
      title: "최종 응답 반환 (JSON)",
      lines: ["modelVersion/promptVersion/confidence/needsReview 포함"]
    }
  ];

  const edges = [
    { from: "e1", to: "n1", fromSide: "bottom", toSide: "top", color: "purple", toPoint: [300, 190] },
    { from: "e2", to: "n1", fromSide: "bottom", toSide: "top", color: "purple", toPoint: [440, 190] },
    { from: "e3", to: "n1", fromSide: "bottom", toSide: "top", color: "purple", toPoint: [580, 190] },
    { from: "n1", to: "n2", color: "default" },
    { from: "n2", to: "n3", color: "default" },
    { from: "n0", to: "n3", fromSide: "left", toSide: "right", color: "llm", dashed: true },
    { from: "n3", to: "n4", color: "default" },
    { from: "n4", to: "n5", color: "default" },
    { from: "n5", to: "n6", color: "default" },
    { from: "n6", to: "n7", fromSide: "right", toSide: "left", color: "red", label: "검증 실패" },
    { from: "n6", to: "n8", color: "green", label: "검증 통과" },
    {
      from: "n7",
      to: "n2",
      fromSide: "top",
      toSide: "right",
      color: "red",
      dashed: true,
      points: [[800, 345]],
      label: ["재시도", "(repairNote 포함)"],
      labelPoint: [828, 560]
    },
    { from: "n7", to: "n9", fromSide: "bottom", toSide: "top", color: "red", label: "3회 소진" },
    { from: "n8", to: "n10", color: "blue" },
    {
      from: "n9",
      to: "n10",
      fromSide: "bottom",
      toSide: "right",
      color: "default",
      points: [[805, 1040]],
      label: "폴백 결과도 동일 스키마"
    }
  ];

  return {
    width,
    height,
    title: "LLM 상세 파이프라인 구조",
    subtitle: "3개 기능(평가/진단/토론)이 공유하는 검색-프롬프트-호출-검증-재시도-폴백 구조",
    nodes,
    edges
  };
}

module.exports = { buildLlmPipelineDiagram };
