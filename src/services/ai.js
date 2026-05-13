const mockResponses = {
  hermione: [
    "Eso está en el libro, capítulo 7. ¿No lo leíste?",
    "Técnicamente, la respuesta correcta es...",
    "Por favor, presta atención. Te lo explico una vez más.",
    "He memorizado todos los hechizos necesarios para esto."
  ],
  dobby: [
    "Dobby cree que eso es muy interesante, sí señor.",
    "Dobby está feliz de ayudar. Dobby siempre ayuda.",
    "Dobby no puede decir eso, Dobby no quiere castigarse.",
    "Dobby piensa que Harry Potter haría lo mismo."
  ],
  homero: [
    "Mmm... donas. ¿De qué hablábamos? D'oh!",
    "Esto me recuerda a un episodio donde comí 64 filetes.",
    "¡Mmm... cerveza! *burp* ¿Qué decías?",
    "D'oh! No entiendo nada pero igual opino."
  ],
  lisa: [
    "Desde una perspectiva sociológica, esto es fascinante.",
    "Toqué mi saxofón pensando en eso. La respuesta es obvia.",
    "Estadísticamente hablando, tenés razón en un 40%.",
    "Como activista, debo señalar que esto es un problema sistémico."
  ]
};

function getMockResponse(character) {
  const key = Object.keys(mockResponses).find(k => 
    character.name.toLowerCase().includes(k) ||
    k.includes(character.name.toLowerCase().split(" ")[0].toLowerCase())
  ) || "hermione";
  
  const responses = mockResponses[key];
  return responses[Math.floor(Math.random() * responses.length)];
}

const USE_MOCK = true; 

export async function fetchAIResponse(currentCharacter, cleanMessages) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800)); // simula delay
    return { reply: getMockResponse(currentCharacter) };
  }

  const safeMessages = cleanMessages
    .filter((m) => !m.loading && m.content?.trim())
    .map((m) => ({
      role: m.role,
      content: m.content.trim()
    }));

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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