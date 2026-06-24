'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePLCGenerator } from '@/hooks/use-plc-generator';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast-container';
import { GeneratorForm } from '@/components/features/generator-form';
import { CodePreview } from '@/components/features/code-preview';
import { HistoryPanel } from '@/components/features/history-panel';
import { CodeAnalyzer } from '@/components/features/code-analyzer';
import { DiagramExtractor } from '@/components/features/diagram-extractor';
import { CommunityPanel } from '@/components/features/community-panel';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationFormData } from '@/types';

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function PLCGeneratorPage() {
  const {
    loading,
    error,
    currentResult,
    currentAnalysis,
    history,
    refining,
    generate,
    analyzeCode,
    refine,
    cancel,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  } = usePLCGenerator();

  const { toasts, success, error: showError, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'generate' | 'diagram' | 'analyze' | 'community'>('generate');
  const [prefill, setPrefill] = useState('');

  const handleRefine = async (instruction: string) => {
    clearError();
    try {
      const r = await refine(instruction);
      if (r) success('Código refinado correctamente');
      return r;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al refinar el código');
      return null;
    }
  };

  const handleUseDiagram = (description: string) => {
    setPrefill(description);
    setActiveTab('generate');
    success('Descripción cargada en el generador');
  };

  const handleGenerate = async (formData: GenerationFormData) => {
    clearError();
    try {
      const result = await generate(formData);
      if (!result) return;
      if (result.warning) {
        success('Código generado en modo demo (sin IA)');
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
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] relative overflow-hidden font-sans">
      {/* ─── Mesh Gradient Background (Light Premium) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-sky-100/30 blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-50/40 blur-[80px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* ─── Header Premium ─── */}
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-b from-white to-slate-50 shadow-sm border border-slate-200/60 overflow-hidden">
                <Image src="/plcicon.png" alt="PLC AI Studio Icon" width={40} height={40} priority className="h-full w-full object-contain p-1.5 drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[15px] font-semibold text-slate-900 tracking-tight leading-tight">{APP_CONFIG.name} <span className="font-light text-slate-500">Studio</span></h1>
                <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">Entorno de Ingeniería</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200/50 bg-emerald-50/50 px-3 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 tracking-widest uppercase">IA Online</span>
              </div>
              <Link href="/" className="text-[12px] font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                Salir
              </Link>
            </div>
          </div>
        </header>

        {/* ─── Tabs Navigation ─── */}
        <div className="w-full max-w-[1400px] mx-auto px-6 mt-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap sm:flex-nowrap p-1.5 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full sm:w-fit mx-auto relative z-20"
          >
            {[
              { id: 'generate', label: 'Generador', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
              { id: 'diagram', label: 'Diagramas', icon: 'M3 16.5l4.5-4.5 3 3 4.5-4.5 6 6M3 16.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18v-1.5z' },
              { id: 'analyze', label: 'Auditoría', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'community', label: 'Comunidad', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`relative flex items-center justify-center gap-2.5 w-full sm:w-40 rounded-xl py-2.5 text-[13px] font-semibold transition-all z-10 ${
                  activeTab === t.id
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {activeTab === t.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                </svg>
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* ─── Main content ─── */}
        <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-10 relative z-10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-md p-5 text-sm text-red-700 flex items-start gap-4 shadow-sm"
            >
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <p className="font-bold">Sistema de alertas</p>
                <p className="mt-1 font-medium">{error}</p>
              </div>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'generate' && (
              <motion.div 
                key="generate"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="grid gap-8 lg:grid-cols-12"
              >
                {/* Left column — Form */}
                <motion.section variants={fadeInUp} className="lg:col-span-4 flex flex-col gap-6">
                  <div className="rounded-[24px] border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
                    <div className="mb-6 border-b border-slate-100 pb-5">
                      <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Especificaciones IEC</h3>
                      <p className="mt-1.5 text-[13px] text-slate-500 font-medium">
                        Configura el entorno del controlador destino.
                      </p>
                    </div>
                    <GeneratorForm onGenerate={handleGenerate} onCancel={cancel} loading={loading} initialDescription={prefill} />
                  </div>
                </motion.section>

                {/* Right column — IDE Screen & History */}
                <motion.section variants={fadeInUp} className="lg:col-span-8 flex flex-col gap-6 h-full">
                  {currentResult ? (
                    <CodePreview result={currentResult} onRefine={handleRefine} refining={refining} />
                  ) : (
                    <div className="flex-1 min-h-[600px] rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center p-12">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-500 border border-blue-100/50 shadow-sm">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 tracking-tight">IDE en reposo</h3>
                      <p className="mt-3 text-[14px] text-slate-500 max-w-md mx-auto leading-relaxed">
                        El entorno de código se activará automáticamente al enviar las especificaciones del proceso.
                      </p>
                    </div>
                  )}

                  <div className="mt-auto">
                    <HistoryPanel
                      history={history}
                      activeId={currentResult?.id}
                      onLoad={loadFromHistory}
                      onDelete={deleteHistoryItem}
                      onClear={clearHistory}
                    />
                  </div>
                </motion.section>
              </motion.div>
            )}

            {activeTab === 'diagram' && (
              <motion.div key="diagram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DiagramExtractor onUse={handleUseDiagram} />
              </motion.div>
            )}

            {activeTab === 'analyze' && (
              <motion.div key="analyze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
                <CodeAnalyzer onAnalyze={handleAnalyze} loading={loading} result={currentAnalysis} />
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommunityPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
