"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  APP_CONFIG,
  PLC_BRANDS,
  PLC_BRANDS_GROUPED,
  PLC_LANGUAGES,
  SAFETY_LEVELS,
} from '@/lib/constants';

const BRAND_COUNT = Object.keys(PLC_BRANDS).length;
const MANUFACTURER_COUNT = Object.keys(PLC_BRANDS_GROUPED).length;
const LANGUAGE_COUNT = PLC_LANGUAGES.length;
const SAFETY_COUNT = SAFETY_LEVELS.filter((s) => s.key !== 'none').length;

// ─── Iconos (heroicons outline) ───────────────────────────────
const icons = {
  bolt: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  shield: 'M9 12.75L11.25 15 15 9.75M21 12c0 4.97-3.582 9.21-8.4 9.95a1 1 0 01-.6 0C7.582 21.21 4 16.97 4 12V6.3a1 1 0 01.6-.92l7-3a1 1 0 01.8 0l7 3a1 1 0 01.6.92V12z',
  cpu: 'M9 3v2.25M15 3v2.25M9 18.75V21M15 18.75V21M3 9h2.25M3 15h2.25M18.75 9H21M18.75 15H21M6.75 6.75h10.5v10.5H6.75zM9.75 9.75h4.5v4.5h-4.5z',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25M6.75 17.25L1.5 12l5.25-5.25M14.25 3.75l-4.5 16.5',
  audit: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z',
  server: 'M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z',
  gauge: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  check: 'M4.5 12.75l6 6 9-13.5',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z',
};

