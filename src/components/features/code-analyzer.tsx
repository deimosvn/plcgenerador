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

    // Límite de tamaño coherente con la validación del servidor.
    if (file.size > MAX_ANALYZE_LENGTH) {
      setFileError(`El archivo supera el máximo de ${(MAX_ANALYZE_LENGTH / 1000).toFixed(0)} KB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent((event.target?.result as string) ?? '');
    };
    reader.onerror = () => setFileError('No se pudo leer el archivo.');
    reader.readAsText(file);
  };

  const handleAnalyzeClick = () => {
    if (fileContent.trim()) {
      onAnalyze(fileContent, fileName);
    }
  };

  const clearFile = () => {
    setFileContent('');
    setFileName('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!result ? (
        <div className="rounded-2xl glass-panel p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-slate-800">Analizador de Código PLC</h3>
            <p className="mt-2 text-sm text-slate-500">
              Sube un archivo de código para auditar su funcionamiento, detectar posibles fallas lógicas o de seguridad.
            </p>
          </div>

          <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.st,.awl,.l5x,.xml,.scl"
              className="hidden"
            />

            {fileError && (
              <p className="mb-4 text-sm font-medium text-red-600">{fileError}</p>
            )}

            {!fileContent ? (
              <div className="flex flex-col items-center justify-center">
                <div 
                  className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4 shadow-sm hover-lift cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">Haz clic para seleccionar un archivo</p>
                <p className="text-xs text-slate-400 mt-1">Formatos soportados: .st, .awl, .scl, .txt, .l5x</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-3 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-800">{fileName}</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">{(fileContent.length / 1024).toFixed(2)} KB cargados</p>
                
                <div className="flex gap-3 mt-2">
                  <button onClick={clearFile} className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors hover-lift">
                    Cambiar archivo
                  </button>
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all hover-lift"
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
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Analizar Código
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Resultados del Análisis</h3>
              <p className="text-sm text-slate-500 mt-1">Archivo analizado: <span className="font-medium text-slate-700">{result.fileName}</span></p>
            </div>
            <button onClick={clearFile} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Analizar otro
            </button>
          </div>
          
          <Markdown content={result.analysisText} className="max-w-none text-sm sm:text-base" />
        </div>
      )}
    </div>
  );
}
