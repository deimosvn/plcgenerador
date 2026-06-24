// ─────────────────────────────────────────────────────────────
// Validación y saneamiento de entradas del lado del servidor
// Toda petición que llega a las rutas /api se valida aquí antes
// de tocar la API de Gemini.
// ─────────────────────────────────────────────────────────────

import { PLC_BRANDS, PLC_LANGUAGES, SAFETY_LEVELS, APP_CONFIG } from './constants';
import type { GenerationFormData } from '@/types';

const VALID_BRAND_KEYS = new Set<string>(Object.keys(PLC_BRANDS));
const VALID_LANGUAGE_KEYS = new Set<string>(PLC_LANGUAGES.map((l) => l.key));
const VALID_SAFETY_KEYS = new Set<string>(SAFETY_LEVELS.map((s) => s.key));

/** Tamaño máximo de código aceptado para análisis (caracteres) */
export const MAX_ANALYZE_LENGTH = 60_000;
/** Longitud máxima de un nombre de archivo */
const MAX_FILENAME_LENGTH = 200;

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Valida y normaliza el cuerpo de una petición de generación */
export function validateGenerationInput(body: unknown): ValidationResult<GenerationFormData> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de la petición inválido.' };
  }

  const raw = body as Record<string, unknown>;

  const description = asString(raw.description).trim();
  if (description.length < APP_CONFIG.minDescriptionLength) {
    return {
      ok: false,
      error: `La descripción debe tener al menos ${APP_CONFIG.minDescriptionLength} caracteres.`,
    };
  }
  if (description.length > APP_CONFIG.maxDescriptionLength) {
    return {
      ok: false,
      error: `La descripción no puede superar ${APP_CONFIG.maxDescriptionLength.toLocaleString()} caracteres.`,
    };
  }

  const plcBrand = asString(raw.plcBrand);
  if (!VALID_BRAND_KEYS.has(plcBrand)) {
    return { ok: false, error: 'Marca de PLC no soportada.' };
  }

  const language = asString(raw.language);
  if (!VALID_LANGUAGE_KEYS.has(language)) {
    return { ok: false, error: 'Lenguaje de programación no soportado.' };
  }

  const safetyLevelRaw = asString(raw.safetyLevel) || 'none';
  const safetyLevel = VALID_SAFETY_KEYS.has(safetyLevelRaw) ? safetyLevelRaw : 'none';

  // El modelo es texto libre opcional: lo limitamos y saneamos saltos de línea.
  const plcModel = asString(raw.plcModel).replace(/[\r\n]+/g, ' ').slice(0, 120).trim();

  return {
    ok: true,
    data: {
      description,
      plcBrand,
      plcModel,
      language,
      safetyLevel: safetyLevel as GenerationFormData['safetyLevel'],
      includeComments: raw.includeComments !== false,
      includeIOMapping: raw.includeIOMapping !== false,
      includeErrorHandling: raw.includeErrorHandling !== false,
    },
  };
}

export interface AnalyzeInput {
  code: string;
  fileName: string;
}

/** Valida y normaliza el cuerpo de una petición de análisis */
export function validateAnalyzeInput(body: unknown): ValidationResult<AnalyzeInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de la petición inválido.' };
  }

  const raw = body as Record<string, unknown>;

  const code = asString(raw.code);
  if (code.trim().length < 5) {
    return { ok: false, error: 'El código a analizar está vacío o es demasiado corto.' };
  }
  if (code.length > MAX_ANALYZE_LENGTH) {
    return {
      ok: false,
      error: `El archivo es demasiado grande (máximo ${(MAX_ANALYZE_LENGTH / 1000).toFixed(0)} KB de texto).`,
    };
  }

  // Saneamos el nombre del archivo para evitar inyección de rutas/control chars.
  const fileName =
    asString(raw.fileName)
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[/\\]/g, '_')
      .slice(0, MAX_FILENAME_LENGTH)
      .trim() || 'codigo.txt';

  return { ok: true, data: { code, fileName } };
}

// ─── Refinamiento ──────────────────────────────────────────────

const MAX_INSTRUCTION_LENGTH = 2000;

