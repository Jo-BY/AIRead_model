// 학년(1~6) <-> 학년군, snake_case <-> camelCase 지표 키 변환 유틸.
const INDICATOR_KEYS = ["comprehension", "inference", "criticalThinking", "expression", "vocabGrammar"];

const GRADE_BAND_LABEL = {
  low: "초등 1~2학년군",
  mid: "초등 3~4학년군",
  high: "초등 5~6학년군"
};

// server.js의 DB 컬럼 기반 snake_case 키를 rubric/추천 데이터의 camelCase 키로 변환.
const SNAKE_TO_CAMEL_INDICATOR = {
  comprehension: "comprehension",
  inference: "inference",
  critical_thinking: "criticalThinking",
  expression: "expression",
  vocab_grammar: "vocabGrammar"
};

function toGradeBand(grade) {
  const n = Number(grade);
  if (n <= 2) return "low";
  if (n <= 4) return "mid";
  return "high";
}

function snakeToCamelIndicator(key) {
  return SNAKE_TO_CAMEL_INDICATOR[key] || key;
}

module.exports = {
  INDICATOR_KEYS,
  GRADE_BAND_LABEL,
  toGradeBand,
  snakeToCamelIndicator
};
