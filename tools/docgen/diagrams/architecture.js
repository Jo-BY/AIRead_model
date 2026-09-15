// 전체 시스템 구조도 (WEB-WAS-DB-LLM 4계층 + 배포 토폴로지)
function buildArchitectureDiagram() {
  const width = 900;
  const height = 860;

  const groups = [
    { x: 40, y: 90, w: 820, h: 96, title: "클라이언트 (브라우저)" },
    { x: 40, y: 200, w: 820, h: 90, title: "WEB 계층 - 정적 프론트엔드 (Express static 미들웨어)" },
    { x: 40, y: 304, w: 820, h: 232, title: "WAS 계층 - Node.js / Express (WAS/server.js)" },
    { x: 40, y: 556, w: 820, h: 132, title: "데이터 · 추론 계층" }
  ];

  const nodes = [
    {
      id: "student",
      x: 90,
      y: 116,
      w: 330,
      h: 60,
      color: "web",
      title: "학생 브라우저",
      lines: ["로그인 · 감상문 제출", "대시보드/타임라인/AI기능 조회"]
    },
    {
      id: "teacher",
      x: 480,
      y: 116,
      w: 330,
      h: 60,
      color: "web",
      title: "교사 브라우저",
      lines: ["학급 현황 조회", "과제 생성 · 채점 확인"]
    },
    {
      id: "webstatic",
      x: 90,
      y: 226,
      w: 720,
      h: 52,
      color: "web",
      title: "WEB/ 정적 자원",
      lines: ["login.html · index.html · app.js(SPA 라우팅) · styles.css · config.js"]
    },
    {
      id: "was",
      x: 90,
      y: 330,
      w: 720,
      h: 58,
      color: "was",
      title: "REST API 라우팅 계층 (server.js)",
      lines: ["인증(간이) · 입력 검증 · 대시보드 집계 · 세션 없는 stateless 처리"]
    },
    {
      id: "evaluator",
      x: 90,
      y: 410,
      w: 340,
      h: 100,
      color: "neutral",
      title: "evaluator.js",
      lines: ["규칙 기반 휴리스틱 평가", "LLM 실패(3회) 시 자동 폴백", "INDICATORS 가중치 정의"]
    },
    {
      id: "llmservices",
      x: 470,
      y: 410,
      w: 340,
      h: 100,
      color: "accent",
      title: "services/llm/* (LLM 파이프라인)",
      lines: ["retrieval → prompt → 호출 → 검증", "referenceRetriever/promptBuilder", "llmClient/responseSchema"]
    },
    {
      id: "db",
      x: 90,
      y: 586,
      w: 340,
      h: 82,
      color: "db",
      title: "DB - SQLite (better-sqlite3)",
      lines: ["DB/data/literacy.db (파일 기반)", "DB/database.js: 11개 테이블 · 동기 API"]
    },
    {
      id: "llmserver",
      x: 470,
      y: 586,
      w: 340,
      h: 82,
      color: "llm",
      title: "LLM 추론 서버",
      lines: ["vLLM: Qwen2.5-7B-Instruct-AWQ", "Ollama: Gemma3 12B · OpenAI 호환 API"]
    },
    {
      id: "deploynote",
      kind: "note",
      x: 60,
      y: 706,
      w: 560,
      h: 110,
      title: "배포 토폴로지",
      lines: [
        "로컬 개발: Docker Desktop(WSL2) GPU 패스스루 +",
        "infra/docker-compose.vllm.yml · docker-compose.ollama.yml",
        "Render(운영, render.yaml): GPU 미지원 → LLM_ENABLED=false",
        "고정, evaluator.js 규칙 기반으로만 동작"
      ]
    }
  ];

  const edges = [
    { from: "student", to: "webstatic", fromSide: "bottom", toSide: "top", color: "gray" },
    { from: "teacher", to: "webstatic", fromSide: "bottom", toSide: "top", color: "gray" },
    { from: "webstatic", to: "was", fromSide: "bottom", toSide: "top", color: "blue", label: "fetch() JSON (REST API)" },
    { from: "was", to: "evaluator", fromSide: "bottomLeft", toSide: "top", color: "default", label: "규칙기반 호출" },
    { from: "was", to: "llmservices", fromSide: "bottomRight", toSide: "top", color: "purple", label: "evaluateWithLLM/diagnoseWithLLM" },
    { from: "evaluator", to: "db", fromSide: "bottom", toSide: "top", color: "green", label: "평가 결과 저장 · 조회" },
    { from: "llmservices", to: "llmserver", fromSide: "bottom", toSide: "top", color: "orange", label: "OpenAI 호환 API (guided_json)" },
    {
      from: "llmservices",
      to: "db",
      fromSide: "left",
      toSide: "right",
      color: "green",
      points: [
        [440, 460],
        [440, 627]
      ],
      label: ["레퍼런스 조회", "(rubric/성취기준/추천후보)"],
      labelPoint: [446, 543]
    }
  ];

  return {
    width,
    height,
    title: "AIRead 전체 시스템 구조도",
    subtitle: "WEB - WAS - DB - LLM 4계층 아키텍처",
    groups,
    nodes,
    edges,
    legendTitle: "범례",
    legendItems: [
      { color: "web", label: "프론트엔드 / 클라이언트" },
      { color: "was", label: "애플리케이션 서버 (Express)" },
      { color: "accent", label: "LLM 오케스트레이션 서비스" },
      { color: "db", label: "데이터 저장소 (SQLite)" },
      { color: "llm", label: "LLM 추론 서버 (vLLM/Ollama)" }
    ],
    legendX: 650,
    legendY: 726
  };
}

module.exports = { buildArchitectureDiagram };
