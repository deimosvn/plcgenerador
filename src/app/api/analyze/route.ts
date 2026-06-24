// ─────────────────────────────────────────────────────────────
// API Route: POST /api/analyze
// Audita código PLC existente en el servidor usando Gemini.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode, hasServerApiKey, GeminiError } from '@/lib/gemini-server';
import { generateId } from '@/lib/utils';
import { validateAnalyzeInput } from '@/lib/validation';
import { rateLimit, getClientId } from '@/lib/rate-limit';
import type { AnalysisResult } from '@/types';

export const runtime = 'nodejs';

// 10 análisis por minuto y por IP (cada análisis es más caro).
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  const rl = rateLimit(`analyze:${clientId}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const validation = validateAnalyzeInput(body);
  if (!validation.ok || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (!hasServerApiKey()) {
    return NextResponse.json(
      { error: 'El análisis con IA no está disponible: el servidor no tiene una clave configurada.' },
      { status: 503 },
    );
  }

  const { code, fileName } = validation.data;

  try {
    const analysisText = await analyzeCode(code);
    const result: AnalysisResult = {
      id: generateId(),
      originalCode: code,
      fileName,
      analysisText,
      timestamp: Date.now(),
    };
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GeminiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Analyze route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
