export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { messages, systemPrompt } = req.body;

  // Mejor validación (evita falsos errores)
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

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // 🔧 FIX IMPORTANTE: evitar mensajes vacíos o undefined
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

    // 🔴 ERROR REAL DE GEMINI (lo devolvemos bien)
    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message || "Error en la API de Gemini",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔧 FIX: si no hay respuesta, mostrar error real
    if (!reply) {
      console.error("Respuesta vacía Gemini:", data);

      return res.status(500).json({
        error: "Gemini no devolvió texto",
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