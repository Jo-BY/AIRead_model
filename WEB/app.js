const logoutButton = document.getElementById("logoutButton");
const loginStatusEl = document.getElementById("loginStatus");
const form = document.getElementById("submissionForm");
const evaluationProgressOverlayEl = document.getElementById("evaluationProgressOverlay");
const evaluationProgressTitleEl = document.getElementById("evaluationProgressTitle");
const evaluationProgressFillEl = document.getElementById("evaluationProgressFill");
const evaluationProgressPercentEl = document.getElementById("evaluationProgressPercent");
const evaluationProgressMessageEl = document.getElementById("evaluationProgressMessage");
const totalScoreEl = document.getElementById("totalScore");
const evaluationMetaBadgeEl = document.getElementById("evaluationMetaBadge");
const scoreRowsEl = document.getElementById("scoreRows");
const indicatorListEl = document.getElementById("indicatorList");
const dashboardBodyEl = document.getElementById("dashboardBody");
const statsEl = document.getElementById("stats");
const dashboardSearchInputEl = document.getElementById("dashboardSearchInput");
const dashboardSourceFilterEl = document.getElementById("dashboardSourceFilter");
const timelineRefreshButton = document.getElementById("timelineRefreshButton");
const timelineSummaryEl = document.getElementById("timelineSummary");
const timelineEmptyEl = document.getElementById("timelineEmpty");
const timelineChartGroupEl = document.getElementById("timelineChartGroup");
const timelineTotalChartEl = document.getElementById("timelineTotalChart");
const timelineIndicatorChartEl = document.getElementById("timelineIndicatorChart");
const timelineIndicatorLegendEl = document.getElementById("timelineIndicatorLegend");
const aiDiagnosisRefreshButton = document.getElementById("aiDiagnosisRefreshButton");
const aiDiagnosisHistoryListEl = document.getElementById("aiDiagnosisHistoryList");
const aiDiagnosisMetaEl = document.getElementById("aiDiagnosisMeta");
const aiDiagnosisEmptyEl = document.getElementById("aiDiagnosisEmpty");
const aiDiagnosisPanelEl = document.getElementById("aiDiagnosisPanel");
const aiDiagnosisHeadlineEl = document.getElementById("aiDiagnosisHeadline");
const aiDiagnosisConfidenceBadgeEl = document.getElementById("aiDiagnosisConfidenceBadge");
const aiDiagnosisOverviewEl = document.getElementById("aiDiagnosisOverview");
const aiDiagnosisTimelineListEl = document.getElementById("aiDiagnosisTimelineList");
const aiDiagnosisIndicatorListEl = document.getElementById("aiDiagnosisIndicatorList");
const aiTextbookListEl = document.getElementById("aiTextbookList");
const aiBookListEl = document.getElementById("aiBookList");
const aiActionPlanListEl = document.getElementById("aiActionPlanList");
const studentDetailModalEl = document.getElementById("studentDetailModal");
const studentDetailCloseButton = document.getElementById("studentDetailCloseButton");
const studentDetailTitleEl = document.getElementById("studentDetailTitle");
const studentDetailSubmittedAtEl = document.getElementById("studentDetailSubmittedAt");
const studentDetailMetaEl = document.getElementById("studentDetailMeta");
const studentDetailTotalScoreEl = document.getElementById("studentDetailTotalScore");
const studentDetailSummaryEl = document.getElementById("studentDetailSummary");
const studentIndicatorScoreListEl = document.getElementById("studentIndicatorScoreList");
const studentDetailScoreRowsEl = document.getElementById("studentDetailScoreRows");
const studentRadarChartEl = document.getElementById("studentRadarChart");
const studentRadarLegendEl = document.getElementById("studentRadarLegend");
const studentDetailReflectionTextEl = document.getElementById("studentDetailReflectionText");
const teacherStatsEl = document.getElementById("teacherStats");
const teacherDashboardBodyEl = document.getElementById("teacherDashboardBody");
const teacherSearchInput = document.getElementById("teacherSearchInput");
const teacherGradeFilter = document.getElementById("teacherGradeFilter");
const teacherClassFilter = document.getElementById("teacherClassFilter");
const teacherFilterResetButton = document.getElementById("teacherFilterResetButton");
const teacherTrendSchoolInput = document.getElementById("teacherTrendSchoolInput");
const teacherTrendNameInput = document.getElementById("teacherTrendNameInput");
const teacherTrendClassFilter = document.getElementById("teacherTrendClassFilter");
const teacherTrendMinScoreInput = document.getElementById("teacherTrendMinScoreInput");
const teacherTrendMaxScoreInput = document.getElementById("teacherTrendMaxScoreInput");
const teacherTrendFilterResetButton = document.getElementById("teacherTrendFilterResetButton");
const teacherOverviewSummaryEl = document.getElementById("teacherOverviewSummary");
const teacherComparisonChartEl = document.getElementById("teacherComparisonChart");
const teacherStudentTrendListEl = document.getElementById("teacherStudentTrendList");
const teacherStudentTrendPaginationEl = document.getElementById("teacherStudentTrendPagination");
const teacherDetailModalEl = document.getElementById("teacherDetailModal");
const teacherDetailCardEl = document.getElementById("teacherDetailCard");
const teacherDetailDragBarEl = document.getElementById("teacherDetailDragBar");
const teacherResizeHandleEl = document.getElementById("teacherResizeHandle");
const teacherDetailCloseButton = document.getElementById("teacherDetailCloseButton");
const teacherDetailTitleEl = document.getElementById("teacherDetailTitle");
const teacherDetailBodyEl = document.getElementById("teacherDetailBody");
const teacherHistoryDetailEmptyEl = document.getElementById("teacherHistoryDetailEmpty");
const teacherHistoryDetailContentEl = document.getElementById("teacherHistoryDetailContent");
const teacherHistoryDetailNameEl = document.getElementById("teacherHistoryDetailName");
const teacherHistoryTabButtons = document.querySelectorAll("[data-history-tab]");
const teacherHistoryTabContents = document.querySelectorAll("[data-history-tab-content]");
const teacherHistoryBookListEl = document.getElementById("teacherHistoryBookList");
const teacherHistoryTimelineSummaryEl = document.getElementById("teacherHistoryTimelineSummary");
const teacherHistoryTimelineEmptyEl = document.getElementById("teacherHistoryTimelineEmpty");
const teacherHistoryTimelineChartGroupEl = document.getElementById("teacherHistoryTimelineChartGroup");
const teacherHistoryTotalChartEl = document.getElementById("teacherHistoryTotalChart");
const teacherHistoryIndicatorChartEl = document.getElementById("teacherHistoryIndicatorChart");
const teacherHistoryIndicatorLegendEl = document.getElementById("teacherHistoryIndicatorLegend");
const teacherHistoryAiMetaEl = document.getElementById("teacherHistoryAiMeta");
const teacherHistoryAiEmptyEl = document.getElementById("teacherHistoryAiEmpty");
const teacherHistoryAiPanelEl = document.getElementById("teacherHistoryAiPanel");
const teacherHistoryAiHeadlineEl = document.getElementById("teacherHistoryAiHeadline");
const teacherHistoryAiConfidenceBadgeEl = document.getElementById("teacherHistoryAiConfidenceBadge");
const teacherHistoryAiOverviewEl = document.getElementById("teacherHistoryAiOverview");
const teacherHistoryAiTimelineListEl = document.getElementById("teacherHistoryAiTimelineList");
const teacherHistoryAiIndicatorListEl = document.getElementById("teacherHistoryAiIndicatorList");
const teacherHistoryAiTextbookListEl = document.getElementById("teacherHistoryAiTextbookList");
const teacherHistoryAiBookListEl = document.getElementById("teacherHistoryAiBookList");
const teacherHistoryAiActionPlanListEl = document.getElementById("teacherHistoryAiActionPlanList");
const teacherHistoryAiHistoryListEl = document.getElementById("teacherHistoryAiHistoryList");
const assignmentForm = document.getElementById("assignmentForm");
const assignmentListEl = document.getElementById("assignmentList");
const assignmentCheckRefreshButton = document.getElementById("assignmentCheckRefreshButton");
const studentAssignmentListEl = document.getElementById("studentAssignmentList");
const studentAssignmentDetailTitleEl = document.getElementById("studentAssignmentDetailTitle");
const studentAssignmentDetailContentEl = document.getElementById("studentAssignmentDetailContent");
const discussionNewButton = document.getElementById("discussionNewButton");
const discussionListEl = document.getElementById("discussionList");
const discussionStartFormEl = document.getElementById("discussionStartForm");
const discussionBookTitleInputEl = document.getElementById("discussionBookTitleInput");
const discussionBookAuthorInputEl = document.getElementById("discussionBookAuthorInput");
const discussionStartButton = document.getElementById("discussionStartButton");
const discussionChatPanelEl = document.getElementById("discussionChatPanel");
const discussionChatTitleEl = document.getElementById("discussionChatTitle");
const discussionChatAuthorEl = document.getElementById("discussionChatAuthor");
const discussionMessagesEl = document.getElementById("discussionMessages");
const discussionChatFormEl = document.getElementById("discussionChatForm");
const discussionChatInputEl = document.getElementById("discussionChatInput");
const discussionSendButton = document.getElementById("discussionSendButton");
const gnbButtons = Array.from(document.querySelectorAll(".gnb-btn"));
const dashboardQuickChips = Array.from(document.querySelectorAll("#view-dashboard .dashboard-chip"));
const teacherPanelChips = Array.from(document.querySelectorAll("#view-teacher-dashboard .dashboard-chip"));

const SESSION_STORAGE_KEY = "airead-auth-session";
let currentSession = null;
let teacherGroupedRows = [];
let teacherFilteredRows = [];
let teacherTrendCurrentPage = 1;
const TEACHER_TREND_PAGE_SIZE = 10;
let myDashboardRows = [];
let studentAssignments = [];
let selectedAssignmentId = null;
let discussionSessions = [];
let activeDiscussionSessionId = null;
let selectedTeacherHistoryStudentId = null;
let activeTeacherHistoryTab = "books";
const teacherHistoryAiCache = new Map();
const teacherModalState = {
  drag: null,
  resize: null,
  lastBounds: null
};

const indicatorNameMap = {
  comprehension: "내용 이해",
  inference: "추론/해석",
  criticalThinking: "비판/평가",
  expression: "표현/구성",
  vocabGrammar: "어휘/문장 사용"
};

const radarIndicators = [
  { key: "comprehension", scoreKey: "comprehension", feedbackKey: "comprehension", label: "내용이해" },
  { key: "inference", scoreKey: "inference", feedbackKey: "inference", label: "추론" },
  { key: "critical_thinking", scoreKey: "critical_thinking", feedbackKey: "criticalThinking", label: "비판" },
  { key: "expression", scoreKey: "expression", feedbackKey: "expression", label: "표현" },
  { key: "vocab_grammar", scoreKey: "vocab_grammar", feedbackKey: "vocabGrammar", label: "어휘" }
];

