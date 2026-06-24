'use client';

import React, { useRef, useState } from 'react';
import { extractFromDiagram } from '@/lib/gemini-client';
import { MAX_VISION_BYTES } from '@/lib/validation';
import type { ExtractionData } from '@/types';

interface DiagramExtractorProps {
  /** Lleva la descripción sugerida al generador de código. */
  onUse: (description: string) => void;
}

const TYPE_BADGE: Record<string, string> = {
  DI: 'bg-blue-100 text-blue-700 border-blue-200',
  DO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  AI: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  AO: 'bg-violet-100 text-violet-700 border-violet-200',
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma !== -1 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

export function DiagramExtractor({ onUse }: DiagramExtractorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [base64, setBase64] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ExtractionData | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResult(null);

    if (file.size > MAX_VISION_BYTES) {
      setError(`El archivo supera el máximo de ${(MAX_VISION_BYTES / (1024 * 1024)).toFixed(0)} MB.`);
      return;
    }

    try {
      const data = await fileToBase64(file);
      setBase64(data);
      setMimeType(file.type);
      setFileName(file.name);
      setPreviewUrl(file.type.startsWith('image/') ? `data:${file.type};base64,${data}` : '');
    } catch {
      setError('No se pudo leer el archivo.');
    }
  };

  const handleExtract = async () => {
    if (!base64 || !mimeType) return;
    setLoading(true);
    setError('');
    try {
      const data = await extractFromDiagram({ mimeType, data: base64 });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo analizar el diagrama.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFileName('');
    setPreviewUrl('');
    setBase64('');
    setMimeType('');
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="rounded-2xl glass-panel p-6 shadow-lg">
        <div className="mb-5 text-center">
          <h3 className="text-xl font-bold text-slate-800">Extraer I/O desde un diagrama</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
            Sube una foto o PDF de tu esquema eléctrico / plano de conexión. La IA identifica las
            entradas y salidas y prepara una descripción lista para generar el código.
          </p>
        </div>

        <input
          type="file"
          ref={inputRef}
          onChange={handleFile}
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
        />

        {!fileName ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l4.5-4.5 3 3 4.5-4.5 6 6M3 16.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18v-1.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">Haz clic para subir tu diagrama</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP o PDF · máx {(MAX_VISION_BYTES / (1024 * 1024)).toFixed(0)} MB</p>
          </button>
        ) : (
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <div className="flex items-center gap-4">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- vista previa local del archivo subido (data URL)
                <img src={previewUrl} alt="Vista previa" className="h-20 w-20 object-cover rounded-lg border border-slate-200" />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 text-xs font-mono">PDF</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{fileName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{mimeType}</p>
              </div>
              <button onClick={reset} className="text-xs text-slate-500 hover:text-red-500 transition-colors">
                Quitar
              </button>
            </div>

            {!result && (
              <button
                onClick={handleExtract}
                disabled={loading}
                className="mt-4 w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analizando diagrama...
                  </>
                ) : (
                  'Extraer I/O y dispositivos'
                )}
              </button>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      </div>

      {result && (
        <div className="rounded-2xl glass-panel p-6 shadow-lg space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Resumen</h4>
            <p className="text-sm text-slate-600">{result.summary}</p>
          </div>

          {result.io?.length > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
                Entradas / Salidas detectadas ({result.io.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 bg-slate-50/50">
                      <th className="px-4 py-2 font-medium">Tipo</th>
                      <th className="px-4 py-2 font-medium">Tag</th>
                      <th className="px-4 py-2 font-medium">Descripción</th>
                      <th className="px-4 py-2 font-medium">Señal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.io.map((io, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-4 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${TYPE_BADGE[io.type?.toUpperCase()] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {io.type?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-slate-800">{io.tag}</td>
                        <td className="px-4 py-2 text-slate-600">{io.description}</td>
                        <td className="px-4 py-2 text-slate-500 text-xs">{io.signal || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.devices?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Dispositivos</h4>
              <div className="flex flex-wrap gap-2">
                {result.devices.map((d, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-600 border border-slate-200">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.notes && result.notes.length > 0 && (
            <ul className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5">
              {result.notes.map((n, i) => (
                <li key={i} className="text-xs text-amber-700 flex gap-2">
                  <span className="text-amber-500">•</span>
                  {n}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => onUse(result.suggestedDescription || result.summary)}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Usar en el generador de código
            </button>
            <button onClick={reset} className="px-5 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              Analizar otro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
