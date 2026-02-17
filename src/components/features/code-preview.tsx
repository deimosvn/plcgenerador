'use client';

import React, { useState } from 'react';
import { PLC_BRANDS } from '@/lib/constants';
import { calculateCodeStats, copyToClipboard, formatTimestamp } from '@/lib/utils';
import { PLCSyntaxHighlighter } from '../ui/syntax-highlighter';
import { CodeStatsBar } from '../ui/code-stats-bar';
import type { GenerationResult, PLCBrandKey } from '@/types';

interface CodePreviewProps {
  result: GenerationResult;
}

export function CodePreview({ result }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'stats' | 'info'>('code');

  const brand = PLC_BRANDS[result.plcBrand as PLCBrandKey];
  const stats = result.codeStats || calculateCodeStats(result.code);

  const handleCopy = async () => {
    const ok = await copyToClipboard(result.code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsFile = () => {
    const ext = brand?.ext || '.txt';
    const fileName = `PLC_${result.plcBrand.replace(/[\s-]+/g, '_')}_${result.language}${ext}`;
    const blob = new Blob([result.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsZip = async () => {
    setExporting(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const ext = brand?.ext || '.txt';
      const codeFileName = `main_program${ext}`;
      zip.file(codeFileName, result.code);

      // README.md profesional
      const readme = [
        '# Proyecto PLC - Generado por PLC AI Studio',
        '',
        '## Información del proyecto',
        '',
        '| Propiedad | Valor |',
        '|-----------|-------|',
        `| **Fabricante** | ${brand?.manufacturer || result.plcBrand} |`,
        `| **Modelo** | ${brand?.model || 'Estándar'}${result.plcModel ? ` (${result.plcModel})` : ''} |`,
        `| **Lenguaje** | ${result.language.toUpperCase()} |`,
        `| **Software** | ${brand?.software || 'IDE del fabricante'} |`,
        `| **Extensión** | ${ext} |`,
        `| **Protocolos** | ${brand?.protocols?.join(', ') || 'N/A'} |`,
        `| **Fecha** | ${formatTimestamp(result.timestamp)} |`,
        '',
        '## Requerimientos originales',
        '',
        result.description,
        '',
        '## Estadísticas del código',
        '',
        `- **Líneas totales:** ${stats.totalLines}`,
        `- **Líneas de código:** ${stats.codeLines}`,
        `- **Comentarios:** ${stats.commentLines}`,
        `- **Variables:** ${stats.variables}`,
        `- **Funciones/Bloques:** ${stats.functions}`,
        '',
        '## Instrucciones de importación',
        '',
        `### ${brand?.software || 'IDE'}`,
        '',
        `1. Abre ${brand?.software || 'tu IDE de PLC'} y crea un nuevo proyecto`,
        `2. Importa el archivo \`${codeFileName}\``,
        '3. Ajusta las direcciones de I/O según tu configuración de hardware',
        '4. Compila el proyecto y revisa advertencias',
        '5. Realiza pruebas en modo simulación antes de desplegar',
        '',
        '## Lista de verificación pre-despliegue',
        '',
        '- [ ] Verificar direcciones de I/O contra diagrama eléctrico',
        '- [ ] Validar tiempos de respuesta de temporizadores',
        '- [ ] Comprobar enclavamientos de seguridad',
        '- [ ] Ejecutar pruebas de paro de emergencia',
        '- [ ] Documentar parámetros de comunicación',
        '- [ ] Respaldar programa antes de transferir',
        '',
        '## Aviso de seguridad',
        '',
        '> **IMPORTANTE:** Valida completamente este código en un entorno controlado.',
        '> Realiza pruebas FAT/SAT documentadas antes de producción.',
        '> Este código es generado por IA y debe ser revisado por un ingeniero calificado.',
        '',
        '---',
        `*Generado por PLC AI Studio v2.0 — ${new Date().toISOString().split('T')[0]}*`,
      ].join('\n');
      zip.file('README.md', readme);

      // Tabla de I/O
      const io = [
        `(*  ═══════════════════════════════════════════════`,
        `    TABLA DE MAPEO DE ENTRADAS/SALIDAS`,
        `    Proyecto: ${brand?.label || result.plcBrand}`,
        `    Fecha: ${formatTimestamp(result.timestamp)}`,
        `    ═══════════════════════════════════════════════ *)`,
        '',
        '(* ─── ENTRADAS DIGITALES ─────────────────────── *)',
        '(*  Dirección    │ Tag              │ Descripción            *)',
        '(*  %I0.0        │ xStartButton     │ Botón de arranque      *)',
        '(*  %I0.1        │ xStopButton      │ Botón de paro          *)',
        '(*  %I0.2        │ xEmergencyStop   │ Paro de emergencia NC  *)',
        '(*  %I0.3        │ xSensor1         │ [Descripción]          *)',
        '',
        '(* ─── SALIDAS DIGITALES ─────────────────────── *)',
        '(*  Dirección    │ Tag              │ Descripción            *)',
        '(*  %Q0.0        │ xMotorCmd        │ Comando del motor      *)',
        '(*  %Q0.1        │ xAlarmOut        │ Salida de alarma       *)',
        '(*  %Q0.2        │ xIndicator       │ Indicador luminoso     *)',
        '',
        '(* ─── ENTRADAS ANALÓGICAS ───────────────────── *)',
        '(*  Dirección    │ Tag              │ Rango     │ Descripción          *)',
        '(*  %IW64        │ rAnalogIn1       │ 4-20 mA   │ [Descripción]        *)',
        '',
        '(* ─── SALIDAS ANALÓGICAS ────────────────────── *)',
        '(*  Dirección    │ Tag              │ Rango     │ Descripción          *)',
        '(*  %QW80        │ rAnalogOut1      │ 0-10 V    │ [Descripción]        *)',
        '',
        '(* IMPORTANTE: Ajusta las direcciones a tu configuración real de hardware *)',
      ].join('\n');
      zip.file('io_mapping.txt', io);

      // Test plan
      const testPlan = [
        '# Plan de pruebas — Proyecto PLC',
        '',
        `**Equipo:** ${brand?.label || result.plcBrand}`,
        `**Fecha:** ${formatTimestamp(result.timestamp)}`,
        '',
        '## 1. Pruebas funcionales (FAT)',
        '',
        '| # | Prueba | Entrada | Resultado esperado | OK/NOK | Observaciones |',
        '|---|--------|---------|-------------------|--------|---------------|',
        '| 1 | Arranque normal | Botón START | Motor arranca | | |',
        '| 2 | Paro normal | Botón STOP | Motor se detiene | | |',
        '| 3 | Paro de emergencia | E-STOP | Todo se detiene inmediatamente | | |',
        '| 4 | Reset tras emergencia | Reset + condiciones OK | Sistema listo | | |',
        '| 5 | Fallo de sensor | Desconectar sensor | Alarma activada | | |',
        '',
        '## 2. Pruebas de seguridad',
        '',
        '| # | Prueba | Método | Criterio de aceptación |',
        '|---|--------|--------|----------------------|',
        '| 1 | Tiempo de respuesta E-STOP | Cronómetro | < 100 ms |',
        '| 2 | Enclavamiento de seguridad | Simular fallo | No permite rearranque sin reset |',
        '| 3 | Pérdida de alimentación | Cortar energía | Estado seguro garantizado |',
        '',
        '## 3. Pruebas de comunicación',
        '',
        '| # | Interfaz | Prueba | Resultado |',
        '|---|----------|--------|-----------|',
        `| 1 | ${brand?.protocols?.[0] || 'Ethernet'} | Ping al PLC | |`,
        '| 2 | HMI | Visualización de variables | |',
        '',
        '## Firmas de aprobación',
        '',
        '| Rol | Nombre | Firma | Fecha |',
        '|-----|--------|-------|-------|',
        '| Programador | | | |',
        '| Supervisor | | | |',
        '| Cliente | | | |',
      ].join('\n');
      zip.file('test_plan.md', testPlan);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PLC_${result.plcBrand.replace(/[\s-]+/g, '_')}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al crear ZIP:', error);
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { key: 'code', label: 'Código', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { key: 'stats', label: 'Estadísticas', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'info', label: 'Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ] as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
              <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Código generado</h2>
              <p className="text-[11px] text-slate-500">
                {result.language.toUpperCase()} · {brand?.label || result.plcBrand}
                {result.plcModel && ` · ${result.plcModel}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result.warning && (
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-700 font-medium">
                ⚠️ Offline
              </span>
            )}
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono border border-slate-200">
              {brand?.ext || '.txt'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Warning */}
        {result.warning && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-700">{result.warning}</p>
          </div>
        )}

        {/* Tab: Code */}
        {activeTab === 'code' && (
          <>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono ml-2">main_program{brand?.ext || '.txt'}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <PLCSyntaxHighlighter code={result.code} language={result.language} />
              </div>
            </div>
          </>
        )}

        {/* Tab: Stats */}
        {activeTab === 'stats' && <CodeStatsBar stats={stats} />}

        {/* Tab: Info */}
        {activeTab === 'info' && (
          <div className="space-y-3">
            {[
              { label: 'Fabricante', value: brand?.manufacturer || result.plcBrand },
              { label: 'Modelo', value: `${brand?.model || ''}${result.plcModel ? ` (${result.plcModel})` : ''}` },
              { label: 'Software', value: brand?.software || 'N/A' },
              { label: 'Formato', value: brand?.ext || '.txt' },
              { label: 'Protocolos', value: brand?.protocols?.join(', ') || 'N/A' },
              { label: 'Generado', value: formatTimestamp(result.timestamp) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-sm text-slate-800 font-medium">{item.value}</span>
              </div>
            ))}

            {result.description && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-2 font-medium">Requerimiento original</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {result.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={downloadAsFile}
            className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar {brand?.ext || '.txt'}
          </button>
          <button
            onClick={downloadAsZip}
            disabled={exporting}
            className="px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:shadow-none"
          >
            {exporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Exportando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar proyecto .zip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
