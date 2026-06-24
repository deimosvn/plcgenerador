// ─────────────────────────────────────────────────────────────
// Motor de prompts profesionales para generación PLC
// ─────────────────────────────────────────────────────────────

import { PLC_BRANDS, PLC_LANGUAGES } from './constants';
import type { GenerationFormData, PLCBrandKey } from '@/types';

/** Construye el prompt de sistema para la IA */
export function buildSystemPrompt(): string {
  return `Eres un ingeniero de automatización industrial senior con más de 20 años de experiencia en programación de PLCs.

DOMINIO DE CONOCIMIENTO:
- Programación según IEC 61131-3 (LD, ST, FBD, IL, SFC, GRAFCET)
- PLCs: Siemens (TIA Portal), Allen-Bradley (Studio 5000), Mitsubishi (GX Works), Omron (Sysmac/CX), Schneider (Control Expert), Beckhoff (TwinCAT), ABB (Automation Builder)
- Normas de seguridad: IEC 61508, IEC 62061, ISO 13849, IEC 61511
- Protocolos industriales: PROFINET, EtherNet/IP, Modbus RTU/TCP, OPC UA, EtherCAT
- Metodologías: ISA-88 (Batch), ISA-95 (MES), GAMP 5 (Pharma)

REGLAS DE GENERACIÓN:
1. SIEMPRE genera código completo y funcional, nunca fragmentos
2. SIEMPRE incluye declaración de variables con tipos de datos correctos
3. SIEMPRE usa nomenclatura IEC 61131-3 para tipos de datos
4. SIEMPRE incluye comentarios descriptivos en español
5. SIEMPRE incluye manejo de errores y condiciones de seguridad
6. SIEMPRE sigue las mejores prácticas del fabricante específico
7. SIEMPRE incluye encabezado con metadata del programa
8. NUNCA uses funciones o instrucciones no estándar sin indicarlo
9. NUNCA generes código que pueda causar condiciones inseguras sin advertencia
10. Responde SOLO con el código, sin explicaciones adicionales fuera del código

FORMATO DE ENCABEZADO OBLIGATORIO:
(*
  ═══════════════════════════════════════════════════
  PROGRAMA: [Nombre descriptivo]
  EQUIPO: [Marca y modelo del PLC]
  LENGUAJE: [Lenguaje de programación]
  NORMA: IEC 61131-3
  FECHA: [Fecha actual]
  GENERADO POR: PLC AI Studio
  ═══════════════════════════════════════════════════
  DESCRIPCIÓN:
  [Descripción breve del proceso]
  
  REQUISITOS DE SEGURIDAD:
  [Nivel SIL/PL si aplica]
  
  NOTAS:
  - [Notas importantes sobre la implementación]
  ═══════════════════════════════════════════════════
*)`;
}

/** Construye el prompt de usuario para la generación */
export function buildUserPrompt(formData: GenerationFormData): string {
  const brand = PLC_BRANDS[formData.plcBrand as PLCBrandKey];
  const language = PLC_LANGUAGES.find(l => l.key === formData.language);

  if (!brand || !language) {
    throw new Error('Configuración de PLC o lenguaje inválida');
  }

  const safetySection = formData.safetyLevel !== 'none'
    ? `\nNIVEL DE SEGURIDAD REQUERIDO: ${formData.safetyLevel.toUpperCase()}
- Implementa redundancia donde sea necesario
- Incluye watchdog y monitoreo de diagnóstico
- Documenta las funciones relacionadas con seguridad`
    : '';

  const optionsSection = [
    formData.includeComments && '- Incluir comentarios detallados en cada sección',
    formData.includeIOMapping && '- Incluir tabla de mapeo de entradas/salidas al inicio',
    formData.includeErrorHandling && '- Incluir manejo completo de errores y diagnósticos',
  ].filter(Boolean).join('\n');

  return `Genera código ${language.label} (${language.shortLabel}) para un PLC ${brand.label}.

ESPECIFICACIONES DEL HARDWARE:
- Fabricante: ${brand.manufacturer}
- Modelo: ${brand.model}${formData.plcModel ? ` (${formData.plcModel})` : ''}
- Software de programación: ${brand.software}
- Formato de archivo: ${brand.ext}
- Protocolos disponibles: ${brand.protocols.join(', ')}

LENGUAJE DE PROGRAMACIÓN:
- ${language.label}
- Estándar: ${language.standard}

REQUERIMIENTOS DEL PROCESO:
${formData.description}
${safetySection}

OPCIONES ADICIONALES:
${optionsSection || '- Configuración estándar'}

INSTRUCCIONES ESPECÍFICAS PARA ${brand.manufacturer.toUpperCase()}:
${getManufacturerInstructions(brand.manufacturer)}

Genera SOLO el código completo y funcional. No incluyas explicaciones fuera del código.`;
}

