# 🧙 Chat con Personajes — Proyecto Integrador M3
 
**Autor:** Nadia Starna  
**Deploy:** [https://proyecto-m3-nadia-starna-ft-73.vercel.app](https://proyecto-m3-nadia-starna-ft-73.vercel.app)  
**Repositorio:** [https://github.com/NadiaStarna/proyectom3-nadiastarnaft73](https://github.com/NadiaStarna/proyectom3-nadiastarnaft73)
 
---
 
## 📖 Descripción del proyecto
 
Single Page Application (SPA) que permite chatear con personajes ficticios usando inteligencia artificial. Desarrollada como prueba de concepto (POC) para **ComicSansCon**, una agencia digital especializada en experiencias interactivas para fans de videojuegos, películas y series.
 
La aplicación integra **Google Gemini 2.5 Flash** de forma segura mediante una Vercel Serverless Function como proxy, evitando exponer la API key en el frontend.
 
---
 
## 🎭 Personajes disponibles
 
La aplicación incluye **4 personajes** con personalidades bien definidas:
 
| Personaje | Franquicia | Personalidad |
|-----------|-----------|-------------|
| **Hermione Granger** 🧙‍♀️ | Harry Potter | Intelectual, precisa, un poco condescendiente |
| **Dobby** 🧦 | Harry Potter | Servicial, habla en tercera persona, muy dramático |
| **Homero Simpson** 🍩 | Los Simpson | Torpe, gracioso, obsesionado con donas y cerveza |
| **Lisa Simpson** 🎷 | Los Simpson | Inteligente, reflexiva, comprometida con causas sociales |
 
Cada personaje tiene su propio **system prompt** que define su tono, vocabulario y estilo de respuesta.
 
---
 
## ✨ Funcionalidades
 
- Navegación SPA con History API (sin recargas de página)
- Tres vistas: `/home`, `/chat`, `/about`
- Chat en tiempo real con Google Gemini 2.5 Flash
- Historial de conversación mantenido durante la sesión
- **Persistencia con localStorage**: el historial se guarda y se recupera al recargar
- **Selector de personajes** con cambio dinámico de tema visual
- **Timestamps** en cada mensaje
- **Botón de copiar** respuestas del personaje al portapapeles
- **Indicador animado** "Escribiendo..." mientras la IA genera la respuesta
- Envío de mensajes con Enter además del botón
- **Botón para borrar historial** que limpia localStorage
- Efecto visual de partículas que cambia según el personaje
- Diseño responsive mobile-first
- Manejo de errores de red con mensaje de fallback
---
 
## 🗂️ Estructura del proyecto
 
```
PROYECTOM3-NADIASTARNAFT73/
│
├── api/
│   └── chat.js              # Vercel Serverless Function (proxy hacia Gemini)
│
├── src/
│   ├── services/
│   │   └── ai.js            # Lógica de comunicación con el backend + sistema de mocks
│   ├── views/
│   │   ├── home.js          # Vista /home
│   │   └── about.js         # Vista /about
│   ├── app.js               # Router SPA (History API)
│   ├── chat.js              # Lógica e interfaz del chat
│   ├── particles.js         # Efecto visual de partículas por personaje
│   ├── style.css            # Estilos globales (mobile-first)
│   └── utils.js             # Funciones utilitarias (formatMessage, isValidMessage, etc.)
│
├── tests/
│   └── utils.test.js        # Tests unitarios con Vitest
│
├── .env                     # Variables de entorno locales (no subir al repo)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
├── index.html               # Entry point de la SPA
├── package.json
├── vercel.json              # Configuración de Vercel
└── README.md
```
 
---
 
## ⚙️ Requisitos previos
 
- [Node.js](https://nodejs.org/) v18 o superior
- [Vercel CLI](https://vercel.com/docs/cli) instalado globalmente
- Una API key de [Google AI Studio](https://aistudio.google.com/)
---
 
## 🚀 Cómo ejecutar el proyecto localmente
 
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
 
Copiá el archivo de ejemplo y completá con tu API key:
 
```bash
cp .env.example .env
```
 
Editá `.env`:
 
```env
GEMINI_API_KEY=tu_api_key_aquí
```
 
> ⚠️ Nunca subas el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.
 
### 4. Ejecutar en modo desarrollo
 
```bash
vercel dev
```
 
La aplicación estará disponible en `http://localhost:3000`.
 
> Es importante usar `vercel dev` (no un servidor estático simple) porque las Serverless Functions de `/api` requieren el entorno de Vercel para ejecutarse correctamente.
 
---
 
## 🧪 Cómo ejecutar los tests
 
```bash
# Modo watch (desarrollo)
npm test
 
# Ejecución única (CI / entrega)
npm run test:run
```
 
Los tests están en `tests/utils.test.js` y cubren las funciones utilitarias del proyecto con Vitest: `formatMessage`, `isValidMessage`, `getCharacterByKey` y `parseGeminiResponse`.
 
---
 
## ☁️ Cómo desplegar en Vercel
 
### Opción 1: Desde la CLI
 
```bash
vercel --prod
```
 
### Opción 2: Desde el dashboard de Vercel
 
1. Ir a [vercel.com](https://vercel.com) e importar el repositorio de GitHub.
2. En **Settings → Environment Variables**, agregar:
   - `GEMINI_API_KEY` → tu API key de Gemini
3. Hacer deploy. Vercel detecta automáticamente las funciones en `/api`.
> ✅ Verificar que la URL `/api/chat` responde correctamente en producción antes de entregar.
 
---
 
## 📸 Capturas de pantalla
 
### Uso de IA durante el desarrollo del proyecto
 
Ver documentación completa en [USO-IA.md](./USO-IA.md).
 
---
 
## 🔒 Seguridad
 
- La `GEMINI_API_KEY` **nunca se expone en el frontend**.
- Toda comunicación con Gemini pasa por la Serverless Function `/api/chat.js`, que actúa como proxy seguro.
- El archivo `.env` está incluido en `.gitignore`.
---
 
## 📄 Licencia
 
Nadia Starna, 2026.