// LLM 기반 평가/진단 오케스트레이션: 검색(retrieval) -> 프롬프트 -> vLLM 호출 -> 검증 -> 폴백.
const { INDICATORS, evaluateReflection } = require("../evaluator");
const { getRubricContext, getCurriculumContext, getRecommendationCandidates } = require("./referenceRetriever");
const { buildEvaluationMessages, buildDiagnosisMessages, PROMPT_VERSION } = require("./promptBuilder");
const {
  evaluationSchema,
  diagnosisSchema,
  validateEvaluation,
  validateDiagnosis,
  errorsToText
} = require("./responseSchema");
const { chatCompletion, checkHealth, LLM_MODEL_NAME } = require("./vllmClient");
const { snakeToCamelIndicator } = require("./shared");

const LLM_ENABLED = String(process.env.LLM_ENABLED ?? "true").toLowerCase() !== "false";
const LLM_FALLBACK_TO_RULE = String(process.env.LLM_FALLBACK_TO_RULE ?? "true").toLowerCase() !== "false";
const MAX_ATTEMPTS = 3;

function extractJson(content) {
  const trimmed = String(content || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch) {
      return JSON.parse(fencedMatch[1]);
    }
    const braceMatch = trimmed.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }
    throw new Error(`JSON 파싱 실패: ${err.message}`);
  }
}

function normalizeForMatch(str) {
  return String(str || "").replace(/\s+/g, "");
}

// evidence가 학생 글 원문에 실제로 존재하는 부분 문자열인지 검증 (사후 합리화/할루시네이션 방지).
// 빈 문자열("근거 없음")은 검증할 인용이 없으므로 그대로 통과시킨다.
function isEvidenceGrounded(evidence, sourceText) {
  const normalizedSource = normalizeForMatch(sourceText);
  return Object.values(evidence || {}).every((quote) => {
    const normalizedQuote = normalizeForMatch(quote);
    return normalizedQuote.length === 0 || normalizedSource.includes(normalizedQuote);
  });
}

function computeTotalScore(scores) {
  return Math.round(
    INDICATORS.reduce((sum, indicator) => sum + (scores[indicator.key] || 1) * 20 * indicator.weight, 0)
  );
}

function ruleBasedFallback(reflectionText, reason) {
  const result = evaluateReflection(reflectionText);
  return {
    ...result,
    evidence: null,
    confidence: "low",
    flags: { offTopic: false, tooShort: false, inappropriate: false },
    needsReview: true,
    modelVersion: "rule-based-fallback",
    promptVersion: PROMPT_VERSION,
    fallbackReason: reason || "unknown"
  };
}

async function evaluateWithLLM(reflectionText, meta = {}) {
  if (!LLM_ENABLED) {
    return ruleBasedFallback(reflectionText, "LLM_ENABLED=false");
  }

  const grade = Number(meta.grade) || 3;
  const { gradeBand, rubric } = getRubricContext(grade);
  const curriculum = getCurriculumContext(grade);

  let lastError = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const messages = buildEvaluationMessages({
        reflectionText,
        bookTitle: meta.bookTitle,
        bookAuthor: meta.bookAuthor,
        gradeBand,
        rubric,
        curriculum,
        repairNote: lastError
      });

      const { content } = await chatCompletion({ messages, guidedJson: evaluationSchema, maxTokens: 1200 });
      const parsed = extractJson(content);

      if (!validateEvaluation(parsed)) {
        lastError = `스키마 검증 실패: ${errorsToText(validateEvaluation)}`;
        continue;
      }

      if (!isEvidenceGrounded(parsed.evidence, reflectionText)) {
        lastError = "evidence 인용이 학생 글 원문에서 발견되지 않았습니다.";
        continue;
      }

      const needsReview = parsed.confidence === "low" || parsed.flags.offTopic || parsed.flags.inappropriate;

      return {
        totalScore: computeTotalScore(parsed.scores),
        scores: parsed.scores,
        feedback: parsed.feedback,
        evidence: parsed.evidence,
        confidence: parsed.confidence,
        flags: parsed.flags,
        needsReview,
        modelVersion: LLM_MODEL_NAME,
        promptVersion: PROMPT_VERSION
      };
    } catch (err) {
      lastError = err.message;
    }
  }

  if (LLM_FALLBACK_TO_RULE) {
    return ruleBasedFallback(reflectionText, lastError);
  }

  throw new Error(`LLM 평가 실패: ${lastError}`);
}

function pickCandidatesByIds(items, ids) {
  const idSet = new Set(ids || []);
  return items.filter((item) => idSet.has(item.id));
}