const timelineIndicatorConfig = [
  { key: "comprehension", label: "내용이해", color: "#1d8f6a" },
  { key: "inference", label: "추론", color: "#1982c4" },
  { key: "critical_thinking", label: "비판", color: "#6a4c93" },
  { key: "expression", label: "표현", color: "#ff7b00" },
  { key: "vocab_grammar", label: "어휘", color: "#c9184a" }
];

const SVG_NS = "http://www.w3.org/2000/svg";
let aiDiagnosisLoaded = false;

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "요청 중 오류가 발생했어요.");
  }
  return response.json();
}

function goToLogin() {
  window.location.href = "./login.html";
}

function restoreSession() {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    goToLogin();
    return false;
  }

  try {
    currentSession = JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    goToLogin();
    return false;
  }

  if (currentSession.role === "student") {
    const student = currentSession.student || {};
    const grade = Number(student.grade);
    if (!student.id || !Number.isInteger(grade) || grade < 1 || grade > 6) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      goToLogin();
      return false;
    }
    return true;
  }

  if (currentSession.role === "teacher") {
    if (!currentSession.teacher?.name) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      goToLogin();
      return false;
    }
    return true;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
  goToLogin();
  return false;
}

function applyRoleUI() {
  document.body.classList.remove("role-student", "role-teacher");
  if (currentSession.role === "teacher") {
    document.body.classList.add("role-teacher");
    return;
  }
  document.body.classList.add("role-student");
}

function getCurrentStudent() {
  return currentSession?.student || null;
}

function getCurrentTeacher() {
  return currentSession?.teacher || null;
}

function getActiveRole() {
  return currentSession?.role;
}

function renderLoginStatus() {
  if (getActiveRole() === "teacher") {
    const teacher = getCurrentTeacher();
    loginStatusEl.textContent = `교사 ${teacher.name}`;
    return;
  }

  const currentStudent = getCurrentStudent();
  if (!currentStudent) {
    loginStatusEl.textContent = "";
    return;
  }

  loginStatusEl.textContent = `${currentStudent.school} ${currentStudent.grade}학년 ${currentStudent.className} ${currentStudent.studentNumber}번 ${currentStudent.name}`;
}

function renderAssignmentList(items) {
  assignmentListEl.innerHTML = "";

  if (!items || !items.length) {
    const li = document.createElement("li");
    li.textContent = "아직 생성된 과제가 없습니다.";
    assignmentListEl.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    const due = item.deadline ? new Date(`${item.deadline}T00:00:00`).toLocaleDateString("ko-KR") : "기한 미지정";
    li.innerHTML = `
      <strong>${item.bookTitle || "제목 없음"}${item.bookAuthor ? ` · ${item.bookAuthor}` : ""}</strong>
      <div><strong>요약:</strong> ${item.summary || ""}</div>
      <div><strong>목표:</strong> ${item.objective || ""}</div>
      <small>제출 기한: ${due}</small>
    `;
    assignmentListEl.appendChild(li);
  });
}

async function loadAssignments() {
  const data = await fetchJSON("/api/assignments");
  renderAssignmentList(data.assignments || []);
}

function renderStudentAssignmentDetail(assignment) {
  if (!assignment) {
    studentAssignmentDetailTitleEl.textContent = "과제 상세";
    studentAssignmentDetailContentEl.innerHTML = "<p>과제를 선택하면 자세한 내용을 볼 수 있어요.</p>";
    return;
  }

  const due = assignment.deadline ? new Date(`${assignment.deadline}T00:00:00`).toLocaleDateString("ko-KR") : "기한 미지정";
  studentAssignmentDetailTitleEl.textContent = assignment.bookTitle || "제목 없는 과제";
  studentAssignmentDetailContentEl.innerHTML = `
    <div class="detail-row"><strong>저자:</strong> ${assignment.bookAuthor || "저자 미기재"}</div>
    <div class="detail-row"><strong>제출 기한:</strong> ${due}</div>
    <div class="detail-row"><strong>책의 요약본</strong><div class="detail-box">${assignment.summary || "요약본이 아직 없습니다."}</div></div>
    <div class="detail-row"><strong>과제 목표</strong><div class="detail-box">${assignment.objective || "과제 목표가 아직 없습니다."}</div></div>

    <div class="assignment-actions">
      <button type="button" id="assignmentWriteToggleButton" class="rainbow-btn small-btn">과제 작성</button>
    </div>

    <div id="assignmentWritePanel" class="assignment-write-panel" hidden>
      <div class="assignment-iframe-shell">
        <textarea id="assignmentWriteTextarea" class="assignment-write-textarea" placeholder="과제 내용을 입력해 주세요. 20자 이상 작성하면 자동으로 문해력 평가가 진행됩니다."></textarea>
      </div>
      <div class="assignment-submit-row">
        <button type="button" id="assignmentSubmitButton" class="rainbow-btn">과제 제출</button>
      </div>
    </div>
  `;

  const writePanelEl = document.getElementById("assignmentWritePanel");
  const writeToggleButton = document.getElementById("assignmentWriteToggleButton");
  const textareaEl = document.getElementById("assignmentWriteTextarea");
  const submitButton = document.getElementById("assignmentSubmitButton");

  writeToggleButton.addEventListener("click", () => {
    const hidden = writePanelEl.hasAttribute("hidden");
    writePanelEl.toggleAttribute("hidden", !hidden);
    if (!writePanelEl.hasAttribute("hidden")) {
      textareaEl.focus();
    }
  });

  submitButton.addEventListener("click", async () => {
    const currentStudent = getCurrentStudent();
    const answerText = textareaEl.value.trim();

    if (!currentStudent) {
      alert("로그인된 학생 정보가 없습니다.");
      return;
    }

    if (!answerText) {
      alert("과제 내용을 입력해 주세요.");
      return;
    }

    try {
      const result = await fetchJSON("/api/assignment-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          assignmentId: assignment.id,
          answerText
        })
      });

      alert(result.message || "과제가 제출되었습니다.");
      await loadMyDashboard();
      await loadAssignmentsForStudent();
      activateView("dashboard");
    } catch (error) {
      alert(error.message);
    }
  });
}

async function loadAssignmentsForStudent() {
  const data = await fetchJSON("/api/assignments");
  studentAssignments = data.assignments || [];

  if (!studentAssignments.length) {
    studentAssignmentListEl.innerHTML = "<li>📝 아직 등록된 과제가 없어요.</li>";
    renderStudentAssignmentDetail(null);
    return;
  }

  if (!selectedAssignmentId || !studentAssignments.some((assignment) => Number(assignment.id) === Number(selectedAssignmentId))) {
    selectedAssignmentId = Number(studentAssignments[0].id);
  }

  studentAssignmentListEl.innerHTML = "";
  studentAssignments.forEach((assignment) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const due = assignment.deadline ? new Date(`${assignment.deadline}T00:00:00`).toLocaleDateString("ko-KR") : "기한 미지정";
    button.type = "button";
    button.className = "assignment-check-item";
    if (Number(assignment.id) === Number(selectedAssignmentId)) {
      button.classList.add("active");
    }
    button.innerHTML = `
      <strong>${assignment.bookTitle || "제목 없음"}</strong>
      <span>${assignment.bookAuthor || "저자 미기재"} · ${due}</span>
    `;
    button.addEventListener("click", () => {
      selectedAssignmentId = Number(assignment.id);
      renderStudentAssignmentDetail(assignment);
      studentAssignmentListEl.querySelectorAll(".assignment-check-item").forEach((item) => item.classList.toggle("active", Number(item.dataset.assignmentId) === Number(assignment.id)));
    });
    button.dataset.assignmentId = assignment.id;
    li.appendChild(button);
    studentAssignmentListEl.appendChild(li);
  });

  const selected = studentAssignments.find((assignment) => Number(assignment.id) === Number(selectedAssignmentId));
  renderStudentAssignmentDetail(selected || studentAssignments[0]);
}

function renderDiscussionList() {
  discussionListEl.innerHTML = "";

  if (!discussionSessions.length) {
    const li = document.createElement("li");
    li.textContent = "💬 아직 시작한 토론이 없어요.";
    discussionListEl.appendChild(li);
    return;
  }

  discussionSessions.forEach((session) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    if (Number(session.id) === Number(activeDiscussionSessionId)) {
      button.classList.add("active");
    }

    const titleEl = document.createElement("strong");
    titleEl.textContent = session.bookTitle;
    const metaEl = document.createElement("span");
    const when = session.updatedAt ? new Date(session.updatedAt).toLocaleString("ko-KR") : "";
    metaEl.textContent = `${session.bookAuthor || "저자 미기재"} · ${when}`;

    button.appendChild(titleEl);
    button.appendChild(metaEl);
    button.addEventListener("click", () => {
      openDiscussionSession(session.id).catch((error) => alert(error.message));
    });

    li.appendChild(button);
    discussionListEl.appendChild(li);
  });
}

async function loadDiscussionSessions() {
  const currentStudent = getCurrentStudent();
  if (!currentStudent) {
    return;
  }

  const data = await fetchJSON(`/api/discussions?studentId=${currentStudent.id}`);
  discussionSessions = data.sessions || [];
  renderDiscussionList();
}

function showDiscussionStartForm() {
  activeDiscussionSessionId = null;
  discussionStartFormEl.hidden = false;
  discussionChatPanelEl.hidden = true;
  discussionBookTitleInputEl.value = "";
  discussionBookAuthorInputEl.value = "";
  renderDiscussionList();
}

function createDiscussionMessageBubble(message) {
  const wrap = document.createElement("div");
  wrap.className = `discussion-message discussion-message-${message.role === "user" ? "user" : "assistant"}`;
  const bubble = document.createElement("div");
  bubble.className = "discussion-message-bubble";
  bubble.textContent = message.content;
  wrap.appendChild(bubble);
  return wrap;
}

function renderDiscussionMessages(messages) {
  discussionMessagesEl.innerHTML = "";

  if (!messages.length) {
    const emptyEl = document.createElement("p");
    emptyEl.className = "discussion-empty-hint";
    emptyEl.textContent = "책에 대한 생각이나 궁금한 점을 자유롭게 이야기해 보세요!";
    discussionMessagesEl.appendChild(emptyEl);
    return;
  }

  messages.forEach((message) => {
    discussionMessagesEl.appendChild(createDiscussionMessageBubble(message));
  });
  discussionMessagesEl.scrollTop = discussionMessagesEl.scrollHeight;
}

