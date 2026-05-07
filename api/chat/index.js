export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { messages, systemPrompt } = req.body;

  if (!Array.isArray(messages) || messages.length === 0 || !systemPrompt) {
    return res.status(400).json({
      error: "Faltan datos",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API key no configurada",
    });
  }

  // 🔥 modelo más estable
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const formattedMessages = messages
    .filter((m) => m?.content)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: formattedMessages,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "Error en la API de Gemini",
        debug: data,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Respuesta vacía de Gemini:", data);

      return res.status(500).json({
        error: "Gemini no devolvió texto",
        debug: data,
      });
    }

    return res.status(200).json({
      reply,
    });

  } catch (error) {
    console.error("Error conexión Gemini:", error);

    return res.status(500).json({
      error: "Error al conectar con Gemini",
    });
  }
}