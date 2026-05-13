const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId = null;
let currentTheme = null;

const themes = {
  "theme-hermione": {
    symbols: ["✦", "✧", "⋆", "★", "✨"],
    color: "rgba(155, 44, 74,",
    count: 40
  },
  "theme-dobby": {
    symbols: ["✦", "◆", "⬟", "✧", "⋆"],
    color: "rgba(45, 122, 79,",
    count: 35
  },
  "theme-homero": {
    symbols: ["🍩", "⭐", "✦", "◉", "●"],
    color: "rgba(212, 147, 10,",
    count: 30
  },
  "theme-lisa": {
    symbols: ["♪", "♫", "♩", "♬", "✦"],
    color: "rgba(26, 109, 181,",
    count: 35
  },
  default: {
    symbols: ["✦", "✧", "⋆", "★"],
    color: "rgba(167, 139, 250,",
    count: 30
  }
};

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle(theme) {
  const config = themes[theme] || themes.default;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    symbol: config.symbols[Math.floor(Math.random() * config.symbols.length)],
    size: Math.random() * 14 + 8,
    opacity: Math.random() * 0.4 + 0.1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: -Math.random() * 0.5 - 0.1,
    color: config.color,
    life: Math.random()
  };
}

function initParticles(theme) {
  const config = themes[theme] || themes.default;
  particles = Array.from({ length: config.count }, () => createParticle(theme));
}

function animate(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.life += 0.003;

    const opacity = Math.sin(p.life * Math.PI) * p.opacity;

    ctx.save();
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.symbol, p.x, p.y);
    ctx.restore();

    if (p.y < -20 || p.life >= 1) {
      particles[i] = createParticle(theme);
      particles[i].y = canvas.height + 20;
    }
  });

  animationId = requestAnimationFrame(() => animate(theme));
}

export function startParticles(theme) {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  currentTheme = theme || "default";
  resize();
  initParticles(currentTheme);
  animate(currentTheme);
}

export function stopParticles() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", () => {
  resize();
  if (currentTheme) initParticles(currentTheme);
});