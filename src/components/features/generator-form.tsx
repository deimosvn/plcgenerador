'use client';

import React, { useState } from 'react';
import { PLC_BRANDS_GROUPED, PLC_LANGUAGES, SAFETY_LEVELS, APP_CONFIG } from '@/lib/constants';
import { TemplateBrowser } from './template-browser';
import type { GenerationFormData, PLCBrandKey, PLCLanguage, SafetyLevel } from '@/types';

interface GeneratorFormProps {
  onGenerate: (data: GenerationFormData) => void;
  loading: boolean;
}

export function GeneratorForm({ onGenerate, loading }: GeneratorFormProps) {
  const [description, setDescription] = useState('');
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

    if (!description.trim() || description.trim().length < APP_CONFIG.minDescriptionLength) {
      return;
    }

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
          <label className="text-sm font-medium text-slate-700">
            Descripción del proceso
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-xs tabular-nums ${charCount < APP_CONFIG.minDescriptionLength ? 'text-red-400' : 'text-slate-400'}`}>
              {charCount.toLocaleString()} / {APP_CONFIG.maxDescriptionLength.toLocaleString()}
            </span>
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu proceso de automatización con el mayor detalle posible: entradas, salidas, secuencias, condiciones de seguridad, alarmas, enclavamientos, tiempos de respuesta..."
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 resize-none transition-all shadow-sm"
          rows={5}
          maxLength={APP_CONFIG.maxDescriptionLength}
          disabled={loading}
        />
        {/* Progress bar */}
        <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              charCount < APP_CONFIG.minDescriptionLength
                ? 'bg-red-300'
                : charPercentage > 80
                ? 'bg-amber-400'
                : 'bg-sky-400'
            }`}
            style={{ width: `${Math.max(charPercentage, 1)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400">
            {charCount < APP_CONFIG.minDescriptionLength
              ? `Mínimo ${APP_CONFIG.minDescriptionLength} caracteres (faltan ${APP_CONFIG.minDescriptionLength - charCount})`
              : 'Descripción válida — cuanto más detalle, mejor resultado'}
          </p>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs text-sky-600 hover:text-sky-500 transition-colors font-medium"
          >
            {showTemplates ? '✕ Cerrar' : '📋 Plantillas'}
          </button>
        </div>
      </div>

      {/* Template Browser */}
      {showTemplates && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
          <TemplateBrowser onSelectTemplate={useTemplate} />
        </div>
      )}

      {/* ─── Marca del PLC ─── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Equipo PLC
        </label>
        <select
          value={plcBrand}
          onChange={(e) => {
            setPlcBrand(e.target.value as PLCBrandKey);
            setPlcModel('');
          }}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all appearance-none cursor-pointer shadow-sm"
          disabled={loading}
        >
          {Object.entries(PLC_BRANDS_GROUPED).map(([manufacturer, brands]) => (
            <optgroup key={manufacturer} label={manufacturer}>
              {brands.map((brand) => (
                <option key={brand.key} value={brand.key}>
                  {brand.label} — {brand.software}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ─── Modelo personalizado ─── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Modelo / CPU específica (opcional)
        </label>
        <input
          type="text"
          value={plcModel}
          onChange={(e) => setPlcModel(e.target.value)}
          placeholder="Ej: CPU 1214C DC/DC/DC, 5069-L306ER..."
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all shadow-sm"
          disabled={loading}
        />
      </div>

      {/* ─── Lenguaje de programación ─── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Lenguaje de programación
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PLC_LANGUAGES.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setLanguage(opt.key)}
              disabled={loading}
              className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                language === opt.key
                  ? 'bg-sky-50 border-sky-300 text-slate-800 shadow-sm ring-1 ring-sky-200'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="block text-xs font-semibold">{opt.shortLabel}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.label.split(' (')[0]}</span>
            </button>
          ))}
        </div>
        {selectedLang && (
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            <span className="font-medium">{selectedLang.standard}</span> — {selectedLang.description}
          </p>
        )}
      </div>

      {/* ─── Opciones avanzadas ─── */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors group"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium">Opciones avanzadas</span>
          <span className="text-xs text-slate-400 group-hover:text-slate-500">Seguridad, comentarios, I/O</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            {/* Safety Level */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Nivel de seguridad requerido
              </label>
              <select
                value={safetyLevel}
                onChange={(e) => setSafetyLevel(e.target.value as SafetyLevel)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                disabled={loading}
              >
                {SAFETY_LEVELS.map((level) => (
                  <option key={level.key} value={level.key}>
                    {level.label} — {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5">
              {[
                { id: 'comments', label: 'Incluir comentarios detallados', value: includeComments, setter: setIncludeComments },
                { id: 'io', label: 'Incluir tabla de mapeo I/O', value: includeIOMapping, setter: setIncludeIOMapping },
                { id: 'errors', label: 'Incluir manejo de errores y diagnósticos', value: includeErrorHandling, setter: setIncludeErrorHandling },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={opt.value}
                      onChange={(e) => opt.setter(e.target.checked)}
                      className="sr-only peer"
                      disabled={loading}
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-all flex items-center justify-center">
                      {opt.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                    {opt.label}
                  </span>
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
        className="w-full px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:from-slate-200 disabled:to-slate-300 text-white disabled:text-slate-400 font-semibold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-sky-500/20 disabled:shadow-none"
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
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            <span>Generar código PLC</span>
          </>
        )}
      </button>
    </form>
  );
}
