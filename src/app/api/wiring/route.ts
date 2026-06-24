// ─────────────────────────────────────────────────────────────
// API Route: POST /api/wiring
// Genera un diagrama de conexión estructurado + BOM del tablero.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { generateWiring, hasServerApiKey, GeminiError } from '@/lib/gemini-server';
import { validateWiringInput } from '@/lib/validation';
import { rateLimit, getClientId } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  const rl = rateLimit(`wiring:${clientId}`, RATE_LIMIT, RATE_WINDOW_MS);
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

  const validation = validateWiringInput(body);
  if (!validation.ok || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (!hasServerApiKey()) {
    return NextResponse.json(
      { error: 'El diagrama con IA no está disponible: el servidor no tiene una clave configurada.' },
      { status: 503 },
    );
  }

  try {
    const data = await generateWiring(validation.data);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof GeminiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Wiring route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
