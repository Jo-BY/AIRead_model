// OpenAI 호환 채팅 엔드포인트(vLLM/Ollama 등)를 호출하는 얇은 HTTP 클라이언트.
// LLM_MODEL 프리셋(modelPresets.js)으로 provider/모델을 선택하고, 필요 시 LLM_PROVIDER/LLM_BASE_URL/
// LLM_MODEL_NAME 개별 환경변수로 프리셋 값을 재정의할 수 있다.
const { resolvePreset } = require("./modelPresets");

const preset = resolvePreset(process.env.LLM_MODEL);
const LLM_PROVIDER = process.env.LLM_PROVIDER || preset.provider;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || preset.baseUrl).replace(/\/+$/, "");
const LLM_MODEL_NAME = process.env.LLM_MODEL_NAME || preset.modelName;
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 60000);
// vLLM 구조화 출력(guided decoding) 확장 - 표준 OpenAI API가 아니라 vLLM 전용이라 다른 provider에는 보내지 않는다.
const SUPPORTS_GUIDED_JSON = LLM_PROVIDER === "vllm";

async function chatCompletion({ messages, guidedJson, temperature = 0.2, maxTokens = 1200 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: LLM_MODEL_NAME,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        ...(guidedJson && SUPPORTS_GUIDED_JSON ? { guided_json: guidedJson } : {})
      })
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`LLM 응답 오류 (HTTP ${response.status}): ${bodyText.slice(0, 300)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("LLM 응답에서 message.content를 찾을 수 없습니다.");
    }

    return { content, usage: data.usage || null };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`LLM 호출 타임아웃 (${LLM_TIMEOUT_MS}ms)`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function checkHealth() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${LLM_BASE_URL}/models`, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { chatCompletion, checkHealth, LLM_PROVIDER, LLM_MODEL_NAME, LLM_BASE_URL };
