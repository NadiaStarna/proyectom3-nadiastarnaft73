import { renderChat } from "./chat.js";

import { renderHome } from "./views/home.js";
import { renderAbout } from "./views/about.js";

const app = document.querySelector("#app");

function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    renderHome(app);

  } else if (path === "/chat") {
    renderChat();

  } else if (path === "/about") {
    renderAbout(app);

  } else {
    app.innerHTML = `
      <h2 style="text-align:center; margin-top:2rem;">
        404 — Página no encontrada
      </h2>
    `;
  }
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");

  if (link) {
    e.preventDefault();

    history.pushState({}, "", link.href);

    router();
  }
});

window.addEventListener("popstate", router);

router();