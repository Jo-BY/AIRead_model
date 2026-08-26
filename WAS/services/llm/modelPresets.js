// 지원 LLM 모델 프리셋 목록. LLM_MODEL 환경변수로 선택하며(기본값 DEFAULT_PRESET_KEY),
// 필요 시 LLM_PROVIDER/LLM_BASE_URL/LLM_MODEL_NAME 개별 환경변수로 프리셋 값을 재정의할 수 있다.
const MODEL_PRESETS = {
  "qwen2.5-7b": {
    label: "Qwen2.5-7B-Instruct-AWQ (vLLM)",
    provider: "vllm",
    baseUrl: "http://localhost:8000/v1",
    modelName: "airead-literacy"
  },
  "gemma3-12b": {
    label: "Gemma 3 12B (Ollama)",
    provider: "ollama",
    baseUrl: "http://localhost:11434/v1",
    modelName: "gemma3:12b"
  }
};

const DEFAULT_PRESET_KEY = "qwen2.5-7b";

function resolvePreset(presetKey) {
  if (!presetKey) {
    return { key: DEFAULT_PRESET_KEY, ...MODEL_PRESETS[DEFAULT_PRESET_KEY] };
  }

  const preset = MODEL_PRESETS[presetKey];
  if (!preset) {
    const validKeys = Object.keys(MODEL_PRESETS).join(", ");
    console.warn(`[llm] 알 수 없는 LLM_MODEL 값 "${presetKey}" (사용 가능: ${validKeys}). 기본값 "${DEFAULT_PRESET_KEY}"로 대체합니다.`);
    return { key: DEFAULT_PRESET_KEY, ...MODEL_PRESETS[DEFAULT_PRESET_KEY] };
  }

  return { key: presetKey, ...preset };
}

module.exports = { MODEL_PRESETS, DEFAULT_PRESET_KEY, resolvePreset };
