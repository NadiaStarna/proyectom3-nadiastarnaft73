export function formatMessage(
  role,
  content,
  loading = false
) {
  return {
    role,
    content,
    loading
  };
}

export function parseGeminiResponse(data) {
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    null
  );
}

export function buildPrompt(systemPrompt, messages) {
  const history = messages
    .filter((m) => !m.loading)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  return `${systemPrompt}\n\n${history}`;
}

export function isValidMessage(content) {
  return (
    typeof content === "string" &&
    content.trim().length > 0
  );
}

export function getCharacterByKey(characters, key) {
  return characters[key] || null;
}