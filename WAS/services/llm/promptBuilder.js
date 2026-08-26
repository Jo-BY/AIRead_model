// system + user 메시지 조립. 학생 입력은 태그로 감싸 "데이터"로만 전달(프롬프트 인젝션 방어).
const { buildEvaluationSystemPrompt, buildDiagnosisSystemPrompt, PROMPT_VERSION } = require("./systemPrompt");

function buildEvaluationMessages({ reflectionText, bookTitle, bookAuthor, gradeBand, rubric, curriculum, repairNote }) {
  const systemPrompt = buildEvaluationSystemPrompt({ gradeBand, rubric, curriculum });

  const userLines = [
    `책 제목: ${bookTitle || "(미상)"}`,
    `저자: ${bookAuthor || "(미상)"}`,
    "학생 글:",
    "<student_text>",
    reflectionText,
    "</student_text>",
    "",
    "위 학생 글을 채점 절차에 따라 평가하고, 스키마에 맞는 JSON만 출력하세요."
  ];

  if (repairNote) {
    userLines.push(
      "",
      `[이전 응답 오류 - 반드시 수정하세요] ${repairNote}`,
      "이전 오류를 반영해 스키마를 정확히 지키고, evidence는 반드시 학생 글에 실제로 존재하는 문구여야 합니다."
    );
  }

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userLines.join("\n") }
  ];
}

function formatCandidateList(label, items, fields) {
  if (!items.length) {
    return `${label}: (후보 없음)`;
  }
  const lines = items.map((item) => `  - id=${item.id}, ${fields(item)}`).join("\n");
  return `${label}:\n${lines}`;
}

function buildDiagnosisMessages({
  student,
  attempts,
  weakest,
  strongest,
  mostImproved,
  timelineInsights,
  indicatorInsights,
  candidates,
  repairNote
}) {
  const systemPrompt = buildDiagnosisSystemPrompt();

  const contextLines = [
    `학교/학년/반: ${student.school} ${student.grade}학년 ${student.class_name}`,
    `분석된 기록 수: ${attempts}건`,
    `최약점 지표: ${weakest.label} (최근 평균 ${weakest.recentAvg.toFixed(1)}점, 이전 대비 ${weakest.delta >= 0 ? "+" : ""}${weakest.delta.toFixed(1)}점)`,
    `최강점 지표: ${strongest.label} (최근 평균 ${strongest.recentAvg.toFixed(1)}점)`,
    `가장 향상된 지표: ${mostImproved.label} (변화 ${mostImproved.delta >= 0 ? "+" : ""}${mostImproved.delta.toFixed(1)}점)`,
    "타임라인 통계:",
    ...timelineInsights.map((line) => `  - ${line}`),
    "지표별 통계:",
    ...indicatorInsights.map((line) => `  - ${line}`)
  ];

  const candidateLines = [
    formatCandidateList("추천 가능 교과서 후보 (candidate)", candidates.textbooks, (t) => `${t.subject} - ${t.unit} (${t.type})`),
    formatCandidateList("추천 가능 도서 후보 (candidate)", candidates.books, (b) => `${b.title} / ${b.author || "저자 미상"} - ${b.reason}`)
  ];

  const userLines = [
    "<student_context>",
    ...contextLines,
    "</student_context>",
    "",
    ...candidateLines,
    "",
    "위 통계와 candidate 목록만 근거로 진단 서사와 추천을 작성하세요. candidate 목록 밖의 id는 절대 사용하지 마세요."
  ];

  if (repairNote) {
    userLines.push(
      "",
      `[이전 응답 오류 - 반드시 수정하세요] ${repairNote}`,
      "recommendedTextbookIds/recommendedBookIds는 반드시 candidate 목록의 id만 사용하세요."
    );
  }

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userLines.join("\n") }
  ];
}

module.exports = { PROMPT_VERSION, buildEvaluationMessages, buildDiagnosisMessages };
