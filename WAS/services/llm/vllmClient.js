// vLLM OpenAI 호환 서버(/v1/chat/completions)를 호출하는 얇은 HTTP 클라이언트.
const LLM_BASE_URL = (process.env.LLM_BASE_URL || "http://localhost:8000/v1").replace(/\/+$/, "");
const LLM_MODEL_NAME = process.env.LLM_MODEL_NAME || "airead-literacy";
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 60000);

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
        // vLLM 구조화 출력(guided decoding) 확장 - 표준 OpenAI API에는 없는 vLLM 전용 필드.
        ...(guidedJson ? { guided_json: guidedJson } : {})
      })
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`vLLM 응답 오류 (HTTP ${response.status}): ${bodyText.slice(0, 300)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("vLLM 응답에서 message.content를 찾을 수 없습니다.");
    }

    return { content, usage: data.usage || null };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`vLLM 호출 타임아웃 (${LLM_TIMEOUT_MS}ms)`);
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

module.exports = { chatCompletion, checkHealth, LLM_MODEL_NAME, LLM_BASE_URL };
