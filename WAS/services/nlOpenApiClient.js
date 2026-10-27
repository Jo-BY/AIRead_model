// 국립중앙도서관 '사서추천도서' Open API 클라이언트.
// 참고 문서: 사서추천도서_OPENAPI_GUIDE_v1.2 (국립중앙도서관, 2020.8).
// 문서의 "호출 URL" 항목은 비어 있어, data.go.kr 활용신청 페이지(건번호 15064371,
// https://www.data.go.kr/data/15064371/openapi.do)를 통해 실제 서비스 도메인을 확인하고,
// 인증키 없이 호출 시 문서 2.4절과 동일한 error_code=010 응답이 오는 것으로 주소를 검증했다.
// 인증키는 위 데이터셋 페이지에서 활용신청 후 발급받아 .env의 NL_OPEN_API_KEY에 설정한다.
const { XMLParser } = require("fast-xml-parser");

const DEFAULT_BASE_URL = "https://www.nl.go.kr/NL/search/openApi/saseoApi.do";
const REQUEST_TIMEOUT_MS = Number(process.env.NL_OPEN_API_TIMEOUT_MS || 10000);

// 가이드 문서 2.1.1 요청변수 drCode 설명: "11:문학, 6:인문과학, 5:사회과학, 4:자연과학".
const DR_CODE_LABELS = {
  11: "문학",
  6: "인문과학",
  5: "사회과학",
  4: "자연과학"
};

// 가이드 문서 2.4 에러 메시지 표.
const ERROR_MESSAGES = {
  "010": "국립중앙도서관 Open API 인증키 값이 누락되었습니다.",
  "011": "국립중앙도서관 Open API 인증키가 유효하지 않습니다."
};

class NlOpenApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "NlOpenApiError";
    this.code = code;
  }
}

function isConfigured() {
  return Boolean(process.env.NL_OPEN_API_KEY);
}

// recomcontents/recommokcha 등 일부 필드는 실제로 <p>...</p> 같은 하위 태그를 포함할 수 있어
// fast-xml-parser가 문자열이 아닌 중첩 객체/배열로 파싱하는 경우가 있다(샘플 XML로 확인됨).
// 어떤 형태로 오든 사람이 읽을 수 있는 평문으로 안전하게 펼쳐서 반환한다("[object Object]" 방지).
function extractText(value) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    return Object.values(value).map(extractText).filter(Boolean).join("\n");
  }
  return String(value);
}

// 응답 필드명이 문서 표와 샘플 XML 사이에서 서로 다른 경우(오탈자 포함)가 있어,
// 두 표기를 모두 시도해 값을 찾는다.
function pick(source, ...keys) {
  for (const key of keys) {
    const value = source ? source[key] : undefined;
    if (value !== undefined && value !== null && value !== "") {
      return extractText(value);
    }
  }
  return "";
}

// recomNo/ISBN처럼 숫자처럼 보이지만 손실 없이 문자열로 보존해야 하는 필드가 있어
// 자동 숫자 변환(parseTagValue)을 꺼두고 필요한 값만 직접 Number()로 변환한다.
const xmlParser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  trimValues: true,
  isArray: (tagName) => tagName === "item"
});

function mapItem(item) {
  return {
    recomNo: pick(item, "recomNo"),
    drCode: pick(item, "drCode", "drcode"),
    drCodeName: pick(item, "drCodeName", "decodeName"),
    title: pick(item, "recomtitle"),
    author: pick(item, "recomauthor"),
    publisher: pick(item, "recompublisher"),
    callNo: pick(item, "recomcallno", "rcomcallno"),
    isbn: pick(item, "recomisbn", "recome_isbn"),
    imageUrl: pick(item, "recomfilepath"),
    toc: pick(item, "recommokcha"),
    description: pick(item, "recomcontents", "recomcontens"),
    regDate: pick(item, "Regdate", "regdate"),
    controlNo: pick(item, "controlNo"),
    publishYear: pick(item, "publishYear"),
    recomYear: pick(item, "recomYear"),
    recomMonth: pick(item, "recomMonth"),
    tocImageUrl: pick(item, "mokchFilePath")
  };
}

function buildRequestUrl({ startRowNumApi, endRowNumApi, startDate, endDate, drCode }) {
  const base = process.env.NL_OPEN_API_BASE_URL || DEFAULT_BASE_URL;
  const url = new URL(base);
  url.searchParams.set("key", process.env.NL_OPEN_API_KEY || "");
  if (startRowNumApi) {
    url.searchParams.set("startRowNumApi", String(startRowNumApi));
  }
  if (endRowNumApi) {
    url.searchParams.set("endRowNumApi", String(endRowNumApi));
  }
  if (startDate) {
    url.searchParams.set("start_date", startDate);
  }
  if (endDate) {
    url.searchParams.set("end_date", endDate);
  }
  if (drCode) {
    url.searchParams.set("drCode", String(drCode));
  }
  return url;
}

async function fetchRecommendedBooks({ startRowNumApi, endRowNumApi, startDate, endDate, drCode } = {}) {
  if (!isConfigured()) {
    throw new NlOpenApiError("국립중앙도서관 Open API 인증키가 설정되지 않았습니다.", "NOT_CONFIGURED");
  }

  const url = buildRequestUrl({ startRowNumApi, endRowNumApi, startDate, endDate, drCode });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let bodyText;
  try {
    const response = await fetch(url, { signal: controller.signal });
    bodyText = await response.text();
    if (!response.ok) {
      throw new NlOpenApiError(`국립중앙도서관 API 호출 실패 (HTTP ${response.status})`, "HTTP_ERROR");
    }
  } catch (err) {
    if (err.name === "AbortError") {
      throw new NlOpenApiError(`국립중앙도서관 API 호출 타임아웃 (${REQUEST_TIMEOUT_MS}ms)`, "TIMEOUT");
    }
    if (err instanceof NlOpenApiError) {
      throw err;
    }
    throw new NlOpenApiError(`국립중앙도서관 API 호출 중 네트워크 오류: ${err.message}`, "NETWORK_ERROR");
  } finally {
    clearTimeout(timer);
  }

  let parsed;
  try {
    parsed = xmlParser.parse(bodyText);
  } catch (err) {
    throw new NlOpenApiError("국립중앙도서관 API 응답을 해석할 수 없습니다(XML 파싱 오류).", "PARSE_ERROR");
  }

  if (parsed && parsed.error) {
    const code = String(pick(parsed.error, "error_code") || "");
    const msg = pick(parsed.error, "msg") || "국립중앙도서관 API 오류가 발생했습니다.";
    throw new NlOpenApiError(ERROR_MESSAGES[code] || msg, code || "API_ERROR");
  }

  const channel = (parsed && parsed.channel) || {};
  const totalCount = Number(pick(channel, "totalCount")) || 0;
  const items = (channel.list && channel.list.item) || [];

  return {
    totalCount,
    items: items.map(mapItem)
  };
}

module.exports = { isConfigured, fetchRecommendedBooks, DR_CODE_LABELS, NlOpenApiError };