function setDiscussionTypingIndicator(visible) {
  let indicatorEl = document.getElementById("discussionTypingIndicator");

  if (visible) {
    if (!indicatorEl) {
      indicatorEl = document.createElement("div");
      indicatorEl.id = "discussionTypingIndicator";
      indicatorEl.className = "discussion-message discussion-message-assistant";

      const bubble = document.createElement("div");
      bubble.className = "discussion-message-bubble discussion-typing";
      bubble.appendChild(document.createElement("span"));
      bubble.appendChild(document.createElement("span"));
      bubble.appendChild(document.createElement("span"));

      indicatorEl.appendChild(bubble);
      discussionMessagesEl.appendChild(indicatorEl);
      discussionMessagesEl.scrollTop = discussionMessagesEl.scrollHeight;
    }
    return;
  }

  if (indicatorEl) {
    indicatorEl.remove();
  }
}

async function openDiscussionSession(sessionId) {
  const currentStudent = getCurrentStudent();
  if (!currentStudent) {
    return;
  }

  const data = await fetchJSON(`/api/discussions/${sessionId}/messages?studentId=${currentStudent.id}`);
  activeDiscussionSessionId = Number(sessionId);
  discussionStartFormEl.hidden = true;
  discussionChatPanelEl.hidden = false;
  discussionChatTitleEl.textContent = data.session.bookTitle;
  discussionChatAuthorEl.textContent = data.session.bookAuthor || "저자 미기재";
  renderDiscussionMessages(data.messages || []);
  renderDiscussionList();
  discussionChatInputEl.focus();
}

async function startNewDiscussion() {
  const currentStudent = getCurrentStudent();
  if (!currentStudent) {
    alert("로그인된 학생 정보가 없습니다.");
    return;
  }

  const bookTitle = discussionBookTitleInputEl.value.trim();
  const bookAuthor = discussionBookAuthorInputEl.value.trim();

  if (!bookTitle) {
    alert("토론할 책 제목을 입력해 주세요.");
    return;
  }

  discussionStartButton.disabled = true;
  try {
    const result = await fetchJSON("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: currentStudent.id, bookTitle, bookAuthor })
    });

    discussionSessions.unshift(result.session);
    await openDiscussionSession(result.session.id);
  } catch (error) {
    alert(error.message);
  } finally {
    discussionStartButton.disabled = false;
  }
}

async function sendDiscussionMessage() {
  const currentStudent = getCurrentStudent();
  const message = discussionChatInputEl.value.trim();

  if (!currentStudent || !activeDiscussionSessionId || !message) {
    return;
  }

  discussionChatInputEl.value = "";
  discussionMessagesEl.appendChild(createDiscussionMessageBubble({ role: "user", content: message }));
  discussionMessagesEl.scrollTop = discussionMessagesEl.scrollHeight;
  setDiscussionTypingIndicator(true);
  discussionSendButton.disabled = true;

  try {
    const result = await fetchJSON(`/api/discussions/${activeDiscussionSessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: currentStudent.id, message })
    });

    setDiscussionTypingIndicator(false);
    discussionMessagesEl.appendChild(createDiscussionMessageBubble(result.assistantMessage));
    discussionMessagesEl.scrollTop = discussionMessagesEl.scrollHeight;

    const session = discussionSessions.find((item) => Number(item.id) === Number(activeDiscussionSessionId));
    if (session) {
      session.updatedAt = result.assistantMessage.createdAt;
      session.lastMessage = result.assistantMessage.content;
      discussionSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      renderDiscussionList();
    }
  } catch (error) {
    setDiscussionTypingIndicator(false);
    alert(error.message);
  } finally {
    discussionSendButton.disabled = false;
    discussionChatInputEl.focus();
  }
}

function renderTeacherComparisonChart() {
  const gradeGroups = new Map();
  const classGroups = new Map();

  teacherGroupedRows.forEach((group) => {
    const gradeKey = `${group.grade}학년`;
    const gradeScores = gradeGroups.get(gradeKey) || [];
    gradeScores.push(Number(group.avgScore || 0));
    gradeGroups.set(gradeKey, gradeScores);

    const classKey = `${group.grade}학년 ${group.class_name}`;
    const classScores = classGroups.get(classKey) || [];
    classScores.push(Number(group.avgScore || 0));
    classGroups.set(classKey, classScores);
  });

  const comparisonSections = [
    {
      title: "학년별 평균",
      items: [...gradeGroups.entries()]
        .map(([label, scores]) => ({
          label,
          value: scores.reduce((sum, score) => sum + score, 0) / scores.length
        }))
        .sort((a, b) => b.value - a.value)
    },
    {
      title: "학급별 평균",
      items: [...classGroups.entries()]
        .map(([label, scores]) => ({
          label,
          value: scores.reduce((sum, score) => sum + score, 0) / scores.length
        }))
        .sort((a, b) => b.value - a.value)
    }
  ];

  teacherComparisonChartEl.innerHTML = "";
  if (!comparisonSections.some((section) => section.items.length)) {
    teacherComparisonChartEl.innerHTML = "<div class=\"teacher-overview-empty\">비교할 학생 데이터가 없습니다.</div>";
    return;
  }

  comparisonSections.forEach((section) => {
    if (!section.items.length) {
      return;
    }

    const maxValue = Math.max(...section.items.map((item) => item.value), 100);
    const sectionEl = document.createElement("div");
    sectionEl.className = "teacher-compare-section";
    sectionEl.innerHTML = `<h5>${section.title}</h5>`;

    section.items.slice(0, 6).forEach((item) => {
      const row = document.createElement("div");
      row.className = "teacher-compare-row";
      row.innerHTML = `
        <div class="teacher-compare-label">${item.label}</div>
        <div class="teacher-compare-track">
          <span class="teacher-compare-fill" style="width:${(item.value / maxValue) * 100}%"></span>
        </div>
        <div class="teacher-compare-value">${item.value.toFixed(1)}점</div>
      `;
      sectionEl.appendChild(row);
    });

    teacherComparisonChartEl.appendChild(sectionEl);
  });
}

function renderTeacherOverviewSummary() {
  if (!teacherGroupedRows.length) {
    teacherOverviewSummaryEl.innerHTML = "<div class=\"teacher-overview-empty\">아직 표시할 학생 데이터가 없습니다.</div>";
    teacherStudentTrendListEl.innerHTML = "";
    teacherComparisonChartEl.innerHTML = "<div class=\"teacher-overview-empty\">비교할 학생 데이터가 없습니다.</div>";
    return;
  }

  const sortedByAvg = [...teacherGroupedRows].sort((a, b) => Number(b.avgScore || 0) - Number(a.avgScore || 0));
  const topStudent = sortedByAvg[0];
  const avgScoreList = teacherGroupedRows.map((group) => Number(group.avgScore || 0));
  const overallAverage = avgScoreList.length ? averageValues(avgScoreList).toFixed(1) : "0.0";
  const improvementCount = teacherGroupedRows.filter((group) => {
    const items = [...group.items].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    if (items.length < 2) {
      return false;
    }
    const first = Number(items[0].total_score || 0);
    const last = Number(items[items.length - 1].total_score || 0);
    return last > first;
  }).length;

  teacherOverviewSummaryEl.innerHTML = `
    <div class="teacher-overview-card">
      <span class="teacher-overview-label">전체 평균 점수</span>
      <strong>${overallAverage}점</strong>
    </div>
    <div class="teacher-overview-card">
      <span class="teacher-overview-label">상위 학생</span>
      <strong>${topStudent ? `${topStudent.name} ${topStudent.avgScore}점` : "-"}</strong>
    </div>
    <div class="teacher-overview-card">
      <span class="teacher-overview-label">성장 중인 학생</span>
      <strong>${improvementCount}명</strong>
    </div>
    <div class="teacher-overview-card">
      <span class="teacher-overview-label">총 학생 수</span>
      <strong>${teacherGroupedRows.length}명</strong>
    </div>
  `;

  teacherStudentTrendListEl.innerHTML = "";
  teacherTrendCurrentPage = 1;
  renderTeacherStudentTrendList(getFilteredTeacherTrendRows());

  renderTeacherComparisonChart();
}

function getFilteredTeacherTrendRows() {
  const school = teacherTrendSchoolInput.value.trim().toLowerCase();
  const name = teacherTrendNameInput.value.trim().toLowerCase();
  const className = teacherTrendClassFilter.value;
  const minScore = teacherTrendMinScoreInput.value === "" ? null : Number(teacherTrendMinScoreInput.value);
  const maxScore = teacherTrendMaxScoreInput.value === "" ? null : Number(teacherTrendMaxScoreInput.value);

  return teacherGroupedRows
    .filter((group) => {
      const matchesSchool = !school || String(group.school).toLowerCase().includes(school);
      const matchesName = !name || String(group.name).toLowerCase().includes(name);
      const matchesClass = !className || group.class_name === className;
      const avgScore = Number(group.avgScore || 0);
      const matchesMin = minScore === null || avgScore >= minScore;
      const matchesMax = maxScore === null || avgScore <= maxScore;
      return matchesSchool && matchesName && matchesClass && matchesMin && matchesMax;
    })
    .sort((a, b) => Number(b.avgScore || 0) - Number(a.avgScore || 0));
}

function buildStudentAverageBar(avgScore) {
  const clamped = Math.max(0, Math.min(100, Number(avgScore) || 0));
  return `
    <div class="teacher-student-trend-bar-wrap">
      <span class="teacher-student-trend-bar-scale">0</span>
      <div class="teacher-student-trend-bar-track">
        <div class="teacher-student-trend-bar-fill" style="width:${clamped}%"></div>
      </div>
      <span class="teacher-student-trend-bar-scale">100</span>
    </div>
  `;
}

function renderTeacherTrendPagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / TEACHER_TREND_PAGE_SIZE));
  teacherStudentTrendPaginationEl.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  const createPageButton = (label, page, options = {}) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "teacher-trend-page-btn";
    if (options.active) {
      btn.classList.add("active");
    }
    btn.textContent = label;
    btn.disabled = Boolean(options.disabled);
    btn.addEventListener("click", () => {
      teacherTrendCurrentPage = page;
      renderTeacherStudentTrendList(getFilteredTeacherTrendRows());
    });
    return btn;
  };

  teacherStudentTrendPaginationEl.appendChild(
    createPageButton("이전", teacherTrendCurrentPage - 1, { disabled: teacherTrendCurrentPage <= 1 })
  );

  for (let page = 1; page <= totalPages; page += 1) {
    teacherStudentTrendPaginationEl.appendChild(createPageButton(String(page), page, { active: page === teacherTrendCurrentPage }));
  }

  teacherStudentTrendPaginationEl.appendChild(
    createPageButton("다음", teacherTrendCurrentPage + 1, { disabled: teacherTrendCurrentPage >= totalPages })
  );
}

function renderTeacherStudentTrendList(rows) {
  teacherStudentTrendListEl.innerHTML = "";

  if (!rows.length) {
    teacherStudentTrendListEl.innerHTML = "<div class=\"teacher-overview-empty\">조건에 맞는 학생이 없습니다.</div>";
    teacherStudentTrendPaginationEl.innerHTML = "";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / TEACHER_TREND_PAGE_SIZE));
  teacherTrendCurrentPage = Math.min(Math.max(1, teacherTrendCurrentPage), totalPages);
  const start = (teacherTrendCurrentPage - 1) * TEACHER_TREND_PAGE_SIZE;
  const pageRows = rows.slice(start, start + TEACHER_TREND_PAGE_SIZE);

  pageRows.forEach((group) => {
      const items = [...group.items].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
      const scores = items.map((item) => Number(item.total_score || 0));
      const first = scores[0] || 0;
      const last = scores[scores.length - 1] || 0;
      const delta = last - first;
      const trendText = delta > 0 ? `+${delta}점 상승` : delta < 0 ? `${delta}점 하락` : "유지";

      const row = document.createElement("button");
      row.type = "button";
      row.className = "teacher-student-trend-item";
      row.dataset.studentId = String(group.student_id);
      row.innerHTML = `
        <div class="teacher-student-trend-head">
          <div>
            <strong>${group.name}</strong>
            <span>${group.school} ${group.grade}학년 ${group.class_name}</span>
          </div>
          <div class="teacher-student-trend-score">
            <span>${group.avgScore}점 평균</span>
            <em>${trendText}</em>
          </div>
        </div>
        ${buildStudentAverageBar(group.avgScore)}
      `;
      row.addEventListener("click", () => {
        const selected = teacherGroupedRows.find((item) => Number(item.student_id) === Number(group.student_id));
        if (selected) {
          renderTeacherDetail(selected);
        }
      });
      teacherStudentTrendListEl.appendChild(row);
  });

  renderTeacherTrendPagination(rows.length);
}

function averageValues(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

function renderTeacherDashboard(data) {
  teacherDashboardBodyEl.innerHTML = "";
  teacherDetailBodyEl.innerHTML = "";
  teacherGroupedRows = [];
  teacherFilteredRows = [];
  closeTeacherDetailModal();
  resetTeacherHistoryDetail();

  const studentCount = data.stats.student_count || 0;
  const reflectionCount = data.stats.reflection_count || 0;
  const avgScore = data.stats.avg_score || 0;

  teacherStatsEl.innerHTML = `
    <div class="stat-pill">전체 학생 수: ${studentCount}</div>
    <div class="stat-pill">전체 제출 수: ${reflectionCount}</div>
    <div class="stat-pill">전체 평균 점수: ${avgScore || 0}</div>
  `;

  if (!data.rows.length) {
    teacherOverviewSummaryEl.innerHTML = "<div class=\"teacher-overview-empty\">아직 표시할 학생 데이터가 없습니다.</div>";
    teacherStudentTrendListEl.innerHTML = "";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="2">아직 저장된 전체 평가 히스토리가 없어요.</td>`;
    teacherDashboardBodyEl.appendChild(tr);
    teacherDetailTitleEl.textContent = "학생 상세 히스토리";
    return;
  }

  const groupedMap = new Map();
  data.rows.forEach((row) => {
    const key = String(row.student_id);
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        student_id: row.student_id,
        name: row.name,
        school: row.school,
        grade: row.grade,
        class_name: row.class_name,
        student_number: row.student_number,
        items: []
      });
    }
    groupedMap.get(key).items.push(row);
  });

  teacherGroupedRows = Array.from(groupedMap.values()).map((group) => {
    const scoreSum = group.items.reduce((sum, item) => sum + Number(item.total_score || 0), 0);
    const avg = group.items.length ? (scoreSum / group.items.length).toFixed(1) : "0.0";
    return {
      ...group,
      count: group.items.length,
      avgScore: avg,
      latestSubmittedAt: group.items[0]?.submitted_at || null
    };
  });

  teacherGroupedRows.sort((a, b) => {
    if (a.grade !== b.grade) {
      return Number(a.grade) - Number(b.grade);
    }

    const classA = Number(String(a.class_name).replace(/\D/g, "")) || 0;
    const classB = Number(String(b.class_name).replace(/\D/g, "")) || 0;
    if (classA !== classB) {
      return classA - classB;
    }

    return Number(a.student_number) - Number(b.student_number);
  });

  renderTeacherOverviewSummary();
  populateTeacherClassFilterOptions();
  populateTeacherTrendClassFilterOptions();
  applyTeacherFiltersAndRender();
}

