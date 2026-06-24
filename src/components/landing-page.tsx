"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import {
  Lightning,
  MagnifyingGlass,
  Cpu,
  Code,
  ShieldCheck,
  DownloadSimple,
  HardDrives,
  Lock,
  Gauge,
  ArrowRight,
  Check,
} from '@phosphor-icons/react';
import { APP_CONFIG, PLC_BRANDS, PLC_BRANDS_GROUPED, PLC_LANGUAGES, SAFETY_LEVELS } from '@/lib/constants';

const BRAND_COUNT = Object.keys(PLC_BRANDS).length;
const MANUFACTURER_COUNT = Object.keys(PLC_BRANDS_GROUPED).length;
const LANGUAGE_COUNT = PLC_LANGUAGES.length;
const SAFETY_COUNT = SAFETY_LEVELS.filter((s) => s.key !== 'none').length;

const ICON_SIZE = 22;

const FEATURES = [
  {
    Icon: Lightning,
    title: 'Generación IEC 61131-3',
    body: 'Convierte una descripción en lenguaje natural en código estructurado y funcional, listo para el IDE del fabricante.',
  },
  {
    Icon: MagnifyingGlass,
    title: 'Auditoría con IA',
    body: 'Sube tu código y recibe un análisis crítico: lógica del proceso, fallas posibles y huecos de seguridad.',
  },
  {
    Icon: Cpu,
    title: `${BRAND_COUNT} equipos de PLC`,
    body: 'Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider, Beckhoff y ABB, con su software y protocolos nativos.',
  },
  {
    Icon: Code,
    title: `${LANGUAGE_COUNT} lenguajes normalizados`,
    body: 'Texto Estructurado, Ladder, FBD, IL, SFC y GRAFCET para cada parte de tu aplicación.',
  },
  {
    Icon: ShieldCheck,
    title: 'Seguridad funcional',
    body: 'Pide requisitos SIL 1-3 (IEC 61508/62061) o PL a-e (ISO 13849) con diagnósticos y enclavamientos.',
  },
  {
    Icon: DownloadSimple,
    title: 'Exportación profesional',
    body: 'Descarga un .zip con el programa, README, mapeo de I/O y un plan de pruebas FAT/SAT.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Describe el proceso',
    body: 'Entradas, salidas, secuencias, alarmas y enclavamientos. O parte de una plantilla incluida.',
  },
  {
    n: '02',
    title: 'Elige equipo y lenguaje',
    body: 'Marca y CPU, lenguaje IEC 61131-3 y, si aplica, el nivel de seguridad SIL o PL.',
  },
  {
    n: '03',
    title: 'Genera y exporta',
    body: 'Revisa el código resaltado, audítalo con IA y descarga el proyecto documentado.',
  },
];

const SECURITY_POINTS = [
  {
    Icon: HardDrives,
    title: 'Clave solo en el servidor',
    body: 'La clave de la IA vive en una variable de entorno del servidor. El navegador nunca la ve ni la transmite.',
  },
  {
    Icon: Lock,
    title: 'Llamadas saneadas',
    body: 'Cada petición se valida (longitudes, marca y lenguaje permitidos) antes de llegar al modelo.',
  },
  {
    Icon: Gauge,
    title: 'Límite de tasa por IP',
    body: 'Las rutas de la API aplican rate limiting para frenar abuso y ráfagas accidentales.',
  },
  {
    Icon: ShieldCheck,
    title: 'Cabeceras endurecidas',
    body: 'CSP, anti-clickjacking (X-Frame-Options) y HSTS activos en toda la aplicación.',
  },
];

