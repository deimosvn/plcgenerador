'use client';

import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const highlightCode = () => {
    let highlighted = code;

    // PLC languages (Ladder, ST, FBD, IL)
    if (['ladder', 'st', 'fbd', 'il'].includes(language)) {
      // Keywords
      const keywords = [
        'IF', 'THEN', 'ELSE', 'ELSIF', 'END_IF', 'WHILE', 'DO', 'END_WHILE',
        'FOR', 'TO', 'BY', 'END_FOR', 'CASE', 'OF', 'END_CASE', 'REPEAT', 'UNTIL', 'END_REPEAT',
        'VAR', 'VAR_INPUT', 'VAR_OUTPUT', 'VAR_IN_OUT', 'VAR_TEMP', 'VAR_GLOBAL', 'END_VAR',
        'FUNCTION', 'FUNCTION_BLOCK', 'PROGRAM', 'END_FUNCTION', 'END_FUNCTION_BLOCK', 'END_PROGRAM',
        'TYPE', 'STRUCT', 'END_STRUCT', 'END_TYPE', 'ARRAY',
        'TRUE', 'FALSE', 'AND', 'OR', 'NOT', 'XOR', 'MOD',
        'BOOL', 'INT', 'DINT', 'REAL', 'LREAL', 'STRING', 'TIME', 'DATE', 'TOD', 'DT', 'WORD', 'DWORD', 'BYTE',
        'LD', 'ST', 'S', 'R', 'CAL', 'JMP', 'RET', 'JMPC', 'JMPCN', 'CALC', 'CALCN', 'RETC', 'RETCN',
      ];

      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        highlighted = highlighted.replace(regex, (match) => `<span class="text-blue-400 font-medium">${match}</span>`);
      });

      // Comments (// style and (* *) style)
      highlighted = highlighted.replace(
        /\/\/(.*?)$/gm,
        '<span class="text-emerald-500/70 italic">//$1</span>'
      );
      highlighted = highlighted.replace(
        /\(\*[\s\S]*?\*\)/g,
        (match) => `<span class="text-emerald-500/70 italic">${match}</span>`
      );

      // Strings
      highlighted = highlighted.replace(
        /'([^']*)'/g,
        '<span class="text-amber-400">\'$1\'</span>'
      );

      // Numbers
      highlighted = highlighted.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="text-orange-400">$1</span>'
      );

      // Operators
      const operators = [':=', '==', '>=', '<=', '<>', '&&', '||', '+', '-', '*', '/', '(', ')', '[', ']', ';', ','];
      operators.forEach((op) => {
        const safeOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeOp, 'g');
        highlighted = highlighted.replace(regex, `<span class="text-violet-400">${op}</span>`);
      });

      // I/O addresses
      highlighted = highlighted.replace(
        /\b([IQM])(\d+\.?\d*)\b/gi,
        '<span class="text-cyan-400 font-medium">$1$2</span>'
      );
    }

    return highlighted;
  };

  const lines = code.split('\n');

  return (
    <div className="relative">
      <pre className="p-4 text-sm text-white/80 font-mono overflow-x-auto leading-relaxed">
        <div className="flex">
          {/* Line numbers */}
          <div className="pr-4 mr-4 border-r border-white/10 text-white/20 select-none text-right">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code */}
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(),
            }}
          />
        </div>
      </pre>
    </div>
  );
}
