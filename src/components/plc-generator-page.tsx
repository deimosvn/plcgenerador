'use client';

import React from 'react';
import { usePLCGenerator } from '@/hooks/use-plc-generator';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyInput } from '@/components/ui/api-key-input';
import { ToastContainer } from '@/components/ui/toast-container';
import { GeneratorForm } from '@/components/features/generator-form';
import { CodePreview } from '@/components/features/code-preview';
import { HistoryPanel } from '@/components/features/history-panel';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationFormData } from '@/types';

export function PLCGeneratorPage() {
  const {
    loading,
    error,
    currentResult,
    apiKey,
    history,
    generate,
    setApiKey,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  } = usePLCGenerator();

  const { toasts, success, error: showError, removeToast } = useToast();

  const handleGenerate = async (formData: GenerationFormData) => {
    clearError();
    try {
      const result = await generate(formData);
      if (result.warning) {
        success('Código generado en modo offline (sin API Key)');
      } else {
        success(`Código ${formData.language.toUpperCase()} generado exitosamente`);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al generar código');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">{APP_CONFIG.name}</h1>
              <p className="text-[11px] text-slate-400">v{APP_CONFIG.version} · IEC 61131-3</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Release {APP_CONFIG.year}
          </span>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-slate-200/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-16 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-5">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Plataforma de ingeniería aumentada
          </p>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl max-w-3xl mx-auto">
            Genera código PLC profesional con inteligencia artificial
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            16 marcas, 6 lenguajes IEC 61131-3, documentación en español, niveles de seguridad SIL/PL y exportación completa.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            {['IEC 61131-3', 'SIL / PL', '16 Marcas PLC', 'ZIP Export'].map((badge) => (
              <span key={badge} className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10">
        {/* Error display */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3 animate-fade-in">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="mt-1">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left column — Form & API Key */}
          <section className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg animate-fade-in">
              <ApiKeyInput value={apiKey} onChange={setApiKey} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg animate-fade-in">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">Configura tu generación</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Define marca, lenguaje, requisitos y opciones avanzadas.
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
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center shadow-lg animate-fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-900">Aquí verás tu código generado</p>
                <p className="mt-2 text-sm text-slate-500">
                  Completa el formulario y genera código PLC profesional al instante.
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
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {APP_CONFIG.year} {APP_CONFIG.author} · Plataforma generativa para automatización industrial.</p>
          <p className="text-slate-400">Hecho con Next.js · Desplegado en Vercel</p>
        </div>
      </footer>
    </div>
  );
}
