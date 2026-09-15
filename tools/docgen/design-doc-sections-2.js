// 설계문서 4~6장: 루브릭/추천도서·교과서/성취기준 상세 레퍼런스 테이블 조립.
const { AlignmentType } = require("docx");
const { h1, h2, h3, p, bullet, note, dataTable, tableSpacer } = require("./lib/docxHelpers");
const {
  img,
  rubricData,
  curriculumData,
  booksData,
  textbooksData,
  GRADE_BAND_LABEL,
  INDICATOR_LABEL,
  INDICATOR_ORDER,
  GRADE_ORDER
} = require("./design-doc-sections-1");

function rubricTableForIndicator(indicatorKey) {
  const rows = rubricData.items
    .filter((it) => it.indicatorKey === indicatorKey)
    .sort((a, b) => GRADE_ORDER.indexOf(a.gradeBand) - GRADE_ORDER.indexOf(b.gradeBand) || a.level - b.level)
    .map((it) => [GRADE_BAND_LABEL[it.gradeBand], String(it.level), it.descriptor, it.source]);

  return dataTable(
    [
      { header: "학년군", width: 13, alignment: AlignmentType.CENTER },
      { header: "단계", width: 7, alignment: AlignmentType.CENTER },
      { header: "행동지표 설명(descriptor)", width: 55 },
      { header: "출처(source)", width: 25 }
    ],
    rows
  );
}

async function buildRubricSection() {
  const children = [
    h1("4. 평가 루브릭 구조 및 상세 레퍼런스"),
    p(
      "AIRead의 문해력 평가는 5개 지표 × 3개 학년군 × 5단계(1~5점) 행동지표로 구성된 자체 루브릭(DB/data/reference/rubric.json, 총 75건)을 기준으로 한다. 국내외 문해력 평가 프레임워크의 평가 관점을 초등 국어 맥락에 맞게 재해석해 재구성한 것으로, 원문을 그대로 번역한 것이 아니다."
    ),
    h2("4.1 루브릭 구조 개요"),
    ...(await img("rubric-structure.png", { caption: "그림 4-1. 문해력 평가 루브릭 구조 (지표 × 학년군 매트릭스)" })),
    dataTable(
      [
        { header: "참고 프레임워크", width: 30 },
        { header: "활용 관점", width: 70 }
      ],
      [
        ["OECD PISA Reading Literacy Framework (2018)", "locate/understand(내용 이해), integrate/interpret(추론/해석), reflect/evaluate(비판/평가) 3단계 읽기 처리 구조"],
        ["NAEP(NCES) Reading Framework", "locate/recall, integrate/interpret, critique/evaluate 관점을 비판/평가 지표에 반영"],
        ["CEFR Companion Volume", "단계적 숙달도 기술(can-do descriptor) 방식을 어휘/문장 사용 지표의 단계별 서술에 참고"],
        ["2022 개정 국어과 교육과정(교육부 고시 제2022-33호)", "표현/구성, 어휘/문장 사용 지표의 학년군별 성취 수준 설정에 반영, 6장 성취기준 매핑과 직결"]
      ]
    ),
    tableSpacer(),
    h2("4.2 평가 지표 정의"),
    p("evaluator.js의 INDICATORS 배열에 정의된 5개 지표와 총점 가중치는 다음과 같다. 총점 = Σ(지표 점수 × 20 × 가중치), 지표 점수는 1~5점 정수이므로 총점은 0~100점 스케일이 된다."),
    dataTable(
      [
        { header: "지표 키(key)", width: 16 },
        { header: "지표명", width: 12, alignment: AlignmentType.CENTER },
        { header: "가중치", width: 10, alignment: AlignmentType.CENTER },
        { header: "정의", width: 42 },
        { header: "참고 출처", width: 20 }
      ],
      [
        ["comprehension", "내용 이해", "0.25", "글의 핵심 내용과 줄거리를 정확히 파악하는 능력", "PISA - locate and understand"],
        ["inference", "추론/해석", "0.20", "명시되지 않은 의미를 연결해 해석하고 원인-결과를 추론하는 능력", "PISA - integrate and interpret"],
        ["criticalThinking", "비판/평가", "0.20", "인물, 사건, 가치에 대해 근거를 들어 판단하고 비교하는 능력", "NAEP - critique and evaluate"],
        ["expression", "표현/구성", "0.20", "생각을 문장과 단락으로 논리적으로 조직해 전달하는 능력", "국어과 성취기준 - 쓰기 조직"],
        ["vocabGrammar", "어휘/문장 사용", "0.15", "어휘 다양성과 문장 사용의 적절성", "국어과 성취기준 - 어휘와 문법"]
      ]
    ),
    tableSpacer(),
    h2("4.3 학년군 정의"),
    dataTable(
      [
        { header: "학년군 키", width: 20, alignment: AlignmentType.CENTER },
        { header: "학년 범위", width: 25, alignment: AlignmentType.CENTER },
        { header: "변환 기준 (toGradeBand)", width: 55 }
      ],
      [
        ["low", "초등 1~2학년", "grade <= 2"],
        ["mid", "초등 3~4학년", "grade <= 4"],
        ["high", "초등 5~6학년", "grade <= 6 (그 외 기본값)"]
      ]
    ),
    tableSpacer(),
    h2("4.4 상세 루브릭 데이터 (전체 75건)"),
    p("지표별로 학년군 × 5단계 행동지표 전문을 아래에 모두 수록한다. 출처(source) 컬럼은 rubric.json 원본 데이터를 그대로 인용한 것이다.")
  ];

  for (const key of INDICATOR_ORDER) {
    children.push(h3(`4.4.${INDICATOR_ORDER.indexOf(key) + 1} ${INDICATOR_LABEL[key]} (${key})`));
    children.push(rubricTableForIndicator(key));
    children.push(tableSpacer());
  }

  return children;
}

