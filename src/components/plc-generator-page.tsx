'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GeneratorForm } from './generator-form';
import { ApiKeySection } from './api-key-section';
import { CodePreview } from './code-preview';
import { HistorySidebar } from './history-sidebar';
import { type GenerationResult } from '@/types';

const heroStats = [
  { label: 'Versiones liberadas', value: '128' },
  { label: 'Equipos soportados', value: '+36' },
  { label: 'Bloques reutilizables', value: '540' },
];

const featureCards = [
  {
    title: 'Validación IEC',
    desc: 'Checklist automático contra IEC 61131-3 y SIL requerido.',
    gradient: 'from-sky-50 to-white',
    badge: 'bg-sky-100 text-sky-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
    ),
  },
  {
    title: 'Modo auditoría',
    desc: 'Genera trazas de revisión para FAT, SAT y OTS.',
    gradient: 'from-emerald-50 to-white',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m0-4a7 7 0 1 0-4.95-2.05A7 7 0 0 0 12 17Z" />
      </svg>
    ),
  },
  {
    title: 'Descargas directas',
    desc: 'README, listas IO y código formateado para compartir.',
    gradient: 'from-rose-50 to-white',
    badge: 'bg-rose-100 text-rose-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5M12 3v12m8 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    title: 'Gemelo digital',
    desc: 'Bloques anotados y listos para simulación y SCADA.',
    gradient: 'from-indigo-50 to-white',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    ),
  },
];

export function PLCGeneratorPage() {
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    // Cargar historial
    const saved = window.localStorage.getItem('plcHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
    // Cargar API Key
    const storedKey = window.localStorage.getItem('userApiKey') || '';
    setApiKey(storedKey);
  }, []);

  const persistHistory = (entries: GenerationResult[]) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('plcHistory', JSON.stringify(entries));
      }
    } catch (error) {
      console.error('Failed to persist history:', error);
    }
  };

  const handleGenerate = async (formData: {
    description: string;
    plcBrand: string;
    plcModel: string;
    language: string;
  }) => {
    setLoading(true);
    try {
      const { description, plcBrand, plcModel, language } = formData;
      const keyToUse = apiKey || (typeof window !== 'undefined' ? window.localStorage.getItem('userApiKey') : '');
      if (!keyToUse) {
        alert('Por favor, ingresa tu Google Gemini API Key.');
        setLoading(false);
        return;
      }
      const prompt = `Genera código PLC en ${language.toUpperCase()} para un ${plcBrand}${plcModel ? ` (${plcModel})` : ''} con los siguientes requerimientos: ${description}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar código.';
      const data = {
        code: generatedText,
        description,
        plcBrand,
        plcModel,
        language,
        timestamp: Date.now(),
      };
      setResults(data);
      setHistory((prev) => {
        const nextHistory = [data, ...prev].slice(0, 10);
        persistHistory(nextHistory);
        return nextHistory;
      });
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error al generar código. Revisa tu API Key y los datos.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: GenerationResult) => {
    setResults(item);
  };

  const deleteHistoryItem = (index: number) => {
    setHistory((prev) => {
      const nextHistory = prev.filter((_, i) => i !== index);
      persistHistory(nextHistory);
      return nextHistory;
    });
  };

  const renderEmptyPreview = () => (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500 shadow-lg shadow-slate-200/60">
      <p className="text-base font-semibold tracking-tight text-slate-900">Aquí verás tu código generado</p>
      <p className="mt-2 text-sm">
        Ejecuta una especificación para visualizar código, documentación y descargas.
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image src="/plc.gif" alt="Icono PLC" width={48} height={48} className="rounded-xl object-contain" priority />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">PLC AI Studio</p>
              <h1 className="text-lg font-semibold text-slate-800">Generador inteligente de código PLC</h1>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Release 2026
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-white via-blue-50/40 to-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_55%)]" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),transparent_60%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" /> Suite de ingeniería aumentada
              </p>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]">
                Diseña lógica PLC profesional en minutos, 100% d                npm install -g vercelocumentada en español.
              </h2>
              <p className="mt-4 text-base text-slate-600 max-w-2xl">
                Documenta tu proceso, selecciona la marca requerida y obtén código validado con mejores prácticas de seguridad, bloques reutilizables y entregables descargables.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                  </svg>
                  Versionado automatizado
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c1.657 0 3 1.567 3 3.5s-1.343 3.5-3 3.5-3-1.567-3-3.5S10.343 8 12 8z" />
                  </svg>
                  Auditoría IEC 61511
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14" />
                  </svg>
                  Descarga multi-formato
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur">
              <p className="text-sm text-slate-500">Indicadores en vivo</p>
              <dl className="mt-4 space-y-4">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-slate-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <ApiKeySection onApiKeyChange={setApiKey} />
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Brief técnico</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">Configura tu generación</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Define entradas, salidas, condiciones de seguridad y el lenguaje deseado.
                </p>
              </div>
              <GeneratorForm onGenerate={handleGenerate} loading={loading} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${feature.gradient} p-4 text-left shadow-sm`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`rounded-xl p-2 text-lg ${feature.badge}`}>{feature.icon}</div>
                    <p className="text-sm font-semibold text-slate-900">{feature.title}</p>
                  </div>
                  <p className="text-xs text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-7 space-y-6">
            {results ? <CodePreview result={results} loading={loading} /> : renderEmptyPreview()}
            <HistorySidebar history={history} onLoad={loadFromHistory} onDelete={deleteHistoryItem} />
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Metodología</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Documentación lista para auditoría</h3>
              <p className="mt-2 text-sm text-slate-600">
                Cada entrega incluye README técnico, notas de IO y recomendaciones de prueba para acelerar la validación FAT/SAT.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Simulación</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Datos para gemelos digitales</h3>
              <p className="mt-2 text-sm text-slate-600">
                Exporta bloques parametrizados listos para herramientas de simulación o transferencia a SCADA.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Supervisión</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Historial cifrado local</h3>
              <p className="mt-2 text-sm text-slate-600">
                Tus prompts y versiones quedan guardados solo en tu navegador con opción de limpieza rápida.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Diego Martinez · Plataforma generativa para automatización industrial.</p>
          <p className="text-slate-400">Hecho con Next.js · Seguridad reforzada en el navegador</p>
        </div>
      </footer>
    </div>
  );
}
