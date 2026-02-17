'use client';

import React, { useEffect, useState } from 'react';
import { PLC_BRANDS } from '@/lib/constants';
import { formatTimestampShort } from '@/lib/utils';
import type { GenerationResult, PLCBrandKey } from '@/types';

interface HistorySidebarProps {
  history: GenerationResult[];
  activeId?: string;
  onLoad: (item: GenerationResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, activeId, onLoad, onDelete, onClear }: HistorySidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center border border-violet-100">
            <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Historial</h2>
            <p className="text-[11px] text-slate-500">{history.length} generaciones</p>
          </div>
        </div>
        {history.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { onClear(); setConfirmClear(false); }}
                  className="px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                title="Borrar todo el historial"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-3">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl mx-auto mb-3 flex items-center justify-center border border-slate-100">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">Sin generaciones aún</p>
            <p className="text-xs text-slate-400 mt-1">
              Cada código generado se guardará aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
            {history.map((item) => {
              const brand = PLC_BRANDS[item.plcBrand as PLCBrandKey];
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 border-sky-200 shadow-sm'
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => onLoad(item)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-xs font-semibold ${isActive ? 'text-sky-700' : 'text-slate-700'}`}>
                        {brand?.label || item.plcBrand}
                      </span>
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                        isActive ? 'bg-sky-100 text-sky-600 border border-sky-200' : 'bg-white text-slate-500 border border-slate-200'
                      }`}>
                        {item.language.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-1.5">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400">
                        {formatTimestampShort(item.timestamp)}
                      </p>
                      {item.codeStats && (
                        <p className="text-[10px] text-slate-400">
                          {item.codeStats.totalLines} líneas
                        </p>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="mt-1.5 w-full text-center text-[11px] text-red-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 py-0.5 flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
