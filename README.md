# PLC AI Studio

**Generador profesional de código PLC con inteligencia artificial**

Genera código PLC completo y funcional en segundos utilizando Google Gemini. Compatible con 16 marcas de PLCs, 6 lenguajes IEC 61131-3, niveles de seguridad SIL/PL y exportación profesional.

## Características

- **16 marcas de PLC**: Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider, Beckhoff, ABB y más
- **6 lenguajes IEC 61131-3**: Structured Text, Ladder, FBD, IL, SFC, GRAFCET
- **Niveles de seguridad**: SIL 1-3, PL a-e según IEC 61508/ISO 13849
- **Auditoría con IA**: sube código existente y obtén un análisis crítico en Markdown
- **Refinamiento iterativo**: ajusta el código generado con instrucciones en lenguaje natural
- **Desde diagrama (visión IA)**: sube una foto/PDF de un esquema eléctrico y extrae las I/O y dispositivos
- **Diagrama de conexión + BOM**: genera el cableado de terminales y la lista de materiales del tablero (export CSV)
- **Exportación**: Dossier **PDF** profesional, archivo del IDE, y ZIP (código + README + Mapeo I/O + Plan de pruebas)
- **Plantillas predefinidas**: Motor trifásico, PID, batch, SCADA y más
- **Historial local**: Generaciones guardadas en el navegador
- **100% en español**: Documentación y comentarios en español

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **IA**: Google Gemini API (gemini-2.0-flash)
- **Lenguaje**: TypeScript 5
- **Deploy**: Vercel

## Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/deimosvn/plcgenerador.git
cd plcgenerador
```

2. Instala dependencias:
```bash
npm install
```

3. Configura tu API Key (ver abajo):
```bash
cp .env.example .env.local
# edita .env.local y pega tu GEMINI_API_KEY
```

4. Ejecuta en desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000)

## API Key (lado servidor)

La generación y el análisis se ejecutan en el **servidor** (rutas `/api/generate` y `/api/analyze`).
La clave de Google Gemini se lee de la variable de entorno `GEMINI_API_KEY` y **nunca se envía al navegador**.

Obtén tu clave gratis en https://aistudio.google.com/apikey y configúrala:

- **Local:** crea `.env.local` con `GEMINI_API_KEY=tu_clave` (este archivo está en `.gitignore`).
- **Vercel:** Project → Settings → Environment Variables → `GEMINI_API_KEY`.

> Sin clave configurada, la app funciona en **modo demo** (genera código de ejemplo) y el
> análisis con IA queda deshabilitado.

## Seguridad

- 🔒 La clave de IA vive solo en el servidor (env var, sin prefijo `NEXT_PUBLIC_`).
- ✅ Toda petición a la API se valida (longitudes, marca y lenguaje permitidos).
- 🚦 Rate limiting por IP en las rutas de la API.
- 🛡️ Cabeceras de seguridad (CSP, X-Frame-Options, HSTS, etc.) en `next.config.ts`.

> ⚠️ Si clonaste una versión anterior que incluía una clave embebida en el código,
> revócala de inmediato en Google AI Studio y genera una nueva.

## Estructura del proyecto

```
src/
  types/           → Tipos TypeScript centrales
  lib/             → Constantes, utilidades, cliente Gemini, prompts
  hooks/           → Hooks personalizados (generador, toast, localStorage)
  components/
    ui/            → Componentes UI reutilizables
    features/      → Componentes de funcionalidad
  app/             → Rutas Next.js (App Router)
```

## Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/deimosvn/plcgenerador)

## Autor

**Diego Martinez** — 2026

## Licencia

Todos los derechos reservados.
