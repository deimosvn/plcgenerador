'use client';

import React, { useState } from 'react';
import { PLC_BRANDS_GROUPED, PLC_LANGUAGES, SAFETY_LEVELS, APP_CONFIG } from '@/lib/constants';
import { TemplateBrowser } from './template-browser';
import type { GenerationFormData, PLCBrandKey, PLCLanguage, SafetyLevel } from '@/types';

interface GeneratorFormProps {
  onGenerate: (data: GenerationFormData) => void;
  onCancel?: () => void;
  loading: boolean;
  /** Texto inicial (p.ej. precargado desde un diagrama). */
  initialDescription?: string;
}

export function GeneratorForm({ onGenerate, onCancel, loading, initialDescription = '' }: GeneratorFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [plcBrand, setPlcBrand] = useState<string>('siemens-s7-1200');
  const [plcModel, setPlcModel] = useState('');
  const [language, setLanguage] = useState<PLCLanguage>('st');
  const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>('none');
  const [includeComments, setIncludeComments] = useState(true);
  const [includeIOMapping, setIncludeIOMapping] = useState(true);
  const [includeErrorHandling, setIncludeErrorHandling] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const charCount = description.length;
  const charPercentage = Math.min((charCount / APP_CONFIG.maxDescriptionLength) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < APP_CONFIG.minDescriptionLength) return;
    onGenerate({
      description: description.trim(),
      plcBrand,
      plcModel: plcModel || '',
      language,
      safetyLevel,
      includeComments,
      includeIOMapping,
      includeErrorHandling,
    });
  };

  const useTemplate = (template: string) => {
    setDescription(template);
    setShowTemplates(false);
  };

  const selectedLang = PLC_LANGUAGES.find((l) => l.key === language);
  const isValid = description.trim().length >= APP_CONFIG.minDescriptionLength;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ─── Descripción del proceso ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-zinc-300">Descripción del proceso</label>
          <span className={`text-xs tabular-nums ${charCount < APP_CONFIG.minDescriptionLength ? 'text-red-400' : 'text-zinc-500'}`}>
            {charCount.toLocaleString()} / {APP_CONFIG.maxDescriptionLength.toLocaleString()}
          </span>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu proceso: entradas, salidas, secuencias, condiciones de seguridad, alarmas, enclavamientos, tiempos de respuesta..."
          className="field px-4 py-3 text-sm resize-none"
          rows={5}
          maxLength={APP_CONFIG.maxDescriptionLength}
          disabled={loading}
        />
        <div className="mt-1.5 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              charCount < APP_CONFIG.minDescriptionLength ? 'bg-red-400/60' : charPercentage > 80 ? 'bg-amber-400' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.max(charPercentage, 1)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-zinc-500">
            {charCount < APP_CONFIG.minDescriptionLength
              ? `Mínimo ${APP_CONFIG.minDescriptionLength} caracteres (faltan ${APP_CONFIG.minDescriptionLength - charCount})`
              : 'Descripción válida. Cuanto más detalle, mejor resultado.'}
          </p>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            {showTemplates ? 'Cerrar' : 'Plantillas'}
          </button>
        </div>
      </div>

      {showTemplates && (
        <div className="rounded-2xl p-4 border border-white/[0.08] bg-white/[0.03]">
          <TemplateBrowser onSelectTemplate={useTemplate} />
        </div>
      )}

      {/* ─── Marca del PLC ─── */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Equipo PLC</label>
        <select
          value={plcBrand}
          onChange={(e) => {
            setPlcBrand(e.target.value as PLCBrandKey);
            setPlcModel('');
          }}
          className="field px-4 py-2.5 text-sm cursor-pointer"
          disabled={loading}
        >
          {Object.entries(PLC_BRANDS_GROUPED).map(([manufacturer, brands]) => (
            <optgroup key={manufacturer} label={manufacturer}>
              {brands.map((brand) => (
                <option key={brand.key} value={brand.key}>
                  {brand.label} - {brand.software}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ─── Modelo personalizado ─── */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Modelo / CPU específica (opcional)</label>
        <input
          type="text"
          value={plcModel}
          onChange={(e) => setPlcModel(e.target.value)}
          placeholder="Ej: CPU 1214C DC/DC/DC, 5069-L306ER..."
          className="field px-4 py-2.5 text-sm"
          disabled={loading}
        />
      </div>

      {/* ─── Lenguaje de programación ─── */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Lenguaje de programación</label>
        <div className="grid grid-cols-3 gap-2">
          {PLC_LANGUAGES.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setLanguage(opt.key)}
              disabled={loading}
              className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                language === opt.key
                  ? 'bg-blue-600/15 border-blue-500/40 text-white ring-1 ring-blue-500/30'
                  : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
              }`}
            >
              <span className="block text-xs font-semibold">{opt.shortLabel}</span>
              <span className="block text-[10px] text-zinc-500 mt-0.5 leading-tight">{opt.label.split(' (')[0]}</span>
            </button>
          ))}
        </div>
        {selectedLang && (
          <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
            <span className="font-medium text-zinc-400">{selectedLang.standard}</span> · {selectedLang.description}
          </p>
        )}
      </div>

      {/* ─── Opciones avanzadas ─── */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium">Opciones avanzadas</span>
          <span className="text-xs text-zinc-600 group-hover:text-zinc-500">Seguridad, comentarios, I/O</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Nivel de seguridad requerido</label>
              <select
                value={safetyLevel}
                onChange={(e) => setSafetyLevel(e.target.value as SafetyLevel)}
                className="field px-3 py-2 text-sm"
                disabled={loading}
              >
                {SAFETY_LEVELS.map((level) => (
                  <option key={level.key} value={level.key}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'comments', label: 'Incluir comentarios detallados', value: includeComments, setter: setIncludeComments },
                { id: 'io', label: 'Incluir tabla de mapeo I/O', value: includeIOMapping, setter: setIncludeIOMapping },
                { id: 'errors', label: 'Incluir manejo de errores y diagnósticos', value: includeErrorHandling, setter: setIncludeErrorHandling },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" checked={opt.value} onChange={(e) => opt.setter(e.target.checked)} className="sr-only peer" disabled={loading} />
                    <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                      {opt.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Submit ─── */}
      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/[0.06] text-white disabled:text-zinc-600 font-semibold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:shadow-none active:scale-[0.99]"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Generando código PLC...</span>
          </>
        ) : (
          <span>Generar código PLC</span>
        )}
      </button>

      {loading && onCancel && (
        <button type="button" onClick={onCancel} className="w-full -mt-2 px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
          Cancelar generación
        </button>
      )}
    </form>
  );
}
