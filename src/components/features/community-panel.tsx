import React from 'react';

export function CommunityPanel() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="rounded-2xl glass-panel p-8 shadow-lg text-center bg-white/50">
        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Comunidad PLC</h2>
        <p className="text-slate-500 mb-6 max-w-lg mx-auto">
          Próximamente podrás subir tus archivos PLC, describir lo que hacen y compartirlos con otros usuarios de la comunidad. ¡Podrán darle «like» y descargar tus aportes!
        </p>
        
        {/* Espacio en blanco reservado para el formulario de subida (futuro) */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 bg-slate-50/50">
          <p className="text-slate-400 font-medium">
            [ Espacio reservado para formulario de subida de archivos y publicación ]<br/>
            <span className="text-xs font-normal mt-1 block">(Pendiente de integración con base de datos)</span>
          </p>
        </div>
      </div>
      
      {/* Espacio reservado para el Feed de posts */}
      <div className="rounded-2xl glass-panel p-8 shadow-lg text-center opacity-60 bg-white/30 border border-slate-200">
        <p className="text-slate-400 font-medium">
          [ Espacio reservado para el feed de la comunidad y sistema de likes ]
        </p>
      </div>
    </div>
  );
}
