import { renderChat } from "../chat.js";

export function renderHome(app) {
  app.innerHTML = `
    <div class="home-container">
      <h1>Chateá con tu personaje favorito</h1>

      <p>
        Elegí un personaje y empezá una conversación.
        Cada uno tiene su propia personalidad.
      </p>

      <div class="character-grid">

        <div class="character-card" data-char="hermione">
          <div class="emoji">🧙‍♀️</div>
          <h3>Hermione</h3>
          <p>Inteligente y lógica</p>
        </div>

        <div class="character-card" data-char="dobby">
          <div class="emoji">🧦</div>
          <h3>Dobby</h3>
          <p>Habla en tercera persona</p>
        </div>

        <div class="character-card" data-char="homero">
          <div class="emoji">🍩</div>
          <h3>Homero</h3>
          <p>Torpe y gracioso</p>
        </div>

        <div class="character-card" data-char="lisa">
          <div class="emoji">🎷</div>
          <h3>Lisa</h3>
          <p>Inteligente y reflexiva</p>
        </div>

      </div>

      <button class="btn-primary" id="btn-ir-chat">
        Ir al chat →
      </button>
    </div>
  `;

  document.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", () => {
      history.pushState({}, "", "/chat");

      renderChat(card.dataset.char);
    });
  });

  document
    .querySelector("#btn-ir-chat")
    .addEventListener("click", () => {
      history.pushState({}, "", "/chat");

      renderChat();
    });
}