function normalizeClassNumber(className) {
  return Number(String(className || "").replace(/\D/g, "")) || 0;
}

function populateTeacherClassFilterOptions() {
  const selectedGrade = teacherGradeFilter.value;
  const classSet = new Set();

  teacherGroupedRows.forEach((row) => {
    if (selectedGrade && String(row.grade) !== selectedGrade) {
      return;
    }
    classSet.add(row.class_name);
  });

  const currentClass = teacherClassFilter.value;
  const sorted = Array.from(classSet).sort((a, b) => normalizeClassNumber(a) - normalizeClassNumber(b));

  teacherClassFilter.innerHTML = '<option value="">전체</option>';
  sorted.forEach((className) => {
    const opt = document.createElement("option");
    opt.value = className;
    opt.textContent = className;
    teacherClassFilter.appendChild(opt);
  });

  if (sorted.includes(currentClass)) {
    teacherClassFilter.value = currentClass;
  }
}

function populateTeacherTrendClassFilterOptions() {
  const classSet = new Set();
  teacherGroupedRows.forEach((row) => classSet.add(row.class_name));

  const currentClass = teacherTrendClassFilter.value;
  const sorted = Array.from(classSet).sort((a, b) => normalizeClassNumber(a) - normalizeClassNumber(b));

  teacherTrendClassFilter.innerHTML = '<option value="">전체</option>';
  sorted.forEach((className) => {
    const opt = document.createElement("option");
    opt.value = className;
    opt.textContent = className;
    teacherTrendClassFilter.appendChild(opt);
  });

  if (sorted.includes(currentClass)) {
    teacherTrendClassFilter.value = currentClass;
  }
}