// ---------------------------------------------------------------------------
// 5. 추천 도서/교과서 데이터 정의 및 레퍼런스
// ---------------------------------------------------------------------------
async function buildRecommendationSection() {
  const bookRows = booksData.items.map((it) => [
    it.id,
    INDICATOR_LABEL[it.indicatorKey],
    GRADE_BAND_LABEL[it.gradeBand],
    it.title,
    it.author || "-",
    it.reason || "-"
  ]);

  const textbookRows = textbooksData.items.map((it) => [
    it.id,
    INDICATOR_LABEL[it.indicatorKey],
    GRADE_BAND_LABEL[it.gradeBand],
    it.type || "-",
    it.unit,
    (it.linkedStandardCodes || []).join(", ") || "-"
  ]);

  return [
    h1("5. 추천 도서 데이터 정의 및 레퍼런스"),
    p(
      "AI 진단/추천 기능은 학생의 최약점 지표를 판별한 뒤, 해당 지표·학년군에 매핑된 추천 후보(도서/교과서 단원)만을 LLM에게 제시하고 그 안에서만 선택하도록 강제하는 폐쇄형(closed-set) 추천 방식을 사용한다."
    ),
    h2("5.1 추천 데이터 흐름 및 구조"),
    ...(await img("recommendation-data.png", { caption: "그림 5-1. 추천 도서 · 교과서 데이터 흐름" })),
    h2("5.2 recommended_books 스키마 정의"),
    dataTable(
      [
        { header: "필드", width: 22 },
        { header: "타입", width: 15, alignment: AlignmentType.CENTER },
        { header: "설명", width: 63 }
      ],
      [
        ["id", "TEXT (PK)", "예: book-comprehension-mid-1 형식의 고유 식별자, LLM 추천 시 유일하게 참조되는 값"],
        ["indicator_key", "TEXT", "매핑된 평가 지표 키 (comprehension/inference/criticalThinking/expression/vocabGrammar)"],
        ["grade_band", "TEXT", "대상 학년군 (low/mid/high)"],
        ["title", "TEXT", "도서 제목 (실존 출판물 기준)"],
        ["author", "TEXT (nullable)", "저자"],
        ["reason", "TEXT (nullable)", "해당 지표 보완에 적합한 이유 (편집 큐레이션)"],
        ["source", "TEXT (nullable)", "선정 근거 출처 설명 (예: 국립어린이청소년도서관 사서추천도서 등)"]
      ]
    ),
    tableSpacer(),
    note(
      "recommended_books.json _meta 주석: title/author는 실존 출판물 기준으로 작성되었으나, gradeBand·지표 매핑과 reason은 편집 큐레이션이며 특정 회차의 공식 추천 목록을 그대로 인용한 것은 아니다. 배포 전 최신 목록과 절판 여부 재확인이 필요하다."
    ),
    h2("5.3 recommended_books 전체 목록 (30건)"),
    dataTable(
      [
        { header: "id", width: 20 },
        { header: "지표", width: 12, alignment: AlignmentType.CENTER },
        { header: "학년군", width: 12, alignment: AlignmentType.CENTER },
        { header: "제목", width: 16 },
        { header: "저자", width: 14 },
        { header: "추천 사유", width: 26 }
      ],
      bookRows
    ),
    tableSpacer(),
    h2("5.4 recommended_textbooks 스키마 정의"),
    dataTable(
      [
        { header: "필드", width: 22 },
        { header: "타입", width: 15, alignment: AlignmentType.CENTER },
        { header: "설명", width: 63 }
      ],
      [
        ["id", "TEXT (PK)", "예: tb-comprehension-mid-1 형식의 고유 식별자"],
        ["indicator_key", "TEXT", "매핑된 평가 지표 키"],
        ["grade_band", "TEXT", "대상 학년군 (low/mid/high)"],
        ["type", "TEXT (nullable)", "교과서 / 국어활동 구분"],
        ["subject", "TEXT (nullable)", "교과명 (현재 전량 국어)"],
        ["unit", "TEXT", "단원명 (통상적인 초등 국어 교과서 구성 방식 참고, 학교별 채택본과 다를 수 있음)"],
        ["linked_standard_codes_json", "TEXT (JSON 배열)", "연계된 성취기준 코드 목록, 6장 curriculum_standards와 연결"],
        ["verified", "INTEGER(0/1)", "실제 채택 교과서 단원명 대조 검증 여부, 현재 전량 미검증(false)"]
      ]
    ),
    tableSpacer(),
    note(
      "recommended_textbooks.json _meta 주석: 실제 교과서 본문은 저작권 보호 대상이므로 포함하지 않고 단원명 메타데이터만 구성했다. 검정 교과서 체계상 발행사는 학교별 채택에 따라 상이하여 특정 출판사를 지정하지 않았으며, 학교 현장 배포 전 담당 교사가 실제 채택 교과서 단원명으로 교체 확인해야 한다."
    ),
    h2("5.5 recommended_textbooks 전체 목록 (30건)"),
    dataTable(
      [
        { header: "id", width: 18 },
        { header: "지표", width: 13, alignment: AlignmentType.CENTER },
        { header: "학년군", width: 11, alignment: AlignmentType.CENTER },
        { header: "유형", width: 10, alignment: AlignmentType.CENTER },
        { header: "단원명", width: 28 },
        { header: "연계 성취기준", width: 20 }
      ],
      textbookRows
    ),
    tableSpacer()
  ];
}

