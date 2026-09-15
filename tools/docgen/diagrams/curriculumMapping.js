// 성취기준 매핑 구조: 교육과정 → 학년군 → 영역(도메인) → 성취기준 코드 → 평가지표 매핑
function buildCurriculumMappingDiagram() {
  const width = 880;
  const height = 750;
  const mainX = 240;
  const mainW = 400;

  const nodes = [
    {
      id: "n1",
      x: mainX,
      y: 50,
      w: mainW,
      h: 70,
      color: "db",
      title: "2022 개정 국어과 교육과정",
      lines: ["교육부 고시 제2022-33호", "국가교육과정정보센터(NCIC) 공개"]
    },
    { id: "n2", x: mainX, y: 150, w: mainW, h: 60, color: "neutral", title: "학년군 분류", lines: ["1~2학년군 · 3~4학년군 · 5~6학년군"] },
    {
      id: "n3",
      x: mainX,
      y: 240,
      w: mainW,
      h: 70,
      color: "neutral",
      title: "영역(도메인)",
      lines: ["듣기·말하기 / 읽기 / 쓰기 / 문법 / 문학", "domainCodeMap: 01~05"]
    },
    { id: "n4", x: mainX, y: 340, w: mainW, h: 60, color: "was", title: "성취기준 코드", lines: ["예: [4국02-02] = 학년군4+영역02+일련번호"] },
    {
      id: "n5",
      x: mainX,
      y: 430,
      w: mainW,
      h: 60,
      color: "accent",
      title: "indicatorKeys 매핑",
      lines: ["comprehension/inference/criticalThinking 등"]
    },
    {
      id: "n6",
      kind: "note",
      x: 60,
      y: 520,
      w: 760,
      h: 90,
      title: "예시 (curriculum_standards.json)",
      lines: ["[4국02-02] \"글의 중심 생각과 세부 내용을 구분하며 읽는다.\"", "→ gradeBand: mid, domain: 읽기, indicatorKeys: [\"comprehension\"]"]
    },
    {
      id: "n7",
      kind: "note",
      x: 60,
      y: 630,
      w: 760,
      h: 90,
      stroke: "#b3261e",
      fill: "#fdecea",
      title: "검증 필요 (verified = false)",
      lines: ["현재 code/description은 NCIC 원문 실시간 대조 없이 작성된 초안입니다.", "운영 반영 전 국가교육과정정보센터(ncic.re.kr) 원문 대조가 필수입니다."]
    }
  ];

  const edges = [
    { from: "n1", to: "n2", color: "blue" },
    { from: "n2", to: "n3", color: "blue" },
    { from: "n3", to: "n4", color: "blue" },
    { from: "n4", to: "n5", color: "purple" },
    { from: "n5", to: "n6", color: "purple", label: "예시 데이터" },
    { from: "n6", to: "n7", color: "red", label: "검증 상태" }
  ];

  return {
    width,
    height,
    title: "성취기준 매핑 구조",
    subtitle: "curriculum_standards.json - 교육과정 성취기준 ↔ 문해력 평가지표 매핑",
    nodes,
    edges
  };
}

module.exports = { buildCurriculumMappingDiagram };