function applyTeacherFiltersAndRender() {
  teacherDashboardBodyEl.innerHTML = "";

  const search = teacherSearchInput.value.trim().toLowerCase();
  const grade = teacherGradeFilter.value;
  const className = teacherClassFilter.value;

  teacherFilteredRows = teacherGroupedRows
    .filter((row) => {
      const matchesName = !search || String(row.name).toLowerCase().includes(search);
      const matchesGrade = !grade || String(row.grade) === grade;
      const matchesClass = !className || row.class_name === className;
      return matchesName && matchesGrade && matchesClass;
    })
    .sort((a, b) => {
      if (a.grade !== b.grade) {
        return Number(a.grade) - Number(b.grade);
      }

      const classA = normalizeClassNumber(a.class_name);
      const classB = normalizeClassNumber(b.class_name);
      if (classA !== classB) {
        return classA - classB;
      }

      return Number(a.student_number) - Number(b.student_number);
    });

  if (!teacherFilteredRows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="2">조건에 맞는 학생이 없어요.</td>`;
    teacherDashboardBodyEl.appendChild(tr);
    return;
  }

  teacherFilteredRows.forEach((group) => {
    const tr = document.createElement("tr");
    tr.className = "teacher-history-row";
    if (group.student_id === selectedTeacherHistoryStudentId) {
      tr.classList.add("active");
    }

    tr.innerHTML = `
      <td><button type="button" class="student-link" data-student-id="${group.student_id}">${group.name}</button> (${group.student_number}번)</td>
      <td>${group.school} ${group.grade}학년 ${group.class_name}</td>
    `;

    teacherDashboardBodyEl.appendChild(tr);
  });

  teacherDashboardBodyEl.querySelectorAll(".student-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const studentId = Number(btn.dataset.studentId);
      const selected = teacherGroupedRows.find((row) => row.student_id === studentId);
      if (selected) {
        selectTeacherHistoryStudent(selected);
      }
    });
  });
}

function buildSubmissionCard(item) {
  const card = document.createElement("div");
  card.className = "teacher-submission-card";
  const when = new Date(item.submitted_at).toLocaleString("ko-KR");
  card.innerHTML = `
    <div class="teacher-submission-head">
      <div>
        <strong>${item.book_title}</strong>
        <span>${item.book_author || "저자 미입력"} · ${when}</span>
      </div>
      <div class="score-badge"><span>${item.total_score}</span>점</div>
    </div>
    <div class="teacher-submission-indicators">
      <span class="teacher-indicator-chip">내용이해 ${item.comprehension}/5</span>
      <span class="teacher-indicator-chip">추론 ${item.inference}/5</span>
      <span class="teacher-indicator-chip">비판 ${item.critical_thinking}/5</span>
      <span class="teacher-indicator-chip">표현 ${item.expression}/5</span>
      <span class="teacher-indicator-chip">어휘 ${item.vocab_grammar}/5</span>
    </div>
    <p class="teacher-submission-reflection">${item.reflection_text || ""}</p>
    <div class="teacher-submission-toggle-row">
      <button type="button" class="teacher-submission-toggle-btn">상세보기 ▾</button>
    </div>
  `;

  const evidenceEl = document.createElement("div");
  evidenceEl.className = "teacher-submission-evidence";
  evidenceEl.hidden = true;
  radarIndicators.forEach((indicator) => {
    const value = Number(item[indicator.scoreKey] || 0);
    const feedbackText = item.feedback?.[indicator.feedbackKey];
    const evidenceText = item.evidence?.[indicator.feedbackKey];
    evidenceEl.appendChild(createScoreRowElement(indicator.feedbackKey, value, feedbackText, evidenceText));
  });
  card.appendChild(evidenceEl);

  const toggleBtn = card.querySelector(".teacher-submission-toggle-btn");
  toggleBtn.addEventListener("click", () => {
    const expanded = !evidenceEl.hidden;
    evidenceEl.hidden = expanded;
    toggleBtn.textContent = expanded ? "상세보기 ▾" : "접기 ▴";
  });

  return card;
}

function renderSubmissionCards(container, items) {
  container.innerHTML = "";
  if (!items || !items.length) {
    container.innerHTML = "<div class=\"teacher-overview-empty\">아직 저장된 평가 기록이 없어요.</div>";
    return;
  }

  items.forEach((item) => {
    container.appendChild(buildSubmissionCard(item));
  });
}

function renderTeacherDetail(group) {
  if (!group) {
    teacherDetailTitleEl.textContent = "학생 상세 히스토리";
    teacherDetailBodyEl.innerHTML = "";
    return;
  }

  teacherDetailTitleEl.textContent = `${group.name} (${group.student_number}번) 상세 히스토리`;
  renderSubmissionCards(teacherDetailBodyEl, group.items);
  openTeacherDetailModal();
}

function resetTeacherHistoryDetail() {
  selectedTeacherHistoryStudentId = null;
  activeTeacherHistoryTab = "books";
  teacherHistoryAiCache.clear();
  teacherHistoryDetailContentEl.hidden = true;
  teacherHistoryDetailEmptyEl.hidden = false;
  teacherHistoryBookListEl.innerHTML = "";
  teacherHistoryAiHistoryListEl.innerHTML = "";
  teacherHistoryAiHeadlineEl.textContent = "AI 진단 결과";
  teacherHistoryAiPanelEl.hidden = true;
  teacherHistoryAiEmptyEl.hidden = true;

  teacherHistoryTabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.historyTab === "books");
  });
  teacherHistoryTabContents.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.historyTabContent === "books");
  });
}

function setActiveTeacherHistoryTab(tabName) {
  activeTeacherHistoryTab = tabName;

  teacherHistoryTabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.historyTab === tabName);
  });
  teacherHistoryTabContents.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.historyTabContent === tabName);
  });

  if (tabName === "ai") {
    const selected = teacherGroupedRows.find((row) => row.student_id === selectedTeacherHistoryStudentId);
    if (selected) {
      loadTeacherHistoryAiDiagnosis(selected);
    }
  }
}

function selectTeacherHistoryStudent(group) {
  selectedTeacherHistoryStudentId = group.student_id;

  teacherDashboardBodyEl.querySelectorAll(".teacher-history-row").forEach((row) => {
    const btn = row.querySelector(".student-link");
    row.classList.toggle("active", btn && Number(btn.dataset.studentId) === group.student_id);
  });

  teacherHistoryDetailEmptyEl.hidden = true;
  teacherHistoryDetailContentEl.hidden = false;
  teacherHistoryDetailNameEl.textContent = `${group.name} (${group.school} ${group.grade}학년 ${group.class_name} · ${group.student_number}번)`;

  renderSubmissionCards(teacherHistoryBookListEl, group.items);
  renderTimelineChartsInto(group.items, {
    totalChartEl: teacherHistoryTotalChartEl,
    indicatorChartEl: teacherHistoryIndicatorChartEl,
    indicatorLegendEl: teacherHistoryIndicatorLegendEl,
    summaryEl: teacherHistoryTimelineSummaryEl,
    emptyEl: teacherHistoryTimelineEmptyEl,
    chartGroupEl: teacherHistoryTimelineChartGroupEl,
    emptyMessage: "이 학생의 평가 기록이 아직 없어요."
  });

  teacherHistoryAiPanelEl.hidden = true;
  teacherHistoryAiEmptyEl.hidden = true;
  setActiveTeacherHistoryTab(activeTeacherHistoryTab);
}

function renderTeacherHistoryAiResult(result, history) {
  renderAiDiagnosisInto(result, {
    metaEl: teacherHistoryAiMetaEl,
    emptyEl: teacherHistoryAiEmptyEl,
    panelEl: teacherHistoryAiPanelEl,
    headlineEl: teacherHistoryAiHeadlineEl,
    confidenceBadgeEl: teacherHistoryAiConfidenceBadgeEl,
    overviewEl: teacherHistoryAiOverviewEl,
    timelineListEl: teacherHistoryAiTimelineListEl,
    indicatorListEl: teacherHistoryAiIndicatorListEl,
    actionPlanListEl: teacherHistoryAiActionPlanListEl,
    textbookListEl: teacherHistoryAiTextbookListEl,
    bookListEl: teacherHistoryAiBookListEl
  });
  renderAiDiagnosisHistoryList(teacherHistoryAiHistoryListEl, history, result.meta ? result.meta.id ?? null : null, (entry) => {
    renderTeacherHistoryAiResult(entry, history);
  });
}

async function loadTeacherHistoryAiDiagnosis(group) {
  if (teacherHistoryAiCache.has(group.student_id)) {
    const cached = teacherHistoryAiCache.get(group.student_id);
    renderTeacherHistoryAiResult(cached.latest, cached.history);
    return;
  }

  teacherHistoryAiMetaEl.textContent = "불러오는 중...";
  teacherHistoryAiPanelEl.hidden = true;
  teacherHistoryAiEmptyEl.hidden = true;
  teacherHistoryAiHistoryListEl.innerHTML = "";

  try {
    const [result, historyResult] = await Promise.all([
      fetchJSON(`/api/my-ai-diagnosis?studentId=${group.student_id}`),
      fetchJSON(`/api/my-ai-diagnosis-history?studentId=${group.student_id}`)
    ]);
    if (selectedTeacherHistoryStudentId !== group.student_id) {
      return;
    }

    const history = historyResult.history || [];
    teacherHistoryAiCache.set(group.student_id, { latest: result, history });
    renderTeacherHistoryAiResult(result, history);
  } catch (error) {
    if (selectedTeacherHistoryStudentId !== group.student_id) {
      return;
    }
    teacherHistoryAiMetaEl.textContent = "AI 진단 결과를 불러오지 못했습니다.";
    teacherHistoryAiEmptyEl.hidden = false;
    teacherHistoryAiPanelEl.hidden = true;
  }
}

function openTeacherDetailModal() {
  applyTeacherModalBounds();
  teacherDetailModalEl.classList.add("open");
  teacherDetailModalEl.setAttribute("aria-hidden", "false");
}

function closeTeacherDetailModal() {
  teacherDetailModalEl.classList.remove("open");
  teacherDetailModalEl.setAttribute("aria-hidden", "true");
}

function openStudentDetailModal() {
  studentDetailModalEl.classList.add("open");
  studentDetailModalEl.setAttribute("aria-hidden", "false");
}

function closeStudentDetailModal() {
  studentDetailModalEl.classList.remove("open");
  studentDetailModalEl.setAttribute("aria-hidden", "true");
}

function toRadarPoints(values, cx, cy, radius) {
  return values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / values.length;
      const scaled = (Number(value) / 5) * radius;
      const x = cx + Math.cos(angle) * scaled;
      const y = cy + Math.sin(angle) * scaled;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, String(value));
  });
  return el;
}

function formatTimelineDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}.${day}`;
}

function normalizeTotalScoreTo100(score) {
  const numeric = Number(score || 0);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  // Support both legacy 25-point totals and already-normalized 100-point totals.
  if (numeric <= 25) {
    return (numeric / 25) * 100;
  }

  return numeric;
}

function getTimelineChartGeometry(totalPoints, width, height) {
  const left = 58;
  const right = 20;
  const top = 18;
  const bottom = 40;
  const usableWidth = width - left - right;
  const usableHeight = height - top - bottom;
  const step = totalPoints > 1 ? usableWidth / (totalPoints - 1) : 0;

  const xForIndex = (index) => {
    if (totalPoints === 1) {
      return left + usableWidth / 2;
    }
    return left + index * step;
  };

  const yForValue = (value, maxValue) => {
    const ratio = maxValue > 0 ? Number(value) / maxValue : 0;
    return top + usableHeight - ratio * usableHeight;
  };

  return {
    left,
    right,
    top,
    bottom,
    usableWidth,
    usableHeight,
    xForIndex,
    yForValue
  };
}

function drawTimelineAxes(svg, geometry, maxValue, tickCount, rows) {
  const { left, top, usableHeight, xForIndex, yForValue } = geometry;
  const chartBottom = top + usableHeight;

  for (let tick = 0; tick <= tickCount; tick += 1) {
    const value = (maxValue / tickCount) * tick;
    const y = yForValue(value, maxValue);

    const grid = createSvgElement("line", {
      x1: left,
      y1: y.toFixed(2),
      x2: (left + geometry.usableWidth).toFixed(2),
      y2: y.toFixed(2),
      stroke: "#e6def5",
      "stroke-width": 1
    });
    svg.appendChild(grid);

    const label = createSvgElement("text", {
      x: left - 10,
      y: (y + 4).toFixed(2),
      "text-anchor": "end",
      "font-size": 12,
      "font-weight": 700,
      fill: "#5b5480"
    });
    label.textContent = value.toFixed(value % 1 === 0 ? 0 : 1);
    svg.appendChild(label);
  }

  const axisX = createSvgElement("line", {
    x1: left,
    y1: chartBottom,
    x2: left + geometry.usableWidth,
    y2: chartBottom,
    stroke: "#8b7eb8",
    "stroke-width": 1.5
  });
  svg.appendChild(axisX);

  if (!rows.length) {
    return;
  }

  const maxLabels = 7;
  const skip = Math.max(1, Math.ceil(rows.length / maxLabels));

  rows.forEach((row, idx) => {
    if (idx % skip !== 0 && idx !== rows.length - 1) {
      return;
    }

    const x = xForIndex(idx);
    const tick = createSvgElement("line", {
      x1: x.toFixed(2),
      y1: chartBottom,
      x2: x.toFixed(2),
      y2: chartBottom + 6,
      stroke: "#8b7eb8",
      "stroke-width": 1.3
    });
    svg.appendChild(tick);

    const label = createSvgElement("text", {
      x: x.toFixed(2),
      y: chartBottom + 20,
      "text-anchor": "middle",
      "font-size": 11,
      "font-weight": 700,
      fill: "#4f4577"
    });
    label.textContent = formatTimelineDateLabel(row.submitted_at);
    svg.appendChild(label);
  });
}

function drawTimelineSeries(svg, geometry, rows, options) {
  const { xForIndex, yForValue } = geometry;
  const maxValue = options.maxValue;

  if (!rows.length) {
    return;
  }

  const points = rows.map((row, idx) => {
    const rawValue = Number(options.valueGetter(row) || 0);
    const value = Math.max(0, Math.min(maxValue, rawValue));
    return {
      row,
      rawValue,
      value,
      x: xForIndex(idx),
      y: yForValue(value, maxValue)
    };
  });

  const pathData = points
    .map((point, idx) => `${idx === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");

  if (options.fillColor) {
    const baseY = yForValue(0, maxValue);
    const areaPath = `${pathData} L${points[points.length - 1].x.toFixed(2)},${baseY.toFixed(2)} L${points[0].x.toFixed(2)},${baseY.toFixed(2)} Z`;
    const area = createSvgElement("path", {
      d: areaPath,
      fill: options.fillColor,
      stroke: "none"
    });
    svg.appendChild(area);
  }

  const line = createSvgElement("path", {
    d: pathData,
    fill: "none",
    stroke: options.color,
    "stroke-width": options.strokeWidth || 2.4,
    "stroke-linejoin": "round",
    "stroke-linecap": "round"
  });
  svg.appendChild(line);

  points.forEach((point) => {
    const dot = createSvgElement("circle", {
      cx: point.x.toFixed(2),
      cy: point.y.toFixed(2),
      r: options.dotRadius || 3.8,
      fill: "#ffffff",
      stroke: options.color,
      "stroke-width": 2
    });

    const title = createSvgElement("title");
    title.textContent = `${new Date(point.row.submitted_at).toLocaleString("ko-KR")} · ${point.row.book_title || "책 제목 없음"} · ${options.tooltipLabel}: ${point.rawValue.toFixed(1)}`;
    dot.appendChild(title);
    svg.appendChild(dot);

    if (options.showPointLabels) {
      const pointLabel = createSvgElement("text", {
        x: point.x.toFixed(2),
        y: (point.y - 10).toFixed(2),
        "text-anchor": "middle",
        "font-size": 11,
        "font-weight": 700,
        fill: options.color
      });
      const formatter = options.pointLabelFormatter || ((v) => v.toFixed(0));
      pointLabel.textContent = formatter(point.rawValue);
      svg.appendChild(pointLabel);
    }
  });
}

function renderTimelineLegendInto(legendEl) {
  legendEl.innerHTML = "";

  timelineIndicatorConfig.forEach((item) => {
    const legendItem = document.createElement("span");
    legendItem.className = "timeline-legend-item";
    legendItem.innerHTML = `<span class="timeline-legend-dot" style="background:${item.color}"></span>${item.label}`;
    legendEl.appendChild(legendItem);
  });
}

function renderTimelineLegend() {
  renderTimelineLegendInto(timelineIndicatorLegendEl);
}

function renderSimpleList(listEl, items) {
  listEl.innerHTML = "";
  if (!items || !items.length) {
    const li = document.createElement("li");
    li.textContent = "추천/진단 데이터가 아직 충분하지 않습니다.";
    listEl.appendChild(li);
    return;
  }

  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    listEl.appendChild(li);
  });
}

function renderRecommendationList(listEl, items, type) {
  listEl.innerHTML = "";
  if (!items || !items.length) {
    const li = document.createElement("li");
    li.textContent = "추천 데이터가 아직 충분하지 않습니다.";
    listEl.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    if (type === "book") {
      li.innerHTML = `<strong>${item.title}</strong> · ${item.author || "저자 미상"}<br/><span>${item.reason || ""}${item.level ? ` (${item.level})` : ""}</span>`;
    } else {
      li.innerHTML = `<strong>${item.title}</strong><br/><span>${item.reason || ""}</span>`;
    }
    listEl.appendChild(li);
  });
}

function renderAiDiagnosisInto(result, els) {
  const meta = result.meta || {};
  const diagnosis = result.diagnosis || {};
  const recommendations = result.recommendations || {};

  const createdAtText = meta.createdAt ? ` · 생성일: ${new Date(meta.createdAt).toLocaleString("ko-KR")}` : "";
  els.metaEl.textContent = `${meta.school || "-"} ${meta.grade || "-"}학년 ${meta.className || "-"} · 분석 기록 ${meta.attemptCount || 0}건${createdAtText}`;

  const hasData = Number(meta.attemptCount || 0) > 0;
  els.emptyEl.hidden = hasData;
  els.panelEl.hidden = !hasData;

  els.headlineEl.textContent = diagnosis.headline || "AI 진단 결과";
  renderConfidenceBadge(els.confidenceBadgeEl, meta);
  els.overviewEl.textContent = diagnosis.overview || "";

  renderSimpleList(els.timelineListEl, diagnosis.timelineInsights || []);
  renderSimpleList(els.indicatorListEl, diagnosis.indicatorInsights || []);
  renderSimpleList(els.actionPlanListEl, diagnosis.actionPlan || []);
  renderRecommendationList(els.textbookListEl, recommendations.textbooks || [], "textbook");
  renderRecommendationList(els.bookListEl, recommendations.books || [], "book");
}

function renderAiDiagnosisHistoryList(container, history, currentId, onSelect) {
  container.innerHTML = "";

  if (!history.length) {
    container.innerHTML = '<div class="ai-history-empty">아직 저장된 진단 기록이 없어요.</div>';
    return;
  }

  history.forEach((entry) => {
    const meta = entry.meta || {};
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ai-history-item";
    btn.classList.toggle("active", meta.id === currentId);
    const when = meta.createdAt ? new Date(meta.createdAt).toLocaleString("ko-KR") : "-";
    const headline = (entry.diagnosis && entry.diagnosis.headline) || "AI 진단 결과";

    const dateSpan = document.createElement("span");
    dateSpan.className = "ai-history-date";
    dateSpan.textContent = when;

    const headlineSpan = document.createElement("span");
    headlineSpan.className = "ai-history-headline";
    headlineSpan.textContent = headline;

    btn.appendChild(dateSpan);
    btn.appendChild(headlineSpan);
    btn.addEventListener("click", () => onSelect(entry));
    container.appendChild(btn);
  });
}

let aiDiagnosisHistoryCache = [];

function renderAiDiagnosis(result) {
  renderAiDiagnosisInto(result, {
    metaEl: aiDiagnosisMetaEl,
    emptyEl: aiDiagnosisEmptyEl,
    panelEl: aiDiagnosisPanelEl,
    headlineEl: aiDiagnosisHeadlineEl,
    confidenceBadgeEl: aiDiagnosisConfidenceBadgeEl,
    overviewEl: aiDiagnosisOverviewEl,
    timelineListEl: aiDiagnosisTimelineListEl,
    indicatorListEl: aiDiagnosisIndicatorListEl,
    actionPlanListEl: aiActionPlanListEl,
    textbookListEl: aiTextbookListEl,
    bookListEl: aiBookListEl
  });
  renderAiDiagnosisHistoryList(aiDiagnosisHistoryListEl, aiDiagnosisHistoryCache, result.meta ? result.meta.id ?? null : null, (entry) => {
    renderAiDiagnosis(entry);
  });
}

async function loadAiDiagnosis(forceRefresh = false) {
  if (getActiveRole() !== "student") {
    return;
  }

  if (aiDiagnosisLoaded && !forceRefresh) {
    return;
  }

  const currentStudent = getCurrentStudent();
  const url = forceRefresh
    ? `/api/my-ai-diagnosis?studentId=${currentStudent.id}&forceRefresh=true`
    : `/api/my-ai-diagnosis?studentId=${currentStudent.id}`;
  const result = await fetchJSON(url);
  const historyResult = await fetchJSON(`/api/my-ai-diagnosis-history?studentId=${currentStudent.id}`);
  aiDiagnosisHistoryCache = historyResult.history || [];
  renderAiDiagnosis(result);
  aiDiagnosisLoaded = true;
}

function renderTimelineChartsInto(rows, els) {
  const sortedRows = [...rows].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
  const count = sortedRows.length;

  els.totalChartEl.innerHTML = "";
  els.indicatorChartEl.innerHTML = "";
  els.indicatorLegendEl.innerHTML = "";

  if (!count) {
    els.summaryEl.textContent = els.emptyMessage || "평가 기록이 아직 없어요.";
    els.emptyEl.hidden = false;
    els.chartGroupEl.hidden = true;
    return;
  }

  els.emptyEl.hidden = true;
  els.chartGroupEl.hidden = false;

  const latest = sortedRows[count - 1];
  const latestScore = normalizeTotalScoreTo100(latest.total_score);
  const highest = sortedRows.reduce((max, row) => Math.max(max, normalizeTotalScoreTo100(row.total_score)), 0);
  els.summaryEl.textContent = `총 ${count}건의 평가 기록이 있습니다. 최근 총점 ${latestScore.toFixed(1)}점, 최고 총점 ${highest.toFixed(1)}점입니다.`;

  const totalWidth = 920;
  const totalHeight = 280;
  const totalGeometry = getTimelineChartGeometry(count, totalWidth, totalHeight);
  drawTimelineAxes(els.totalChartEl, totalGeometry, 100, 5, sortedRows);
  drawTimelineSeries(els.totalChartEl, totalGeometry, sortedRows, {
    maxValue: 100,
    valueGetter: (row) => normalizeTotalScoreTo100(row.total_score),
    color: "#ff6b35",
    fillColor: "rgba(255, 160, 90, 0.2)",
    strokeWidth: 3,
    dotRadius: 4.2,
    tooltipLabel: "총점",
    showPointLabels: true,
    pointLabelFormatter: (value) => `${value.toFixed(0)}점`
  });

  const indicatorWidth = 920;
  const indicatorHeight = 320;
  const indicatorGeometry = getTimelineChartGeometry(count, indicatorWidth, indicatorHeight);
  drawTimelineAxes(els.indicatorChartEl, indicatorGeometry, 5, 5, sortedRows);

  timelineIndicatorConfig.forEach((indicator) => {
    drawTimelineSeries(els.indicatorChartEl, indicatorGeometry, sortedRows, {
      maxValue: 5,
      valueGetter: (row) => row[indicator.key],
      color: indicator.color,
      strokeWidth: 2.2,
      dotRadius: 3.5,
      tooltipLabel: indicator.label
    });
  });

  renderTimelineLegendInto(els.indicatorLegendEl);
}

function renderTimelineCharts(rows) {
  renderTimelineChartsInto(rows, {
    totalChartEl: timelineTotalChartEl,
    indicatorChartEl: timelineIndicatorChartEl,
    indicatorLegendEl: timelineIndicatorLegendEl,
    summaryEl: timelineSummaryEl,
    emptyEl: timelineEmptyEl,
    chartGroupEl: timelineChartGroupEl,
    emptyMessage: "내 평가 기록이 아직 없어요."
  });
}

function renderStudentRadarChart(selfScores, peerScores, peerCount) {
  const svg = studentRadarChartEl;
  const cx = 170;
  const cy = 145;
  const radius = 100;

  svg.innerHTML = "";

  for (let level = 1; level <= 5; level += 1) {
    const ringValues = radarIndicators.map(() => level);
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ring.setAttribute("points", toRadarPoints(ringValues, cx, cy, radius));
    ring.setAttribute("fill", level % 2 ? "#faf8fd" : "#f1ecfb");
    ring.setAttribute("stroke", "#ddd0f0");
    ring.setAttribute("stroke-width", "1");
    svg.appendChild(ring);
  }

  radarIndicators.forEach((indicator, idx) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * idx) / radarIndicators.length;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const lx = cx + Math.cos(angle) * (radius + 22);
    const ly = cy + Math.sin(angle) * (radius + 22);

    const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axis.setAttribute("x1", String(cx));
    axis.setAttribute("y1", String(cy));
    axis.setAttribute("x2", x.toFixed(2));
    axis.setAttribute("y2", y.toFixed(2));
    axis.setAttribute("stroke", "#c9bce4");
    axis.setAttribute("stroke-width", "1");
    svg.appendChild(axis);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", lx.toFixed(2));
    label.setAttribute("y", ly.toFixed(2));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.setAttribute("font-weight", "700");
    label.setAttribute("fill", "#453a6b");
    label.textContent = indicator.label;
    svg.appendChild(label);
  });

  const peerPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  peerPolygon.setAttribute("points", toRadarPoints(peerScores, cx, cy, radius));
  peerPolygon.setAttribute("fill", "rgba(47, 128, 237, 0.24)");
  peerPolygon.setAttribute("stroke", "#2f80ed");
  peerPolygon.setAttribute("stroke-width", "2");
  svg.appendChild(peerPolygon);

  const selfPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  selfPolygon.setAttribute("points", toRadarPoints(selfScores, cx, cy, radius));
  selfPolygon.setAttribute("fill", "rgba(255, 122, 69, 0.28)");
  selfPolygon.setAttribute("stroke", "#ff7a45");
  selfPolygon.setAttribute("stroke-width", "2.2");
  svg.appendChild(selfPolygon);

  studentRadarLegendEl.innerHTML = `
    <span class="legend-item"><span class="legend-dot" style="background:#ff7a45"></span>내 점수</span>
    <span class="legend-item"><span class="legend-dot" style="background:#2f80ed"></span>동일 도서 타학생 평균 (${peerCount}명)</span>
  `;
}

function pickSummaryText(detail) {
  const feedback = detail.feedback || {};
  const parts = radarIndicators
    .map((indicator) => feedback[indicator.feedbackKey])
    .filter((value) => typeof value === "string" && value.trim().length > 0);

  if (!parts.length) {
    return "저장된 평가 요약이 없습니다.";
  }

  return parts.slice(0, 2).join(" ");
}

function createScoreRowElement(key, value, feedbackText, evidenceText) {
  const row = document.createElement("div");
  row.className = "score-row";

  const percent = (value / 5) * 100;
  row.innerHTML = `
    <strong>${indicatorNameMap[key] || key}: ${value}/5</strong>
    <div class="bar"><div class="fill" style="width:${percent}%"></div></div>
    <div>${feedbackText || ""}</div>
    ${evidenceText ? `<div class="evidence-quote">근거: "${evidenceText}"</div>` : ""}
  `;
  return row;
}

function renderStudentDetail(detail) {
  const submittedAt = new Date(detail.submitted_at).toLocaleString("ko-KR");
  studentDetailTitleEl.textContent = `${detail.book_title} 독서 기록`;
  studentDetailSubmittedAtEl.textContent = submittedAt;
  studentDetailMetaEl.textContent = `${detail.book_author || "저자 미입력"} · ${detail.school} ${detail.grade}학년 ${detail.class_name}`;
  studentDetailTotalScoreEl.textContent = detail.total_score;
  studentDetailSummaryEl.textContent = pickSummaryText(detail);
  studentDetailReflectionTextEl.textContent = detail.reflection_text || "";

  const selfScores = radarIndicators.map((indicator) => Number(detail[indicator.scoreKey] || 0));
  const peerScores = radarIndicators.map((indicator) => Number(detail.peer_average?.[indicator.key] || 0));
  const peerCount = Number(detail.peer_average?.peer_count || 0);

  studentIndicatorScoreListEl.innerHTML = "";
  radarIndicators.forEach((indicator, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${indicator.label}</span>
      <strong>${selfScores[idx].toFixed(1)}/5 · 평균 ${peerScores[idx].toFixed(1)}/5</strong>
    `;
    studentIndicatorScoreListEl.appendChild(li);
  });

  studentDetailScoreRowsEl.innerHTML = "";
  radarIndicators.forEach((indicator, idx) => {
    const feedbackText = detail.feedback?.[indicator.feedbackKey];
    const evidenceText = detail.evidence?.[indicator.feedbackKey];
    studentDetailScoreRowsEl.appendChild(
      createScoreRowElement(indicator.feedbackKey, selfScores[idx], feedbackText, evidenceText)
    );
  });

  renderStudentRadarChart(selfScores, peerScores, peerCount);
}

