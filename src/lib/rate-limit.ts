// ─────────────────────────────────────────────────────────────
// Limitador de tasa por IP — ventana fija en memoria
//
// Nota: en entornos serverless (Vercel) la memoria no se comparte
// entre instancias, por lo que esto es una defensa best-effort.
// Para límites estrictos en producción usa un store compartido
// (Upstash Redis, Vercel KV, etc.). Aun así, frena abuso básico
// y ráfagas accidentales desde un mismo cliente.
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Limpieza perezosa para que el Map no crezca indefinidamente.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Aplica un límite de `limit` peticiones por `windowMs` para una clave dada.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, limit, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, limit, retryAfterSeconds: 0 };
}

/** Extrae una IP de cliente razonable de las cabeceras de la petición. */
export function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
