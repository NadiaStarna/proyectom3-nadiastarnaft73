import { buildPrompt } from "../utils.js";

export async function fetchAIResponse(
  currentCharacter,
  cleanMessages
) {
  const prompt = buildPrompt(
    currentCharacter.systemPrompt,
    cleanMessages
  );

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: cleanMessages,
      systemPrompt: currentCharacter.systemPrompt
    })
  });

  const data = await res.json();

  return data;
}