export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" });
  }

  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !systemPrompt) {
      return res.status(400).json({ reply: "Faltan datos en el body" });
    }

    const prompt = `
${systemPrompt}

${messages.map(m => `${m.role}: ${m.content}`).join("\n")}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("GEMINI RAW:", data);

    if (data.error) {
      console.error("GEMINI ERROR:", data.error);
      return res.status(502).json({ reply: `Error de Gemini: ${data.error.message}` });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json({ reply: reply || "No pude responder 😢" });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Error en el servidor 😢" });
  }
}