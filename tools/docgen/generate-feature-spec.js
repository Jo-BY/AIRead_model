// AIRead 주요기능명세서(.xlsx) 생성 스크립트 (그림 없음, API기능정의서 참고).
// 실행: node tools/docgen/generate-feature-spec.js  → docs/AIRead_주요기능명세서.xlsx
const fs = require("fs");
const path = require("path");
const { newWorkbook, addSheet, styleHeaderRow, addDataRow, titleSheet } = require("./lib/xlsxHelpers");

const OUT_PATH = path.join(__dirname, "..", "..", "docs", "AIRead_주요기능명세서.xlsx");

// [기능ID, 기능명, 기능 설명, 사용자, 관련 API, 우선순위]
const FEATURES = [
  ["FEAT-01", "로그인 (학생/교사)", "이름/학교/학년/반/번호 조합 또는 이름+공용 비밀번호로 로그인한다.", "학생/교사", "API-03, API-04", "필수(P1)"],
  ["FEAT-02", "문해력 평가 (독후감 제출 및 AI 채점)", "독서 감상문을 제출하면 5개 지표를 1~5점으로 채점하고 근거를 함께 제공한다.", "학생", "API-05, API-06", "필수(P1)"],
  ["FEAT-03", "내 대시보드", "본인의 제출 이력과 평균 점수 등 통계를 조회한다.", "학생", "API-07", "필수(P1)"],
  ["FEAT-04", "성장 타임라인", "총점 및 지표별 점수의 시간 흐름에 따른 변화를 시각화한다.", "학생", "API-07(데이터 재사용)", "필수(P1)"],
  ["FEAT-05", "AI 진단/추천", "누적 평가 이력을 분석해 강점/약점을 진단하고 맞춤 도서·교과서를 추천한다.", "학생/교사", "API-09, API-10", "부가(P2)"],
  ["FEAT-06", "AI 독서토론", "특정 도서를 주제로 AI와 1:1 대화형 독서토론을 진행한다.", "학생", "API-15, API-16, API-17, API-18", "부가(P2)"],
  ["FEAT-07", "과제 확인 및 제출", "교사가 등록한 과제를 확인하고 답안을 제출해 평가를 받는다.", "학생", "API-13, API-14", "필수(P1)"],
  ["FEAT-08", "과제 생성", "도서 기반 과제(요약본/목표/제출기한)를 생성한다.", "교사", "API-12", "필수(P1)"],
  ["FEAT-09", "교사용 전체 학생 히스토리 대시보드", "전체 학생 제출 이력 검색/필터, 학급 비교, 학생별 상세 조회를 제공한다.", "교사", "API-11, API-08, API-09", "필수(P1)"],
  ["FEAT-10", "시스템 지원 기능", "서비스/LLM 상태 확인과 평가지표 정의 조회를 제공한다.", "시스템/운영", "API-01, API-02", "지원(P3)"]
];