const STATS = [
  { value: String(BRAND_COUNT), label: 'Equipos de PLC' },
  { value: String(MANUFACTURER_COUNT), label: 'Fabricantes' },
  { value: String(LANGUAGE_COUNT), label: 'Lenguajes IEC' },
  { value: `${SAFETY_COUNT}`, label: 'Niveles SIL / PL' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // React no siempre aplica el atributo `muted`, y sin él el navegador
  // bloquea el autoplay. Lo forzamos por ref y lanzamos la reproducción.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      /* el navegador puede diferir el autoplay; el poster cubre la espera */
    });
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Props de reveal al hacer scroll, neutralizados con reduced-motion.
  const reveal = reduce
    ? {}
    : ({ initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' } } as const);

  return (
    <div className="bg-[#0a0a0b] text-zinc-300 antialiased selection:bg-blue-600 selection:text-white">
      {/* ─── Navbar (una sola línea, enlaces reales) ─── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#0a0a0b]/70 backdrop-blur-xl">
        <nav className="max-w-[1400px] mx-auto h-16 px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="text-white font-semibold tracking-tight text-[15px]">
            LogicPLC<span className="text-blue-500">.ai</span>
          </Link>
          <div className="hidden md:flex items-center gap-9 text-sm text-zinc-400">
            <a href="#capacidades" className="hover:text-white transition-colors">Capacidades</a>
            <a href="#equipos" className="hover:text-white transition-colors">Equipos</a>
            <a href="#proceso" className="hover:text-white transition-colors">Proceso</a>
            <a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a>
          </div>
          <Link
            href="/studio"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0a0a0b] hover:bg-zinc-200 transition-colors"
          >
            Abrir Studio
          </Link>
        </nav>
      </header>

      {/* ─── Hero: video inmersivo ─── */}
      <section ref={heroRef} className="relative isolate min-h-[100dvh] flex items-center overflow-hidden bg-black">
        <motion.div
          style={reduce ? undefined : { y: videoY, scale: videoScale }}
          className="absolute inset-0 z-0"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-poster.jpg"
            className="h-full w-full object-cover opacity-70"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Capas de oscurecimiento para legibilidad (un solo tema oscuro) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
        </motion.div>

        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="visible"
          variants={stagger}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-24"
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.25em] text-blue-400 uppercase mb-6">
            IEC 61131-3 · {BRAND_COUNT} equipos de PLC
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.02]"
          >
            Del proceso al código PLC, en segundos.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg text-zinc-300 leading-relaxed">
            Genera, audita y optimiza programas IEC 61131-3 para {BRAND_COUNT} marcas de PLC.
            Tú revisas, el campo lo ejecuta.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/studio"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a0a0b] hover:bg-zinc-200 transition-colors active:scale-[0.98]"
            >
              Abrir Studio
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#capacidades"
              className="inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white hover:bg-white/[0.06] transition-colors"
            >
              Ver capacidades
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Banda de cifras (familia: métricas en línea, sin tarjetas) ─── */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0b]">
        <motion.dl
          {...reveal}
          variants={stagger}
          className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="py-10 px-6 text-center">
              <dd className="font-mono text-4xl md:text-5xl font-semibold text-white tabular-nums">{s.value}</dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{s.label}</dt>
            </motion.div>
          ))}
        </motion.dl>
      </section>

      {/* ─── Capacidades (familia: bento asimétrico) ─── */}
      <section id="capacidades" className="py-28 scroll-mt-16">
        <motion.div {...reveal} variants={stagger} className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.25em] text-blue-400 uppercase">
            Capacidades
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-5 max-w-2xl text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
            Todo lo que necesitas para programar un PLC.
          </motion.h2>

          {/* Bento 6-col: destacada 4x2, resto 2x1 -> 6 celdas exactas, sin huecos */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4">
            {FEATURES.map((f, i) => {
              const featured = i === 0;
              const span = featured ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2';
              const bg = featured
                ? 'bg-gradient-to-br from-blue-600/15 via-blue-600/[0.05] to-transparent flex flex-col justify-between'
                : i === 3
                ? 'bg-gradient-to-br from-white/[0.06] to-transparent'
                : 'bg-white/[0.02]';
              return (
                <motion.article
                  key={f.title}
                  variants={fadeUp}
                  className={`${span} ${bg} group rounded-2xl border border-white/[0.08] p-7 transition-colors hover:border-white/[0.16]`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <f.Icon size={ICON_SIZE} weight="regular" />
                  </div>
                  <div className={featured ? 'mt-10' : 'mt-6'}>
                    <h3 className={`font-medium text-white ${featured ? 'text-2xl' : 'text-lg'}`}>{f.title}</h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md">{f.body}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── Proceso (familia: línea de tiempo conectada) ─── */}
      <section id="proceso" className="py-28 border-t border-white/[0.06] bg-[#080809] scroll-mt-16">
        <motion.div {...reveal} variants={stagger} className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.h2 variants={fadeUp} className="max-w-2xl text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
            De la idea al programa, sin fricción.
          </motion.h2>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 relative">
            {/* Línea conectora en desktop */}
            <div className="hidden md:block absolute top-5 left-0 right-0 h-px bg-white/[0.08]" />
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0a0b] border border-white/15 font-mono text-sm text-blue-400 relative z-10">
                  {s.n}
                </div>
                <h3 className="mt-6 text-xl font-medium text-white">{s.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-xs">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Equipos (familia: lista agrupada con hairlines) ─── */}
      <section id="equipos" className="py-28 border-t border-white/[0.06] scroll-mt-16">
        <motion.div {...reveal} variants={stagger} className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.h2 variants={fadeUp} className="max-w-2xl text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
            Compatible con tu parque industrial.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-zinc-400 leading-relaxed">
            Código nativo con el software, la extensión de archivo y los protocolos correctos de {MANUFACTURER_COUNT} fabricantes.
          </motion.p>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PLC_BRANDS_GROUPED).map(([manufacturer, brands]) => (
              <motion.div key={manufacturer} variants={fadeUp}>
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-medium text-white">{manufacturer}</h3>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500">{brands[0].software}</span>
                </div>
                <ul className="mt-3 divide-y divide-white/[0.06]">
                  {brands.map((b) => (
                    <li key={b.key} className="flex items-center gap-3 py-2.5 text-sm text-zinc-300">
                      <Check size={15} weight="bold" className="text-blue-500 shrink-0" />
                      {b.model}
                      <span className="ml-auto font-mono text-[11px] text-zinc-600">{b.ext}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Lenguajes como fila de fichas (familia distinta del listado) */}
          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap gap-2.5">
            {PLC_LANGUAGES.map((l) => (
              <span
                key={l.key}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-zinc-300"
              >
                <span className="font-mono text-xs font-semibold text-blue-400">{l.shortLabel}</span>
                {l.label.split(' (')[0]}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Seguridad (familia: split asimétrico título / lista) ─── */}
      <section id="seguridad" className="py-28 border-t border-white/[0.06] bg-[#080809] scroll-mt-16">
        <motion.div {...reveal} variants={stagger} className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.05]">
              Seguridad desde el núcleo.
            </h2>
            <p className="mt-5 text-zinc-400 leading-relaxed">
              La IA se ejecuta en el servidor con buenas prácticas de extremo a extremo. Tu clave nunca toca el navegador.
            </p>
          </motion.div>
          <motion.ul variants={stagger} className="lg:col-span-8 divide-y divide-white/[0.08] border-t border-white/[0.08]">
            {SECURITY_POINTS.map((p) => (
              <motion.li key={p.title} variants={fadeUp} className="flex gap-5 py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                  <p.Icon size={ICON_SIZE} weight="regular" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{p.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* ─── CTA con visual real (familia: split asimétrico texto / imagen) ─── */}
      <section className="py-28 border-t border-white/[0.06]">
        <motion.div {...reveal} variants={stagger} className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.02]">
              Tu próximo programa empieza aquí.
            </h2>
            <p className="mt-6 max-w-md text-lg text-zinc-400 leading-relaxed">
              Sin instalar nada. Describe el proceso y obtén código documentado, listo para tu IDE.
            </p>
            <Link
              href="/studio"
              className="mt-10 group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0a0a0b] hover:bg-zinc-200 transition-colors active:scale-[0.98]"
            >
              Abrir Studio
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 -z-10 m-auto h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />
            <Image
              src="/robot.png"
              alt="Robot construido con autómatas y módulos de PLC"
              width={387}
              height={416}
              className="h-auto w-[280px] md:w-[340px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span className="text-white font-semibold tracking-tight">
            LogicPLC<span className="text-blue-500">.ai</span>
          </span>
          <span>© {APP_CONFIG.year} {APP_CONFIG.author}. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
