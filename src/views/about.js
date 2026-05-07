export function renderAbout(app) {
  app.innerHTML = `
    <div class="about-container">

      <h1>Sobre este proyecto</h1>

      <div class="about-card">
        <h2>¿Qué es esto?</h2>

        <p>
          Una aplicación web de chat interactivo desarrollada
          como proyecto del Módulo 3.

          Permite simular conversaciones con distintos personajes
          de manera dinámica.
        </p>
      </div>

      <div class="about-card">
        <h2>Los personajes</h2>

        <p>
          🧙‍♀️ <strong>Hermione Granger</strong><br>
          🧦 <strong>Dobby</strong><br>
          🍩 <strong>Homero Simpson</strong><br>
          🎷 <strong>Lisa Simpson</strong>
        </p>
      </div>

      <div class="about-card">
        <h2>Tecnologías</h2>

        <p>
          HTML, CSS y JavaScript vanilla.
          Routing SPA con History API.

          Backend con Vercel Serverless Functions.
          IA con Google Gemini API.
        </p>
      </div>

      <div class="about-card">
        <h2>Desarrollado por</h2>

        <p>
          Nadia Starna — FT73 — 2026
        </p>
      </div>
    </div>
  `;
}