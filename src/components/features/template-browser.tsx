'use client';

import React, { useState, useMemo } from 'react';
import { TEMPLATE_LIBRARY, TEMPLATE_CATEGORIES } from '@/lib/constants';
import type { TemplateCategory } from '@/types';

interface TemplateBrowserProps {
  onSelectTemplate: (template: string) => void;
}

export function TemplateBrowser({ onSelectTemplate }: TemplateBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let templates = TEMPLATE_LIBRARY;

    if (activeCategory !== 'todas') {
      templates = templates.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return templates;
  }, [activeCategory, searchQuery]);

  const difficultyColors = {
    'básico': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'intermedio': 'bg-amber-100 text-amber-700 border-amber-200',
    'avanzado': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Plantillas de proyecto</h3>
        <span className="text-xs text-slate-400">{filtered.length} disponibles</span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar plantilla..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory('todas')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'todas'
              ? 'bg-sky-100 text-sky-700 border border-sky-200'
              : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
          }`}
        >
          Todas
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as TemplateCategory)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.key
                ? 'bg-sky-100 text-sky-700 border border-sky-200'
                : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.template)}
            className="text-left p-3 bg-white hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-200 transition-all group shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={template.icon} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                    {template.name}
                  </p>
                  <span className={`flex-shrink-0 px-1.5 py-0 rounded text-[10px] font-medium border ${difficultyColors[template.difficulty]}`}>
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{template.description}</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0 rounded bg-slate-100 text-[10px] text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-6 text-sm text-slate-400">
          No se encontraron plantillas para esta búsqueda.
        </div>
      )}
    </div>
  );
}
