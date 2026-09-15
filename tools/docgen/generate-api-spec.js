// AIRead API기능정의서(.xlsx) 생성 스크립트.
// 실행: node tools/docgen/generate-api-spec.js  → docs/AIRead_API기능정의서.xlsx
const fs = require("fs");
const path = require("path");
const { newWorkbook, addSheet, styleHeaderRow, addDataRow, titleSheet } = require("./lib/xlsxHelpers");

const OUT_PATH = path.join(__dirname, "..", "..", "docs", "AIRead_API기능정의서.xlsx");

// [분류, Method, Endpoint, 기능명, 설명, 요청 파라미터(Path/Query), 요청 Body, 응답 주요 필드, 성공코드, 실패코드/조건, 인증, 비고]
const API_ROWS = [
  [
    "시스템", "GET", "/api/health", "상태 확인",
    "서비스 및 LLM(vLLM/Ollama) 연결 상태를 확인한다.",
    "없음", "없음",
    "ok(boolean), service(string), llm.enabled(boolean), llm.reachable(boolean)",
    "200", "-",
    "없음",
    "README에는 llm.provider/llm.model도 노출된다고 되어 있으나 실제 checkLlmHealth() 구현은 enabled/reachable만 반환함 (연동 시 실제 응답 기준으로 참고)"
  ],
  [
    "시스템", "GET", "/api/indicators", "평가지표 목록",
    "문해력 평가 5개 지표(키/이름/가중치/설명/출처) 정의를 반환한다.",
    "없음", "없음",
    "indicators: [{key,name,weight,description,source}] (5건)",
    "200", "-",
    "없음", "-"
  ],
  [
    "인증", "POST", "/api/auth/login", "학생 로그인",
    "이름/학교/학년/반/번호 조합으로 학생 계정을 조회하거나 없으면 새로 생성한다.",
    "없음",
    "{name, school, grade, className, studentNumber}",
    "message(string), student{id,name,school,grade,className,studentNumber}",
    "200", "400 (필드 누락, grade 1~6 범위 초과, studentNumber 1 미만)",
    "없음",
    "동일 (school,grade,className,studentNumber) 조합은 같은 계정으로 매핑됨(UNIQUE 인덱스)"
  ],
  [
    "인증", "POST", "/api/auth/teacher-login", "교사 로그인",
    "이름과 공용 비밀번호(TEACHER_PASSWORD)로 교사 로그인을 처리한다.",
    "없음", "{name, password}",
    "message(string), teacher{name, role:\"teacher\"}",
    "200", "400 (필드 누락) / 401 (비밀번호 불일치)",
    "없음",
    "모든 교사가 동일한 공용 비밀번호를 공유하는 구조 (개별 계정 인증 아님, ERD 문서 3장 개선안 참고)"
  ],
  [
    "평가", "POST", "/api/evaluate", "감상문 평가(저장 없음)",
    "감상문 텍스트를 즉시 LLM/규칙 기반으로 평가만 하고 DB에는 저장하지 않는다(미리보기/연동 테스트용).",
    "없음", "{reflectionText, grade, bookTitle, bookAuthor}",
    "totalScore, scores{5지표}, feedback{5지표}, evidence, confidence, flags, needsReview, modelVersion, promptVersion",
    "200", "400 (감상문 20자 미만)",
    "없음", "-"
  ],
  [
    "평가", "POST", "/api/submissions", "독후감 제출 및 평가 저장",
    "학생 감상문을 제출하면 LLM(or 규칙기반) 평가를 수행하고 결과를 DB에 저장한다.",
    "없음", "{studentId, reflection:{bookTitle, bookAuthor, reflectionText}}",
    "message, ids{studentId,reflectionId}, student, evaluation",
    "201", "400 (studentId/필수값 누락, 감상문 20자 미만) / 404 (학생 없음)",
    "없음",
    "핵심 평가 파이프라인 (설계문서 3.1절, 7장 참고)"
  ],
  [
    "대시보드", "GET", "/api/my-dashboard", "학생 대시보드 조회",
    "특정 학생의 제출 이력 목록과 통계(건수/평균점수)를 조회한다.",
    "Query: studentId(number, 필수), limit(number, 기본 100, 최대 300)",
    "없음",
    "student, stats{reflection_count, avg_score}, rows[]",
    "200", "400 (studentId 누락/형식 오류) / 404 (학생 없음)",
    "없음 (IDOR 주의: studentId만 알면 조회 가능)",
    "-"
  ],
  [
    "대시보드", "GET", "/api/my-reflection-detail", "독서 기록 상세 조회",
    "특정 제출 건의 상세 평가 결과와 동일 도서 또래 평균 점수를 조회한다.",
    "Query: studentId(number, 필수), reflectionId(number, 필수)",
    "없음",
    "detail{...평가결과, feedback, evidence, peer_average}",
    "200", "400 (파라미터 누락) / 404 (학생 또는 기록 없음)",
    "없음 (IDOR 주의)",
    "-"
  ],
  [
    "AI진단", "GET", "/api/my-ai-diagnosis", "AI 진단/추천 조회",
    "누적 평가 이력 기반 진단 서사와 맞춤 도서/교과서 추천을 조회한다. 기본은 DB에 저장된 최신 결과를 즉시 반환.",
    "Query: studentId(number, 필수), forceRefresh(boolean, 기본 false)",
    "없음",
    "diagnosis{headline,overview,timelineInsights,indicatorInsights,actionPlan}, recommendations{textbooks[],books[]}, meta{...}",
    "200", "400 (studentId 누락) / 404 (학생 없음)",
    "없음 (IDOR 주의)",
    "forceRefresh=true일 때만 LLM을 재호출하고 결과를 새로 저장(비용/지연 발생, 설계문서 3.2절 참고)"
  ],
  [
    "AI진단", "GET", "/api/my-ai-diagnosis-history", "AI 진단 이력 목록",
    "학생의 과거 AI 진단/추천 이력을 최신순으로 조회한다.",
    "Query: studentId(number, 필수), limit(number, 기본 20, 최대 100)",
    "없음",
    "history: [진단 결과 객체, ...]",
    "200", "400 (studentId 누락) / 404 (학생 없음)",
    "없음 (IDOR 주의)",
    "-"
  ],
  [
    "대시보드", "GET", "/api/dashboard", "교사용 전체 대시보드",
    "전체 학생의 제출 이력과 통계(학생수/제출건수/평균점수)를 조회한다.",
    "Query: limit(number, 기본 100, 최대 300)",
    "없음",
    "stats{student_count, reflection_count, avg_score}, rows[]",
    "200", "-",
    "없음 (역할 검증 없음 - 교사 로그인 여부와 무관하게 호출 가능)",
    "-"
  ],
  [
    "과제", "POST", "/api/assignments", "과제 생성",
    "교사가 도서 기반 과제(요약본/목표/제출기한)를 생성한다.",
    "없음", "{bookTitle, bookAuthor, summary, objective, deadline}",
    "message, assignment{id,bookTitle,bookAuthor,summary,objective,deadline,createdAt}",
    "201", "400 (필수값 누락)",
    "없음",
    "-"
  ],
  [
    "과제", "GET", "/api/assignments", "과제 목록 조회",
    "생성된 전체 과제 목록을 최신순으로 조회한다.",
    "없음", "없음",
    "assignments: [{id,bookTitle,bookAuthor,summary,objective,deadline,createdAt}, ...]",
    "200", "-",
    "없음", "-"
  ],
  [
    "과제", "POST", "/api/assignment-submissions", "과제 제출 및 평가",
    "학생이 과제 답안을 제출하면 평가를 수행하고 결과를 저장한다 (독후감 제출과 동일 평가 파이프라인 재사용).",
    "없음", "{studentId, assignmentId, answerText}",
    "message, assignment, submission, evaluation",
    "201", "400 (필수값 누락, 답안 20자 미만) / 404 (학생 또는 과제 없음)",
    "없음",
    "-"
  ],
  [
    "AI토론", "POST", "/api/discussions", "독서토론 세션 시작",
    "특정 도서를 주제로 새 AI 독서토론 세션을 생성한다.",
    "없음", "{studentId, bookTitle, bookAuthor}",
    "message, session{id,studentId,bookTitle,bookAuthor,createdAt,updatedAt}",
    "201", "400 (studentId 유효하지 않음, bookTitle 누락) / 404 (학생 없음)",
    "없음",
    "-"
  ],
  [
    "AI토론", "GET", "/api/discussions", "독서토론 세션 목록",
    "학생의 과거 독서토론 세션 목록(메시지 수/마지막 메시지 포함)을 조회한다.",
    "Query: studentId(number, 필수)",
    "없음",
    "sessions: [{id,bookTitle,bookAuthor,createdAt,updatedAt,messageCount,lastMessage}, ...]",
    "200", "400 (studentId 누락) / 404 (학생 없음)",
    "없음", "-"
  ],
  [
    "AI토론", "GET", "/api/discussions/:sessionId/messages", "독서토론 대화 이력 조회",
    "특정 세션의 메시지 전체 이력을 조회한다.",
    "Path: sessionId(number) / Query: studentId(number, 필수)",
    "없음",
    "session, messages: [{id,sessionId,role,content,createdAt}, ...]",
    "200", "400 (파라미터 누락/형식 오류) / 404 (세션 없음 또는 studentId 불일치)",
    "세션 소유자 검증 있음 (studentId 불일치 시 404)",
    "본 API만 예외적으로 IDOR 방지 로직이 구현되어 있음"
  ],
  [
    "AI토론", "POST", "/api/discussions/:sessionId/messages", "독서토론 메시지 전송",
    "학생 메시지를 저장하고 LLM 응답(assistant)을 생성해 함께 반환한다.",
    "Path: sessionId(number)",
    "{studentId, message(1~1000자)}",
    "userMessage, assistantMessage",
    "201", "400 (메시지 누락/1000자 초과, 파라미터 형식 오류) / 404 (학생 또는 세션 없음/불일치)",
    "세션 소유자 검증 있음",
    "-"
  ]
];

