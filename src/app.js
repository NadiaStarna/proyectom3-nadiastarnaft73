import { renderChat } from "./chat.js";

const app = document.querySelector("#app");

function renderHome() {
  app.innerHTML = `
    <div class="home-container">
      <h1>Chateá con tu personaje favorito</h1>
      <p>Elegí un personaje y empezá una conversación. Cada uno tiene su propia personalidad.</p>

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
        <div class="character-card" data-char="homer">
          <div class="emoji">🍩</div>
          <h3>Homer</h3>
          <p>Torpe y gracioso</p>
        </div>
        <div class="character-card" data-char="lisa">
          <div class="emoji">🎷</div>
          <h3>Lisa</h3>
          <p>Inteligente y reflexiva</p>
        </div>
      </div>

      <a href="/chat" data-link>
        <button class="btn-primary">Ir al chat →</button>
      </a>
    </div>
  `;

  document.querySelectorAll(".character-card").forEach(card => {
    card.addEventListener("click", () => {
      history.pushState({}, "", "/chat");
      renderChat(card.dataset.char);
    });
  });
}

function renderAbout() {
  app.innerHTML = `
    <div class="about-container">
      <h1>Sobre este proyecto</h1>

      <div class="about-card">
        <h2>¿Qué es esto?</h2>
        <p>
          Una Single Page Application donde podés chatear con personajes ficticios
          usando inteligencia artificial. Desarrollada como Proyecto Integrador para
          la carrera de desarrollo frontend.
        </p>
      </div>

      <div class="about-card">
        <h2>Los personajes</h2>
        <p>
          🧙‍♀️ <strong>Hermione Granger</strong> — De Harry Potter. Lógica, precisa y siempre con la respuesta correcta.<br><br>
          🧦 <strong>Dobby</strong> — El elfo doméstico más famoso. Habla en tercera persona y es muy dramático.<br><br>
          🍩 <strong>Homer Simpson</strong> — Torpe, hambriento y con una lógica única. Siempre menciona la cerveza y las donas.<br><br>
          🎷 <strong>Lisa Simpson</strong> — Inteligente, reflexiva y con una opinión sobre todo.
        </p>
      </div>

      <div class="about-card">
        <h2>Tecnologías</h2>
        <p>
          HTML, CSS y JavaScript vanilla. Routing SPA con History API.
          Backend con Vercel Serverless Functions. IA con Google Gemini API.
        </p>
      </div>

      <div class="about-card">
        <h2>Desarrollado por</h2>
        <p>Nadia Starna — FT73 — 2025</p>
      </div>
    </div>
  `;
}

function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    renderHome();
  } else if (path === "/chat") {
    renderChat();
  } else if (path === "/about") {
    renderAbout();
  } else {
    app.innerHTML = `<h2 style="text-align:center; margin-top:2rem;">404 — Página no encontrada</h2>`;
  }
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    history.pushState({}, "", e.target.href);
    router();
  }
});

window.addEventListener("popstate", router);

router();