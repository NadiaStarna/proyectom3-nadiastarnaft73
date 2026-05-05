import { formatMessage, buildPrompt, isValidMessage, getCharacterByKey } from "./utils.js";

const characters = {
  hermione: {
    name: "Hermione Granger",
    emoji: "🧙‍♀️",
    systemPrompt: `Sos Hermione Granger de Harry Potter. Respondés de forma inteligente, 
    precisa y un poco condescendiente. Citás libros y reglas. Corregís errores de los demás. 
    Tus respuestas son cortas, como en un chat.`
  },
  dobby: {
    name: "Dobby",
    emoji: "🧦",
    systemPrompt: `Sos Dobby, el elfo doméstico de Harry Potter. Siempre hablás en tercera 
    persona ("Dobby cree que...", "Dobby está feliz de..."). Sos muy dramático y leal. 
    Tus respuestas son cortas, como en un chat.`
  },
  homero: {
    name: "Homero Simpson",
    emoji: "🍩",
    systemPrompt: `Sos Homero Simpson. Sos torpe, gracioso y pensás en comida todo el tiempo, 
    especialmente donas y cerveza. Decís "Mmm..." seguido de algo rico. Usás frases como 
    "D'oh!" cuando te equivocás. Tus respuestas son cortas, como en un chat.`
  },
  lisa: {
    name: "Lisa Simpson",
    emoji: "🎷",
    systemPrompt: `Sos Lisa Simpson. Sos inteligente, reflexiva y comprometida con causas sociales. 
    Tocás saxofón y luchás por la justicia. Tenés una opinión fundamentada sobre todo. 
    Tus respuestas son cortas, como en un chat.`
  }
};

let currentCharacter = characters.hermione;
let messages = [];
let isLoading = false;

export function renderChat(charKey) {
  if (charKey && getCharacterByKey(characters, charKey)) {
    currentCharacter = characters[charKey];
    messages = [];
  }

  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="chat-container">
      <h2>${currentCharacter.emoji} Chateando con ${currentCharacter.name}</h2>

      <div id="character-selector">
        ${Object.entries(characters).map(([key, char]) => `
          <button data-c="${key}" class="${characters[key] === currentCharacter ? 'active' : ''}">
            ${char.emoji} ${char.name.split(" ")[0]}
          </button>
        `).join("")}
      </div>

      <div id="chat-box"></div>

      <div class="input-area">
        <input id="input" placeholder="Escribí tu mensaje..." autocomplete="off" />
        <button id="send">Enviar</button>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-c]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCharacter = characters[btn.dataset.c];
      messages = [];
      renderChat();
    });
  });

  document.querySelector("#send").addEventListener("click", handleSend);

  document.querySelector("#input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  renderMessages();
}

function renderMessages() {
  const box = document.querySelector("#chat-box");
  if (!box) return;

  box.innerHTML = "";

  messages.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("message", m.role === "user" ? "user" : "bot");
    div.textContent = m.content;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

function handleSend() {
  const input = document.querySelector("#input");
  if (!input || !isValidMessage(input.value) || isLoading) return;

  messages.push(formatMessage("user", input.value.trim()));
  input.value = "";
  renderMessages();
  simulateResponse();
}

async function realFetch(cleanMessages) {
  const prompt = buildPrompt(currentCharacter.systemPrompt, cleanMessages);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: cleanMessages,
      systemPrompt: currentCharacter.systemPrompt,
      prompt
    })
  });
  return await res.json();
}

async function simulateResponse() {
  isLoading = true;

  const sendBtn = document.querySelector("#send");
  const inputEl = document.querySelector("#input");
  if (sendBtn) sendBtn.disabled = true;
  if (inputEl) inputEl.disabled = true;

  messages.push(formatMessage("model", "Escribiendo...", true));
  renderMessages();

  try {
    const clean = messages.filter(m => !m.loading);
    const data = await realFetch(clean);

    messages.pop();
    messages.push(formatMessage("model", data.reply || "No pude responder 😢"));

  } catch (err) {
    messages.pop();
    messages.push(formatMessage("model", "Error al conectar 😢"));
  }

  isLoading = false;
  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) inputEl.disabled = false;
  renderMessages();
}