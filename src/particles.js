const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId = null;
let currentTheme = null;

const themes = {
  "theme-hermione": {
    symbols: ["✦", "✧", "⋆", "★"],
    colors: [
      "255, 100, 130",
      "220, 80, 110",
      "255, 180, 200",
      "200, 60, 90"
    ],
    count: 35,
    minSize: 18,
    maxSize: 42,
    glow: "255, 100, 130",
    speedMult: 1
  },

  "theme-dobby": {
    symbols: ["✦", "❋", "◆", "✧"],
    colors: [
      "80, 200, 120",
      "50, 180, 90",
      "120, 220, 150",
      "40, 150, 80"
    ],
    count: 35,
    minSize: 18,
    maxSize: 42,
    glow: "80, 200, 120",
    speedMult: 0.6
  },

  "theme-homero": {
    symbols: ["★", "✦", "✧", "◉"],
    colors: [
      "255, 200, 50",
      "240, 170, 20",
      "255, 220, 80",
      "210, 140, 10"
    ],
    count: 30,
    minSize: 20,
    maxSize: 48,
    glow: "255, 200, 50",
    speedMult: 0.8
  },

  "theme-lisa": {
    symbols: ["♪", "♫", "✦", "⋆"],
    colors: [
      "80, 160, 255",
      "50, 130, 220",
      "120, 190, 255",
      "40, 110, 200"
    ],
    count: 35,
    minSize: 18,
    maxSize: 44,
    glow: "80, 160, 255",
    speedMult: 0.5
  },

  default: {
    symbols: ["✦", "✧", "⋆", "★"],
    colors: [
      "167, 139, 250",
      "140, 100, 230",
      "190, 160, 255"
    ],
    count: 30,
    minSize: 18,
    maxSize: 40,
    glow: "167, 139, 250",
    speedMult: 0.5
  }
};

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle(theme) {
  const config = themes[theme] || themes.default;

  const color =
    config.colors[Math.floor(Math.random() * config.colors.length)];

  return {
    x: Math.random() * canvas.width,

    y: Math.random() * canvas.height,

    symbol:
      config.symbols[
        Math.floor(Math.random() * config.symbols.length)
      ],

    size:
      Math.random() *
        (config.maxSize - config.minSize) +
      config.minSize,

    opacity: Math.random() * 0.25 + 0.35,

    speedX:
      (Math.random() - 0.5) *
      0.5 *
      (config.speedMult || 1),

    speedY:
      -(Math.random() * 0.7 + 0.3) *
      (config.speedMult || 1),

    color,

    glow: config.glow,

    rotation: Math.random() * Math.PI * 2,

    rotationSpeed:
      (Math.random() - 0.5) * 0.01
  };
}

function initParticles(theme) {
  const config = themes[theme] || themes.default;

  particles = Array.from(
    { length: config.count },
    () => createParticle(theme)
  );
}

function animate(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;

    p.rotation += p.rotationSpeed;

    ctx.save();

    ctx.translate(p.x, p.y);

    ctx.rotate(p.rotation);

    ctx.globalAlpha = p.opacity;

    ctx.shadowColor = `rgba(${p.glow}, 0.25)`;

    ctx.shadowBlur = 8;

    ctx.font = `${p.size}px sans-serif`;

    ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(p.symbol, 0, 0);

    ctx.restore();

    if (p.y < -50) {
      particles[i] = createParticle(theme);

      particles[i].y = canvas.height + 20;

      particles[i].x =
        Math.random() * canvas.width;
    }

    if (p.x < -50) {
      p.x = canvas.width + 20;
    }

    if (p.x > canvas.width + 50) {
      p.x = -20;
    }
  });

  animationId = requestAnimationFrame(() =>
    animate(theme)
  );
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

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

window.addEventListener("resize", () => {
  resize();

  if (currentTheme) {
    initParticles(currentTheme);
  }
});