// 골든셋 대비 LLM 평가 정확도(MAE)와 진단 추천의 할루시네이션 방지 여부를 점검하는 하네스.
// 실행: npm run eval:llm  (vLLM이 꺼져 있으면 전량 폴백으로 처리되어 MAE는 규칙 기반 결과를 반영함)
const path = require("path");
const fs = require("fs");
const { initDatabase, getRubricByGradeBand } = require("../../DB/database");
const { evaluateWithLLM } = require("../../WAS/services/llm/llmLiteracyService");
const { getRecommendationCandidates } = require("../../WAS/services/llm/referenceRetriever");
const { buildDiagnosisMessages } = require("../../WAS/services/llm/promptBuilder");
const { diagnosisSchema, validateDiagnosis } = require("../../WAS/services/llm/responseSchema");
const { chatCompletion } = require("../../WAS/services/llm/vllmClient");

const INDICATOR_KEYS = ["comprehension", "inference", "criticalThinking", "expression", "vocabGrammar"];
const MAE_THRESHOLD = 0.5;

function loadGoldenSet() {
  const filePath = path.join(__dirname, "golden-set.json");
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return parsed.items || [];
}

async function runEvaluationBench(cases) {
  const perIndicatorErrors = Object.fromEntries(INDICATOR_KEYS.map((key) => [key, []]));
  const llmOnlyErrors = Object.fromEntries(INDICATOR_KEYS.map((key) => [key, []]));
  let llmSuccessCount = 0;
  let fallbackCount = 0;
  let needsReviewCount = 0;

  for (const testCase of cases) {
    const result = await evaluateWithLLM(testCase.reflectionText, {
      grade: testCase.grade,
      bookTitle: testCase.bookTitle,
      bookAuthor: testCase.bookAuthor
    });

    const isFallback = result.modelVersion === "rule-based-fallback";
    isFallback ? (fallbackCount += 1) : (llmSuccessCount += 1);
    if (result.needsReview) {
      needsReviewCount += 1;
    }

    INDICATOR_KEYS.forEach((key) => {
      const error = Math.abs(testCase.expectedScores[key] - result.scores[key]);
      perIndicatorErrors[key].push(error);
      if (!isFallback) {
        llmOnlyErrors[key].push(error);
      }
    });

    console.log(
      `  [${testCase.id}] fallback=${isFallback} scores=${JSON.stringify(result.scores)}${
        isFallback ? ` reason=${result.fallbackReason}` : ""
      }`
    );
  }

  function printMae(label, errorsByIndicator) {
    console.log(`\n=== ${label} (1~5점 척도, 기준 <= ${MAE_THRESHOLD}) ===`);
    const sampleCount = errorsByIndicator[INDICATOR_KEYS[0]].length;
    if (!sampleCount) {
      console.log("  (해당 없음: 샘플 0건)");
      return;
    }
    let overallSum = 0;
    let overallCount = 0;
    INDICATOR_KEYS.forEach((key) => {
      const errors = errorsByIndicator[key];
      const sum = errors.reduce((a, b) => a + b, 0);
      overallSum += sum;
      overallCount += errors.length;
      const mae = sum / errors.length;
      console.log(`  ${key}: MAE=${mae.toFixed(2)} [${mae <= MAE_THRESHOLD ? "PASS" : "FAIL"}] (n=${errors.length})`);
    });
    console.log(`  전체 MAE: ${(overallSum / overallCount).toFixed(2)} (n=${sampleCount})`);
  }

  // 폴백이 섞이면 규칙 기반 evaluator.js의 오차가 LLM 정확도처럼 보일 수 있어 반드시 분리 표기.
  printMae("LLM 응답만 대상 MAE (실제 vLLM 정확도)", llmOnlyErrors);
  printMae("전체 케이스 MAE (폴백 포함, 참고용)", perIndicatorErrors);

  console.log("\n=== 실행 통계 ===");
  console.log(`  총 케이스: ${cases.length}건`);
  console.log(`  LLM 응답(스키마 검증 통과): ${llmSuccessCount}건`);
  console.log(`  규칙 기반 폴백: ${fallbackCount}건 (vLLM 미가동/응답 실패/타임아웃 시 발생)`);
  console.log(`  교사 검수 필요(needsReview): ${needsReviewCount}건`);

  if (fallbackCount === cases.length) {
    console.log(
      "\n  안내: 전체 케이스가 폴백으로 처리되어 MAE는 규칙 기반(evaluator.js) 결과 기준입니다."
    );
    console.log("        vLLM 서버 구동 후 재실행해야 LLM 자체의 정확도를 측정할 수 있습니다.");
  } else if (fallbackCount > 0) {
    console.log(
      `\n  안내: ${fallbackCount}건이 폴백 처리되었습니다. LLM_TIMEOUT_MS를 늘리거나(예: 60000) vLLM 응답 속도를 확인하세요.`
    );
  }
}


