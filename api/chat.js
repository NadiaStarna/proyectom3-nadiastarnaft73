export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, systemPrompt } = req.body;

  if (!Array.isArray(messages) || messages.length === 0 || !systemPrompt) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const formattedMessages = messages
    .filter((m) => m?.content?.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.trim() }]
    }));

  const lastRole = formattedMessages[formattedMessages.length - 1]?.role;
  if (lastRole !== "user") {
    return res.status(400).json({ error: "El último mensaje debe ser del usuario" });
  }

  const geminiBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: formattedMessages
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Error en Gemini",
        debug: data
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "Gemini no devolvió texto", debug: data });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: "Error al conectar con Gemini" });
  }
}