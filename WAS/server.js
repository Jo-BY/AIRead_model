const path = require("path");
// DB/llm 모듈이 module-load 시점에 process.env를 읽으므로, 그 require보다 먼저 .env를 로드해야 한다.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const {
  initDatabase,
  createOrGetStudentAccount,
  getStudentById,
  createSubmission,
  createAssignment,
  getAssignmentById,
  getAssignments,
  createAssignmentSubmission,
  getDashboard,
  getStudentReflectionDetail,
  createDiscussionSession,
  getDiscussionSessionById,
  getDiscussionSessionsByStudent,
  getDiscussionMessages,
  addDiscussionMessage,
  createAiDiagnosis,
  getLatestAiDiagnosis,
  getAiDiagnosisHistory
} = require("../DB/database");
const { INDICATORS } = require("./services/evaluator");
const { evaluateWithLLM, diagnoseWithLLM, chatDiscussionReply, checkLlmHealth } = require("./services/llm/llmLiteracyService");

const app = express();
const PORT = process.env.PORT || 3000;
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "0000";
const HAS_EXPLICIT_PORT = Boolean(process.env.PORT);

const INDICATOR_META = [
  { key: "comprehension", label: "내용 이해" },
  { key: "inference", label: "추론/해석" },
  { key: "critical_thinking", label: "비판/평가" },
  { key: "expression", label: "표현/구성" },
  { key: "vocab_grammar", label: "어휘/문장 사용" }
];

function normalizeTotalTo100(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) {
    return 0;
  }
  if (n <= 25) {
    return (n / 25) * 100;
  }
  return n;
}

function normalizeIndicatorTo100(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) {
    return 0;
  }
  if (n <= 5) {
    return n * 20;
  }
  return n;
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, v) => sum + Number(v || 0), 0) / values.length;
}

function calcSlope(values) {
  if (values.length < 2) {
    return 0;
  }

  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = average(values);
  let num = 0;
  let den = 0;

  values.forEach((value, idx) => {
    const dx = idx - meanX;
    num += dx * (value - meanY);
    den += dx * dx;
  });

  return den === 0 ? 0 : num / den;
}

async function buildStudentDiagnosis(student, rows) {
  const sortedRows = [...rows].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
  const attempts = sortedRows.length;

  if (!attempts) {
    return {
      diagnosis: {
        headline: `${student.name} 학생의 진단을 위해 평가 기록이 필요합니다.`,
        overview:
          "아직 분석 가능한 문해력 평가 기록이 없습니다. 문해력 평가 탭에서 최소 2건 이상 작성하면 성장 패턴과 지표별 약점을 더 정확하게 진단할 수 있어요.",
        timelineInsights: ["기록 2건 이상 누적 시 추세(상승/정체/하락) 분석을 제공합니다."],
        indicatorInsights: [],
        actionPlan: [
          "주 2회 이상 감상문을 작성해 시간 흐름 데이터(타임라인)를 확보하세요.",
          "책 내용 요약 3문장 + 이유/근거 2문장 구조로 꾸준히 작성해 보세요."
        ]
      },
      recommendations: {
        textbooks: [],
        books: []
      },
      meta: {
        attemptCount: 0,
        school: student.school,
        grade: student.grade,
        className: student.class_name
      }
    };
  }

  const totalSeries = sortedRows.map((row) => normalizeTotalTo100(row.total_score));
  const firstTotal = totalSeries[0];
  const latestTotal = totalSeries[totalSeries.length - 1];
  const totalDelta = latestTotal - firstTotal;
  const totalSlope = calcSlope(totalSeries);

  const trendText = totalSlope > 1.2 ? "상승" : totalSlope < -1.2 ? "하락" : "정체";
  const recentWindow = sortedRows.slice(-Math.min(3, attempts));
  const prevWindow = sortedRows.slice(0, Math.max(1, attempts - recentWindow.length));

  const indicatorStats = INDICATOR_META.map((meta) => {
    const recentAvg = average(recentWindow.map((row) => normalizeIndicatorTo100(row[meta.key])));
    const prevAvg = average(prevWindow.map((row) => normalizeIndicatorTo100(row[meta.key])));
    return {
      ...meta,
      recentAvg,
      prevAvg,
      delta: recentAvg - prevAvg
    };
  });

  const weakest = [...indicatorStats].sort((a, b) => a.recentAvg - b.recentAvg)[0];
  const strongest = [...indicatorStats].sort((a, b) => b.recentAvg - a.recentAvg)[0];
  const mostImproved = [...indicatorStats].sort((a, b) => b.delta - a.delta)[0];

  const timelineInsights = [
    `초기 대비 최근 총점 변화: ${firstTotal.toFixed(1)}점 -> ${latestTotal.toFixed(1)}점 (${totalDelta >= 0 ? "+" : ""}${totalDelta.toFixed(1)}점)`,
    `타임라인 추세는 ${trendText} 흐름입니다.`,
    `최근 ${recentWindow.length}회 평균 총점: ${average(recentWindow.map((row) => normalizeTotalTo100(row.total_score))).toFixed(1)}점`
  ];

  const indicatorInsights = indicatorStats.map((item) => {
    const deltaPrefix = item.delta >= 0 ? "+" : "";
    return `${item.label}: 최근 평균 ${item.recentAvg.toFixed(1)}점 (이전 대비 ${deltaPrefix}${item.delta.toFixed(1)}점)`;
  });

  // 추세/지표 통계는 결정론적으로 유지하고, 서사(headline/overview/actionPlan)와 추천 선택만 LLM이 담당.
  const narrative = await diagnoseWithLLM({
    student,
    attempts,
    weakest,
    strongest,
    mostImproved,
    timelineInsights,
    indicatorInsights
  });

  return {
    diagnosis: {
      headline: narrative.headline,
      overview: narrative.overview,
      timelineInsights,
      indicatorInsights,
      actionPlan: narrative.actionPlan
    },
    recommendations: narrative.recommendations,
    meta: {
      attemptCount: attempts,
      school: student.school,
      grade: student.grade,
      className: student.class_name,
      weakestIndicator: weakest.label,
      strongestIndicator: strongest.label,
      confidence: narrative.confidence,
      needsReview: narrative.needsReview,
      modelVersion: narrative.modelVersion,
      promptVersion: narrative.promptVersion
    }
  };
}

