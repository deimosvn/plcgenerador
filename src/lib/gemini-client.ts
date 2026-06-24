// ─────────────────────────────────────────────────────────────
// Cliente del navegador — habla SOLO con nuestras rutas /api.
// No contiene ninguna clave: la generación y el análisis ocurren
// en el servidor, donde vive GEMINI_API_KEY.
// ─────────────────────────────────────────────────────────────

import type {
  GenerationFormData,
  GenerationResult,
  AnalysisResult,
  ExtractionData,
  WiringData,
} from '@/types';

/** Lee el mensaje de error de una respuesta de la API de forma segura. */
async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.error === 'string') return data.error;
  } catch {
    /* respuesta sin JSON */
  }
  return `Error de la API (${response.status}).`;
}

/** Genera código PLC llamando a /api/generate. */
export async function generatePLCCode(
  formData: GenerationFormData,
  signal?: AbortSignal,
): Promise<GenerationResult> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as GenerationResult;
}

/** Audita código PLC llamando a /api/analyze. */
export async function analyzePLCCode(
  code: string,
  fileName: string,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, fileName }),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as AnalysisResult;
}

/** Refina código existente llamando a /api/refine. */
export async function refinePLCCode(
  args: { code: string; instruction: string; plcBrand: string; language: string },
  signal?: AbortSignal,
): Promise<GenerationResult> {
  const response = await fetch('/api/refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as GenerationResult;
}

/** Extrae I/O de un diagrama (imagen/PDF) llamando a /api/extract. */
export async function extractFromDiagram(
  file: { mimeType: string; data: string },
  signal?: AbortSignal,
): Promise<ExtractionData> {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(file),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as ExtractionData;
}

/** Genera diagrama de conexión + BOM llamando a /api/wiring. */
export async function generateWiring(
  args: { description: string; plcBrand: string; language: string; code?: string },
  signal?: AbortSignal,
): Promise<WiringData> {
  const response = await fetch('/api/wiring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as WiringData;
}