function Icon({ d, className = 'w-6 h-6' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const FEATURES = [
  {
    icon: icons.bolt,
    color: 'text-white bg-white/10',
    title: 'Generación IEC 61131-3',
    body: `Convierte una descripción en lenguaje natural en código estructurado y funcional, listo para importar en el IDE del fabricante.`,
  },
  {
    icon: icons.audit,
    color: 'text-white bg-white/10',
    title: 'Auditoría inteligente',
    body: `Sube tu código existente y recibe un análisis crítico: lógica del proceso, posibles fallas y aspectos de seguridad a reforzar.`,
  },
  {
    icon: icons.cpu,
    color: 'text-white bg-white/10',
    title: `${BRAND_COUNT} equipos PLC`,
    body: `Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider, Beckhoff y ABB — con su software, extensiones y protocolos nativos.`,
  },
  {
    icon: icons.code,
    color: 'text-white bg-white/10',
    title: `${LANGUAGE_COUNT} lenguajes normalizados`,
    body: `Texto Estructurado, Ladder, FBD, IL, SFC y GRAFCET. Elige el paradigma adecuado para cada parte de tu aplicación.`,
  },
  {
    icon: icons.shield,
    color: 'text-white bg-white/10',
    title: 'Seguridad funcional',
    body: `Solicita requisitos SIL 1-3 (IEC 61508/62061) o PL a-e (ISO 13849) y obtén código con diagnósticos y enclavamientos.`,
  },
  {
    icon: icons.download,
    color: 'text-white bg-white/10',
    title: 'Exportación profesional',
    body: `Descarga un .zip con el programa, README, tabla de mapeo I/O y un plan de pruebas FAT/SAT listo para firmar.`,
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Describe tu proceso',
    body: 'Detalla entradas, salidas, secuencias, alarmas y enclavamientos. O parte de una de las plantillas incluidas.',
  },
  {
    n: '02',
    title: 'Elige equipo y lenguaje',
    body: 'Selecciona la marca/CPU, el lenguaje IEC 61131-3 y, si aplica, el nivel de seguridad requerido.',
  },
  {
    n: '03',
    title: 'Genera, audita y exporta',
    body: 'Revisa el código resaltado, audita la lógica con IA y descarga el proyecto completo documentado.',
  },
];

const SECURITY_POINTS = [
  {
    icon: icons.server,
    title: 'Clave solo en el servidor',
    body: 'La clave de la IA vive en una variable de entorno del servidor. El navegador nunca la ve ni la transmite.',
  },
  {
    icon: icons.lock,
    title: 'Llamadas saneadas',
    body: 'Cada petición se valida (longitudes, marca y lenguaje permitidos) antes de llegar al modelo.',
  },
  {
    icon: icons.gauge,
    title: 'Límite de tasa por IP',
    body: 'Las rutas de la API aplican rate limiting para frenar abuso y ráfagas accidentales.',
  },
  {
    icon: icons.shield,
    title: 'Cabeceras endurecidas',
    body: 'CSP, anti-clickjacking (X-Frame-Options) y HSTS activos en toda la aplicación.',
  },
];

// Reutilizable Framer Motion variant para scroll reveals
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // El video hace un parallax sutil hacia abajo mientras hacemos scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-[#000000] text-slate-200 selection:bg-blue-600 selection:text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* ─── Navbar Transparente ─── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent pt-6 pb-12"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium text-lg tracking-[0.15em]">LogicPLC.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-12 text-[10px] font-medium text-slate-300 tracking-[0.2em] uppercase">
            <a href="#features" className="hover:text-white transition-colors">Capacidades</a>
            <a href="#brands" className="hover:text-white transition-colors">Compatibilidad</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Proceso</a>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md" title="Menu">
               <div className="grid grid-cols-2 gap-[4px] w-3.5 h-3.5">
                 {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-[1px] w-full h-full"></div>)}
               </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Immersive Video ─── */}
      <section ref={containerRef} className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
        
        {/* Video Background with Parallax */}
        <motion.div 
          style={{ y: videoY, scale: videoScale }}
          className="absolute inset-0 w-full h-full -z-20"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source src="/robot_optimized.mp4" type="video/mp4" />
          </video>
          {/* Vignette & Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_100%)] z-10 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
        </motion.div>

        {/* Hero Content (Centered) */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-30 flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl mt-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] font-medium tracking-[0.3em] text-white uppercase mb-8 backdrop-blur-xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
            El futuro de la automatización
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[80px] md:text-[140px] lg:text-[180px] font-medium tracking-tight text-white relative leading-[0.85]"
          >
            LOGIC
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-xl text-slate-300 max-w-2xl mt-10 leading-relaxed font-light"
          >
            Genera, audita y optimiza código PLC en segundos con IA. 
            La plataforma definitiva para ingenieros que exigen la máxima precisión bajo estándares IEC.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex items-center gap-6"
          >
            <Link href="/studio" className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-white text-black text-[12px] font-semibold tracking-[0.2em] uppercase rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
              <span className="relative z-10">EMPEZAR AHORA</span>
              <Icon d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30"
        >
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-slate-500">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* ─── Características ─── */}
      <section id="features" className="py-32 bg-[#000000] relative z-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={fadeInUp} className="max-w-3xl mb-24">
            <span className="text-[10px] font-medium text-blue-500 uppercase tracking-[0.3em]">Capacidades</span>
            <h2 className="mt-6 text-4xl md:text-6xl font-medium text-white tracking-tight leading-tight">
              Ingeniería industrial potenciada por Inteligencia Artificial.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                className="group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white/[0.05] border border-white/[0.1] text-white group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500`}>
                  <Icon d={f.icon} />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Brands Parallax Section ─── */}
      <section id="brands" className="py-32 bg-[#050505] border-t border-white/[0.05] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl mb-20">
            <span className="text-[10px] font-medium text-blue-500 uppercase tracking-[0.3em]">Compatibilidad Total</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-medium text-white tracking-tight">
              Diseñado para el ecosistema real.
            </h2>
            <p className="mt-6 text-lg text-slate-400 font-light">
              Generamos código nativo con el software, extensión y protocolos correctos para las marcas líderes de la industria.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PLC_BRANDS_GROUPED).map(([manufacturer, brands]) => (
              <motion.div key={manufacturer} variants={fadeInUp} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 hover:bg-white/[0.04] transition-colors">
                <h3 className="font-medium text-white text-xl mb-2">{manufacturer}</h3>
                <p className="text-[11px] font-medium tracking-widest uppercase text-slate-500 mb-8">{brands[0].software}</p>
                <ul className="space-y-4">
                  {brands.map((b) => (
                    <li key={b.key} className="flex items-center gap-3 text-sm text-slate-300 font-light">
                      <span className="text-blue-500"><Icon d={icons.check} className="w-4 h-4" /></span>
                      {b.model}
                      <span className="ml-auto font-mono text-[10px] text-slate-500">{b.ext}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="py-32 bg-[#000000] relative border-t border-white/[0.05]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl mb-24 text-center mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
              Flujo de trabajo impecable.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={fadeInUp} className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-10">
                <span className="text-sm font-medium tracking-[0.2em] text-blue-500 block mb-6">
                  PASO {s.n}
                </span>
                <h3 className="text-2xl font-medium text-white mb-4">{s.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Security ─── */}
      <section id="security" className="py-32 bg-[#050505] border-t border-white/[0.05]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl mb-20 text-center mx-auto">
            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-[0.3em]">Enterprise Grade</span>
            <h2 className="mt-6 text-4xl font-medium text-white tracking-tight">
              Seguridad desde el núcleo.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECURITY_POINTS.map((p) => (
              <motion.div key={p.title} variants={fadeInUp} className="rounded-3xl border border-white/[0.05] p-8 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <Icon d={p.icon} className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-white mb-3 text-lg">{p.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 bg-[#000000] border-t border-white/[0.05]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto px-6"
        >
          <motion.div variants={fadeInUp} className="relative rounded-[3rem] border border-white/[0.1] bg-gradient-to-b from-white/[0.05] to-transparent overflow-hidden px-8 py-24 md:px-20 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-8">
                El futuro es lógico.
              </h2>
              <p className="text-xl text-slate-400 font-light mb-12 max-w-2xl mx-auto">
                No instales nada. Describe tu proceso y deja que LogicPLC.ai escriba tu código en segundos.
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-black font-semibold tracking-[0.2em] text-[12px] uppercase rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all"
              >
                Abrir Studio
                <Icon d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#000000] text-slate-500 py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium tracking-[0.1em] text-lg">LogicPLC.ai</span>
          </div>
          <div className="text-xs font-light tracking-wider">
            © {APP_CONFIG.year} {APP_CONFIG.author}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