export interface RefineInput {
  code: string;
  instruction: string;
  plcBrand: string;
  language: string;
}

/** Valida el cuerpo de una petición de refinamiento de código. */
export function validateRefineInput(body: unknown): ValidationResult<RefineInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de la petición inválido.' };
  }
  const raw = body as Record<string, unknown>;

  const code = asString(raw.code);
  if (code.trim().length < 5) return { ok: false, error: 'No hay código para refinar.' };
  if (code.length > MAX_ANALYZE_LENGTH) return { ok: false, error: 'El código es demasiado largo.' };

  const instruction = asString(raw.instruction).trim();
  if (instruction.length < 3) return { ok: false, error: 'Describe el cambio que quieres aplicar.' };
  if (instruction.length > MAX_INSTRUCTION_LENGTH) {
    return { ok: false, error: 'La instrucción es demasiado larga.' };
  }

  const plcBrand = asString(raw.plcBrand);
  if (!VALID_BRAND_KEYS.has(plcBrand)) return { ok: false, error: 'Marca de PLC no soportada.' };

  const language = asString(raw.language);
  if (!VALID_LANGUAGE_KEYS.has(language)) return { ok: false, error: 'Lenguaje no soportado.' };

  return { ok: true, data: { code, instruction, plcBrand, language } };
}

// ─── Diagrama de conexión / BOM ────────────────────────────────

export interface WiringInput {
  description: string;
  plcBrand: string;
  language: string;
  code?: string;
}

/** Valida el cuerpo de una petición de diagrama de conexión. */
export function validateWiringInput(body: unknown): ValidationResult<WiringInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de la petición inválido.' };
  }
  const raw = body as Record<string, unknown>;

  const description = asString(raw.description).trim();
  if (description.length < APP_CONFIG.minDescriptionLength) {
    return { ok: false, error: 'Falta la descripción del proceso.' };
  }
  if (description.length > APP_CONFIG.maxDescriptionLength) {
    return { ok: false, error: 'La descripción es demasiado larga.' };
  }

  const plcBrand = asString(raw.plcBrand);
  if (!VALID_BRAND_KEYS.has(plcBrand)) return { ok: false, error: 'Marca de PLC no soportada.' };

  const language = asString(raw.language);
  if (!VALID_LANGUAGE_KEYS.has(language)) return { ok: false, error: 'Lenguaje no soportado.' };

  const code = asString(raw.code).slice(0, MAX_ANALYZE_LENGTH) || undefined;

  return { ok: true, data: { description, plcBrand, language, code } };
}

// ─── Extracción desde imagen/PDF (visión) ──────────────────────

/** Tipos MIME aceptados para extracción por visión. */
const ALLOWED_VISION_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
]);

/** Tamaño máximo del archivo decodificado (~8 MB). */
export const MAX_VISION_BYTES = 8 * 1024 * 1024;

export interface VisionInput {
  mimeType: string;
  data: string; // base64 (sin prefijo data:)
}

/** Valida el cuerpo de una petición de extracción por visión. */
export function validateVisionInput(body: unknown): ValidationResult<VisionInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de la petición inválido.' };
  }
  const raw = body as Record<string, unknown>;

  const mimeType = asString(raw.mimeType).toLowerCase();
  if (!ALLOWED_VISION_MIME.has(mimeType)) {
    return { ok: false, error: 'Formato no soportado. Sube PNG, JPG, WEBP o PDF.' };
  }

  let data = asString(raw.data);
  // Acepta y descarta el prefijo data:...;base64,
  const comma = data.indexOf(',');
  if (data.startsWith('data:') && comma !== -1) data = data.slice(comma + 1);

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data) || data.length < 16) {
    return { ok: false, error: 'Archivo inválido o vacío.' };
  }

  // Tamaño aproximado del binario decodificado a partir de la longitud base64.
  const approxBytes = Math.floor((data.length * 3) / 4);
  if (approxBytes > MAX_VISION_BYTES) {
    return { ok: false, error: `El archivo supera el máximo de ${(MAX_VISION_BYTES / (1024 * 1024)).toFixed(0)} MB.` };
  }

  return { ok: true, data: { mimeType, data } };
}
