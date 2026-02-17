'use client';

import React from 'react';
import type { CodeStats as CodeStatsType } from '@/types';

interface CodeStatsBarProps {
  stats: CodeStatsType;
}

export function CodeStatsBar({ stats }: CodeStatsBarProps) {
  const items = [
    { label: 'Líneas', value: stats.totalLines, icon: 'M4 6h16M4 12h16M4 18h16', color: 'text-sky-600 bg-sky-50' },
    { label: 'Código', value: stats.codeLines, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Comentarios', value: stats.commentLines, icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', color: 'text-violet-600 bg-violet-50' },
    { label: 'Variables', value: stats.variables, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', color: 'text-amber-600 bg-amber-50' },
    { label: 'Funciones', value: stats.functions, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547', color: 'text-rose-600 bg-rose-50' },
    { label: 'Caracteres', value: stats.characters, icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', color: 'text-slate-600 bg-slate-50' },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`px-3 py-2.5 rounded-xl border border-slate-100 text-center ${item.color.split(' ')[1]}`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg className={`w-3.5 h-3.5 ${item.color.split(' ')[0]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
          </div>
          <p className={`text-lg font-bold tabular-nums ${item.color.split(' ')[0]}`}>
            {item.value.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