async function openStudentDetailModalByReflection(reflectionId) {
  const currentStudent = getCurrentStudent();
  const detailResult = await fetchJSON(
    `/api/my-reflection-detail?studentId=${currentStudent.id}&reflectionId=${reflectionId}`
  );

  renderStudentDetail(detailResult.detail);
  openStudentDetailModal();
}

function getTeacherModalMinSize() {
  const minWidth = window.matchMedia("(max-width: 760px)").matches ? 320 : 620;
  const minHeight = window.matchMedia("(max-width: 760px)").matches ? 260 : 320;
  return { minWidth, minHeight };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function setTeacherModalBounds(bounds) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const { minWidth, minHeight } = getTeacherModalMinSize();

  const widthMax = Math.max(minWidth, viewportWidth - 24);
  const heightMax = Math.max(minHeight, viewportHeight - 24);
  const width = clamp(bounds.width, minWidth, widthMax);
  const height = clamp(bounds.height, minHeight, heightMax);

  const leftMax = Math.max(12, viewportWidth - width - 12);
  const topMax = Math.max(12, viewportHeight - height - 12);
  const left = clamp(bounds.left, 12, leftMax);
  const top = clamp(bounds.top, 12, topMax);

  teacherDetailCardEl.style.width = `${width}px`;
  teacherDetailCardEl.style.height = `${height}px`;
  teacherDetailCardEl.style.left = `${left}px`;
  teacherDetailCardEl.style.top = `${top}px`;

  teacherModalState.lastBounds = { left, top, width, height };
}