function normalizeClassName(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return raw;
  }

  // Accept "1" or "1반" as the same class label.
  if (/^\d+$/.test(raw)) {
    return `${raw}반`;
  }

  return raw;
}

initDatabase();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "WEB")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "WEB", "login.html"));
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "WEB", "index.html"));
});

app.get("/api/health", async (req, res) => {
  const llm = await checkLlmHealth();
  res.json({ ok: true, service: "AIRead literacy service", llm });
});

app.get("/api/indicators", (req, res) => {
  res.json({ indicators: INDICATORS });
});

app.post("/api/auth/login", (req, res) => {
  const { name, school, grade, className, studentNumber } = req.body || {};

  if (!name || !school || !grade || !className || !studentNumber) {
    return res.status(400).json({ message: "이름, 학교, 학년, 반, 번호를 모두 입력해 주세요." });
  }

  const parsedGrade = Number(grade);
  if (!Number.isInteger(parsedGrade) || parsedGrade < 1 || parsedGrade > 6) {
    return res.status(400).json({ message: "학년은 1~6 사이의 숫자로 입력해 주세요." });
  }

  const parsedNumber = Number(studentNumber);
  if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
    return res.status(400).json({ message: "번호는 1 이상의 숫자로 입력해 주세요." });
  }

  const student = createOrGetStudentAccount({
    name: String(name).trim(),
    school: String(school).trim(),
    grade: parsedGrade,
    className: normalizeClassName(className),
    studentNumber: parsedNumber
  });

  return res.json({
    message: "로그인되었습니다.",
    student: {
      id: student.id,
      name: student.name,
      school: student.school,
      grade: student.grade,
      className: student.class_name,
      studentNumber: student.student_number
    }
  });
});

app.post("/api/auth/teacher-login", (req, res) => {
  const { name, password } = req.body || {};

  if (!name || !password) {
    return res.status(400).json({ message: "이름과 비밀번호를 입력해 주세요." });
  }

  if (String(password) !== TEACHER_PASSWORD) {
    return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
  }

  return res.json({
    message: "교사 로그인되었습니다.",
    teacher: {
      name: String(name).trim(),
      role: "teacher"
    }
  });
});

app.post("/api/evaluate", async (req, res) => {
  const { reflectionText, grade, bookTitle, bookAuthor } = req.body || {};

  if (!reflectionText || reflectionText.trim().length < 20) {
    return res.status(400).json({ message: "감상문은 20자 이상 입력해 주세요." });
  }

  const result = await evaluateWithLLM(reflectionText, { grade: grade || 4, bookTitle, bookAuthor });
  return res.json(result);
});

