'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePLCGenerator } from '@/hooks/use-plc-generator';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast-container';
import { GeneratorForm } from '@/components/features/generator-form';
import { CodePreview } from '@/components/features/code-preview';
import { HistoryPanel } from '@/components/features/history-panel';
import { CodeAnalyzer } from '@/components/features/code-analyzer';
import { CommunityPanel } from '@/components/features/community-panel';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationFormData } from '@/types';

export function PLCGeneratorPage() {
  const {
    loading,
    error,
    currentResult,
    currentAnalysis,
    history,
    generate,
    analyzeCode,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  } = usePLCGenerator();

  const { toasts, success, error: showError, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'community'>('generate');

  const handleGenerate = async (formData: GenerationFormData) => {
    clearError();
    try {
      const result = await generate(formData);
      if (result.warning) {
        success('Código generado en modo offline');
      } else {
        success(`Código ${formData.language.toUpperCase()} generado exitosamente`);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al generar código');
    }
  };

  const handleAnalyze = async (code: string, fileName: string) => {
    clearError();
    try {
      await analyzeCode(code, fileName);
      success('Análisis completado exitosamente');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al analizar el código');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
              <img src="/plcicon.png" alt="PLC AI Studio Icon" className="h-full w-full object-contain p-1" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">{APP_CONFIG.name} Studio</h1>
              <p className="text-[11px] text-slate-400">Área de Trabajo</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              IA Conectada
            </span>
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ml-2">
              Salir
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Tabs Navigation ─── */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-8 animate-fade-in">
        <div className="flex flex-wrap sm:flex-nowrap space-x-1 rounded-xl bg-slate-200/60 p-1 w-full sm:w-fit mx-auto backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center justify-center gap-2 w-full sm:w-48 rounded-lg py-2.5 text-sm font-semibold transition-all hover-lift ${
              activeTab === 'generate'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Generar Código
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center justify-center gap-2 w-full sm:w-48 rounded-lg py-2.5 text-sm font-semibold transition-all hover-lift ${
              activeTab === 'analyze'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analizar Código
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center justify-center gap-2 w-full sm:w-48 rounded-lg py-2.5 text-sm font-semibold transition-all hover-lift mt-1 sm:mt-0 ${
              activeTab === 'community'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Comunidad
          </button>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-md p-4 text-sm text-red-700 flex items-start gap-3 animate-fade-in shadow-sm">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="flex-1">
              <p className="font-bold">Error encontrado</p>
              <p className="mt-1">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="grid gap-8 lg:grid-cols-12 animate-fade-in">
            {/* Left column — Form */}
            <section className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl glass-panel p-6 shadow-lg">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-800">Parámetros de Generación</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Define especificaciones de hardware, lenguaje y normativas.
                  </p>
                </div>
                <GeneratorForm onGenerate={handleGenerate} loading={loading} />
              </div>
            </section>

            {/* Right column — Preview & History */}
            <section className="lg:col-span-7 space-y-6">
              {currentResult ? (
                <CodePreview result={currentResult} />
              ) : (
                <div className="rounded-2xl glass-panel p-12 text-center shadow-lg">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50/50 text-blue-500 border border-blue-100">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-800">Área de Código Generado</p>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                    Completa el formulario a la izquierda y tu código IEC 61131-3 aparecerá aquí.
                  </p>
                </div>
              )}

              <HistoryPanel
                history={history}
                activeId={currentResult?.id}
                onLoad={loadFromHistory}
                onDelete={deleteHistoryItem}
                onClear={clearHistory}
              />
            </section>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <CodeAnalyzer onAnalyze={handleAnalyze} loading={loading} result={currentAnalysis} />
          </div>
        )}

        {activeTab === 'community' && (
          <CommunityPanel />
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-md mt-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {APP_CONFIG.year} {APP_CONFIG.author} · Plataforma para automatización industrial.</p>
          <p className="text-slate-400 font-medium">Hecho con <span className="text-slate-600">Next.js</span> y <span className="text-blue-500">Gemini AI</span></p>
        </div>
      </footer>
    </div>
  );
}