/** Instrucciones específicas por fabricante */
function getManufacturerInstructions(manufacturer: string): string {
  const instructions: Record<string, string> = {
    'Siemens': `- Usa sintaxis SCL/ST compatible con TIA Portal
- Declara variables en secciones VAR, VAR_INPUT, VAR_OUTPUT, VAR_TEMP
- Usa tipos de datos SIMATIC (BOOL, INT, DINT, REAL, TIME, STRING)
- Incluye DBs (Data Blocks) cuando sea necesario
- Usa instrucciones S7 estándar (MOVE, CONVERT, SCALE, etc.)
- Nomenclatura de I/O: %I, %Q, %M, %DB`,

    'Rockwell Automation': `- Usa sintaxis compatible con Studio 5000 Logix Designer
- Declara tags con tipos AOI cuando sea posible
- Usa instrucciones RSLogix (XIC, XIO, OTE, TON, CTU, etc.)
- Incluye UDTs para estructuras de datos complejas
- Nomenclatura de tags descriptiva con prefijos (di_, do_, ai_, ao_)`,

    'Mitsubishi Electric': `- Usa sintaxis compatible con GX Works2/3
- Usa registros D, M, X, Y para variables
- Incluye labels y comentarios para cada línea
- Sigue convenciones de nomenclatura MELSEC
- Usa instrucciones estándar FX/Q (LD, OUT, MOV, SET, RST, etc.)`,

    'Omron': `- Usa sintaxis compatible con CX-Programmer o Sysmac Studio
- Declara variables en la tabla de símbolos
- Usa áreas de memoria CIO, W, H, D, T, C
- Incluye secciones y comentarios de rung
- Instrucciones estándar: LD, AND, OR, OUT, TIM, CNT, MOV`,

    'Schneider Electric': `- Usa sintaxis compatible con EcoStruxure Control Expert
- Declara variables en secciones DFB/FFB
- Sigue convenciones Unity Pro / Control Expert
- Incluye secciones SR (Structured) cuando sea necesario
- Tipos de datos: BOOL, INT, DINT, REAL, TIME, STRING`,

    'Beckhoff': `- Usa sintaxis TwinCAT 3 structured text
- Declara POUs (Program Organization Units) correctamente
- Usa tipos TwinCAT: FB_, PRG_, FUNCTION, etc.
- Incluye GVL (Global Variable List) cuando sea necesario
- Nomenclatura con prefijos: b (BOOL), n (INT), f (REAL), etc.`,

    'ABB': `- Usa sintaxis compatible con Automation Builder / CODESYS
- Declara variables con tipos IEC estándar
- Incluye POUs organizados por funcionalidad
- Sigue convenciones de programación ABB
- Usa bibliotecas estándar cuando estén disponibles`,
  };

  return instructions[manufacturer] || '- Usa sintaxis IEC 61131-3 estándar';
}

