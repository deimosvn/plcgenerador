'use client';

import React, { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  value: string;
  onChange: (key: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [show, setShow] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    onChange(v);
  };

  const isValid = localValue.trim().length > 10;

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800">Google Gemini API Key</h3>
          <p className="text-xs text-amber-600 mt-0.5">
            Tu clave se almacena solo en tu navegador. No se envía a ningún servidor externo.
          </p>
        </div>
        {isValid && (
          <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-700 font-medium">Activa</span>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={localValue}
          onChange={handleChange}
          placeholder="AIza... (pega tu API Key aquí)"
          autoComplete="off"
          className="w-full px-4 py-2.5 pr-20 bg-white border border-amber-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all font-mono"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-600 hover:text-amber-800 underline underline-offset-2 transition-colors"
        >
          ¿No tienes una API Key? Consíguela gratis aquí →
        </a>
      </div>
    </div>
  );
}