function applyTeacherModalBounds() {
  if (teacherModalState.lastBounds) {
    setTeacherModalBounds(teacherModalState.lastBounds);
    return;
  }

  const defaultWidth = Math.min(1100, window.innerWidth - 24);
  const defaultHeight = Math.min(640, window.innerHeight - 24);
  const left = Math.max(12, Math.round((window.innerWidth - defaultWidth) / 2));
  const top = Math.max(12, Math.round((window.innerHeight - defaultHeight) / 2));
  setTeacherModalBounds({ left, top, width: defaultWidth, height: defaultHeight });
}

function handleTeacherModalPointerMove(event) {
  if (teacherModalState.drag) {
    const nextLeft = event.clientX - teacherModalState.drag.offsetX;
    const nextTop = event.clientY - teacherModalState.drag.offsetY;
    setTeacherModalBounds({
      ...teacherModalState.lastBounds,
      left: nextLeft,
      top: nextTop
    });
    return;
  }

  if (teacherModalState.resize) {
    const nextWidth = event.clientX - teacherModalState.resize.startLeft;
    const nextHeight = event.clientY - teacherModalState.resize.startTop;
    setTeacherModalBounds({
      ...teacherModalState.lastBounds,
      width: nextWidth,
      height: nextHeight
    });
  }
}

function stopTeacherModalInteractions() {
  if (!teacherModalState.drag && !teacherModalState.resize) {
    return;
  }

  teacherModalState.drag = null;
  teacherModalState.resize = null;
  document.body.style.userSelect = "";
}

async function loadAllDashboard() {
  const data = await fetchJSON("/api/dashboard?limit=300");
  renderTeacherDashboard(data);
}

let evaluationProgressTimer = null;

// LLM 응답에는 실제 진행률이 없으므로, 97%까지만 점점 느려지며 채우다가
// 실제 응답이 오면 100%로 마무리하는 방식으로 체감 대기 시간을 표현한다.
function startEvaluationProgress({
  title = "AI가 감상문을 평가하고 있어요",
  initialMessage = "AI가 감상문을 읽고 있어요...",
  laterMessage = "5개 지표로 점수를 계산하고 있어요..."
} = {}) {
  let percent = 0;
  clearInterval(evaluationProgressTimer);

  evaluationProgressTitleEl.textContent = title;
  evaluationProgressOverlayEl.classList.add("open");
  evaluationProgressOverlayEl.setAttribute("aria-hidden", "false");
  evaluationProgressMessageEl.textContent = initialMessage;
  evaluationProgressFillEl.style.width = "0%";
  evaluationProgressPercentEl.textContent = "0%";

  evaluationProgressTimer = setInterval(() => {
    const remaining = 97 - percent;
    percent = Math.min(97, percent + Math.max(0.4, remaining * 0.06));
    evaluationProgressFillEl.style.width = `${percent}%`;
    evaluationProgressPercentEl.textContent = `${Math.floor(percent)}%`;

    if (percent > 60) {
      evaluationProgressMessageEl.textContent = laterMessage;
    }
  }, 300);
}

