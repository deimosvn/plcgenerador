// ─────────────────────────────────────────────────────────────
// Cliente de API Gemini para generación de código PLC
// ─────────────────────────────────────────────────────────────

import { APP_CONFIG } from './constants';
import { buildSystemPrompt, buildUserPrompt, buildFallbackCode, buildAnalyzePrompt } from './prompts';
import { generateId, cleanGeneratedCode, calculateCodeStats } from './utils';
import type { GenerationFormData, GenerationResult, AnalysisResult } from '@/types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

const FIXED_API_KEY = 'AIzaSyDQMejzD4vP0XE2npuLOVVgLpZx68rTk6c';

/** Genera código PLC usando la API de Gemini */
export async function generatePLCCode(
  formData: GenerationFormData,
  apiKey: string = FIXED_API_KEY,
): Promise<GenerationResult> {
  const id = generateId();
  const timestamp = Date.now();
  const actualKey = apiKey?.trim() || FIXED_API_KEY;

  if (!actualKey) {
    const code = buildFallbackCode(formData);
    return {
      id,
      code,
      description: formData.description,
      plcBrand: formData.plcBrand,
      plcModel: formData.plcModel,
      language: formData.language,
      timestamp,
      codeStats: calculateCodeStats(code),
      warning: 'Código generado en modo offline. Configura tu API Key para generación completa con IA.',
    };
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(formData);

  const url = `${APP_CONFIG.geminiEndpoint}/${APP_CONFIG.geminiModel}:generateContent?key=${actualKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error de API (${response.status})`;
    if (response.status === 400) errorMessage = 'API Key inválida o request malformado. Verifica tu clave de Google Gemini.';
    else if (response.status === 403) errorMessage = 'Acceso denegado. Verifica que tu API Key tenga permisos para Gemini.';
    else if (response.status === 429) errorMessage = 'Límite de solicitudes excedido. Espera un momento e intenta de nuevo.';
    else if (response.status === 500) errorMessage = 'Error del servidor de Gemini. Intenta de nuevo en unos segundos.';
    throw new Error(errorMessage);
  }

  const data: GeminiResponse = await response.json();
  if (data.error) throw new Error(data.error.message || 'Error desconocido de la API');

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('La API no devolvió contenido. Intenta reformular tu descripción.');

  const code = cleanGeneratedCode(rawText);

  return {
    id,
    code,
    description: formData.description,
    plcBrand: formData.plcBrand,
    plcModel: formData.plcModel,
    language: formData.language,
    timestamp,
    codeStats: calculateCodeStats(code),
  };
}

/** Analiza código PLC existente usando la API de Gemini */
export async function analyzePLCCode(
  code: string,
  fileName: string,
  apiKey: string = FIXED_API_KEY,
): Promise<AnalysisResult> {
  const id = generateId();
  const timestamp = Date.now();
  const actualKey = apiKey?.trim() || FIXED_API_KEY;

  if (!actualKey) {
    throw new Error('API Key no configurada. No se puede realizar el análisis.');
  }

  const prompt = buildAnalyzePrompt(code);
  const url = `${APP_CONFIG.geminiEndpoint}/${APP_CONFIG.geminiModel}:generateContent?key=${actualKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error de API (${response.status})`;
    if (response.status === 400) errorMessage = 'API Key inválida o request malformado.';
    else if (response.status === 403) errorMessage = 'Acceso denegado. Verifica tu API Key.';
    else if (response.status === 429) errorMessage = 'Límite de solicitudes excedido. Espera un momento.';
    else if (response.status === 500) errorMessage = 'Error del servidor de Gemini.';
    throw new Error(errorMessage);
  }

  const data: GeminiResponse = await response.json();
  if (data.error) throw new Error(data.error.message || 'Error desconocido de la API');

  const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!analysisText) throw new Error('La API no devolvió un análisis. Inténtalo de nuevo.');

  return {
    id,
    originalCode: code,
    fileName,
    analysisText,
    timestamp,
  };
}
