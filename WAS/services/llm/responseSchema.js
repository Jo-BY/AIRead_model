// LLM 응답 구조를 강제하는 JSON 스키마 (vLLM guided_json + ajv 이중 검증용).
const Ajv = require("ajv");
const { INDICATOR_KEYS } = require("./shared");

const ajv = new Ajv({ allErrors: true, strict: false });

const scoreProperty = { type: "integer", minimum: 1, maximum: 5 };
const textProperty = { type: "string", minLength: 1, maxLength: 400 };
// 인용할 근거가 실제로 없는 지표(예: 매우 짧은 글)에는 빈 문자열을 허용 -
// 없는 근거를 지어내게 강제하는 것보다 정직한 "근거 없음"이 낫다.
const evidenceProperty = { type: "string", maxLength: 400 };

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scores", "evidence", "feedback", "confidence", "flags"],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: INDICATOR_KEYS,
      properties: Object.fromEntries(INDICATOR_KEYS.map((key) => [key, scoreProperty]))
    },
    evidence: {
      type: "object",
      description: "각 지표 판단의 근거가 되는 학생 글 원문 인용(부분 문자열). 근거가 없으면 빈 문자열.",
      additionalProperties: false,
      required: INDICATOR_KEYS,
      properties: Object.fromEntries(INDICATOR_KEYS.map((key) => [key, evidenceProperty]))
    },
    feedback: {
      type: "object",
      additionalProperties: false,
      required: INDICATOR_KEYS,
      properties: Object.fromEntries(INDICATOR_KEYS.map((key) => [key, textProperty]))
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    flags: {
      type: "object",
      additionalProperties: false,
      required: ["offTopic", "tooShort", "inappropriate"],
      properties: {
        offTopic: { type: "boolean" },
        tooShort: { type: "boolean" },
        inappropriate: { type: "boolean" }
      }
    }
  }
};

const diagnosisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "overview", "actionPlan", "recommendedTextbookIds", "recommendedBookIds", "confidence"],
  properties: {
    headline: { type: "string", minLength: 1, maxLength: 120 },
    overview: { type: "string", minLength: 1, maxLength: 500 },
    actionPlan: {
      type: "array",
      items: { type: "string", minLength: 1, maxLength: 200 },
      minItems: 1,
      maxItems: 5
    },
    recommendedTextbookIds: { type: "array", items: { type: "string" }, maxItems: 5 },
    recommendedBookIds: { type: "array", items: { type: "string" }, maxItems: 5 },
    confidence: { type: "string", enum: ["low", "medium", "high"] }
  }
};

const validateEvaluation = ajv.compile(evaluationSchema);
const validateDiagnosis = ajv.compile(diagnosisSchema);

function errorsToText(validateFn) {
  return ajv.errorsText(validateFn.errors, { separator: "; " });
}

module.exports = {
  evaluationSchema,
  diagnosisSchema,
  validateEvaluation,
  validateDiagnosis,
  errorsToText
};