function finalizeDiagnosis(narrative, candidates) {
  const textbookMap = new Map(candidates.textbooks.map((t) => [t.id, t]));
  const bookMap = new Map(candidates.books.map((b) => [b.id, b]));

  return {
    headline: narrative.headline,
    overview: narrative.overview,
    actionPlan: narrative.actionPlan,
    confidence: narrative.confidence,
    needsReview: narrative.needsReview,
    modelVersion: narrative.modelVersion,
    promptVersion: narrative.promptVersion,
    recommendations: {
      textbooks: narrative.recommendedTextbookIds
        .filter((id) => textbookMap.has(id))
        .map((id) => {
          const t = textbookMap.get(id);
          return {
            id,
            title: `${t.subject} - ${t.unit}`,
            reason: `${t.type} 연계 활동${t.linkedStandardCodes?.length ? ` (${t.linkedStandardCodes.join(", ")})` : ""}`
          };
        }),
      books: narrative.recommendedBookIds
        .filter((id) => bookMap.has(id))
        .map((id) => {
          const b = bookMap.get(id);
          return { id, title: b.title, author: b.author, reason: b.reason, level: `${candidates.gradeBand} 권장` };
        })
    }
  };
}

function templateFallbackNarrative({ student, weakest, strongest, candidates, reason }) {
  return {
    headline: `${student.name} 학생 AI 진단 결과 (기본 요약)`,
    overview: `핵심 강점은 ${strongest.label}, 보완이 필요한 영역은 ${weakest.label}입니다. (LLM 서사 생성에 실패해 기본 요약을 표시합니다: ${reason || "알 수 없는 오류"})`,
    actionPlan: [
      `${weakest.label} 보완을 위해 아래 추천 도서/교과서 활동을 우선 진행하세요.`,
      `${strongest.label}은(는) 상승세를 유지할 수 있도록 현재 학습 방식을 지속하세요.`
    ],
    recommendedTextbookIds: candidates.textbooks.slice(0, 2).map((t) => t.id),
    recommendedBookIds: candidates.books.slice(0, 2).map((b) => b.id),
    confidence: "low",
    needsReview: true,
    modelVersion: "template-fallback",
    promptVersion: PROMPT_VERSION
  };
}

async function diagnoseWithLLM({ student, attempts, weakest, strongest, mostImproved, timelineInsights, indicatorInsights }) {
  const weakestCamelKey = snakeToCamelIndicator(weakest.key);
  const candidates = getRecommendationCandidates(student.grade, weakestCamelKey);

  if (!LLM_ENABLED) {
    return finalizeDiagnosis(
      templateFallbackNarrative({ student, weakest, strongest, candidates, reason: "LLM_ENABLED=false" }),
      candidates
    );
  }

  let lastError = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const messages = buildDiagnosisMessages({
        student,
        attempts,
        weakest,
        strongest,
        mostImproved,
        timelineInsights,
        indicatorInsights,
        candidates,
        repairNote: lastError
      });

      const { content } = await chatCompletion({ messages, guidedJson: diagnosisSchema, maxTokens: 900 });
      const parsed = extractJson(content);

      if (!validateDiagnosis(parsed)) {
        lastError = `스키마 검증 실패: ${errorsToText(validateDiagnosis)}`;
        continue;
      }

      const safeTextbookIds = pickCandidatesByIds(candidates.textbooks, parsed.recommendedTextbookIds).map((t) => t.id);
      const safeBookIds = pickCandidatesByIds(candidates.books, parsed.recommendedBookIds).map((b) => b.id);
      const droppedInvalidIds =
        safeTextbookIds.length !== (parsed.recommendedTextbookIds || []).length ||
        safeBookIds.length !== (parsed.recommendedBookIds || []).length;

      return finalizeDiagnosis(
        {
          headline: parsed.headline,
          overview: parsed.overview,
          actionPlan: parsed.actionPlan,
          recommendedTextbookIds: safeTextbookIds,
          recommendedBookIds: safeBookIds,
          confidence: droppedInvalidIds ? "low" : parsed.confidence,
          needsReview: droppedInvalidIds || parsed.confidence === "low",
          modelVersion: LLM_MODEL_NAME,
          promptVersion: PROMPT_VERSION
        },
        candidates
      );
    } catch (err) {
      lastError = err.message;
    }
  }

  if (LLM_FALLBACK_TO_RULE) {
    return finalizeDiagnosis(
      templateFallbackNarrative({ student, weakest, strongest, candidates, reason: lastError }),
      candidates
    );
  }

  throw new Error(`LLM 진단 실패: ${lastError}`);
}

async function checkLlmHealth() {
  if (!LLM_ENABLED) {
    return { enabled: false, reachable: false };
  }
  const reachable = await checkHealth();
  return { enabled: true, reachable };
}

module.exports = {
  PROMPT_VERSION,
  evaluateWithLLM,
  diagnoseWithLLM,
  checkLlmHealth
};
