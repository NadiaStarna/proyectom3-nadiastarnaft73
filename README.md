# 🎭 Chat con Personajes — Proyecto Integrador M3

Una Single Page Application que permite chatear con personajes ficticios usando inteligencia artificial.

## 👥 Personajes disponibles

- 🧙‍♀️ **Hermione Granger** — Inteligente, precisa y un poco condescendiente
- 🧦 **Dobby** — Dramático y leal, habla en tercera persona
- 🍩 **Homero Simpson** — Torpe y gracioso, obsesionado con la comida
- 🎷 **Lisa Simpson** — Reflexiva y comprometida con causas sociales

## 🚀 Demo

🔗 [https://proyecto-m3-nadia-starna-ft-73.vercel.app](https://proyecto-m3-nadia-starna-ft-73.vercel.app)

## ⚙️ Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/NadiaStarna/proyectom3-nadiastarnaft73.git
cd proyectom3-nadiastarnaft73
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example` y completar con los valores correspondientes.

### 4. Ejecutar en local

```bash
vercel dev
```

La app estará disponible en `http://localhost:3000`

## 🧪 Cómo ejecutar los tests

```bash
npm run test:run
```

Se ejecutan 13 tests unitarios con Vitest que cubren las funciones principales de `utils.js`.

## 🌐 Cómo desplegar en Vercel

### 1. Conectar el repositorio a Vercel desde el dashboard

### 2. Configurar las variables de entorno en Settings → Environment Variables

### 3. Deployar

```bash
vercel --prod
```

## 🏗️ Estructura del proyecto

├── api/
│   └── chat.js           # Serverless Function — proxy seguro a la IA
├── src/
│   ├── app.js            # Routing SPA con History API
│   ├── chat.js           # Lógica del chat
│   ├── utils.js          # Funciones utilitarias
│   ├── style.css         # Estilos mobile-first
│   ├── services/
│   │   └── ai.js         # Comunicación con la serverless function
│   └── views/
│       ├── home.js       # Vista Home
│       └── about.js      # Vista About
├── tests/
│   └── utils.test.js     # Tests unitarios
├── .env.example          # Variables de entorno necesarias (sin valores)
├── vercel.json           # Configuración de Vercel
└── README.md

## 🛠️ Tecnologías utilizadas

- HTML, CSS y JavaScript vanilla
- History API para routing SPA
- Vercel Serverless Functions
- Google Gemini AI
- Vitest para testing
- localStorage para persistencia del historial

## 📸 Capturas de pantalla

...............

## 👩‍💻 Autora

**Nadia Starna** — FT73 — 2026

## 🤖 Uso de IA

Ver [docs/uso-de-ia.md](docs/uso-de-ia.md)