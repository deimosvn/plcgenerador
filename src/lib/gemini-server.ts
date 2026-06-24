// ─────────────────────────────────────────────────────────────
// Cliente Gemini — SOLO SERVIDOR
//
// Este módulo se importa únicamente desde las rutas /api. La clave
// se lee de process.env.GEMINI_API_KEY y NUNCA llega al navegador.
// La clave se envía a Google por cabecera (x-goog-api-key), no por
// query string, para evitar que quede registrada en logs/proxies.
// ─────────────────────────────────────────────────────────────

import { APP_CONFIG } from './constants';
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildAnalyzePrompt,
  buildRefinePrompt,
  buildExtractPrompt,
  buildWiringPrompt,
} from './prompts';
import { cleanGeneratedCode } from './utils';
import type { GenerationFormData, ExtractionData, WiringData } from '@/types';

export type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message: string; code: number };
}

/** Error con un código de estado HTTP y un mensaje apto para el usuario. */
export class GeminiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

/** ¿Hay una clave configurada en el servidor? */
export function hasServerApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
}

const REQUEST_TIMEOUT_MS = 60_000;

interface GeminiCallOptions {
  systemPrompt?: string;
  parts: GeminiPart[];
  temperature: number;
  /** Fuerza salida JSON (responseMimeType: application/json). */
  jsonMode?: boolean;
}

async function callGemini({ systemPrompt, parts, temperature, jsonMode }: GeminiCallOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new GeminiError(503, 'El servicio de IA no está configurado en el servidor.');
  }

  const url = `${APP_CONFIG.geminiEndpoint}/${APP_CONFIG.geminiModel}:generateContent`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        ...(systemPrompt ? { system_instruction: { parts: [{ text: systemPrompt }] } } : {}),
        contents: [{ parts }],
        generationConfig: {
          temperature,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new GeminiError(504, 'La operación tardó demasiado. Intenta de nuevo.');
    }
    throw new GeminiError(502, 'No se pudo contactar al servicio de IA.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    // No exponemos el cuerpo crudo del error de Google al cliente.
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      /* ignore */
    }
    console.error('Gemini API error:', response.status, detail.slice(0, 500));

    if (response.status === 400) throw new GeminiError(502, 'Solicitud rechazada por el servicio de IA.');
    if (response.status === 401 || response.status === 403)
      throw new GeminiError(503, 'El servicio de IA no está disponible (configuración del servidor).');
    if (response.status === 429)
      throw new GeminiError(429, 'Servicio saturado. Espera un momento e intenta de nuevo.');
    throw new GeminiError(502, 'Error del servicio de IA. Intenta de nuevo en unos segundos.');
  }

  const data: GeminiResponse = await response.json();

  if (data.promptFeedback?.blockReason) {
    throw new GeminiError(422, 'La solicitud fue bloqueada por las políticas de contenido de la IA.');
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError(502, 'La IA no devolvió contenido. Intenta reformular tu solicitud.');
  }

  return text;
}

/** Extrae y parsea de forma robusta un objeto JSON de la respuesta del modelo. */
function parseJson<T>(raw: string): T {
  let text = raw.trim();
  // Por si el modelo envuelve el JSON en un bloque ```json
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(text) as T;
  } catch {
    // Último recurso: extraer el primer objeto/array balanceado.
    const start = text.search(/[[{]/);
    const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as T;
      } catch {
        /* cae al throw */
      }
    }
    throw new GeminiError(502, 'La IA devolvió un formato inesperado. Intenta de nuevo.');
  }
}

/** Genera código PLC a partir del formulario. Devuelve solo el código limpio. */
export async function generateCode(formData: GenerationFormData): Promise<string> {
  const raw = await callGemini({
    systemPrompt: buildSystemPrompt(),
    parts: [{ text: buildUserPrompt(formData) }],
    temperature: 0.4,
  });
  return cleanGeneratedCode(raw);
}

/** Audita código PLC existente. Devuelve el análisis en Markdown. */
export async function analyzeCode(code: string): Promise<string> {
  return callGemini({
    parts: [{ text: buildAnalyzePrompt(code) }],
    temperature: 0.2,
  });
}

/** Refina código existente según una instrucción en lenguaje natural. */
export async function refineCode(args: {
  code: string;
  instruction: string;
  plcBrand: string;
  language: string;
}): Promise<string> {
  const raw = await callGemini({
    systemPrompt: buildSystemPrompt(),
    parts: [{ text: buildRefinePrompt(args) }],
    temperature: 0.3,
  });
  return cleanGeneratedCode(raw);
}

/** Extrae I/O y dispositivos de una imagen/PDF de un diagrama eléctrico. */
export async function extractFromDiagram(file: { mimeType: string; data: string }): Promise<ExtractionData> {
  const raw = await callGemini({
    parts: [
      { text: buildExtractPrompt() },
      { inline_data: { mime_type: file.mimeType, data: file.data } },
    ],
    temperature: 0.1,
    jsonMode: true,
  });
  return parseJson<ExtractionData>(raw);
}

/** Genera un diagrama de conexión estructurado + BOM del tablero. */
export async function generateWiring(args: {
  description: string;
  plcBrand: string;
  language: string;
  code?: string;
}): Promise<WiringData> {
  const raw = await callGemini({
    parts: [{ text: buildWiringPrompt(args) }],
    temperature: 0.2,
    jsonMode: true,
  });
  return parseJson<WiringData>(raw);
}
