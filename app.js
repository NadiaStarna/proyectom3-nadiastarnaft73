import { renderChat } from "./chat.js";

const app = document.querySelector("#app");

function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    app.innerHTML = "<h1>Home</h1>";
  } else if (path === "/about") {
    app.innerHTML = "<h1>About</h1>";
  } else if (path === "/chat") {
    renderChat();
  } else {
    app.innerHTML = "<h1>404 - Página no encontrada</h1>";
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