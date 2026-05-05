const characters = {
  hermione: {
    name: "Hermione",
    systemPrompt: "Sos Hermione Granger. Inteligente y lógica."
  },
  dobby: {
    name: "Dobby",
    systemPrompt: "Sos Dobby. Hablás en tercera persona."
  },
  homer: {
    name: "Homer",
    systemPrompt: "Sos Homer Simpson. Torpe y gracioso."
  },
  lisa: {
    name: "Lisa",
    systemPrompt: "Sos Lisa Simpson. Inteligente y reflexiva."
  }
};

let currentCharacter = characters.hermione;
let messages = [];
let isLoading = false;

export function renderChat() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <h2>Chat con ${currentCharacter.name}</h2>
    <div>
      <button data-c="hermione">Hermione</button>
      <button data-c="dobby">Dobby</button>
      <button data-c="homer">Homer</button>
      <button data-c="lisa">Lisa</button>
    </div>
    <div id="chat-box"></div>
    <input id="input" placeholder="Escribí..." />
    <button id="send">Enviar</button>
  `;

  document.querySelectorAll("[data-c]").forEach(btn => {
    btn.onclick = () => {
      currentCharacter = characters[btn.dataset.c];
      messages = [];
      renderChat();
    };
  });

  document.querySelector("#send").onclick = handleSend;

  document.querySelector("#input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  renderMessages();
}

function renderMessages() {
  const box = document.querySelector("#chat-box");
  box.innerHTML = "";

  messages.forEach(m => {
    const div = document.createElement("div");
    div.textContent = m.content;
    box.appendChild(div);
  });
}

function handleSend() {
  const input = document.querySelector("#input");
  if (!input.value.trim() || isLoading) return;

  messages.push({ role: "user", content: input.value.trim() });
  input.value = "";
  renderMessages();
  simulateResponse();
}

async function realFetch(cleanMessages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: cleanMessages,
      systemPrompt: currentCharacter.systemPrompt
    })
  });
  return await res.json();
}

async function simulateResponse() {
  isLoading = true;

  const sendBtn = document.querySelector("#send");
  const inputEl = document.querySelector("#input");
  sendBtn.disabled = true;
  inputEl.disabled = true;

  messages.push({ role: "model", content: "Escribiendo...", loading: true });
  renderMessages();

  try {
    const clean = messages.filter(m => !m.loading);
    const data = await realFetch(clean);

    messages.pop();
    messages.push({
      role: "model",
      content: data.reply || "No pude responder 😢"
    });

  } catch (err) {
    messages.pop();
    messages.push({ role: "model", content: "Error al conectar 😢" });
  }

  isLoading = false;
  sendBtn.disabled = false;
  inputEl.disabled = false;
  renderMessages();
}