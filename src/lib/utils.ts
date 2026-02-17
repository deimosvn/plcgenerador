// ─────────────────────────────────────────────────────────────
// Utilidades generales de PLC AI Studio
// ─────────────────────────────────────────────────────────────

import type { CodeStats } from '@/types';

/** Genera un ID único */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Calcula estadísticas del código generado */
export function calculateCodeStats(code: string): CodeStats {
  const lines = code.split('\n');
  const totalLines = lines.length;

  let commentLines = 0;
  let blankLines = 0;
  let codeLines = 0;
  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      blankLines++;
      continue;
    }

    // Block comments: (* ... *)
    if (trimmed.startsWith('(*')) inBlockComment = true;
    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*)')) inBlockComment = false;
      continue;
    }

    // Single-line comments
    if (trimmed.startsWith('//') || trimmed.startsWith('--') || trimmed.startsWith('#')) {
      commentLines++;
      continue;
    }

    codeLines++;
  }

  // Count variable declarations
  const varPattern = /\b(VAR|VAR_INPUT|VAR_OUTPUT|VAR_IN_OUT|VAR_TEMP|VAR_GLOBAL)\b/gi;
  const varBlocks = code.match(varPattern) || [];

  // Count functions/programs/function blocks
  const funcPattern = /\b(FUNCTION|FUNCTION_BLOCK|PROGRAM|FB_)\b/gi;
  const funcs = code.match(funcPattern) || [];

  // Count individual variable declarations (lines with : inside VAR blocks)
  const varDecls = code.match(/^\s*\w+\s*:\s*\w+/gm) || [];

  return {
    totalLines,
    codeLines,
    commentLines,
    blankLines,
    characters: code.length,
    variables: varDecls.length || varBlocks.length,
    functions: funcs.length,
  };
}

/** Formatea un timestamp a fecha legible */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Formatea un timestamp corto */
export function formatTimestampShort(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-MX', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Limpia el código de markdown wrappers */
export function cleanGeneratedCode(raw: string): string {
  let code = raw.trim();

  // Remove markdown code blocks
  code = code.replace(/^```[\w]*\n?/gm, '');
  code = code.replace(/\n?```$/gm, '');

  // Remove leading/trailing whitespace
  code = code.trim();

  return code;
}

/** Sanitiza texto HTML */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/** Trunca texto con ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/** Copia texto al portapapeles */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
