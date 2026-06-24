'use client';

import React from 'react';
import { escapeHtml } from '@/lib/utils';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

// Palabras clave IEC 61131-3
const KEYWORDS = new Set([
  'IF', 'THEN', 'ELSE', 'ELSIF', 'END_IF',
  'WHILE', 'DO', 'END_WHILE',
  'FOR', 'TO', 'BY', 'END_FOR',
  'CASE', 'OF', 'END_CASE',
  'REPEAT', 'UNTIL', 'END_REPEAT',
  'RETURN', 'EXIT',
  'VAR', 'VAR_INPUT', 'VAR_OUTPUT', 'VAR_IN_OUT', 'VAR_TEMP', 'VAR_GLOBAL', 'VAR_EXTERNAL', 'END_VAR',
  'FUNCTION', 'FUNCTION_BLOCK', 'PROGRAM', 'END_FUNCTION', 'END_FUNCTION_BLOCK', 'END_PROGRAM',
  'TYPE', 'STRUCT', 'END_STRUCT', 'END_TYPE', 'ARRAY', 'AT',
  'METHOD', 'END_METHOD', 'PROPERTY', 'END_PROPERTY', 'INTERFACE', 'END_INTERFACE',
  'STEP', 'END_STEP', 'TRANSITION', 'END_TRANSITION', 'ACTION', 'END_ACTION',
  'INITIAL_STEP',
  'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'XOR', 'MOD',
]);

const TYPES = new Set([
  'BOOL', 'BYTE', 'WORD', 'DWORD', 'LWORD',
  'SINT', 'INT', 'DINT', 'LINT', 'USINT', 'UINT', 'UDINT', 'ULINT',
  'REAL', 'LREAL',
  'STRING', 'WSTRING', 'CHAR', 'WCHAR',
  'TIME', 'LTIME', 'DATE', 'TOD', 'DT', 'DATE_AND_TIME', 'TIME_OF_DAY',
]);

const INSTRUCTIONS = new Set([
  'LD', 'ST', 'S', 'R', 'CAL', 'JMP', 'RET',
  'JMPC', 'JMPCN', 'CALC', 'CALCN', 'RETC', 'RETCN',
  'AND', 'OR', 'XOR', 'ADD', 'SUB', 'MUL', 'DIV',
  'GT', 'GE', 'EQ', 'NE', 'LE', 'LT',
  'MOVE', 'TON', 'TOF', 'TP', 'CTU', 'CTD', 'CTUD',
  'SR', 'RS', 'R_TRIG', 'F_TRIG',
]);

function highlightLine(line: string): string {
  const escaped = escapeHtml(line);

  // Block comment marker (* *)
  if (/^\s*\(\*/.test(line) || /\*\)\s*$/.test(line) || /^\s*\*/.test(line)) {
    return `<span class="text-emerald-400/80 italic">${escaped}</span>`;
  }

  // Single-line comment //
  const commentMatch = escaped.match(/^(.*?)(\/\/.*)$/);
  if (commentMatch) {
    const before = highlightTokens(commentMatch[1]);
    return `${before}<span class="text-emerald-400/80 italic">${commentMatch[2]}</span>`;
  }

  // Comment with --
  const dashComment = escaped.match(/^(.*?)(--.*)$/);
  if (dashComment) {
    const before = highlightTokens(dashComment[1]);
    return `${before}<span class="text-emerald-400/80 italic">${dashComment[2]}</span>`;
  }

  return highlightTokens(escaped);
}

function highlightTokens(text: string): string {
  // Tokenize and highlight
  return text.replace(/\b([A-Z_][A-Z0-9_]*)\b/gi, (match) => {
    const upper = match.toUpperCase();

    if (KEYWORDS.has(upper)) {
      return `<span class="text-blue-400 font-semibold">${match}</span>`;
    }
    if (TYPES.has(upper)) {
      return `<span class="text-cyan-400">${match}</span>`;
    }
    if (INSTRUCTIONS.has(upper)) {
      return `<span class="text-purple-400 font-medium">${match}</span>`;
    }
    return match;
  })
  // Strings
  .replace(/'([^']*)'/g, '<span class="text-amber-400">\'$1\'</span>')
  // Numbers
  .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300">$1</span>')
  // I/O addresses
  .replace(/(%[IQM][BWD]?\d+(\.\d+)?)/gi, '<span class="text-cyan-300 font-medium">$1</span>')
  // Assignment operator
  .replace(/:=/g, '<span class="text-violet-400">:=</span>')
  // Comparison operators
  .replace(/(&gt;=|&lt;=|&lt;&gt;|&gt;|&lt;)/g, '<span class="text-violet-400">$1</span>');
}

/** Resalta todas las líneas, llevando el estado de comentario de bloque. */
function highlightAllLines(lines: string[]): string[] {
  const results: string[] = [];
  let inBlockComment = false;

  for (const line of lines) {
    if (line.includes('(*')) inBlockComment = true;

    results.push(
      inBlockComment
        ? `<span class="text-emerald-400/80 italic">${escapeHtml(line)}</span>`
        : highlightLine(line),
    );

    if (line.includes('*)')) inBlockComment = false;
  }

  return results;
}

export function PLCSyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const lines = code.split('\n');
  const highlightedLines = highlightAllLines(lines);

  return (
    <div className="relative group">
      <pre className="p-4 text-[13px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
        <div className="flex">
          {/* Line numbers */}
          <div className="pr-4 mr-4 border-r border-slate-700/50 text-slate-600 select-none text-right min-w-[3ch]">
            {lines.map((_, i) => (
              <div key={i} className="hover:text-slate-400 transition-colors">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Code */}
          <code className="flex-1">
            {highlightedLines.map((html, i) => (
              <div
                key={i}
                className="hover:bg-white/5 px-1 -mx-1 rounded transition-colors"
                dangerouslySetInnerHTML={{ __html: html || '\u200B' }}
              />
            ))}
          </code>
        </div>
      </pre>
      {/* Language badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        {language}
      </div>
    </div>
  );
}