async function main() {
  const wb = newWorkbook();

  titleSheet(wb, {
    title: "AIRead API 기능정의서",
    subtitle: "학생 문해력 평가 서비스 - REST API 상세 명세",
    meta: ["버전 1.0", `작성일: ${new Date().toISOString().slice(0, 10)}`, "Base URL(로컬): http://localhost:3000", "대상 저장소: AIRead_model (WAS/server.js)"]
  });

  // ------------------------------------------------------------------
  // API 목록 (요약)
  // ------------------------------------------------------------------
  const summarySheet = addSheet(wb, "API 목록", [
    { header: "No.", key: "no", width: 6 },
    { header: "분류", key: "category", width: 10 },
    { header: "Method", key: "method", width: 9 },
    { header: "Endpoint", key: "endpoint", width: 38 },
    { header: "기능명", key: "name", width: 22 },
    { header: "성공코드", key: "success", width: 9 },
    { header: "인증/권한", key: "auth", width: 26 }
  ]);
  styleHeaderRow(summarySheet);
  API_ROWS.forEach((row, idx) => {
    const [category, method, endpoint, name, , , , , success, , auth] = row;
    addDataRow(summarySheet, { no: idx + 1, category, method, endpoint, name, success, auth }, { zebraIndex: idx });
  });
  summarySheet.getColumn("method").alignment = { vertical: "top", horizontal: "center" };
  summarySheet.getColumn("success").alignment = { vertical: "top", horizontal: "center" };
  summarySheet.autoFilter = { from: "A1", to: "G1" };

  // ------------------------------------------------------------------
  // API 상세명세
  // ------------------------------------------------------------------
  const detailSheet = addSheet(
    wb,
    "API 상세명세",
    [
      { header: "No.", key: "no", width: 6 },
      { header: "분류", key: "category", width: 10 },
      { header: "Method", key: "method", width: 9 },
      { header: "Endpoint", key: "endpoint", width: 34 },
      { header: "기능명", key: "name", width: 20 },
      { header: "기능 설명", key: "desc", width: 40 },
      { header: "요청 파라미터 (Path/Query)", key: "params", width: 30 },
      { header: "요청 Body", key: "body", width: 34 },
      { header: "응답 주요 필드", key: "response", width: 40 },
      { header: "성공코드", key: "success", width: 8 },
      { header: "실패코드 및 조건", key: "fail", width: 36 },
      { header: "인증/권한", key: "auth", width: 26 },
      { header: "비고", key: "note", width: 40 }
    ],
    { rowHeight: 40 }
  );
  styleHeaderRow(detailSheet);
  API_ROWS.forEach((row, idx) => {
    const [category, method, endpoint, name, desc, params, body, response, success, fail, auth, note] = row;
    addDataRow(
      detailSheet,
      { no: idx + 1, category, method, endpoint, name, desc, params, body, response, success, fail, auth, note },
      { zebraIndex: idx }
    );
  });
  detailSheet.getColumn("method").alignment = { vertical: "top", horizontal: "center" };
  detailSheet.getColumn("success").alignment = { vertical: "top", horizontal: "center" };
  detailSheet.autoFilter = { from: "A1", to: "M1" };

  // ------------------------------------------------------------------
  // 공통 규격 및 에러코드
  // ------------------------------------------------------------------
  const commonSheet = addSheet(wb, "공통 규격", [
    { header: "구분", key: "k", width: 22 },
    { header: "내용", key: "v", width: 90 }
  ]);
  styleHeaderRow(commonSheet);
  [
    ["Base URL (로컬)", "http://localhost:3000 (PORT 환경변수 미설정 시 사용 중이면 3001, 3002로 자동 승격)"],
    ["Base URL (운영/Render)", "render.yaml 배포 도메인 (예: https://<service-name>.onrender.com)"],
    ["Content-Type", "요청/응답 모두 application/json (POST 요청은 반드시 Content-Type: application/json 헤더 필요)"],
    ["CORS", "cors 미들웨어로 모든 origin 허용 (origin: true)"],
    ["인증 방식", "세션/토큰 기반 인증 없음(stateless). 로그인 API도 studentId를 발급할 뿐 이후 요청은 클라이언트가 studentId를 직접 실어 보내는 구조"],
    ["보안 주의", "studentId/studentId 기반 리소스 대부분에 소유자(세션) 검증이 없어 studentId 값만 알면 다른 학생 데이터 조회가 가능함(IDOR). AI 독서토론(discussions) API만 예외적으로 세션 소유자 검증이 구현되어 있음. 외부 서비스 연동 시 반드시 별도의 인증/인가 계층을 앞단에 두는 것을 권장"],
    ["공통 에러 응답 형식", '{"message": "사용자에게 보여줄 한글 오류 메시지"} 형태의 단일 필드 JSON (전역 에러 핸들링 미들웨어 없음, 각 라우트가 자체적으로 400/404/401 응답)'],
    ["200 OK", "조회/처리 성공 (GET, 일부 POST)"],
    ["201 Created", "리소스 생성 성공 (POST /api/submissions, /api/assignments, /api/assignment-submissions, /api/discussions, /api/discussions/:id/messages)"],
    ["400 Bad Request", "필수 파라미터 누락, 형식 오류(숫자 변환 실패 등), 글자 수 제약 위반(20자 미만/1000자 초과 등)"],
    ["401 Unauthorized", "교사 로그인 비밀번호 불일치 (POST /api/auth/teacher-login 전용)"],
    ["404 Not Found", "studentId/assignmentId/sessionId 등으로 조회한 리소스가 존재하지 않는 경우"],
    ["500 Internal Server Error", "라우트 내 미처리 예외 발생 시 Express 기본 에러 핸들러가 처리 (전역 에러 핸들링 미들웨어는 별도로 정의되어 있지 않음)"],
    ["LLM 호출 지연", "평가/진단/토론 API는 내부적으로 LLM 호출(최대 3회 재시도, 최대 LLM_TIMEOUT_MS × 3)이 발생할 수 있어 응답 지연이 클 수 있음 (기본 타임아웃 60초 기준 최대 약 180초)"]
  ].forEach((row, idx) => addDataRow(commonSheet, { k: row[0], v: row[1] }, { zebraIndex: idx }));

  // ------------------------------------------------------------------
  // 변경 이력
  // ------------------------------------------------------------------
  const historySheet = addSheet(wb, "변경이력", [
    { header: "버전", key: "ver", width: 10 },
    { header: "일자", key: "date", width: 14 },
    { header: "내용", key: "desc", width: 80 },
    { header: "작성자", key: "author", width: 14 }
  ]);
  styleHeaderRow(historySheet);
  addDataRow(historySheet, { ver: "1.0", date: new Date().toISOString().slice(0, 10), desc: "최초 작성 (WAS/server.js 기준 18개 API 전수 문서화)", author: "AIRead 팀" }, { zebraIndex: 0 });

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  await wb.xlsx.writeFile(OUT_PATH);
  console.log(`OK: wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