async function finishEvaluationProgress(completeMessage = "평가가 완료됐어요!") {
  clearInterval(evaluationProgressTimer);
  evaluationProgressTimer = null;
  evaluationProgressFillEl.style.width = "100%";
  evaluationProgressPercentEl.textContent = "100%";
  evaluationProgressMessageEl.textContent = completeMessage;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

function hideEvaluationProgress() {
  clearInterval(evaluationProgressTimer);
  evaluationProgressTimer = null;
  evaluationProgressOverlayEl.classList.remove("open");
  evaluationProgressOverlayEl.setAttribute("aria-hidden", "true");
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  goToLogin();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (getActiveRole() !== "student") {
    alert("학생 계정에서만 문해력 평가를 저장할 수 있어요.");
    return;
  }

  const currentStudent = getCurrentStudent();
  const formData = new FormData(form);
  const payload = {
    studentId: currentStudent.id,
    reflection: {
      bookTitle: formData.get("bookTitle"),
      bookAuthor: formData.get("bookAuthor"),
      reflectionText: formData.get("reflectionText")
    }
  };

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  startEvaluationProgress();

  try {
    const result = await fetchJSON("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    await finishEvaluationProgress();
    hideEvaluationProgress();

    renderEvaluation(result.evaluation);
    await loadMyDashboard();
    activateView("dashboard");
    alert("평가와 저장이 완료되었어요.");
  } catch (error) {
    hideEvaluationProgress();
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

timelineRefreshButton.addEventListener("click", loadMyDashboard);
aiDiagnosisRefreshButton.addEventListener("click", async () => {
  aiDiagnosisRefreshButton.disabled = true;
  startEvaluationProgress({
    title: "AI가 진단·추천을 분석하고 있어요",
    initialMessage: "최근 독서 활동을 살펴보고 있어요...",
    laterMessage: "강점과 보완점을 정리하고 있어요..."
  });

  try {
    await loadAiDiagnosis(true);
    await finishEvaluationProgress("분석이 완료됐어요!");
    hideEvaluationProgress();
  } catch (error) {
    hideEvaluationProgress();
    alert(error.message);
  } finally {
    aiDiagnosisRefreshButton.disabled = false;
  }
});
assignmentCheckRefreshButton.addEventListener("click", async () => {
  try {
    await loadAssignmentsForStudent();
  } catch (error) {
    alert(error.message);
  }
});
discussionNewButton.addEventListener("click", showDiscussionStartForm);
discussionStartButton.addEventListener("click", startNewDiscussion);
discussionChatFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  sendDiscussionMessage();
});
assignmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (getActiveRole() !== "teacher") {
    alert("교사 계정에서만 과제를 생성할 수 있어요.");
    return;
  }

  const formData = new FormData(assignmentForm);
  const payload = {
    bookTitle: formData.get("bookTitle"),
    bookAuthor: formData.get("bookAuthor"),
    summary: formData.get("summary"),
    objective: formData.get("objective"),
    deadline: formData.get("deadline")
  };

  try {
    const result = await fetchJSON("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    assignmentForm.reset();
    await loadAssignments();
    alert(result.message || "과제가 저장되었습니다.");
  } catch (error) {
    alert(error.message);
  }
});
teacherSearchInput.addEventListener("input", applyTeacherFiltersAndRender);
teacherGradeFilter.addEventListener("change", () => {
  populateTeacherClassFilterOptions();
  applyTeacherFiltersAndRender();
});
teacherClassFilter.addEventListener("change", applyTeacherFiltersAndRender);
teacherFilterResetButton.addEventListener("click", () => {
  teacherSearchInput.value = "";
  teacherGradeFilter.value = "";
  populateTeacherClassFilterOptions();
  teacherClassFilter.value = "";
  applyTeacherFiltersAndRender();
});
function rerenderTeacherTrendFromFilters() {
  teacherTrendCurrentPage = 1;
  renderTeacherStudentTrendList(getFilteredTeacherTrendRows());
}

teacherTrendSchoolInput.addEventListener("input", rerenderTeacherTrendFromFilters);
teacherTrendNameInput.addEventListener("input", rerenderTeacherTrendFromFilters);
teacherTrendClassFilter.addEventListener("change", rerenderTeacherTrendFromFilters);
teacherTrendMinScoreInput.addEventListener("input", rerenderTeacherTrendFromFilters);
teacherTrendMaxScoreInput.addEventListener("input", rerenderTeacherTrendFromFilters);
teacherTrendFilterResetButton.addEventListener("click", () => {
  teacherTrendSchoolInput.value = "";
  teacherTrendNameInput.value = "";
  teacherTrendClassFilter.value = "";
  teacherTrendMinScoreInput.value = "";
  teacherTrendMaxScoreInput.value = "";
  rerenderTeacherTrendFromFilters();
});
studentDetailCloseButton.addEventListener("click", closeStudentDetailModal);
studentDetailModalEl.addEventListener("click", (event) => {
  if (event.target === studentDetailModalEl) {
    closeStudentDetailModal();
  }
});
teacherDetailCloseButton.addEventListener("click", closeTeacherDetailModal);
teacherDetailModalEl.addEventListener("click", (event) => {
  if (event.target === teacherDetailModalEl) {
    closeTeacherDetailModal();
  }
});
teacherDetailDragBarEl.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  if (event.target.closest("button")) {
    return;
  }

  const rect = teacherDetailCardEl.getBoundingClientRect();
  teacherModalState.drag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  teacherDetailDragBarEl.setPointerCapture(event.pointerId);
  document.body.style.userSelect = "none";
});
teacherDetailDragBarEl.addEventListener("pointermove", handleTeacherModalPointerMove);
teacherDetailDragBarEl.addEventListener("pointerup", stopTeacherModalInteractions);
teacherDetailDragBarEl.addEventListener("pointercancel", stopTeacherModalInteractions);

teacherResizeHandleEl.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  const rect = teacherDetailCardEl.getBoundingClientRect();
  teacherModalState.resize = {
    startLeft: rect.left,
    startTop: rect.top
  };
  teacherResizeHandleEl.setPointerCapture(event.pointerId);
  document.body.style.userSelect = "none";
});
teacherResizeHandleEl.addEventListener("pointermove", handleTeacherModalPointerMove);
teacherResizeHandleEl.addEventListener("pointerup", stopTeacherModalInteractions);
teacherResizeHandleEl.addEventListener("pointercancel", stopTeacherModalInteractions);

window.addEventListener("resize", () => {
  if (teacherModalState.lastBounds) {
    setTeacherModalBounds(teacherModalState.lastBounds);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeStudentDetailModal();
    closeTeacherDetailModal();
  }
});

gnbButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    activateView(button.dataset.view);
    if (button.dataset.view === "ai-diagnosis") {
      try {
        await loadAiDiagnosis();
      } catch (error) {
        alert(error.message);
      }
    }
    if (button.dataset.view === "assignment-check") {
      try {
        await loadAssignmentsForStudent();
      } catch (error) {
        alert(error.message);
      }
    }
    if (button.dataset.view === "ai-discussion") {
      try {
        await loadDiscussionSessions();
        if (!activeDiscussionSessionId) {
          showDiscussionStartForm();
        }
      } catch (error) {
        alert(error.message);
      }
    }
  });
});

dashboardQuickChips.forEach((chip) => {
  chip.addEventListener("click", async () => {
    const targetView = chip.dataset.quickView;
    activateView(targetView);

    if (targetView === "ai-diagnosis") {
      try {
        await loadAiDiagnosis();
      } catch (error) {
        alert(error.message);
      }
    }
  });
});

teacherPanelChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const targetPanel = chip.dataset.teacherPanel;
    teacherPanelChips.forEach((c) => c.classList.toggle("active", c === chip));
    document.querySelectorAll(".teacher-tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.teacherPanel === targetPanel);
    });
  });
});

teacherHistoryTabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveTeacherHistoryTab(btn.dataset.historyTab);
  });
});

(async function init() {
  if (!restoreSession()) {
    return;
  }

  applyRoleUI();

  try {
    renderLoginStatus();

    if (getActiveRole() === "teacher") {
      await Promise.all([loadAllDashboard(), loadAssignments()]);
      activateView("teacher-dashboard");
      return;
    }

    await Promise.all([loadIndicators(), loadMyDashboard(), loadAssignmentsForStudent()]);
    activateView("dashboard");
  } catch (error) {
    alert(`초기 로딩 오류: ${error.message}`);
  }
})();
function activateView(viewName) {
  gnbButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  dashboardQuickChips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.quickView === viewName);
  });

  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `view-${viewName}`);
  });
}

const CONFIDENCE_LABEL = { high: "신뢰도 높음", medium: "신뢰도 보통", low: "신뢰도 낮음" };

function renderConfidenceBadge(el, { confidence, needsReview, modelVersion }) {
  if (!confidence && !needsReview) {
    el.hidden = true;
    return;
  }

  el.hidden = false;
  el.classList.remove("confidence-high", "confidence-medium", "confidence-low", "confidence-review");
  el.classList.add(`confidence-${confidence || "medium"}`);
  if (needsReview) {
    el.classList.add("confidence-review");
  }

  const isFallback = modelVersion === "rule-based-fallback" || modelVersion === "template-fallback";
  const parts = [CONFIDENCE_LABEL[confidence] || "신뢰도 보통"];
  if (needsReview) {
    parts.push(isFallback ? "AI 서버 연결 실패 - 규칙 기반 결과 (교사 확인 권장)" : "교사 확인 권장");
  }
  el.textContent = parts.join(" · ");
}

function renderEvaluation(evaluation) {
  totalScoreEl.textContent = evaluation.totalScore;
  scoreRowsEl.innerHTML = "";
  renderConfidenceBadge(evaluationMetaBadgeEl, evaluation);

  Object.entries(evaluation.scores).forEach(([key, value]) => {
    const row = createScoreRowElement(key, value, evaluation.feedback[key], evaluation.evidence?.[key]);
    scoreRowsEl.appendChild(row);
  });
}

function getFilteredDashboardRows() {
  const keyword = dashboardSearchInputEl.value.trim().toLowerCase();
  const sourceFilter = dashboardSourceFilterEl.value;

  return myDashboardRows.filter((row) => {
    if (sourceFilter !== "all" && row.source_type !== sourceFilter) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystack = `${row.book_title || ""} ${row.feedback?.comprehension || ""}`.toLowerCase();
    return haystack.includes(keyword);
  });
}

function renderDashboardRows(rows) {
  dashboardBodyEl.innerHTML = "";

  if (!rows.length) {
    const tr = document.createElement("tr");
    const message = myDashboardRows.length
      ? "🔍 조건에 맞는 평가 기록이 없어요."
      : "🌱 아직 저장된 평가가 없어요. 문해력 평가 메뉴에서 첫 감상문을 작성해보세요.";
    tr.innerHTML = `<td colspan="5">${message}</td>`;
    dashboardBodyEl.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const when = new Date(row.submitted_at).toLocaleString("ko-KR");
    const isTeacherAssigned = row.source_type === "teacher";

    tr.innerHTML = `
      <td><span class="source-badge ${isTeacherAssigned ? "source-badge-teacher" : "source-badge-self"}">${isTeacherAssigned ? "교사" : "본인"}</span></td>
      <td><button type="button" class="student-book-link" data-reflection-id="${row.reflection_id}">${row.book_title}</button></td>
      <td>${row.total_score}점</td>
      <td>${row.feedback?.comprehension || ""}</td>
      <td>${when}</td>
    `;

    dashboardBodyEl.appendChild(tr);
  });

  dashboardBodyEl.querySelectorAll(".student-book-link").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reflectionId = Number(btn.dataset.reflectionId);
      if (!Number.isInteger(reflectionId) || reflectionId <= 0) {
        return;
      }

      try {
        await openStudentDetailModalByReflection(reflectionId);
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

function renderDashboard(data) {
  myDashboardRows = data.rows || [];
  renderTimelineCharts(myDashboardRows);

  const reflectionCount = data.stats.reflection_count || 0;
  const avgScore = data.stats.avg_score || 0;

  statsEl.innerHTML = `
    <div class="stat-pill">내 제출 수: ${reflectionCount}</div>
    <div class="stat-pill">내 평균 점수: ${avgScore || 0}</div>
  `;

  renderDashboardRows(getFilteredDashboardRows());
}

dashboardSearchInputEl.addEventListener("input", () => renderDashboardRows(getFilteredDashboardRows()));
dashboardSourceFilterEl.addEventListener("change", () => renderDashboardRows(getFilteredDashboardRows()));

async function loadIndicators() {
  const data = await fetchJSON("/api/indicators");
  indicatorListEl.innerHTML = "";

  data.indicators.forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${i.name}</strong> (${Math.round(i.weight * 100)}%) - ${i.description} <small>[${i.source}]</small>`;
    indicatorListEl.appendChild(li);
  });
}

async function loadMyDashboard() {
  const currentStudent = getCurrentStudent();
  const data = await fetchJSON(`/api/my-dashboard?studentId=${currentStudent.id}&limit=100`);
  renderDashboard(data);
}