// [요구사항ID, 상위기능ID, 요구사항 내용, 관련 API, 비고]
const REQUIREMENTS = [
  ["REQ-01-1", "FEAT-01", "학생은 이름/학교/학년/반/번호 5개 항목을 모두 입력해야 로그인할 수 있다.", "API-03", "필드 누락 시 400 오류"],
  ["REQ-01-2", "FEAT-01", "동일한 (학교, 학년, 반, 번호) 조합은 항상 같은 학생 계정으로 매핑되어야 한다.", "API-03", "DB UNIQUE 인덱스로 보장"],
  ["REQ-01-3", "FEAT-01", "학년은 1~6 사이의 정수만 허용한다.", "API-03", "범위 밖 값은 400 오류"],
  ["REQ-01-4", "FEAT-01", "번호(학생 출석번호)는 1 이상의 정수만 허용한다.", "API-03", "-"],
  ["REQ-01-5", "FEAT-01", "반 입력값이 숫자만 있으면 'N반' 형식으로 자동 정규화되어야 한다.", "API-03", "예: '1' 입력 시 '1반'으로 저장"],
  ["REQ-01-6", "FEAT-01", "교사는 이름과 공용 비밀번호로 로그인하며, 비밀번호 불일치 시 401을 반환해야 한다.", "API-04", "TEACHER_PASSWORD 환경변수 기준"],
  ["REQ-02-1", "FEAT-02", "감상문은 20자 이상 입력해야 하며, 미만 시 제출을 거부해야 한다.", "API-05, API-06", "400 오류"],
  ["REQ-02-2", "FEAT-02", "제출 시 책 제목(필수)/저자(선택)/감상문 본문을 함께 입력받아야 한다.", "API-06", "-"],
  ["REQ-02-3", "FEAT-02", "내용이해/추론해석/비판평가/표현구성/어휘문장 5개 지표를 1~5점 정수로 채점해야 한다.", "API-06", "-"],
  ["REQ-02-4", "FEAT-02", "총점은 지표별 가중치를 반영해 0~100점 스케일로 산출해야 한다.", "API-06", "-"],
  ["REQ-02-5", "FEAT-02", "지표별 채점 근거(학생 글 원문 인용)를 함께 제공해야 하며, 근거가 없으면 빈 문자열을 허용한다.", "API-06", "근거 지어내기 금지"],
  ["REQ-02-6", "FEAT-02", "LLM 응답이 최대 3회 재시도 후에도 검증에 실패하면 규칙 기반 평가로 자동 전환되어야 한다.", "API-06", "modelVersion=rule-based-fallback으로 구분"],
  ["REQ-02-7", "FEAT-02", "채점 확신도가 낮거나 이상 신호(주제이탈/분량부족/부적절)가 감지되면 교사 재검토 필요로 표시해야 한다.", "API-06", "needsReview 플래그"],
  ["REQ-02-8", "FEAT-02", "평가 결과는 제출 즉시 저장되어 대시보드/타임라인에 반영되어야 한다.", "API-06", "-"],
  ["REQ-03-1", "FEAT-03", "로그인한 학생 본인의 제출 이력만 최신순으로 목록 표시해야 한다.", "API-07", "-"],
  ["REQ-03-2", "FEAT-03", "각 목록 행은 본인 제출/교사 과제 제출 여부를 구분해 표시해야 한다.", "API-07", "-"],
  ["REQ-03-3", "FEAT-03", "전체 제출 건수와 평균 점수를 통계로 함께 제공해야 한다.", "API-07", "-"],
  ["REQ-03-4", "FEAT-03", "도서명/피드백 텍스트 검색과 구분(본인/교사) 필터를 지원해야 한다.", "API-07(클라이언트 처리)", "재조회 없이 클라이언트에서 필터링"],
  ["REQ-03-5", "FEAT-03", "1회 조회 건수는 최대 300건으로 제한해야 한다.", "API-07", "-"],
  ["REQ-04-1", "FEAT-04", "총점 및 지표별 점수의 제출 순서에 따른 변화를 차트로 시각화해야 한다.", "API-07(데이터 재사용)", "-"],
  ["REQ-04-2", "FEAT-04", "제출 기록이 2건 미만이면 추세(상승/정체/하락) 판단을 제공하지 않아야 한다.", "-", "AI 진단 로직과 공유되는 규칙"],
  ["REQ-04-3", "FEAT-04", "타임라인은 대시보드 검색/필터 상태와 무관하게 항상 전체 이력 기준으로 렌더링해야 한다.", "-", "-"],
  ["REQ-05-1", "FEAT-05", "누적 평가 이력이 0건이면 LLM을 호출하지 않고 빈 상태 안내만 제공해야 한다.", "API-09", "-"],
  ["REQ-05-2", "FEAT-05", "총점/지표별 평균, 추세, 최약점·최강점·가장 향상된 지표는 결정론적 계산식으로 산출해야 한다.", "API-09", "LLM이 재계산하지 않음"],
  ["REQ-05-3", "FEAT-05", "진단 서사는 계산된 통계만 근거로 작성되어야 하며 통계에 없는 사실을 추측해서는 안 된다.", "API-09", "-"],
  ["REQ-05-4", "FEAT-05", "추천 도서/교과서는 최약점 지표·학년군에 매핑된 후보 목록 안에서만 선택되어야 한다.", "API-09", "폐쇄형 추천, candidate 밖 id는 서버가 제거"],
  ["REQ-05-5", "FEAT-05", "기본 조회는 저장된 최신 결과를 즉시 반환하고, 명시적 새로고침 요청 시에만 재계산·재저장해야 한다.", "API-09", "forceRefresh 파라미터"],
  ["REQ-05-6", "FEAT-05", "과거 진단 결과 이력을 시간순으로 열람할 수 있어야 한다.", "API-10", "-"],
  ["REQ-06-1", "FEAT-06", "학생은 토론할 도서 제목(및 저자)을 입력해 새 세션을 시작할 수 있어야 한다.", "API-15", "-"],
  ["REQ-06-2", "FEAT-06", "메시지는 1~1000자 이내로 제한해야 한다.", "API-18", "초과/빈 값은 400 오류"],
  ["REQ-06-3", "FEAT-06", "응답은 1~3문장이며 후속 질문을 포함하는 대화형 톤을 유지해야 한다.", "API-18", "-"],
  ["REQ-06-4", "FEAT-06", "세션 소유자가 아닌 studentId로는 해당 세션을 조회/작성할 수 없어야 한다.", "API-17, API-18", "불일치 시 404"],
  ["REQ-06-5", "FEAT-06", "최근 20건까지의 대화 이력만 프롬프트에 포함해야 한다.", "API-18", "토큰 사용량 관리"],
  ["REQ-06-6", "FEAT-06", "과거 세션 목록을 다시 불러와 이어서 대화할 수 있어야 한다.", "API-16", "-"],
  ["REQ-07-1", "FEAT-07", "학생은 교사가 등록한 과제 목록(도서명/요약본/목표/제출기한)을 조회할 수 있어야 한다.", "API-13", "-"],
  ["REQ-07-2", "FEAT-07", "답안은 20자 이상 입력해야 하며, 제출 시 문해력 평가와 동일한 채점 파이프라인이 적용되어야 한다.", "API-14", "-"],
  ["REQ-07-3", "FEAT-07", "과제 제출 건은 본인 대시보드에서 '교사' 구분으로 표시되어야 한다.", "API-14, API-07", "-"],
  ["REQ-08-1", "FEAT-08", "교사는 책 제목/요약본/과제 목표/제출 기한을 입력해 과제를 생성할 수 있어야 한다.", "API-12", "저자는 선택 입력"],
  ["REQ-08-2", "FEAT-08", "필수 항목(책 제목/요약본/목표/제출기한) 누락 시 생성을 거부해야 한다.", "API-12", "400 오류"],
  ["REQ-09-1", "FEAT-09", "전체 학생의 제출 이력을 학년/반/학생명 기준으로 검색·필터링할 수 있어야 한다.", "API-11(클라이언트 필터)", "-"],
  ["REQ-09-2", "FEAT-09", "학급/학년별 비교 통계를 제공해야 한다.", "API-11", "-"],
  ["REQ-09-3", "FEAT-09", "개별 학생을 선택하면 도서 목록/성장 타임라인/AI 진단·추천을 탭으로 상세 조회할 수 있어야 한다.", "API-08, API-09", "-"],
  ["REQ-09-4", "FEAT-09", "학생별 평가 점수 통계 및 성장 추이를 학교명/학생명/점수 범위로 검색할 수 있어야 한다.", "API-11(클라이언트 필터)", "-"],
  ["REQ-10-1", "FEAT-10", "서비스 및 LLM 서버의 실시간 연결 상태를 확인할 수 있어야 한다.", "API-01", "운영 모니터링/헬스체크용"],
  ["REQ-10-2", "FEAT-10", "평가지표 정의(이름/가중치/설명)를 클라이언트가 조회할 수 있어야 한다.", "API-02", "-"]
];

