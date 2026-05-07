export function formatMessage(role, content, loading = false) {
  return { role, content, loading };
}

export function isValidMessage(content) {
  return typeof content === "string" && content.trim().length > 0;
}

export function getCharacterByKey(characters, key) {
  return characters[key] || null;
}