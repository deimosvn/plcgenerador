# PLC AI Studio

**Generador profesional de código PLC con inteligencia artificial**

Genera código PLC completo y funcional en segundos utilizando Google Gemini. Compatible con 16 marcas de PLCs, 6 lenguajes IEC 61131-3, niveles de seguridad SIL/PL y exportación profesional.

## Características

- **16 marcas de PLC**: Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider, Beckhoff, ABB y más
- **6 lenguajes IEC 61131-3**: Structured Text, Ladder, FBD, IL, SFC, GRAFCET
- **Niveles de seguridad**: SIL 1-3, PL a-e según IEC 61508/ISO 13849
- **Exportación ZIP**: Código + README + Mapeo I/O + Plan de pruebas
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

3. Ejecuta en desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000)

## API Key

La aplicación utiliza Google Gemini directamente desde el navegador. Ingresa tu API Key de Google AI Studio en la interfaz. Puedes obtenerla en:

https://aistudio.google.com/apikey

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
