// AIRead 설계 문서(.docx) 생성 스크립트.
// 실행: node tools/docgen/generate-design-doc.js  → docs/AIRead_설계문서.docx
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, SectionType, PageOrientation, convertInchesToTwip, TableOfContents, AlignmentType } = require("docx");
const {
  h1,
  h2,
  h3,
  p,
  bullet,
  note,
  imageParagraph,
  dataTable,
  tableSpacer,
  codeBlock,
  pageNumberFooter,
  titlePage
} = require("./lib/docxHelpers");

const REF_DIR = path.join(__dirname, "..", "..", "DB", "data", "reference");
const ASSETS = path.join(__dirname, "assets");
const OUT_PATH = path.join(__dirname, "..", "..", "docs", "AIRead_설계문서.docx");

const rubricData = JSON.parse(fs.readFileSync(path.join(REF_DIR, "rubric.json"), "utf8"));
const curriculumData = JSON.parse(fs.readFileSync(path.join(REF_DIR, "curriculum_standards.json"), "utf8"));
const booksData = JSON.parse(fs.readFileSync(path.join(REF_DIR, "recommended_books.json"), "utf8"));
const textbooksData = JSON.parse(fs.readFileSync(path.join(REF_DIR, "recommended_textbooks.json"), "utf8"));

const GRADE_BAND_LABEL = { low: "초1~2학년군", mid: "초3~4학년군", high: "초5~6학년군" };
const INDICATOR_LABEL = {
  comprehension: "내용 이해",
  inference: "추론/해석",
  criticalThinking: "비판/평가",
  expression: "표현/구성",
  vocabGrammar: "어휘/문장 사용"
};
const INDICATOR_ORDER = ["comprehension", "inference", "criticalThinking", "expression", "vocabGrammar"];
const GRADE_ORDER = ["low", "mid", "high"];

async function img(filename, opts = {}) {
  return imageParagraph(path.join(ASSETS, filename), opts);
}

// ---------------------------------------------------------------------------
// 1. 개요
// ---------------------------------------------------------------------------
function buildOverviewSection() {
  return [
    h1("1. 개요"),
    p(
      "AIRead는 초등학생이 작성한 독서 감상문을 LLM(거대언어모델) 기반으로 자동 채점하고, 성장 추이 진단과 맞춤 도서·교과서 추천, 1:1 AI 독서토론을 제공하는 WEB-WAS-DB 3계층 구조의 문해력 평가 서비스이다."
    ),
    p(
      "핵심 목표는 (1) 교사의 반복적인 감상문 채점 부담을 경감하고, (2) 학생 개인별 문해력 지표(내용 이해/추론·해석/비판·평가/표현·구성/어휘·문장 사용) 성장을 시계열로 추적하며, (3) 채점 근거(원문 인용)를 함께 제시해 신뢰 가능한 자동 평가를 제공하는 것이다."
    ),
    h2("1.1 문서 목적 및 범위"),
    bullet("본 설계 문서는 시스템 구조, 서비스 프로세스, 평가 루브릭/성취기준/추천 도서 데이터 구조, LLM 상세 로직(프롬프트·검증·폴백)을 정리하여 유지보수 및 인수인계 시 참고 자료로 활용하기 위해 작성되었다."),
    bullet("API 상세 명세는 별도 문서인 「API기능정의서」, 데이터베이스 물리 설계는 「ERD 및 DB 설계서」를 참고한다."),
    h2("1.2 핵심 기능 요약"),
    dataTable(
      [
        { header: "기능 영역", width: 20 },
        { header: "설명", width: 55 },
        { header: "대상", width: 12 },
        { header: "관련 장", width: 13 }
      ],
      [
        ["로그인", "이름/학교/학년/반/번호 조합으로 학생 계정을 자동 생성·조회, 교사는 이름+공용 비밀번호로 로그인", "학생/교사", "3장"],
        ["문해력 평가", "독서 감상문을 제출하면 LLM이 5개 지표를 1~5점으로 채점하고 근거 문장을 함께 제시", "학생", "3.1, 4장"],
        ["대시보드/타임라인", "본인 제출 이력, 평균 점수, 지표별 성장 추이 차트 조회", "학생/교사", "3장"],
        ["AI 진단/추천", "누적 평가 이력을 분석해 강점/약점 지표를 진단하고 맞춤 도서·교과서 단원을 추천", "학생/교사", "3.2, 5~6장"],
        ["AI 독서토론", "특정 도서를 주제로 LLM과 1:1 대화형 독서토론 진행", "학생", "3.3장"],
        ["과제 생성/제출", "교사가 도서 기반 과제를 생성하면 학생이 답안을 제출, 동일한 LLM 평가 파이프라인 적용", "교사/학생", "3.1장"]
      ],
      { }
    ),
    tableSpacer()
  ];
}