async function main() {
  const wb = newWorkbook();

  titleSheet(wb, {
    title: "AIRead 주요기능명세서",
    subtitle: "학생 문해력 평가 서비스 - 주요 기능 목록 및 세부 요구사항",
    meta: ["버전 1.0", `작성일: ${new Date().toISOString().slice(0, 10)}`, "참고 문서: AIRead_API기능정의서.xlsx"]
  });

  const featureSheet = addSheet(wb, "주요 기능 목록", [
    { header: "기능 ID", key: "id", width: 10 },
    { header: "기능명", key: "name", width: 28 },
    { header: "기능 설명", key: "desc", width: 55 },
    { header: "사용자", key: "user", width: 12 },
    { header: "관련 API ID", key: "api", width: 26 },
    { header: "우선순위", key: "priority", width: 12 }
  ]);
  styleHeaderRow(featureSheet);
  FEATURES.forEach((row, idx) => {
    const [id, name, desc, user, api, priority] = row;
    addDataRow(featureSheet, { id, name, desc, user, api, priority }, { zebraIndex: idx });
  });
  featureSheet.getColumn("user").alignment = { vertical: "top", horizontal: "center" };
  featureSheet.getColumn("priority").alignment = { vertical: "top", horizontal: "center" };
  featureSheet.autoFilter = { from: "A1", to: "F1" };

  const reqSheet = addSheet(wb, "세부 요구사항", [
    { header: "요구사항 ID", key: "id", width: 12 },
    { header: "상위 기능 ID", key: "featId", width: 12 },
    { header: "요구사항 내용", key: "desc", width: 65 },
    { header: "관련 API ID", key: "api", width: 22 },
    { header: "비고", key: "note", width: 32 }
  ]);
  styleHeaderRow(reqSheet);
  REQUIREMENTS.forEach((row, idx) => {
    const [id, featId, desc, api, note] = row;
    addDataRow(reqSheet, { id, featId, desc, api, note }, { zebraIndex: idx });
  });
  reqSheet.getColumn("featId").alignment = { vertical: "top", horizontal: "center" };
  reqSheet.autoFilter = { from: "A1", to: "E1" };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  await wb.xlsx.writeFile(OUT_PATH);
  console.log(`OK: wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
