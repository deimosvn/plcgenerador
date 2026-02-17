'use client';

import React, { useState } from 'react';
import { type GenerationResult } from '@/types';
import { SyntaxHighlighter } from './syntax-highlighter';
import { CodeStats } from './code-stats';

const PLC_FILE_EXTENSIONS: Record<string, { ext: string; mime: string; software: string }> = {
  'Siemens S7-1200': { ext: '.scl', mime: 'text/plain', software: 'TIA Portal' },
  'Siemens S7-1500': { ext: '.scl', mime: 'text/plain', software: 'TIA Portal' },
  'Allen-Bradley CompactLogix': { ext: '.L5X', mime: 'text/xml', software: 'Studio 5000' },
  'Allen-Bradley ControlLogix': { ext: '.L5X', mime: 'text/xml', software: 'Studio 5000' },
  'Mitsubishi FX5U': { ext: '.gxw', mime: 'application/octet-stream', software: 'GX Works3' },
  'Mitsubishi Q Series': { ext: '.gxw', mime: 'application/octet-stream', software: 'GX Works2' },
  'Omron CP1E': { ext: '.cxp', mime: 'application/octet-stream', software: 'CX-Programmer' },
  'Omron CJ2M': { ext: '.cxp', mime: 'application/octet-stream', software: 'CX-Programmer' },
};

interface CodePreviewProps {
  result: GenerationResult;
  loading: boolean;
}

export function CodePreview({ result, loading }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const plcInfo = PLC_FILE_EXTENSIONS[result.plcBrand] || { ext: '.txt', mime: 'text/plain', software: 'IDE' };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('No se pudo copiar el código:', error);
    }
  };

  const downloadAsFile = () => {
    const element = document.createElement('a');
    const fileName = `${result.plcBrand.replace(/[\s-]+/g, '_')}_code${plcInfo.ext}`;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.code));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsZip = async () => {
    setExporting(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const codeFileName = `main_program${plcInfo.ext}`;
      zip.file(codeFileName, result.code);
      
      const readmeContent = [
        '# Resultados de generación PLC',
        '',
        '## Datos del proyecto',
        '| Propiedad | Valor |',
        '|-----------|-------|',
        `| Marca | ${result.plcBrand} |`,
        `| Modelo | ${result.plcModel} |`,
        `| Lenguaje | ${result.language.toUpperCase()} |`,
        `| Fecha de generación | ${new Date(result.timestamp).toISOString()} |`,
        `| Software compatible | ${plcInfo.software} |`,
        `| Extensión | ${plcInfo.ext} |`,
        '',
        '## Requerimiento original',
        result.description,
        '',
        '## Métricas del código',
        `- Líneas totales: ${result.code.split('\n').length}`,
        `- Caracteres: ${result.code.length}`,
        `- Líneas comentadas: ${(result.code.match(/--\s*|\/\/\s*|#\s*|\(\*|\*\)/g) || []).length}`,
        '',
        '## Instrucciones de importación',
        '',
        `### ${plcInfo.software}`,
        `1. Abre ${plcInfo.software} y crea/importa tu proyecto.`,
        `2. Importa el archivo \`${codeFileName}\` en los bloques necesarios.`,
        '3. Ajusta direcciones de I/O a tu hardware.',
        '4. Compila y corrige advertencias.',
        '5. Prueba en simulación antes de desplegar.',
        '',
        '## Aviso de seguridad',
        'Valida el código en un entorno controlado y documenta pruebas FAT/SAT antes de producción.',
        '',
        '---',
        'Generado por PLC AI Studio',
      ].join('\n');

      zip.file('README.md', readmeContent);

      // Archivo auxiliar con sugerencias de configuración
      const configContent = [
        `// Notas de configuración para ${result.plcBrand}`,
        `// Software: ${plcInfo.software}`,
        `// Formato: ${plcInfo.ext}`,
        '',
        '/*',
        '  PLANTILLA DE MAPEOS I/O',
        '  =======================',
        '  ',
        '  Entradas digitales:',
        '  - I0.0: [Descripción]',
        '  - I0.1: [Descripción]',
        '  ',
        '  Salidas digitales:',
        '  - Q0.0: [Descripción]',
        '  - Q0.1: [Descripción]',
        '  ',
        '  Entradas analógicas:',
        '  - AI0: [Descripción]',
        '  ',
        '  Salidas analógicas:',
        '  - AO0: [Descripción]',
        '  ',
        '  IMPORTANTE: Ajusta las direcciones a tu arquitectura real.',
        '*/',
      ].join('\n');
      zip.file('io_mapping.txt', configContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.plcBrand.replace(/[\s-]+/g, '_')}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('No se pudo crear el ZIP:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-slate-900 font-semibold">Código generado</h2>
            <p className="text-xs text-slate-500">{result.language.toUpperCase()} · {result.plcBrand}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-mono border border-slate-200">
            {plcInfo.ext}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Metadatos */}
        <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Software</p>
            <p className="text-sm text-slate-900 font-medium">{plcInfo.software}</p>
          </div>
          <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Modelo</p>
            <p className="text-sm text-slate-900 font-medium">{result.plcModel}</p>
          </div>
          <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Generado</p>
            <p className="text-sm text-slate-900 font-medium">
              {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Métricas */}
        <CodeStats code={result.code} />

        {/* Editor */}
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90">
            <span className="text-xs text-slate-200 font-mono">main_program{plcInfo.ext}</span>
            <button
              onClick={copyToClipboard}
              className="text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <SyntaxHighlighter code={result.code} language={result.language} />
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadAsFile}
            disabled={loading}
            className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar {plcInfo.ext}
          </button>
          <button
            onClick={downloadAsZip}
            disabled={loading || exporting}
            className="px-4 py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow"
          >
            {exporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Descargar proyecto</span>
              </>
            )}
          </button>
        </div>

        {/* Requerimiento original */}
        {result.description && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Requerimiento original
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
