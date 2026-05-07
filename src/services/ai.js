export async function fetchAIResponse(currentCharacter, cleanMessages) {
  const safeMessages = cleanMessages
    .filter((m) => !m.loading && m.content?.trim())
    .map((m) => ({
      role: m.role,
      content: m.content.trim()
    }));

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: safeMessages,
      systemPrompt: currentCharacter.systemPrompt
    })
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Error del backend:", err);
    throw new Error(err.error || "Error del servidor");
  }

  const data = await res.json();

  if (!data.reply) {
    console.error("Respuesta sin reply:", data);
    throw new Error("Sin respuesta");
  }

  return data;
}