// ---------------------------------------------------------------------------
// 2. 시스템 구조
// ---------------------------------------------------------------------------
async function buildArchitectureSection() {
  return [
    h1("2. 시스템 구조"),
    h2("2.1 전체 아키텍처"),
    p("AIRead는 WEB(정적 프론트엔드) - WAS(Express REST API) - DB(SQLite) - LLM(vLLM/Ollama 추론 서버) 4계층으로 구성된다."),
    ...(await img("architecture.png", { caption: "그림 2-1. AIRead 전체 시스템 구조도" })),
    dataTable(
      [
        { header: "계층", width: 12 },
        { header: "구성 요소", width: 22 },
        { header: "주요 파일/위치", width: 30 },
        { header: "책임", width: 36 }
      ],
      [
        ["WEB", "로그인/앱 화면(SPA)", "WEB/login.html, index.html, app.js, styles.css, config.js", "화면 렌더링, fetch() 기반 REST 호출, 클라이언트 상태 관리(세션 없음)"],
        ["WAS", "Express REST API 서버", "WAS/server.js", "라우팅, 입력 검증, 대시보드 통계 집계, 정적 파일 서빙(WEB/)"],
        ["WAS 서비스", "규칙 기반 평가", "WAS/services/evaluator.js", "휴리스틱 채점(LLM 실패 시 폴백), INDICATORS 정의"],
        ["WAS 서비스", "LLM 오케스트레이션", "WAS/services/llm/*.js", "검색(retrieval)→프롬프트→LLM 호출→검증→재시도→폴백 파이프라인"],
        ["DB", "SQLite 데이터 저장", "DB/database.js, DB/data/literacy.db", "학생/제출/평가/과제/레퍼런스/토론/AI진단 12개 테이블 관리"],
        ["LLM", "추론 서버", "infra/docker-compose.vllm.yml, docker-compose.ollama.yml", "OpenAI 호환 /v1/chat/completions API 제공(vLLM 또는 Ollama)"]
      ]
    ),
    tableSpacer(),
    h2("2.2 기술 스택"),
    dataTable(
      [
        { header: "구분", width: 20 },
        { header: "기술", width: 30 },
        { header: "비고", width: 50 }
      ],
      [
        ["런타임", "Node.js >= 22, < 24", "package.json engines 지정. better-sqlite3 네이티브 모듈 호환성 때문에 22 LTS 고정"],
        ["웹 프레임워크", "Express 4.21.2", "REST API + WEB/ 정적 파일 서빙"],
        ["DB 드라이버", "better-sqlite3 11.7.0", "동기(sync) API, 파일 기반 SQLite"],
        ["스키마 검증", "ajv 8.17.1", "LLM 응답 JSON 스키마 검증 (평가/진단/토론 3종)"],
        ["기타 서버 의존성", "cors 2.8.5, dotenv 16.6.1", "CORS 허용, .env 환경변수 로드"],
        ["프론트엔드", "Vanilla JS/HTML/CSS (프레임워크 미사용)", "WEB/app.js 단일 파일 SPA 라우팅(data-view 속성 기반)"],
        ["LLM 추론 서버", "vLLM(OpenAI 호환) 또는 Ollama(OpenAI 호환 /v1)", "모델 프리셋 전환으로 선택, 7장 참고"]
      ]
    ),
    tableSpacer(),
    h2("2.3 배포 토폴로지"),
    p("로컬 개발 환경과 Render 운영 환경은 LLM 가동 여부에서 가장 큰 차이가 있다. Render는 GPU를 지원하지 않으므로 LLM을 비활성화하고 규칙 기반 evaluator.js로만 동작한다."),
    dataTable(
      [
        { header: "항목", width: 22 },
        { header: "로컬 개발 환경", width: 39 },
        { header: "Render 운영 환경", width: 39 }
      ],
      [
        ["실행 방식", "npm start (node WAS/server.js)", "render.yaml 기준 Build: npm install / Start: npm start"],
        ["DB 경로", "DB/data/literacy.db (파일 기반, 자동 생성)", "DB_DIR=/tmp/airead-data (임시 디스크, 재배포 시 초기화됨)"],
        ["LLM 가동", "LLM_ENABLED=true (기본값), Docker Desktop(WSL2) GPU 패스스루로 vLLM/Ollama 구동", "LLM_ENABLED=false 고정 (GPU 미지원) → 항상 규칙 기반 폴백"],
        ["포트", "기본 3000, 사용 중이면 3001·3002로 자동 승격", "Render가 할당한 PORT 환경변수 사용"],
        ["헬스체크", "GET /api/health (llm.reachable로 실제 연결 확인)", "동일 경로를 Render Health Check Path로 등록"]
      ]
    ),
    tableSpacer(),
    note(
      "Render 환경에서는 TEACHER_PASSWORD를 반드시 기본값(0000)에서 변경하고, DB_DIR이 임시 디스크이므로 영구 저장이 필요하면 별도의 상용 DB 연동이 필요하다 (ERD 및 DB 설계서 참고)."
    )
  ];
}