// ---------------------------------------------------------------------------
// 6. 성취기준 매핑 구조 및 상세 레퍼런스
// ---------------------------------------------------------------------------
async function buildCurriculumSection() {
  const rows = curriculumData.items.map((it) => [
    it.code,
    GRADE_BAND_LABEL[it.gradeBand],
    it.domain,
    it.description,
    it.indicatorKeys.map((k) => INDICATOR_LABEL[k] || k).join(", "),
    it.verified ? "검증됨" : "초안"
  ]);

  return [
    h1("6. 성취기준 매핑 구조 및 상세 레퍼런스"),
    p(
      "2022 개정 국어과 교육과정(교육부 고시 제2022-33호)의 성취기준을 학년군·영역(도메인) 기준으로 정리하고, 각 성취기준을 문해력 평가지표(indicatorKeys)에 매핑한 데이터이다 (DB/data/reference/curriculum_standards.json, 총 30건)."
    ),
    h2("6.1 매핑 구조"),
    ...(await img("curriculum-mapping.png", { caption: "그림 6-1. 성취기준 매핑 구조" })),
    h2("6.2 curriculum_standards 스키마 정의"),
    dataTable(
      [
        { header: "필드", width: 22 },
        { header: "타입", width: 15, alignment: AlignmentType.CENTER },
        { header: "설명", width: 63 }
      ],
      [
        ["id", "TEXT (PK)", "예: std-comprehension-mid-1"],
        ["code", "TEXT", "성취기준 코드, 형식 [학년군 코드+영역 코드+일련번호] 예: [4국02-02]"],
        ["grade_band", "TEXT", "학년군 (low=1~2학년군 코드 접두 2, mid=3~4학년군 코드 접두 4, high=5~6학년군 코드 접두 6)"],
        ["domain", "TEXT", "영역(도메인): 듣기·말하기/읽기/쓰기/문법/문학 (domainCodeMap 01~05)"],
        ["description", "TEXT", "성취기준 원문 설명"],
        ["indicator_keys_json", "TEXT (JSON 배열)", "매핑된 문해력 평가지표 키 목록"],
        ["verified", "INTEGER(0/1)", "국가교육과정정보센터(NCIC) 원문 대조 검증 여부"],
        ["source", "TEXT", "출처 설명"]
      ]
    ),
    tableSpacer(),
    note(
      "curriculum_standards.json IMPORTANT_VERIFICATION_NOTE: 이 파일의 code/description은 실제 고시문을 실시간 대조하지 못한 상태로 작성된 초안이다(전 30건 verified=false). 운영 반영 전 반드시 국가교육과정정보센터(https://ncic.re.kr) 원문 고시문서와 대조하여 verified=true로 갱신해야 한다."
    ),
    h2("6.3 성취기준 전체 목록 (30건)"),
    dataTable(
      [
        { header: "코드", width: 12, alignment: AlignmentType.CENTER },
        { header: "학년군", width: 10, alignment: AlignmentType.CENTER },
        { header: "영역", width: 10, alignment: AlignmentType.CENTER },
        { header: "설명", width: 40 },
        { header: "매핑 지표", width: 16 },
        { header: "검증", width: 12, alignment: AlignmentType.CENTER }
      ],
      rows
    ),
    tableSpacer()
  ];
}

module.exports = { buildRubricSection, buildRecommendationSection, buildCurriculumSection };