app.post("/api/submissions", async (req, res) => {
  const { studentId, reflection } = req.body || {};

  if (!studentId || !reflection) {
    return res.status(400).json({ message: "로그인 정보와 감상문 정보가 필요합니다." });
  }

  const parsedStudentId = Number(studentId);
  if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 학생 계정입니다." });
  }

  const student = getStudentById(parsedStudentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다. 다시 로그인해 주세요." });
  }

  if (!reflection.bookTitle || !reflection.reflectionText) {
    return res.status(400).json({ message: "책 제목과 감상문을 입력해 주세요." });
  }

  if (reflection.reflectionText.trim().length < 20) {
    return res.status(400).json({ message: "감상문은 20자 이상 입력해 주세요." });
  }

  const evaluation = await evaluateWithLLM(reflection.reflectionText, {
    grade: student.grade,
    bookTitle: reflection.bookTitle,
    bookAuthor: reflection.bookAuthor
  });
  const ids = createSubmission(parsedStudentId, reflection, evaluation);

  return res.status(201).json({
    message: "저장 및 평가가 완료되었습니다.",
    ids,
    student: {
      id: student.id,
      name: student.name,
      school: student.school,
      grade: student.grade,
      className: student.class_name,
      studentNumber: student.student_number
    },
    evaluation
  });
});

app.get("/api/my-dashboard", (req, res) => {
  const studentId = Number(req.query.studentId);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }

  const student = getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  const limit = Number(req.query.limit || 100);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 300) : 100;
  const dashboard = getDashboard(safeLimit, studentId);

  return res.json({
    student: {
      id: student.id,
      name: student.name,
      school: student.school,
      grade: student.grade,
      className: student.class_name,
      studentNumber: student.student_number
    },
    ...dashboard
  });
});

app.get("/api/my-reflection-detail", (req, res) => {
  const studentId = Number(req.query.studentId);
  const reflectionId = Number(req.query.reflectionId);

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }

  if (!Number.isInteger(reflectionId) || reflectionId <= 0) {
    return res.status(400).json({ message: "reflectionId가 필요합니다." });
  }

  const student = getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  const detail = getStudentReflectionDetail(studentId, reflectionId);
  if (!detail) {
    return res.status(404).json({ message: "해당 독서 기록을 찾을 수 없습니다." });
  }

  return res.json({ detail });
});

app.get("/api/my-ai-diagnosis", async (req, res) => {
  const studentId = Number(req.query.studentId);
  const forceRefresh = String(req.query.forceRefresh || "false").toLowerCase() === "true";

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }

  const student = getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  if (!forceRefresh) {
    const saved = getLatestAiDiagnosis(studentId);
    if (saved) {
      return res.json(saved);
    }
  }

  const dashboard = getDashboard(300, studentId);
  const result = await buildStudentDiagnosis(student, dashboard.rows || []);

  if (Number(result.meta?.attemptCount || 0) > 0) {
    const saved = createAiDiagnosis(studentId, result);
    return res.json(saved);
  }

  return res.json(result);
});

app.get("/api/my-ai-diagnosis-history", (req, res) => {
  const studentId = Number(req.query.studentId);

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }

  const student = getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  const limit = Number(req.query.limit || 20);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;
  const history = getAiDiagnosisHistory(studentId, safeLimit);
  return res.json({ history });
});

app.get("/api/dashboard", (req, res) => {
  const limit = Number(req.query.limit || 100);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 300) : 100;

  const dashboard = getDashboard(safeLimit);
  return res.json(dashboard);
});

app.post("/api/assignments", (req, res) => {
  const { bookTitle, bookAuthor, summary, objective, deadline } = req.body || {};

  if (!bookTitle || !summary || !objective || !deadline) {
    return res.status(400).json({ message: "책 제목, 책의 요약본, 과제 목표, 제출 기한을 모두 입력해 주세요." });
  }

  const assignment = createAssignment({
    bookTitle: String(bookTitle).trim(),
    bookAuthor: bookAuthor ? String(bookAuthor).trim() : null,
    summary: String(summary).trim(),
    objective: String(objective).trim(),
    deadline: String(deadline).trim()
  });

  return res.status(201).json({
    message: "과제가 저장되었습니다.",
    assignment
  });
});

app.get("/api/assignments", (req, res) => {
  return res.json({ assignments: getAssignments() });
});

