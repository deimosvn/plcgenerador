import React from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/plcicon.png" alt="PLC AI Studio" className="h-8 w-8 object-contain brightness-0 invert" />
            <span className="text-white font-bold text-lg tracking-tight">PLC AI Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Cómo funciona</a>
            <Link href="/studio" className="hover:text-white transition-colors">Comunidad</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/studio" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/studio" className="text-sm font-semibold bg-white text-[#0d1117] px-4 py-2 rounded-md hover:bg-slate-200 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero (GitHub style dark) ─── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0d1117] overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              Presentando PLC AI Studio v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Construye el código de <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                la industria del futuro.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed">
              La primera plataforma impulsada por Inteligencia Artificial para generar, auditar y optimizar código PLC. Diseñada para ingenieros de automatización que exigen la máxima precisión y seguridad.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/studio" className="px-8 py-4 bg-white text-[#0d1117] font-bold rounded-lg text-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                Empezar a programar
              </Link>
              <a href="#features" className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg text-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                Explorar funciones
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#161b22] p-6 transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="text-xs text-slate-500 font-mono ml-2">studio.plc-ai.app</div>
               </div>
               <pre className="text-sm font-mono text-slate-300 overflow-hidden leading-relaxed">
                 <code className="text-blue-400">PROGRAM</code> Main<br/>
                 <code className="text-blue-400">VAR</code><br/>
                 &nbsp;&nbsp;xStart : <code className="text-purple-400">BOOL</code>;<br/>
                 &nbsp;&nbsp;xMotor : <code className="text-purple-400">BOOL</code>;<br/>
                 <code className="text-blue-400">END_VAR</code><br/><br/>
                 <span className="text-slate-500">(* Generado y auditado por IA *)</span><br/>
                 <code className="text-blue-400">IF</code> xStart <code className="text-blue-400">THEN</code><br/>
                 &nbsp;&nbsp;xMotor := <code className="text-orange-400">TRUE</code>;<br/>
                 <code className="text-blue-400">END_IF</code>;
               </pre>
             </div>
          </div>
        </div>
      </section>

      {/* ─── Features (Light theme) ─── */}
      <section id="features" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Potencia tu ingeniería con herramientas de próxima generación.</h2>
            <p className="text-lg text-slate-600 max-w-2xl">Automatiza las tareas repetitivas y enfócate en el diseño lógico de alto nivel. PLC AI Studio te respalda en cada paso del desarrollo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all bg-white group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Generación IEC 61131-3</h3>
              <p className="text-slate-600 leading-relaxed">
                Transforma descripciones en lenguaje natural en código estructurado (ST, Ladder, etc.) compatible con más de 16 marcas industriales incluyendo Siemens y Allen-Bradley.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all bg-white group hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Auditoría Inteligente</h3>
              <p className="text-slate-600 leading-relaxed">
                Sube tus archivos PLC existentes y permite que la IA actúe como un auditor experto, detectando fallas lógicas, errores de seguridad (SIL/PL) y proponiendo mejoras.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all bg-white group hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Comunidad Global</h3>
              <p className="text-slate-600 leading-relaxed">
                Comparte tus soluciones, descubre lógicas optimizadas por otros ingenieros y colabora en el ecosistema abierto más grande de automatización industrial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
               <img src="/plcicon.png" alt="Icon" className="h-6 w-6 brightness-0 invert opacity-70" />
               <span className="text-white font-bold tracking-tight">PLC AI Studio</span>
            </div>
            <p className="text-sm max-w-sm">
              Plataforma generativa de código industrial basada en los modelos más avanzados de IA.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studio" className="hover:text-white transition-colors">Generador</Link></li>
              <li><Link href="/studio" className="hover:text-white transition-colors">Auditoría</Link></li>
              <li><Link href="/studio" className="hover:text-white transition-colors">Comunidad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Compañía</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
