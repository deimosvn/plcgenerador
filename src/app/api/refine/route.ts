// ─────────────────────────────────────────────────────────────
// API Route: POST /api/refine
// Refina código PLC existente según una instrucción del usuario.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { refineCode, hasServerApiKey, GeminiError } from '@/lib/gemini-server';
import { calculateCodeStats, generateId } from '@/lib/utils';
import { validateRefineInput } from '@/lib/validation';
import { rateLimit, getClientId } from '@/lib/rate-limit';
import type { GenerationResult } from '@/types';

export const runtime = 'nodejs';

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  const rl = rateLimit(`refine:${clientId}`, RATE_LIMIT, RATE_WINDOW_MS);
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

  const validation = validateRefineInput(body);
  if (!validation.ok || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (!hasServerApiKey()) {
    return NextResponse.json(
      { error: 'El refinamiento con IA no está disponible: el servidor no tiene una clave configurada.' },
      { status: 503 },
    );
  }

  const { code, instruction, plcBrand, language } = validation.data;

  try {
    const newCode = await refineCode({ code, instruction, plcBrand, language });
    const result: GenerationResult = {
      id: generateId(),
      code: newCode,
      description: instruction,
      plcBrand,
      plcModel: '',
      language,
      timestamp: Date.now(),
      codeStats: calculateCodeStats(newCode),
    };
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GeminiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Refine route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