// ---------------------------------------------------------------------------
// 3. 서비스 프로세스
// ---------------------------------------------------------------------------
async function buildProcessSection() {
  return [
    h1("3. 서비스 프로세스"),
    p("학생/교사 화면에서 발생하는 3가지 핵심 요청 처리 흐름(독후감 평가, AI 진단/추천, AI 독서토론)을 정리한다. 세 흐름 모두 동일한 LLM 파이프라인 구조(검색→프롬프트→호출→검증→재시도→폴백)를 공유한다 (7장 참고)."),
    h2("3.1 독후감 제출 · AI 평가 처리 흐름"),
    p("학생이 감상문을 제출하면 POST /api/submissions가 evaluateWithLLM()을 호출해 5개 지표 점수와 근거를 산출하고 DB에 저장한다."),
    ...(await img("flow-submission.png", { caption: "그림 3-1. 독후감 제출 · AI 평가 처리 흐름" })),
    dataTable(
      [
        { header: "단계", width: 8, alignment: AlignmentType.CENTER },
        { header: "처리 내용", width: 52 },
        { header: "관련 함수/모듈", width: 40 }
      ],
      [
        ["1", "studentId, 책 제목, 감상문(20자 이상) 입력 검증", "server.js: POST /api/submissions"],
        ["2", "학년 → 학년군 변환 후 루브릭/성취기준 컨텍스트 조회", "referenceRetriever.js: getRubricContext/getCurriculumContext"],
        ["3", "system 프롬프트(루브릭 그라운딩) + user 메시지(학생 글) 조립", "promptBuilder.js: buildEvaluationMessages"],
        ["4", "OpenAI 호환 API 호출 (guided_json, temperature 0.2)", "llmClient.js: chatCompletion"],
        ["5", "ajv 스키마 검증 + evidence 원문 포함 여부 검증", "responseSchema.js, llmLiteracyService.js: isEvidenceGrounded"],
        ["6", "검증 실패 시 최대 3회까지 오류 메시지(repairNote)를 포함해 재시도", "llmLiteracyService.js: MAX_ATTEMPTS=3"],
        ["7", "3회 모두 실패 시 규칙 기반 evaluator.js로 자동 폴백", "llmLiteracyService.js: ruleBasedFallback"],
        ["8", "평가 결과를 book_reflections + literacy_evaluations에 저장", "database.js: createSubmission"]
      ]
    ),
    tableSpacer(),
    h2("3.2 AI 진단/추천 처리 흐름"),
    p(
      "GET /api/my-ai-diagnosis는 기본적으로 DB에 저장된 최신 결과를 즉시 반환하며, forceRefresh=true일 때만 통계 재계산과 LLM 서사 생성을 수행한다."
    ),
    ...(await img("flow-diagnosis.png", { caption: "그림 3-2. AI 진단/추천 처리 흐름" })),
    dataTable(
      [
        { header: "단계", width: 8, alignment: AlignmentType.CENTER },
        { header: "처리 내용", width: 52 },
        { header: "관련 함수/모듈", width: 40 }
      ],
      [
        ["1", "forceRefresh=false이고 저장된 결과가 있으면 LLM 호출 없이 즉시 반환", "database.js: getLatestAiDiagnosis"],
        ["2", "평가 이력이 0건이면 통계·LLM 호출 없이 빈 상태 안내만 반환", "server.js: buildStudentDiagnosis"],
        ["3", "총점/지표별 최근·이전 평균과 추세(기울기)를 결정론적으로 계산", "server.js: calcSlope, average"],
        ["4", "최약점 지표 기준으로 추천 후보(교과서/도서)를 SQL로 조회", "referenceRetriever.js: getRecommendationCandidates"],
        ["5", "통계+후보 목록을 컨텍스트로 LLM에 서사(headline/overview/actionPlan)와 추천 id 생성 요청", "llmLiteracyService.js: diagnoseWithLLM"],
        ["6", "추천 id가 candidate 목록 밖이면 서버에서 강제 제거(폐쇄형 추천)", "llmLiteracyService.js: pickCandidatesByIds"],
        ["7", "3회 모두 실패 시 템플릿 기반 고정 서사로 폴백", "llmLiteracyService.js: templateFallbackNarrative"],
        ["8", "attempts > 0인 경우 결과를 ai_diagnoses 테이블에 저장(이력 누적)", "database.js: createAiDiagnosis"]
      ]
    ),
    tableSpacer(),
    h2("3.3 AI 독서토론 처리 흐름"),
    p("학생이 특정 도서를 주제로 세션을 시작하면, 최근 대화 이력을 포함해 LLM이 소크라테스식 후속 질문을 덧붙인 1~3문장 답변을 생성한다."),
    ...(await img("flow-discussion.png", { caption: "그림 3-3. AI 독서토론 처리 흐름" })),
    dataTable(
      [
        { header: "단계", width: 8, alignment: AlignmentType.CENTER },
        { header: "처리 내용", width: 52 },
        { header: "관련 함수/모듈", width: 40 }
      ],
      [
        ["1", "메시지 길이(1~1000자), 세션 소유자(studentId) 일치 여부 검증", "server.js: POST /api/discussions/:sessionId/messages"],
        ["2", "user 메시지를 저장 후 최근 20건(MAX_DISCUSSION_HISTORY) 대화 이력 조회", "database.js: addDiscussionMessage, getDiscussionMessages"],
        ["3", "책 제목/저자/학년군 기반 system 프롬프트 + 대화 이력으로 메시지 조립", "promptBuilder.js: buildDiscussionMessages"],
        ["4", "temperature 0.6로 LLM 호출, {\"reply\": string} 스키마로 응답 강제", "llmClient.js, responseSchema.js: discussionSchema"],
        ["5", "3회 모두 실패 시 고정 안내 문구로 폴백", "llmLiteracyService.js: discussionFallbackReply"],
        ["6", "assistant 메시지 저장(세션 updated_at 갱신) 후 응답 반환", "database.js: addDiscussionMessage"]
      ]
    ),
    tableSpacer()
  ];
}

module.exports = {
  buildOverviewSection,
  buildArchitectureSection,
  buildProcessSection,
  img,
  rubricData,
  curriculumData,
  booksData,
  textbooksData,
  GRADE_BAND_LABEL,
  INDICATOR_LABEL,
  INDICATOR_ORDER,
  GRADE_ORDER,
  REF_DIR,
  ASSETS,
  OUT_PATH
};
