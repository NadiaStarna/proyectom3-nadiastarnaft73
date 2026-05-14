# 🤖 Registro de uso de IA en el proyecto

Este documento detalla cómo se utilizó inteligencia artificial como herramienta de apoyo durante el desarrollo del Proyecto Integrador 3, y cómo Gemini AI está integrada en la aplicación.

---

## 1. Herramientas de IA utilizadas

| Herramienta | Uso |
|-------------|-----|
| **Google Gemini 2.5 Flash** | Modelo integrado en la app para generar las respuestas de los personajes |
| **Google AI Studio** | Prueba y refinamiento de los system prompts antes de integrarlos al código |
| **Claude (Anthropic)** | Asistencia durante el desarrollo: revisión de código, resolución de errores, documentación |
| **Chat GPt** | Asistencia durante el desarrollo: revisión de código, resolución de errores, documentación |

---

## 2. Integración técnica de Gemini en la aplicación

### Flujo de una conversación

```
Usuario escribe un mensaje
        ↓
Frontend — src/services/ai.js
  → fetch POST a /api/chat con { messages, systemPrompt }
        ↓
Serverless Function — api/chat.js
  → Construye el body con system_instruction + historial completo
  → POST a Gemini API (generativelanguage.googleapis.com)
        ↓
Gemini 2.5 Flash genera la respuesta
        ↓
Serverless Function devuelve { reply }
        ↓
Frontend renderiza el mensaje del personaje con timestamp
```

### Modelo utilizado

```
gemini-2.5-flash
```

Se eligió por su velocidad de respuesta y su capacidad para mantener el tono de personajes ficticios en conversaciones cortas de chat.

### Estructura del request a Gemini

Cada llamada incluye dos partes:

- **`system_instruction`**: el system prompt del personaje activo, que define su personalidad, tono y estilo.
- **`contents`**: el historial completo de la conversación en el formato que requiere Gemini:

```json
[
  { "role": "user", "parts": [{ "text": "¿Qué es la magia?" }] },
  { "role": "model", "parts": [{ "text": "Está explicado en el libro, capítulo 3." }] }
]
```

Enviar el historial completo en cada request es lo que le da al personaje memoria de la conversación, ya que Gemini no retiene estado entre llamadas.

### Mapeo de roles

La API de Gemini usa `"model"` en lugar de `"assistant"` para las respuestas del bot. Por eso en `api/chat.js` se realiza la siguiente conversión antes de enviar:

```javascript
role: m.role === "assistant" ? "model" : "user"
```

---

## 3. System prompts diseñados

Los prompts se iteraron primero en **Google AI Studio** hasta lograr respuestas consistentes con la personalidad de cada personaje, y luego se integraron directamente en `src/chat.js`.

### Hermione Granger 🧙‍♀️

```
Sos Hermione Granger de Harry Potter. Respondés de forma inteligente,
precisa y un poco condescendiente. Citás libros y reglas. Corregís errores de los demás.
Tus respuestas son cortas, como en un chat.
```

### Dobby 🧦

```
Sos Dobby, el elfo doméstico de Harry Potter. Siempre hablás en tercera
persona ("Dobby cree que...", "Dobby está feliz de..."). Sos muy dramático y leal.
Tus respuestas son cortas, como en un chat.
```

### Homero Simpson 🍩

```
Sos Homero Simpson. Sos torpe, gracioso y pensás en comida todo el tiempo,
especialmente donas y cerveza. Decís "Mmm..." seguido de algo rico. Usás frases como
"D'oh!" cuando te equivocás. Tus respuestas son cortas, como en un chat.
```

### Lisa Simpson 🎷

```
Sos Lisa Simpson. Sos inteligente, reflexiva y comprometida con causas sociales.
Tocás saxofón y luchás por la justicia. Tenés una opinión fundamentada sobre todo.
Tus respuestas son cortas, como en un chat.
```

### Criterios aplicados al diseñar cada prompt

- Definir el personaje y su franquicia de origen.
- Especificar el tono, vocabulario y frases características.
- Indicar explícitamente que las respuestas deben ser **cortas**, apropiadas para chat.
- Para Dobby: especificar el uso de tercera persona, que es un rasgo clave del personaje.

---

## 4. IA como herramienta de desarrollo

Durante la construcción del proyecto se utilizó **Chat GPT** y **Claude** para orientación técnica en distintas etapas. A continuación se detallan los usos principales, los prompts utilizados y su influencia concreta en el código.

---

### Arquitectura del proxy serverless

**Prompt utilizado:**
> "¿Cómo puedo crear una Vercel Serverless Function en JavaScript que reciba mensajes del frontend y los reenvíe a la API de Gemini sin exponer la API key?"

**Influencia en el código:**
Sirvió para entender la estructura de `api/chat.js`. Un punto clave fue aprender que Gemini requiere `system_instruction` como campo separado del array `contents`, a diferencia de OpenAI que lo incluye como un mensaje con `role: "system"` dentro del mismo array.

###[ver captura](capturasPrompt/prompt1.png)

---

### Mapeo de roles user/model

**Prompt utilizado:**
> "¿Cuál es la diferencia entre el formato de mensajes de OpenAI y el de Gemini? ¿Cómo se mapean los roles?"

**Influencia en el código:**
Llevó a implementar la conversión `assistant → model` en `api/chat.js`:

```javascript
role: m.role === "assistant" ? "model" : "user"
```

Sin esta conversión, Gemini devuelve error 400 porque no reconoce el rol `"assistant"`.

###[ver captura](capturasPrompt/prompt2.png)
###[ver captura](capturasPrompt/prompt2a.png)

---

### Sistema de mocks para desarrollo

**Prompt utilizado:**
> "¿Cómo puedo testear la interfaz del chat sin consumir la API real durante el desarrollo?"

**Influencia en el código:**
Resultó en el objeto `mockResponses` en `src/services/ai.js` con respuestas predefinidas por personaje, controlado por la flag `USE_MOCK`. Esto permitió desarrollar y ajustar la interfaz visual del chat sin hacer llamadas a la API y sin riesgo de consumir cuota.

```javascript
const USE_MOCK = false; // cambiar a true para desarrollo sin API
```

###[ver captura](capturasPrompt/prompt3.png)

---

### Error en terminal

**Prompt utilizado:**
> "pegue error"

**Influencia en el código:**
La IA ayudó a identificar que el error “UV handle closing” era un bug de Vercel Dev en Windows, por lo que se decidió evitar el entorno de desarrollo local y validar directamente en producción mediante deploy en Vercel.

###[ver captura](capturasPrompt/prompt4.png)

---

### Error en terminal

**Prompt utilizado:**
> "pegue error"

**Influencia en el código:**
La IA permitió detectar que la estructura api/chat/index.js generaba conflictos y propuso una solución más compatible con el deploy.

###[ver captura](capturasPrompt/prompt5.png)

---

## 7. Reflexión sobre el uso de IA

El uso de IA durante el desarrollo aportó principalmente en dos áreas: acelerar la comprensión de APIs externas y como herramienta de revisión para detectar edge cases que podían causar errores silenciosos.

El criterio aplicado fue siempre entender el porqué de cada sugerencia antes de adoptarla. Las respuestas de la IA se tomaron como punto de partida para investigar, no como respuesta definitiva. En los casos donde la sugerencia no se ajustaba al alcance del proyecto, se tomó una decisión diferente con criterio propio.