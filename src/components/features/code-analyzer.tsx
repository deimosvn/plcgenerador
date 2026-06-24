'use client';

import React, { useState, useRef } from 'react';
import { Markdown } from '@/components/ui/markdown';
import { MAX_ANALYZE_LENGTH } from '@/lib/validation';
import type { AnalysisResult } from '@/types';

interface CodeAnalyzerProps {
  onAnalyze: (code: string, fileName: string) => Promise<void>;
  loading: boolean;
  result: AnalysisResult | null;
}

export function CodeAnalyzer({ onAnalyze, loading, result }: CodeAnalyzerProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    if (file.size > MAX_ANALYZE_LENGTH) {
      setFileError(`El archivo supera el máximo de ${(MAX_ANALYZE_LENGTH / 1000).toFixed(0)} KB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setFileContent((event.target?.result as string) ?? '');
    reader.onerror = () => setFileError('No se pudo leer el archivo.');
    reader.readAsText(file);
  };

  const handleAnalyzeClick = () => {
    if (fileContent.trim()) onAnalyze(fileContent, fileName);
  };

  const clearFile = () => {
    setFileContent('');
    setFileName('');
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="rounded-2xl glass-panel p-6">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-white tracking-tight">Analizador de código PLC</h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-lg mx-auto">
              Sube un archivo para auditar su funcionamiento y detectar fallas lógicas o de seguridad.
            </p>
          </div>

          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.st,.awl,.l5x,.xml,.scl" className="hidden" />

            {fileError && <p className="mb-4 text-sm font-medium text-red-400">{fileError}</p>}

            {!fileContent ? (
              <div className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 transition-transform hover:scale-105"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <p className="text-sm font-medium text-zinc-300">Haz clic para seleccionar un archivo</p>
                <p className="text-xs text-zinc-600 mt-1">Formatos: .st, .awl, .scl, .txt, .l5x</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">{fileName}</p>
                <p className="text-xs text-zinc-500 mt-1 mb-4">{(fileContent.length / 1024).toFixed(2)} KB cargados</p>
                <div className="flex gap-3">
                  <button onClick={clearFile} className="px-4 py-2 text-xs font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors">
                    Cambiar archivo
                  </button>
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-white/[0.06] disabled:text-zinc-600 transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analizando...
                      </>
                    ) : (
                      'Analizar código'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Resultados del análisis</h3>
              <p className="text-sm text-zinc-500 mt-1">Archivo: <span className="font-medium text-zinc-300">{result.fileName}</span></p>
            </div>
            <button onClick={clearFile} className="px-4 py-2 text-sm font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
              Analizar otro
            </button>
          </div>
          <Markdown content={result.analysisText} className="max-w-none text-sm sm:text-base" />
        </div>
      )}
    </div>
  );
}
