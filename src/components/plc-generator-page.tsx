'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Lightning, ImageSquare, MagnifyingGlass, UsersThree, ArrowRight, Warning, X, type Icon } from '@phosphor-icons/react';
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

type TabId = 'generate' | 'diagram' | 'analyze' | 'community';

const TABS: { id: TabId; label: string; Icon: Icon }[] = [
  { id: 'generate', label: 'Generador', Icon: Lightning },
  { id: 'diagram', label: 'Diagramas', Icon: ImageSquare },
  { id: 'analyze', label: 'Auditoría', Icon: MagnifyingGlass },
  { id: 'community', label: 'Comunidad', Icon: UsersThree },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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
  const [activeTab, setActiveTab] = useState<TabId>('generate');
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
      if (result.warning) success('Código generado en modo demo (sin IA)');
      else success(`Código ${formData.language.toUpperCase()} generado exitosamente`);
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] text-zinc-300 relative overflow-hidden">
      {/* Ambiente sutil (profundidad, sin slop) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[620px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* ─── Header ─── */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0b]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
                <Image src="/plcicon.png" alt="" width={36} height={36} priority className="h-full w-full object-contain p-1.5 brightness-0 invert opacity-90" />
              </div>
              <div className="flex flex-col leading-tight">
                <h1 className="text-[15px] font-semibold text-white tracking-tight">
                  {APP_CONFIG.name} <span className="font-normal text-zinc-500">Studio</span>
                </h1>
                <p className="text-[10px] font-medium text-zinc-500 tracking-[0.18em] uppercase">Entorno de Ingeniería</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-300 tracking-[0.15em] uppercase">IA Online</span>
              </span>
              <Link href="/" className="text-[11px] font-semibold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.15em]">
                Salir
              </Link>
            </div>
          </div>
        </header>

        {/* ─── Tabs ─── */}
        <div className="w-full max-w-[1400px] mx-auto px-6 mt-9">
          <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] w-full sm:w-fit mx-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center justify-center gap-2.5 w-full sm:w-40 rounded-xl py-2.5 text-[13px] font-semibold transition-colors z-10 ${
                  activeTab === t.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {activeTab === t.id && (
                  <motion.div
                    layoutId="activeStudioTab"
                    className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.1]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <t.Icon size={17} weight="bold" className="relative z-10" />
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Main ─── */}
        <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-10">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200"
              >
                <Warning size={20} weight="bold" className="mt-0.5 shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="font-semibold text-red-100">Se produjo un error</p>
                  <p className="mt-1 text-red-300/90">{error}</p>
                </div>
                <button onClick={clearError} className="text-red-400/70 hover:text-red-200 transition-colors">
                  <X size={16} weight="bold" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'generate' && (
              <motion.div
                key="generate"
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
                className="grid gap-7 lg:grid-cols-12"
              >
                <motion.section variants={fadeInUp} className="lg:col-span-4">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                    <div className="mb-6 border-b border-white/[0.08] pb-5">
                      <h3 className="text-base font-semibold text-white tracking-tight">Especificaciones IEC</h3>
                      <p className="mt-1.5 text-[13px] text-zinc-500">Configura el controlador destino del programa.</p>
                    </div>
                    <GeneratorForm onGenerate={handleGenerate} onCancel={cancel} loading={loading} initialDescription={prefill} />
                  </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="lg:col-span-8 flex flex-col gap-6">
                  {currentResult ? (
                    <CodePreview result={currentResult} onRefine={handleRefine} refining={refining} />
                  ) : (
                    <div className="flex-1 min-h-[600px] rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col items-center justify-center text-center p-12">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Lightning size={30} weight="regular" />
                      </div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">Entorno en reposo</h3>
                      <p className="mt-3 text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                        El editor de código se activará al enviar las especificaciones del proceso.
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
                </motion.section>
              </motion.div>
            )}

            {activeTab === 'diagram' && (
              <motion.div key="diagram" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <DiagramExtractor onUse={handleUseDiagram} />
              </motion.div>
            )}

            {activeTab === 'analyze' && (
              <motion.div key="analyze" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                <CodeAnalyzer onAnalyze={handleAnalyze} loading={loading} result={currentAnalysis} />
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div key="community" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <CommunityPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-white/[0.06] py-6 mt-auto">
          <div className="mx-auto max-w-[1400px] px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
            <span>© {APP_CONFIG.year} {APP_CONFIG.author}. Todos los derechos reservados.</span>
            <span className="inline-flex items-center gap-1.5">
              Volver a la portada <ArrowRight size={12} weight="bold" />
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