// diagnoseWithLLM은 항상 candidate 목록으로 결과를 필터링하므로 최종 결과의 할루시네이션은 구조적으로 0%입니다.
// 이 점검은 필터링 이전, 모델이 실제로 candidate 밖 id를 만들어내려는 시도가 있는지 측정합니다.
async function runDiagnosisHallucinationCheck() {
  const candidates = getRecommendationCandidates(4, "criticalThinking");
  const candidateIds = new Set([...candidates.textbooks, ...candidates.books].map((item) => item.id));

  const messages = buildDiagnosisMessages({
    student: { name: "샘플학생", grade: 4, school: "샘플초", class_name: "1반" },
    attempts: 3,
    weakest: { key: "critical_thinking", label: "비판/평가", recentAvg: 55, prevAvg: 60, delta: -5 },
    strongest: { key: "comprehension", label: "내용 이해", recentAvg: 85, prevAvg: 80, delta: 5 },
    mostImproved: { key: "comprehension", label: "내용 이해", recentAvg: 85, prevAvg: 80, delta: 5 },
    timelineInsights: ["샘플 타임라인 인사이트"],
    indicatorInsights: ["샘플 지표 인사이트"],
    candidates
  });

  console.log("\n=== 진단 추천 할루시네이션(candidate 밖 id) 점검 - 필터링 이전 원본 응답 기준 ===");

  try {
    const { content } = await chatCompletion({ messages, guidedJson: diagnosisSchema, maxTokens: 900 });
    const parsed = JSON.parse(content);

    if (!validateDiagnosis(parsed)) {
      console.log("  스키마 검증 실패로 할루시네이션 비율을 측정할 수 없습니다.");
      return;
    }

    const proposedIds = [...(parsed.recommendedTextbookIds || []), ...(parsed.recommendedBookIds || [])];
    const hallucinated = proposedIds.filter((id) => !candidateIds.has(id));
    const rate = proposedIds.length ? (hallucinated.length / proposedIds.length) * 100 : 0;

    console.log(`  모델이 제안한 id 수: ${proposedIds.length}`);
    console.log(`  candidate 밖 id(할루시네이션) 수: ${hallucinated.length} (${rate.toFixed(1)}%)`);
    if (hallucinated.length) {
      console.log(`  할루시네이션 id 목록: ${hallucinated.join(", ")}`);
    }
  } catch (err) {
    console.log(`  vLLM 호출 실패로 점검을 건너뜁니다: ${err.message}`);
    console.log("  (참고: 실제 서비스 경로의 diagnoseWithLLM은 항상 candidate로 필터링하므로 최종 결과는 이 실패와 무관하게 안전합니다.)");
  }
}

async function run() {
  initDatabase();

  if (!getRubricByGradeBand("low").length) {
    console.warn("경고: literacy_rubric 테이블이 비어 있습니다. 먼저 `npm run seed:reference`를 실행하세요.\n");
  }

  const cases = loadGoldenSet();
  console.log(`골든셋 ${cases.length}건으로 LLM 평가 정확도를 점검합니다.\n`);

  await runEvaluationBench(cases);
  await runDiagnosisHallucinationCheck();
}

if (require.main === module) {
  run().catch((err) => {
    console.error("평가 실행 실패:", err);
    process.exit(1);
  });
}

module.exports = { run };
