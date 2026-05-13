import { formatMessage, isValidMessage, getCharacterByKey } from "./utils.js";
import { fetchAIResponse } from "./services/ai.js";
import { startParticles } from "./particles.js";

const characters = {
  hermione: {
    name: "Hermione Granger",
    emoji: "🧙‍♀️",
    theme: "theme-hermione",
    systemPrompt: `Sos Hermione Granger de Harry Potter. Respondés de forma inteligente,
    precisa y un poco condescendiente. Citás libros y reglas. Corregís errores de los demás.
    Tus respuestas son cortas, como en un chat.`
  },
  dobby: {
    name: "Dobby",
    emoji: "🧦",
    theme: "theme-dobby",
    systemPrompt: `Sos Dobby, el elfo doméstico de Harry Potter. Siempre hablás en tercera
    persona ("Dobby cree que...", "Dobby está feliz de..."). Sos muy dramático y leal.
    Tus respuestas son cortas, como en un chat.`
  },
  homero: {
    name: "Homero Simpson",
    emoji: "🍩",
    theme: "theme-homero",
    systemPrompt: `Sos Homero Simpson. Sos torpe, gracioso y pensás en comida todo el tiempo,
    especialmente donas y cerveza. Decís "Mmm..." seguido de algo rico. Usás frases como
    "D'oh!" cuando te equivocás. Tus respuestas son cortas, como en un chat.`
  },
  lisa: {
    name: "Lisa Simpson",
    emoji: "🎷",
    theme: "theme-lisa",
    systemPrompt: `Sos Lisa Simpson. Sos inteligente, reflexiva y comprometida con causas sociales.
    Tocás saxofón y luchás por la justicia. Tenés una opinión fundamentada sobre todo.
    Tus respuestas son cortas, como en un chat.`
  }
};

let currentCharacter = characters.hermione;
let messages = [];
let isLoading = false;

function getCurrentCharacterKey() {
  return Object.keys(characters).find(
    (key) => characters[key] === currentCharacter
  );
}

function applyTheme() {
  const container = document.querySelector(".chat-container");
  if (!container) return;
  container.className = `chat-container ${currentCharacter.theme}`;
  document.body.className = currentCharacter.theme;
  startParticles(currentCharacter.theme);
}

function saveMessages() {
  const key = `chat_${getCurrentCharacterKey()}`;
  localStorage.setItem(key, JSON.stringify(messages));
}

function loadMessages() {
  const key = `chat_${getCurrentCharacterKey()}`;
  messages = JSON.parse(localStorage.getItem(key)) || [];
}

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✅";
    setTimeout(() => {
      btn.textContent = "📋";
    }, 1500);
  });
}

export function renderChat(charKey) {
  if (charKey && getCharacterByKey(characters, charKey)) {
    currentCharacter = characters[charKey];
    localStorage.setItem("selectedCharacter", charKey);
  }

  loadMessages();

  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="chat-container ${currentCharacter.theme}">
      <div class="chat-header">
        <h2>${currentCharacter.emoji} Chateando con ${currentCharacter.name}</h2>
        <button id="clear-chat">🗑️ Borrar historial</button>
      </div>

      <div id="character-selector">
        ${Object.entries(characters)
          .map(
            ([key, char]) => `
              <button data-c="${key}" class="${characters[key] === currentCharacter ? "active" : ""}">
                ${char.emoji} ${char.name.split(" ")[0]}
              </button>
            `
          )
          .join("")}
      </div>

      <div id="chat-box"></div>

      <div class="input-area">
        <input id="input" placeholder="Escribí tu mensaje..." autocomplete="off" />
        <button id="send">Enviar</button>
      </div>
    </div>
  `;

  applyTheme();

  document.querySelectorAll("[data-c]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.c;
      currentCharacter = characters[selected];
      localStorage.setItem("selectedCharacter", selected);
      loadMessages();
      renderChat(selected);
    });
  });

  document.querySelector("#send").addEventListener("click", handleSend);

  document.querySelector("#input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  document.querySelector("#clear-chat").addEventListener("click", () => {
    messages = [];
    const key = `chat_${getCurrentCharacterKey()}`;
    localStorage.removeItem(key);
    renderMessages();
  });

  renderMessages();
}

function renderMessages() {
  const box = document.querySelector("#chat-box");
  if (!box) return;

  box.innerHTML = "";

  messages.forEach((m) => {
    if (m.loading) {
      const div = document.createElement("div");
      div.classList.add("message", "bot", "typing-indicator");
      div.innerHTML = `<span></span><span></span><span></span>`;
      box.appendChild(div);
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", m.role === "user" ? "user-wrapper" : "bot-wrapper");

    const div = document.createElement("div");
    div.classList.add("message", m.role === "user" ? "user" : "bot");
    div.textContent = m.content;

    const meta = document.createElement("div");
    meta.classList.add("message-meta");

    const time = document.createElement("span");
    time.classList.add("timestamp");
    time.textContent = m.timestamp || getTimestamp();
    meta.appendChild(time);

    if (m.role === "assistant") {
      const copyBtn = document.createElement("button");
      copyBtn.classList.add("copy-btn");
      copyBtn.textContent = "📋";
      copyBtn.title = "Copiar respuesta";
      copyBtn.addEventListener("click", () => copyToClipboard(m.content, copyBtn));
      meta.appendChild(copyBtn);
    }

    wrapper.appendChild(div);
    wrapper.appendChild(meta);
    box.appendChild(wrapper);
  });

  box.scrollTop = box.scrollHeight;
}

function handleSend() {
  const input = document.querySelector("#input");

  if (!input || !isValidMessage(input.value) || isLoading) return;

  messages.push(formatMessage("user", input.value.trim()));
  messages[messages.length - 1].timestamp = getTimestamp();
  saveMessages();
  input.value = "";
  input.focus();
  renderMessages();
  simulateResponse();
}

async function simulateResponse() {
  isLoading = true;

  const sendBtn = document.querySelector("#send");
  const inputEl = document.querySelector("#input");

  if (sendBtn) sendBtn.disabled = true;
  if (inputEl) inputEl.disabled = true;

  messages.push(formatMessage("assistant", "Escribiendo...", true));
  renderMessages();

  try {
    const cleanMessages = messages.filter((m) => !m.loading);
    const data = await fetchAIResponse(currentCharacter, cleanMessages);

    messages.pop();

    const reply = formatMessage("assistant", data.reply || "No pude responder 😢");
    reply.timestamp = getTimestamp();
    messages.push(reply);
    saveMessages();

  } catch (error) {
    messages.pop();
    const errMsg = formatMessage("assistant", "Error al conectar 😢");
    errMsg.timestamp = getTimestamp();
    messages.push(errMsg);
  }

  isLoading = false;
  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) inputEl.disabled = false;

  renderMessages();
}