// 평가 루브릭 구조: 5개 지표 × 3개 학년군 매트릭스 + 1개 셀 드릴다운(5단계 행동지표) 예시
function buildRubricStructureDiagram() {
  const width = 900;
  const height = 820;

  const indicators = [
    { key: "comprehension", label: ["내용 이해"] },
    { key: "inference", label: ["추론 / 해석"] },
    { key: "criticalThinking", label: ["비판 / 평가"] },
    { key: "expression", label: ["표현 / 구성"] },
    { key: "vocabGrammar", label: ["어휘 / 문장 사용"] }
  ];
  const gradeBands = [
    { key: "low", label: "초1~2학년군" },
    { key: "mid", label: "초3~4학년군" },
    { key: "high", label: "초5~6학년군" }
  ];

  const gridX = 210;
  const colW = 178;
  const rowH = 64;
  const headerY = 140;

  const nodes = [
    { id: "corner", x: 60, y: headerY, w: 145, h: 36, color: "neutral", title: "지표 \\ 학년군", titleFontSize: 12 },
    {
      id: "note1",
      kind: "note",
      x: 620,
      y: 60,
      w: 240,
      h: 60,
      title: "참고 프레임워크",
      lines: ["PISA · NAEP · CEFR · 2022 개정", "국어과 교육과정 관점 재구성"]
    }
  ];

  gradeBands.forEach((gb, j) => {
    nodes.push({ id: `gb-${gb.key}`, x: gridX + j * colW, y: headerY, w: colW - 2, h: 36, color: "db", title: gb.label, titleFontSize: 13 });
  });

  indicators.forEach((ind, i) => {
    const y = headerY + 40 + i * rowH;
    nodes.push({ id: `ind-${ind.key}`, x: 60, y, w: 145, h: rowH - 2, color: "accent", title: ind.label[0], titleFontSize: 12.5 });
    gradeBands.forEach((gb, j) => {
      nodes.push({
        id: `cell-${ind.key}-${gb.key}`,
        x: gridX + j * colW,
        y,
        w: colW - 2,
        h: rowH - 2,
        color: "neutral",
        lines: ["Lv.1 ~ Lv.5", "행동지표 5단계"],
        bodyFontSize: 11.6
      });
    });
  });

  const levels = [
    { n: 1, color: "danger", text: "명시되지 않은 내용에 대해 근거 없는 추측만 한다." },
    { n: 2, color: "llm", text: "본문의 단서를 일부 활용하지만 논리적 비약이 있다." },
    { n: 3, color: "neutral", text: "본문에 드러나지 않은 인물의 의도·결과를 본문 단서로 추론한다." },
    { n: 4, color: "web", text: "여러 단서를 종합해 사건의 원인-과정-결과를 논리적으로 추론한다." },
    { n: 5, color: "db", text: "행간의 의미와 복선을 파악해 타당한 근거로 정교하게 해석한다." }
  ];
  const panelY = 600;
  nodes.push({
    id: "drilltitle",
    x: 100,
    y: 555,
    w: 700,
    h: 30,
    color: "accent",
    title: "예시: 추론/해석 × 초등 3~4학년군 (rubric.json 5단계 행동지표)",
    titleFontSize: 13
  });
  levels.forEach((lv, i) => {
    nodes.push({
      id: `lv-${lv.n}`,
      x: 100,
      y: panelY + i * 42,
      w: 700,
      h: 38,
      color: lv.color,
      lines: [`Lv.${lv.n} (${lv.n}점): ${lv.text}`],
      bodyFontSize: 12.3
    });
  });

  const edges = [
    {
      from: "cell-inference-mid",
      to: "drilltitle",
      fromSide: "bottom",
      toSide: "top",
      color: "purple",
      dashed: true,
      label: "상세 보기"
    }
  ];

  return {
    width,
    height,
    title: "문해력 평가 루브릭 구조",
    subtitle: "5개 지표 × 3개 학년군 × 5단계(1~5점) 행동지표 매트릭스",
    nodes,
    edges
  };
}

module.exports = { buildRubricStructureDiagram };