/** Construye código de respaldo cuando la API no está disponible */
export function buildFallbackCode(formData: GenerationFormData): string {
  const brand = PLC_BRANDS[formData.plcBrand as PLCBrandKey];
  const language = PLC_LANGUAGES.find(l => l.key === formData.language);

  return `(*
  ═══════════════════════════════════════════════════
  PROGRAMA: Programa de Demostración
  EQUIPO: ${brand?.label || 'PLC Estándar'}
  LENGUAJE: ${language?.label || 'Texto Estructurado'}
  NORMA: IEC 61131-3
  FECHA: ${new Date().toISOString().split('T')[0]}
  GENERADO POR: PLC AI Studio (modo offline)
  ═══════════════════════════════════════════════════
  DESCRIPCIÓN:
  ${formData.description}
  
  NOTA: Este es un código de demostración generado localmente.
  Para código completo, configura tu API Key de Google Gemini.
  ═══════════════════════════════════════════════════
*)

PROGRAM Main
VAR_INPUT
    xStart        : BOOL;    (* Botón de arranque *)
    xStop         : BOOL;    (* Botón de paro *)
    xEmergency    : BOOL;    (* Paro de emergencia - NC *)
    xSensorOK     : BOOL;    (* Sensor de confirmación *)
    rAnalogInput  : REAL;    (* Entrada analógica 4-20 mA *)
END_VAR

VAR_OUTPUT
    xMotorCmd     : BOOL;    (* Comando del motor *)
    xAlarm        : BOOL;    (* Alarma general *)
    xReady        : BOOL;    (* Sistema listo *)
    xRunning      : BOOL;    (* Sistema en marcha *)
    rAnalogOutput : REAL;    (* Salida analógica 0-10V *)
END_VAR

VAR
    xRunLatch     : BOOL;    (* Enclavamiento de marcha *)
    iState        : INT;     (* Estado de la máquina *)
    tOnDelay      : TIME := T#2s;  (* Temporización de arranque *)
    diCycleCount  : DINT;    (* Contador de ciclos *)
END_VAR

(* ─── LÓGICA PRINCIPAL ─────────────────────────── *)

(* Verificar condiciones de seguridad *)
IF NOT xEmergency THEN
    xRunLatch := FALSE;
    xAlarm := TRUE;
    iState := 0;
END_IF;

(* Máquina de estados *)
CASE iState OF
    0: (* ESTADO: Inicialización *)
        xReady := xEmergency AND xSensorOK;
        xRunning := FALSE;
        xMotorCmd := FALSE;
        IF xReady AND xStart AND NOT xStop THEN
            iState := 1;
        END_IF;

    1: (* ESTADO: Arranque *)
        xRunLatch := TRUE;
        xRunning := TRUE;
        xMotorCmd := TRUE;
        diCycleCount := diCycleCount + 1;
        IF xStop OR NOT xSensorOK THEN
            iState := 2;
        END_IF;

    2: (* ESTADO: Parada controlada *)
        xMotorCmd := FALSE;
        xRunning := FALSE;
        xRunLatch := FALSE;
        iState := 0;
END_CASE;

(* Procesamiento analógico *)
rAnalogOutput := rAnalogInput * 0.625;  (* Escalar 4-20mA a 0-10V *)

(* Alarma general *)
xAlarm := NOT xEmergency OR NOT xSensorOK;

END_PROGRAM`;
}

/** Construye el prompt para refinar código existente según una instrucción */
export function buildRefinePrompt(args: {
  code: string;
  instruction: string;
  plcBrand: string;
  language: string;
}): string {
  const brand = PLC_BRANDS[args.plcBrand as PLCBrandKey];
  const language = PLC_LANGUAGES.find((l) => l.key === args.language);

  return `Tienes un programa PLC existente y debes MODIFICARLO según la instrucción del usuario.

EQUIPO: ${brand?.label || args.plcBrand}${brand ? ` (${brand.software})` : ''}
LENGUAJE: ${language?.label || args.language}

REGLAS:
1. Aplica EXACTAMENTE el cambio solicitado, conservando todo lo demás que funcione.
2. Mantén el estilo, la nomenclatura y el encabezado de metadata del código original.
3. No elimines lógica de seguridad existente salvo que se pida explícitamente.
4. Devuelve el PROGRAMA COMPLETO actualizado, no solo el fragmento cambiado.
5. Responde SOLO con el código, sin explicaciones fuera del código.

INSTRUCCIÓN DEL USUARIO:
${args.instruction}

CÓDIGO ACTUAL:
\`\`\`
${args.code}
\`\`\`

Genera el código completo modificado.`;
}

