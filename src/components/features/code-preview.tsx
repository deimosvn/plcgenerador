'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePdf, DownloadSimple, FileZip, Code, Cpu, ChartBar, Info, Terminal, Check } from '@phosphor-icons/react';
import { PLC_BRANDS } from '@/lib/constants';
import { calculateCodeStats, copyToClipboard } from '@/lib/utils';
import { exportProjectPdf } from '@/lib/pdf-export';
import { generateWiring } from '@/lib/gemini-client';
import { PLCSyntaxHighlighter } from '../ui/syntax-highlighter';
import { CodeStatsBar } from '../ui/code-stats-bar';
import { WiringDiagram } from './wiring-diagram';
import type { GenerationResult, PLCBrandKey, WiringData } from '@/types';

interface CodePreviewProps {
  result: GenerationResult;
  onRefine?: (instruction: string) => Promise<unknown>;
  refining?: boolean;
}

type FileId = 'main' | 'wiring' | 'stats' | 'info';

export function CodePreview({ result, onRefine, refining = false }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<FileId>('main');
  const [instruction, setInstruction] = useState('');

  const [wiring, setWiring] = useState<WiringData | null>(null);
  const [wiringLoading, setWiringLoading] = useState(false);
  const [wiringError, setWiringError] = useState('');

  const brand = PLC_BRANDS[result.plcBrand as PLCBrandKey];
  const stats = result.codeStats || calculateCodeStats(result.code);
  const ext = brand?.ext || '.txt';

  useEffect(() => {
    setWiring(null);
    setWiringError('');
    setActiveFile('main');
  }, [result.id]);

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRefine || !instruction.trim() || refining) return;
    try {
      const r = await onRefine(instruction.trim());
      if (r) setInstruction('');
    } catch {
      /* el error se muestra en el contenedor superior */
    }
  };

  const handleGenerateWiring = async () => {
    setWiringLoading(true);
    setWiringError('');
    try {
      const data = await generateWiring({
        description: result.description,
        plcBrand: result.plcBrand,
        language: result.language,
        code: result.code,
      });
      setWiring(data);
    } catch (err) {
      setWiringError(err instanceof Error ? err.message : 'No se pudo generar el diagrama.');
    } finally {
      setWiringLoading(false);
    }
  };

  const exportWiringCsv = () => {
    if (!wiring) return;
    const cell = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines: string[] = [];
    lines.push(['Tipo', 'Terminal', 'Tag', 'Dispositivo', 'Cable'].map(cell).join(','));
    for (const c of wiring.connections) lines.push([c.type, c.terminal, c.tag, c.device, c.wire || ''].map(cell).join(','));
    lines.push('');
    lines.push(cell('LISTA DE MATERIALES (BOM)'));
    lines.push(['Item', 'Referencia', 'Cantidad', 'Notas'].map(cell).join(','));
    for (const b of wiring.bom) lines.push([b.item, b.reference, String(b.quantity), b.notes || ''].map(cell).join(','));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    triggerDownload(blob, `Tablero_${result.plcBrand.replace(/[\s-]+/g, '_')}.csv`);
  };

  const handleCopy = async () => {
    if (await copyToClipboard(result.code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsFile = () => {
    triggerDownload(new Blob([result.code], { type: 'text/plain;charset=utf-8' }), `main_program${ext}`);
  };

  const downloadAsZip = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      zip.file(`src/main_program${ext}`, result.code);
      zip.file('README.md', `# ${brand?.label || result.plcBrand}\n\nGenerado con PLC AI Studio.`);
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, `PLC_Project_${Date.now()}.zip`);
    } catch (error) {
      console.error('Error al crear ZIP:', error);
    }
  };

  const fileTree: { id: FileId; label: string; folder: string; Icon: typeof Code }[] = [
    { id: 'main', label: `main_program${ext}`, folder: 'src', Icon: Code },
    { id: 'wiring', label: 'io_mapping.json', folder: 'config', Icon: Cpu },
    { id: 'stats', label: 'analysis_stats.log', folder: 'build', Icon: ChartBar },
    { id: 'info', label: 'README.md', folder: 'docs', Icon: Info },
  ];

  const ActiveIcon = fileTree.find((f) => f.id === activeFile)?.Icon ?? Code;

  return (
    <div className="flex flex-col h-[700px] w-full rounded-2xl border border-white/[0.08] bg-[#0c0c0e] shadow-2xl shadow-black/40 overflow-hidden">
      {/* ─── Top bar ─── */}
      <div className="flex items-center justify-between px-4 h-12 bg-white/[0.02] border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[12px] font-mono text-zinc-600 hidden sm:block">
            workspace / {result.plcBrand} / {result.id.substring(0, 6)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result.warning && (
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-300 font-medium">
              Modo demo
            </span>
          )}
          <div className="flex gap-1.5">
            <button onClick={() => { void exportProjectPdf(result).catch((e) => console.error('PDF error:', e)); }} className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs transition-colors" title="Dossier PDF">
              <FilePdf size={15} weight="regular" className="text-rose-400" /> PDF
            </button>
            <button onClick={downloadAsFile} className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 transition-colors" title={`Descargar ${ext}`}>
              <DownloadSimple size={16} weight="regular" />
            </button>
            <button onClick={downloadAsZip} className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors" title="Descargar proyecto .zip">
              <FileZip size={16} weight="regular" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Mobile explorer */}
        <div className="md:hidden flex overflow-x-auto bg-white/[0.02] border-b border-white/[0.06] p-2 gap-2 flex-shrink-0 no-scrollbar">
          {fileTree.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFile(f.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] whitespace-nowrap transition-colors ${
                activeFile === f.id ? 'bg-blue-500/15 text-blue-300' : 'text-zinc-400 hover:bg-white/[0.05]'
              }`}
            >
              <f.Icon size={14} weight="regular" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex w-56 bg-white/[0.02] border-r border-white/[0.06] flex-col flex-shrink-0">
          <div className="px-4 py-3 text-[10px] font-semibold text-zinc-600 tracking-[0.15em] uppercase">Explorador</div>
          <div className="flex flex-col gap-0.5 px-2">
            {fileTree.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFile(f.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12.5px] text-left transition-colors ${
                  activeFile === f.id ? 'bg-blue-500/15 text-blue-300 font-medium' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                }`}
              >
                <f.Icon size={14} weight="regular" className={activeFile === f.id ? 'text-blue-400' : 'text-zinc-500'} />
                <span className="truncate">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex flex-col flex-1 overflow-hidden relative bg-[#0a0a0b]">
          {/* Editor tab */}
          <div className="flex items-end h-10 border-b border-white/[0.06] bg-white/[0.02] px-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0b] border-t border-l border-r border-white/[0.08] rounded-t-lg relative top-[1px]">
              <ActiveIcon size={14} weight="regular" className="text-zinc-500" />
              <span className="text-[12px] font-mono text-zinc-300">{fileTree.find((f) => f.id === activeFile)?.label}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative">
            <AnimatePresence mode="wait">
              {activeFile === 'main' && (
                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <div className="absolute top-3 right-4 z-10">
                    <button
                      onClick={handleCopy}
                      className="text-[11px] font-mono bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08]"
                    >
                      {copied ? <><Check size={13} weight="bold" className="text-emerald-400" /> Copiado</> : 'Copiar'}
                    </button>
                  </div>
                  <PLCSyntaxHighlighter code={result.code} language={result.language} />
                </motion.div>
              )}

              {activeFile === 'wiring' && (
                <motion.div key="wiring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-6 overflow-auto">
                  {!wiring ? (
                    <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6">
                        <Cpu size={30} weight="regular" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Generar mapeo de I/O</h4>
                      <p className="text-zinc-500 text-sm mb-6">La IA analiza el código y extrae el diagrama de conexión eléctrica y la lista de materiales.</p>
                      {wiringError && <p className="text-red-400 text-sm mb-4">{wiringError}</p>}
                      <button
                        onClick={handleGenerateWiring}
                        disabled={wiringLoading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/[0.06] disabled:text-zinc-600 text-white text-sm font-medium rounded-lg w-full transition-colors"
                      >
                        {wiringLoading ? 'Analizando...' : 'Generar io_mapping.json'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-xl border border-white/[0.08] bg-white p-3 overflow-x-auto">
                        <WiringDiagram data={wiring} />
                      </div>
                      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                          <span className="text-sm font-semibold text-zinc-200">Lista de materiales</span>
                          <button onClick={exportWiringCsv} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <DownloadSimple size={14} weight="regular" /> CSV
                          </button>
                        </div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-zinc-500 bg-white/[0.02]">
                              <th className="px-4 py-2 font-medium">Componente</th>
                              <th className="px-4 py-2 font-medium">Referencia</th>
                              <th className="px-4 py-2 font-medium text-center">Cant.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wiring.bom.map((b, i) => (
                              <tr key={i} className="border-t border-white/[0.06]">
                                <td className="px-4 py-2 text-zinc-200">{b.item}</td>
                                <td className="px-4 py-2 text-zinc-500 font-mono text-xs">{b.reference}</td>
                                <td className="px-4 py-2 text-center text-zinc-300 tabular-nums">{b.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeFile === 'stats' && (
                <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-6 overflow-auto">
                  <CodeStatsBar stats={stats} />
                </motion.div>
              )}

              {activeFile === 'info' && (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-8 overflow-auto">
                  <h2 className="text-xl font-semibold text-white mb-4">Proyecto PLC</h2>
                  <dl className="space-y-2.5 text-sm">
                    {[
                      ['Fabricante', brand?.manufacturer || result.plcBrand],
                      ['Controlador', `${brand?.model || ''}${result.plcModel ? ` (${result.plcModel})` : ''}`],
                      ['Entorno', brand?.software || 'N/A'],
                      ['Lenguaje IEC', result.language.toUpperCase()],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                        <dt className="text-zinc-500">{k}</dt>
                        <dd className="text-zinc-200 font-medium text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="mt-7 mb-2 text-sm font-semibold text-white">Especificación original</h3>
                  <p className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 text-zinc-400 whitespace-pre-wrap leading-relaxed text-sm">
                    {result.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Terminal / refine ─── */}
      <div className="h-44 border-t border-white/[0.06] bg-[#0c0c0e] flex flex-col flex-shrink-0">
        <div className="flex items-center px-4 h-8 bg-white/[0.02] border-b border-white/[0.06] gap-2">
          <Terminal size={14} weight="regular" className="text-zinc-500" />
          <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Terminal / Refinamiento</span>
        </div>
        <div className="flex-1 p-3 overflow-hidden flex flex-col">
          <div className="flex-1 font-mono text-[11px] text-zinc-500 overflow-y-auto mb-2 pl-1 space-y-0.5">
            <p className="text-emerald-400">[ok] Compilación inicial exitosa.</p>
            <p>[..] Analizando sintaxis {result.language.toUpperCase()}... OK</p>
            <p>[..] Vinculando bibliotecas para {brand?.software || 'el IDE'}... OK</p>
            <p className="text-blue-400">[ready] Entorno listo. Escribe abajo para modificar el código.</p>
          </div>

          {onRefine && (
            <form onSubmit={handleRefine} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 focus-within:border-blue-500/50 transition-colors">
                <span className="text-blue-400 font-mono text-sm">&gt;</span>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ej: añade un temporizador de 5s antes de apagar la salida..."
                  disabled={refining}
                  className="flex-1 bg-transparent py-1.5 text-[13px] text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={refining || !instruction.trim()}
                className="px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-white/[0.06] disabled:text-zinc-600 text-white text-[12px] font-medium rounded-lg transition-colors"
              >
                {refining ? 'Procesando...' : 'Ejecutar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
