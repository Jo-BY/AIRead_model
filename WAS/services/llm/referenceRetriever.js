// 학년/지표 기준으로 루브릭, 성취기준, 추천 후보(교과서/도서)를 SQL 필터로 조회.
// 구조화된 데이터라 별도 임베딩/벡터DB 없이 SQL 필터만으로 충분 (VRAM 절약).
const {
  getRubricByGradeBand,
  getCurriculumStandardsByGradeBand,
  getRecommendedTextbooks,
  getRecommendedBooks
} = require("../../../DB/database");
const { INDICATOR_KEYS, toGradeBand } = require("./shared");

function getRubricContext(grade) {
  const gradeBand = toGradeBand(grade);
  return { gradeBand, rubric: getRubricByGradeBand(gradeBand) };
}

function getCurriculumContext(grade, indicatorKeys = INDICATOR_KEYS) {
  const gradeBand = toGradeBand(grade);
  const standards = getCurriculumStandardsByGradeBand(gradeBand);
  return standards.filter((std) => std.indicatorKeys.some((key) => indicatorKeys.includes(key)));
}

function getRecommendationCandidates(grade, indicatorKey) {
  const gradeBand = toGradeBand(grade);
  return {
    gradeBand,
    textbooks: getRecommendedTextbooks(gradeBand, indicatorKey),
    books: getRecommendedBooks(gradeBand, indicatorKey)
  };
}

module.exports = { getRubricContext, getCurriculumContext, getRecommendationCandidates };
