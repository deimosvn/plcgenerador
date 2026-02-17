'use client';

import React, { useEffect, useState } from 'react';
import { type GenerationResult } from '@/types';

interface HistorySidebarProps {
  history: GenerationResult[];
  onLoad: (item: GenerationResult) => void;
  onDelete: (index: number) => void;
}

export function HistorySidebar({ history, onLoad, onDelete }: HistorySidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* Encabezado */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-slate-900 font-semibold">Historial reciente</h2>
          <p className="text-xs text-slate-500">{history.length} generaciones guardadas</p>
        </div>
      </div>

      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-600 text-sm font-medium">Aún no guardas proyectos</p>
            <p className="text-slate-400 text-xs mt-1">
              Cada generación se almacenará localmente para volver a consultarla.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all group"
              >
                <button
                  onClick={() => onLoad(item)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      {item.plcBrand}
                    </span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-xs text-slate-600 font-mono">
                      {item.language.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  className="mt-2 w-full text-center text-xs text-rose-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 py-1 flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar de la lista
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
