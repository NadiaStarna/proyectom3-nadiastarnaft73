import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatMessage,
  parseGeminiResponse,
  buildPrompt,
  isValidMessage,
  getCharacterByKey
} from "../src/utils.js";

describe("formatMessage", () => {
  it("crea un mensaje con role y content correctos", () => {
    const msg = formatMessage("user", "Hola");
    expect(msg.role).toBe("user");
    expect(msg.content).toBe("Hola");
  });

  it("funciona con role model", () => {
    const msg = formatMessage("model", "Hola, soy Hermione");
    expect(msg.role).toBe("model");
    expect(msg.content).toBe("Hola, soy Hermione");
  });
});

describe("parseGeminiResponse", () => {
  it("extrae el texto de una respuesta válida de Gemini", () => {
    const data = {
      candidates: [
        { content: { parts: [{ text: "Respuesta de prueba" }] } }
      ]
    };
    expect(parseGeminiResponse(data)).toBe("Respuesta de prueba");
  });

  it("devuelve null si la respuesta está vacía", () => {
    expect(parseGeminiResponse({})).toBeNull();
  });

  it("devuelve null si candidates está vacío", () => {
    expect(parseGeminiResponse({ candidates: [] })).toBeNull();
  });
});

describe("isValidMessage", () => {
  it("devuelve true para un mensaje válido", () => {
    expect(isValidMessage("Hola")).toBe(true);
  });

  it("devuelve false para un string vacío", () => {
    expect(isValidMessage("")).toBe(false);
  });

  it("devuelve false para solo espacios", () => {
    expect(isValidMessage("   ")).toBe(false);
  });

  it("devuelve false para un valor no string", () => {
    expect(isValidMessage(null)).toBe(false);
  });
});

describe("getCharacterByKey", () => {
  const characters = {
    hermione: { name: "Hermione" },
    dobby: { name: "Dobby" }
  };

  it("devuelve el personaje correcto por key", () => {
    expect(getCharacterByKey(characters, "hermione")).toEqual({ name: "Hermione" });
  });

  it("devuelve null si la key no existe", () => {
    expect(getCharacterByKey(characters, "batman")).toBeNull();
  });
});

describe("buildPrompt", () => {
  it("combina el systemPrompt con el historial de mensajes", () => {
    const messages = [
      { role: "user", content: "Hola" },
      { role: "model", content: "Hola, soy Hermione" }
    ];
    const prompt = buildPrompt("Sos Hermione.", messages);
    expect(prompt).toContain("Sos Hermione.");
    expect(prompt).toContain("user: Hola");
    expect(prompt).toContain("model: Hola, soy Hermione");
  });

  it("ignora mensajes con loading true", () => {
    const messages = [
      { role: "user", content: "Hola" },
      { role: "model", content: "Escribiendo...", loading: true }
    ];
    const prompt = buildPrompt("Sos Hermione.", messages);
    expect(prompt).not.toContain("Escribiendo...");
  });
});

describe("fetch mock — fetchAIResponse", () => {
  it("devuelve reply cuando el mock está activo", async () => {
    const { fetchAIResponse } = await import("../src/services/ai.js");

    const character = { name: "Homero Simpson", systemPrompt: "Sos Homero." };
    const messages = [{ role: "user", content: "Hola", loading: false }];

    const data = await fetchAIResponse(character, messages);
    expect(data.reply).toBeTruthy();
    expect(typeof data.reply).toBe("string");
  });

  it("devuelve reply con contenido para Hermione", async () => {
    const { fetchAIResponse } = await import("../src/services/ai.js");

    const character = { name: "Hermione Granger", systemPrompt: "Sos Hermione." };
    const messages = [{ role: "user", content: "Hola", loading: false }];

    const data = await fetchAIResponse(character, messages);
    expect(data.reply).toBeTruthy();
    expect(typeof data.reply).toBe("string");
  });
});