'use client';

import React from 'react';

// ─────────────────────────────────────────────────────────────
// Renderizador Markdown minimalista y SEGURO.
// Construye elementos React directamente (sin dangerouslySetInnerHTML),
// por lo que es inmune a inyección de HTML/scripts. Cubre el subconjunto
// que produce el analizador: encabezados, listas, negrita, cursiva,
// código en línea y bloques de código.
// ─────────────────────────────────────────────────────────────

interface MarkdownProps {
  content: string;
  className?: string;
}

/** Procesa formato en línea: **negrita**, *cursiva*, `código`. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith('**')) {
      tokens.push(<strong key={key} className="font-semibold text-slate-900">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      tokens.push(
        <code key={key} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-rose-600">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      tokens.push(<em key={key} className="italic">{token.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) tokens.push(text.slice(lastIndex));
  return tokens;
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];

  let listItems: string[] = [];
  let listOrdered = false;
  let codeLines: string[] | null = null;
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const items = listItems.map((item, idx) => (
      <li key={idx} className="leading-relaxed">{renderInline(item, `li-${key}-${idx}`)}</li>
    ));
    blocks.push(
      listOrdered ? (
        <ol key={`block-${key++}`} className="my-3 list-decimal space-y-1.5 pl-6 text-slate-700">{items}</ol>
      ) : (
        <ul key={`block-${key++}`} className="my-3 list-disc space-y-1.5 pl-6 text-slate-700">{items}</ul>
      ),
    );
    listItems = [];
  };

  for (const line of lines) {
    // Bloques de código ```
    if (line.trim().startsWith('```')) {
      if (codeLines === null) {
        flushList();
        codeLines = [];
      } else {
        blocks.push(
          <pre key={`block-${key++}`} className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-[13px] leading-relaxed text-slate-200">
            <code className="font-mono">{codeLines.join('\n')}</code>
          </pre>,
        );
        codeLines = null;
      }
      continue;
    }
    if (codeLines !== null) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Encabezados
    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      const sizes = ['text-xl', 'text-lg', 'text-base', 'text-sm'];
      blocks.push(
        <p
          key={`block-${key++}`}
          className={`mt-5 mb-2 font-bold text-slate-900 ${sizes[level - 1]}`}
        >
          {renderInline(text, `h-${key}`)}
        </p>,
      );
      continue;
    }

    // Elementos de lista
    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (ordered) {
      if (!listOrdered) flushList();
      listOrdered = true;
      listItems.push(ordered[1]);
      continue;
    }
    if (unordered) {
      if (listOrdered) flushList();
      listOrdered = false;
      listItems.push(unordered[1]);
      continue;
    }

    // Párrafo
    flushList();
    blocks.push(
      <p key={`block-${key++}`} className="my-2 leading-relaxed text-slate-700">
        {renderInline(trimmed, `p-${key}`)}
      </p>,
    );
  }

  flushList();
  if (codeLines !== null) {
    blocks.push(
      <pre key={`block-${key++}`} className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-[13px] text-slate-200">
        <code className="font-mono">{codeLines.join('\n')}</code>
      </pre>,
    );
  }

  return <div className={className}>{blocks}</div>;
}