app.post("/api/assignment-submissions", async (req, res) => {
  const { studentId, assignmentId, answerText } = req.body || {};

  if (!studentId || !assignmentId || !answerText) {
    return res.status(400).json({ message: "학생 정보, 과제 정보, 작성 내용을 모두 입력해 주세요." });
  }

  const parsedStudentId = Number(studentId);
  const parsedAssignmentId = Number(assignmentId);

  if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 학생 계정입니다." });
  }

  if (!Number.isInteger(parsedAssignmentId) || parsedAssignmentId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 과제입니다." });
  }

  const student = getStudentById(parsedStudentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  const assignment = getAssignmentById(parsedAssignmentId);
  if (!assignment) {
    return res.status(404).json({ message: "해당 과제를 찾을 수 없습니다." });
  }

  const trimmedText = String(answerText).trim();
  if (trimmedText.length < 20) {
    return res.status(400).json({ message: "과제 작성은 20자 이상 입력해 주세요." });
  }

  const evaluation = await evaluateWithLLM(trimmedText, {
    grade: student.grade,
    bookTitle: assignment.bookTitle,
    bookAuthor: assignment.bookAuthor
  });
  const submission = createAssignmentSubmission(parsedStudentId, parsedAssignmentId, trimmedText, evaluation);

  return res.status(201).json({
    message: "과제가 제출되었고 평가가 저장되었습니다.",
    assignment,
    submission,
    evaluation
  });
});

app.post("/api/discussions", (req, res) => {
  const { studentId, bookTitle, bookAuthor } = req.body || {};

  const parsedStudentId = Number(studentId);
  if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 학생 계정입니다." });
  }

  const student = getStudentById(parsedStudentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다. 다시 로그인해 주세요." });
  }

  const trimmedTitle = String(bookTitle || "").trim();
  if (!trimmedTitle) {
    return res.status(400).json({ message: "토론할 책 제목을 입력해 주세요." });
  }

  const session = createDiscussionSession(parsedStudentId, trimmedTitle, bookAuthor);
  return res.status(201).json({ message: "토론이 시작되었습니다.", session });
});

app.get("/api/discussions", (req, res) => {
  const studentId = Number(req.query.studentId);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }

  const student = getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  return res.json({ sessions: getDiscussionSessionsByStudent(studentId) });
});

app.get("/api/discussions/:sessionId/messages", (req, res) => {
  const studentId = Number(req.query.studentId);
  const sessionId = Number(req.params.sessionId);

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ message: "studentId가 필요합니다." });
  }
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 토론입니다." });
  }

  const session = getDiscussionSessionById(sessionId, studentId);
  if (!session) {
    return res.status(404).json({ message: "해당 토론을 찾을 수 없습니다." });
  }

  return res.json({ session, messages: getDiscussionMessages(sessionId) });
});

app.post("/api/discussions/:sessionId/messages", async (req, res) => {
  const { studentId, message } = req.body || {};
  const sessionId = Number(req.params.sessionId);
  const parsedStudentId = Number(studentId);

  if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 학생 계정입니다." });
  }
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return res.status(400).json({ message: "유효하지 않은 토론입니다." });
  }

  const trimmedMessage = String(message || "").trim();
  if (!trimmedMessage) {
    return res.status(400).json({ message: "메시지를 입력해 주세요." });
  }
  if (trimmedMessage.length > 1000) {
    return res.status(400).json({ message: "메시지는 1000자 이하로 입력해 주세요." });
  }

  const student = getStudentById(parsedStudentId);
  if (!student) {
    return res.status(404).json({ message: "학생 계정을 찾을 수 없습니다." });
  }

  const session = getDiscussionSessionById(sessionId, parsedStudentId);
  if (!session) {
    return res.status(404).json({ message: "해당 토론을 찾을 수 없습니다." });
  }

  const userMessage = addDiscussionMessage(sessionId, "user", trimmedMessage);
  const history = getDiscussionMessages(sessionId);

  const result = await chatDiscussionReply({
    bookTitle: session.bookTitle,
    bookAuthor: session.bookAuthor,
    grade: student.grade,
    history
  });

  const assistantMessage = addDiscussionMessage(sessionId, "assistant", result.reply);

  return res.status(201).json({ userMessage, assistantMessage });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`AIRead server running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    if (process.env.DB_PATH || process.env.DB_DIR) {
      console.log("Custom DB path configuration is enabled.");
    }
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !HAS_EXPLICIT_PORT && port < 3010) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

startServer(PORT);
