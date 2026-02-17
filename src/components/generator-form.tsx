'use client';

import React, { useState } from 'react';
import { TemplateBrowser } from './template-library';

const PLC_BRANDS = [
  { label: 'Siemens S7-1200', value: 'Siemens S7-1200', ext: '.scl' },
  { label: 'Siemens S7-1500', value: 'Siemens S7-1500', ext: '.scl' },
  { label: 'Allen-Bradley CompactLogix', value: 'Allen-Bradley CompactLogix', ext: '.L5X' },
  { label: 'Allen-Bradley ControlLogix', value: 'Allen-Bradley ControlLogix', ext: '.L5X' },
  { label: 'Mitsubishi FX5U', value: 'Mitsubishi FX5U', ext: '.gxw' },
  { label: 'Mitsubishi Q Series', value: 'Mitsubishi Q Series', ext: '.gxw' },
  { label: 'Omron CP1E', value: 'Omron CP1E', ext: '.cxp' },
  { label: 'Omron CJ2M', value: 'Omron CJ2M', ext: '.cxp' },
];

const LANGUAGE_OPTIONS = [
  { label: 'Diagrama Ladder (LAD)', value: 'ladder', desc: 'Lógica visual con peldaños, contactos y bobinas' },
  { label: 'Texto Estructurado (ST)', value: 'st', desc: 'Sintaxis similar a Pascal para lógica compleja' },
  { label: 'Bloques Funcionales (FBD)', value: 'fbd', desc: 'Bloques gráficos con conexiones intuitivas' },
  { label: 'Lista de Instrucciones (IL)', value: 'il', desc: 'Instrucciones de bajo nivel tipo ensamblador' },
];

interface GeneratorFormProps {
  onGenerate: (data: {
    description: string;
    plcBrand: string;
    plcModel: string;
    language: string;
  }) => void;
  loading: boolean;
}

export function GeneratorForm({ onGenerate, loading }: GeneratorFormProps) {
  const [description, setDescription] = useState('');
  const [plcBrand, setPlcBrand] = useState('Siemens S7-1200');
  const [plcModel, setPlcModel] = useState('');
  const [language, setLanguage] = useState('ladder');
  const [charCount, setCharCount] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || description.trim().length < 10) {
      alert('Por favor ingresa una descripción detallada (mínimo 10 caracteres).');
      return;
    }

    // La API Key se gestiona desde el input principal, no desde localStorage
    onGenerate({
      description: description.trim(),
      plcBrand,
      plcModel: plcModel || 'Standard',
      language,
      apiKey: undefined,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharCount(e.target.value.length);
  };

  const useTemplate = (template: string) => {
    setDescription(template);
    setCharCount(template.length);
    setShowTemplates(false);
  };

  const selectedLang = LANGUAGE_OPTIONS.find(l => l.value === language);
  const selectedBrand = PLC_BRANDS.find(b => b.value === plcBrand);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Descripción */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">
            Descripción del proceso
          </label>
          <span className="text-xs text-slate-400 tabular-nums">
            {charCount} caracteres
          </span>
        </div>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Detalla las entradas, salidas, alarmas, enclavamientos y criterios de seguridad que debe cumplir tu lógica."
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 resize-none transition-all shadow-sm"
          rows={4}
          disabled={loading}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400">
            Se requieren al menos 10 caracteres
          </p>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs text-sky-600 hover:text-sky-500 transition-colors"
          >
            {showTemplates ? 'Ocultar plantillas' : 'Ver plantillas'}
          </button>
        </div>
      </div>

      {/* Template Browser */}
      {showTemplates && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <TemplateBrowser onSelectTemplate={useTemplate} />
        </div>
      )}

      {/* Marca y modelo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Marca del PLC
          </label>
          <select
            value={plcBrand}
            onChange={(e) => {
              setPlcBrand(e.target.value);
              setPlcModel('');
            }}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all appearance-none cursor-pointer shadow-sm"
            disabled={loading}
          >
            {PLC_BRANDS.map((brand) => (
              <option key={brand.value} value={brand.value} className="bg-white text-slate-900">
                {brand.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Modelo (opcional)
          </label>
          <input
            type="text"
            value={plcModel}
            onChange={(e) => setPlcModel(e.target.value)}
            placeholder="p. ej. CPU 1214C"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all shadow-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Lenguaje */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Lenguaje de programación
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLanguage(opt.value)}
              disabled={loading}
              className={`px-4 py-3 rounded-xl border text-left transition-all ${
                language === opt.value
                  ? 'bg-sky-100 border-sky-300 text-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="block text-sm font-medium">{opt.label.split(' (')[0]}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{opt.label.match(/\(([^)]+)\)/)?.[1]}</span>
            </button>
          ))}
        </div>
        {selectedLang && (
          <p className="mt-2 text-xs text-slate-500">{selectedLang.desc}</p>
        )}
      </div>

      {/* File Format Info */}
      {selectedBrand && (
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p className="text-xs text-slate-500">Formato generado para {selectedBrand.label.split(' ')[0]}</p>
            <p className="text-sm text-slate-900 font-mono">{selectedBrand.ext}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || charCount < 10}
        className="w-full px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:from-slate-200 disabled:to-slate-200 text-white font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Generando código...</span>
          </>
        ) : (
          <>
            <span>Generar código</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
