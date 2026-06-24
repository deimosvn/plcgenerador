// ─────────────────────────────────────────────────────────────
// API Route: POST /api/extract
// Extrae I/O y dispositivos de una imagen/PDF de un diagrama
// eléctrico usando la visión multimodal de Gemini.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { extractFromDiagram, hasServerApiKey, GeminiError } from '@/lib/gemini-server';
import { validateVisionInput } from '@/lib/validation';
import { rateLimit, getClientId } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Las peticiones de visión son más pesadas: límite más estricto.
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  const rl = rateLimit(`extract:${clientId}`, RATE_LIMIT, RATE_WINDOW_MS);
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

  const validation = validateVisionInput(body);
  if (!validation.ok || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (!hasServerApiKey()) {
    return NextResponse.json(
      { error: 'La extracción con IA no está disponible: el servidor no tiene una clave configurada.' },
      { status: 503 },
    );
  }

  try {
    const data = await extractFromDiagram({
      mimeType: validation.data.mimeType,
      data: validation.data.data,
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof GeminiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Extract route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
