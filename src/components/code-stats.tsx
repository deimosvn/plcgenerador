'use client';

import React from 'react';

export function CodeStats({ code }: { code: string }) {
  const lines = code.split('\n').length;
  const chars = code.length;
  const words = code.split(/\s+/).filter(Boolean).length;
  const comments = (code.match(/--\s*|\/\/\s*|#\s*|\(\*|\*\)/g) || []).length;

  const stats = [
    { label: 'Líneas', value: lines },
    { label: 'Caracteres', value: chars },
    { label: 'Palabras', value: words },
    { label: 'Comentarios', value: comments },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="px-3 py-2 bg-slate-50 rounded-lg text-center border border-slate-200">
          <p className="text-lg font-semibold text-slate-900 tabular-nums">{stat.value.toLocaleString()}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
