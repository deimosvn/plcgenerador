'use client';

import React from 'react';
import type { CodeStats as CodeStatsType } from '@/types';

interface CodeStatsBarProps {
  stats: CodeStatsType;
}

export function CodeStatsBar({ stats }: CodeStatsBarProps) {
  const items = [
    { label: 'Líneas', value: stats.totalLines, icon: 'M4 6h16M4 12h16M4 18h16' },
    { label: 'Código', value: stats.codeLines, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { label: 'Comentarios', value: stats.commentLines, icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { label: 'Variables', value: stats.variables, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { label: 'Funciones', value: stats.functions, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547' },
    { label: 'Caracteres', value: stats.characters, icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <div key={item.label} className="px-3 py-4 rounded-xl border border-white/[0.06] bg-white/[0.03] text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
          </div>
          <p className="text-xl font-semibold tabular-nums text-white font-mono">{item.value.toLocaleString()}</p>
          <p className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