/** Construye el prompt de visión para extraer I/O de un diagrama eléctrico */
export function buildExtractPrompt(): string {
  return `Eres un ingeniero eléctrico industrial. Analiza la imagen o PDF de un diagrama eléctrico / esquema de conexión / plano de tablero que se adjunta.

Tu tarea es EXTRAER la información necesaria para programar un PLC.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "summary": "resumen breve de lo que muestra el diagrama (1-2 frases)",
  "suggestedDescription": "descripción del proceso de automatización lista para usar como requerimiento de generación de código PLC, redactada en español con entradas, salidas, secuencias y seguridades que se deduzcan del diagrama",
  "io": [
    { "type": "DI|DO|AI|AO", "tag": "nombre_de_variable_sugerido", "description": "qué es", "device": "dispositivo de campo", "signal": "24VDC / 4-20mA / etc." }
  ],
  "devices": ["lista de dispositivos identificados (motores, sensores, válvulas, etc.)"],
  "notes": ["observaciones, ambigüedades o elementos no legibles del diagrama"]
}

REGLAS:
- type: DI=entrada digital, DO=salida digital, AI=entrada analógica, AO=salida analógica.
- Usa nomenclatura IEC para los tags (xBoton, xMotor, rNivel, etc.).
- Si algo no es legible o no aparece, indícalo en "notes" y no lo inventes.
- Responde SOLO con el JSON, sin texto adicional ni markdown.`;
}

/** Construye el prompt para generar diagrama de conexión + BOM del tablero */
export function buildWiringPrompt(args: {
  description: string;
  plcBrand: string;
  language: string;
  code?: string;
}): string {
  const brand = PLC_BRANDS[args.plcBrand as PLCBrandKey];

  return `Eres un ingeniero de diseño de tableros eléctricos industriales. A partir del proceso descrito${args.code ? ' y del código PLC' : ''}, define el cableado de conexión del PLC y la lista de materiales del tablero.

EQUIPO PLC: ${brand?.label || args.plcBrand}${brand ? ` — ${brand.software}` : ''}

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "plc": "modelo del PLC",
  "powerSupply": "fuente de alimentación recomendada (p.ej. 24VDC 5A)",
  "connections": [
    { "terminal": "%I0.0", "type": "DI|DO|AI|AO", "tag": "xBoton", "device": "Pulsador de marcha", "wire": "calibre/color sugerido" }
  ],
  "bom": [
    { "item": "Componente", "reference": "referencia/parte sugerida", "quantity": 1, "notes": "opcional" }
  ],
  "notes": ["advertencias de diseño, protecciones, dimensionamiento"]
}

REGLAS:
- Asigna direcciones de terminal coherentes con ${brand?.manufacturer || 'el fabricante'} (%I, %Q, %IW, %QW para Siemens; etiquetas equivalentes para otros).
- En la BOM incluye al menos: PLC, fuente, protecciones (breakers/fusibles), borneras, y los contactores/relés/sensores necesarios según el proceso.
- Sé realista en cantidades. Responde SOLO con el JSON, sin texto adicional ni markdown.

PROCESO:
${args.description}
${args.code ? `\nCÓDIGO PLC:\n\`\`\`\n${args.code.slice(0, 6000)}\n\`\`\`` : ''}`;
}

/** Construye el prompt para analizar código PLC existente */
export function buildAnalyzePrompt(code: string): string {
  return `Eres un ingeniero auditor de control e instrumentación y experto en seguridad de código PLC. 
Tu tarea es auditar, analizar y explicar el siguiente código PLC.

REGLAS DE AUDITORÍA:
1. Describe brevemente y paso a paso el proceso o la lógica que implementa el código.
2. Identifica posibles fallas lógicas, errores de sintaxis, o malas prácticas (si las hay).
3. Evalúa si el código considera aspectos de seguridad básicos (por ejemplo, paros de emergencia o condiciones iniciales seguras) y menciona qué falta.
4. Tu respuesta debe estar formateada en Markdown clara y profesional, usando subtítulos para "Descripción del Proceso", "Posibles Fallas", "Aspectos de Seguridad", y "Recomendaciones de Mejora".
5. No modifiques el código, solo analízalo de manera crítica y profesional en español.

CÓDIGO A ANALIZAR:
\`\`\`
${code}
\`\`\`
`;
}
