import React from 'react';

export function CommunityPanel() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-2xl glass-panel p-8 text-center">
        <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Comunidad PLC</h2>
        <p className="text-zinc-400 mb-6 max-w-lg mx-auto leading-relaxed">
          Próximamente podrás subir tus archivos PLC, describir lo que hacen y compartirlos con otros ingenieros.
          Podrán darle «like» y descargar tus aportes.
        </p>
        <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-10 bg-white/[0.02]">
          <p className="text-zinc-500 font-medium">
            Espacio reservado para subir archivos y publicar.
            <span className="text-xs font-normal mt-1 block text-zinc-600">(Pendiente de integración con base de datos.)</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl glass-panel p-8 text-center opacity-60">
        <p className="text-zinc-500 font-medium">Espacio reservado para el feed de la comunidad y el sistema de likes.</p>
      </div>
    </div>
  );
}
