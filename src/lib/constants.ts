// ─────────────────────────────────────────────────────────────
// Constantes y configuración central de PLC AI Studio
// ─────────────────────────────────────────────────────────────

import type { PLCBrandInfo, PLCBrandKey, PLCLanguageInfo, PLCTemplate } from '@/types';

// ─── Marcas y modelos de PLC ───────────────────────────────

export const PLC_BRANDS: Record<PLCBrandKey, PLCBrandInfo> = {
  'siemens-s7-1200': {
    key: 'siemens-s7-1200',
    label: 'Siemens S7-1200',
    manufacturer: 'Siemens',
    model: 'S7-1200',
    ext: '.scl',
    software: 'TIA Portal V17+',
    description: 'PLC compacto para automatización estándar',
    protocols: ['PROFINET', 'Modbus TCP', 'OPC UA'],
  },
  'siemens-s7-1500': {
    key: 'siemens-s7-1500',
    label: 'Siemens S7-1500',
    manufacturer: 'Siemens',
    model: 'S7-1500',
    ext: '.scl',
    software: 'TIA Portal V17+',
    description: 'PLC de gama alta para procesos complejos',
    protocols: ['PROFINET', 'PROFIBUS', 'OPC UA', 'Modbus TCP'],
  },
  'siemens-s7-300': {
    key: 'siemens-s7-300',
    label: 'Siemens S7-300',
    manufacturer: 'Siemens',
    model: 'S7-300',
    ext: '.awl',
    software: 'STEP 7 / TIA Portal',
    description: 'PLC modular clásico (legacy)',
    protocols: ['PROFIBUS', 'MPI', 'Ethernet'],
  },
  'allen-bradley-compactlogix': {
    key: 'allen-bradley-compactlogix',
    label: 'Allen-Bradley CompactLogix',
    manufacturer: 'Rockwell Automation',
    model: 'CompactLogix 5380',
    ext: '.L5X',
    software: 'Studio 5000',
    description: 'Controlador compacto con EtherNet/IP integrado',
    protocols: ['EtherNet/IP', 'DeviceNet', 'ControlNet'],
  },
  'allen-bradley-controllogix': {
    key: 'allen-bradley-controllogix',
    label: 'Allen-Bradley ControlLogix',
    manufacturer: 'Rockwell Automation',
    model: 'ControlLogix 5580',
    ext: '.L5X',
    software: 'Studio 5000',
    description: 'Controlador modular de alta disponibilidad',
    protocols: ['EtherNet/IP', 'DeviceNet', 'ControlNet', 'HART'],
  },
  'allen-bradley-micrologix': {
    key: 'allen-bradley-micrologix',
    label: 'Allen-Bradley MicroLogix',
    manufacturer: 'Rockwell Automation',
    model: 'MicroLogix 1400',
    ext: '.RSS',
    software: 'RSLogix 500',
    description: 'Micro PLC para aplicaciones sencillas',
    protocols: ['EtherNet/IP', 'DH-485', 'Modbus RTU'],
  },
  'mitsubishi-fx5u': {
    key: 'mitsubishi-fx5u',
    label: 'Mitsubishi FX5U',
    manufacturer: 'Mitsubishi Electric',
    model: 'FX5U',
    ext: '.gxw',
    software: 'GX Works3',
    description: 'PLC compacto de última generación',
    protocols: ['CC-Link IE', 'Ethernet', 'Modbus RTU/TCP'],
  },
  'mitsubishi-q-series': {
    key: 'mitsubishi-q-series',
    label: 'Mitsubishi Q Series',
    manufacturer: 'Mitsubishi Electric',
    model: 'Q Series',
    ext: '.gxw',
    software: 'GX Works2',
    description: 'PLC modular para procesos medianos a grandes',
    protocols: ['CC-Link', 'Ethernet', 'MELSECNET'],
  },
  'mitsubishi-iq-r': {
    key: 'mitsubishi-iq-r',
    label: 'Mitsubishi iQ-R',
    manufacturer: 'Mitsubishi Electric',
    model: 'iQ-R Series',
    ext: '.gxw',
    software: 'GX Works3',
    description: 'Plataforma de automatización de nueva generación',
    protocols: ['CC-Link IE TSN', 'OPC UA', 'Ethernet/IP'],
  },
  'omron-cp1e': {
    key: 'omron-cp1e',
    label: 'Omron CP1E',
    manufacturer: 'Omron',
    model: 'CP1E',
    ext: '.cxp',
    software: 'CX-Programmer',
    description: 'PLC económico para automatización básica',
    protocols: ['Ethernet', 'RS-232C', 'RS-485'],
  },
  'omron-cj2m': {
    key: 'omron-cj2m',
    label: 'Omron CJ2M',
    manufacturer: 'Omron',
    model: 'CJ2M',
    ext: '.cxp',
    software: 'CX-Programmer / Sysmac Studio',
    description: 'PLC modular de gama media',
    protocols: ['EtherNet/IP', 'EtherCAT', 'DeviceNet'],
  },
  'omron-nx1p': {
    key: 'omron-nx1p',
    label: 'Omron NX1P',
    manufacturer: 'Omron',
    model: 'NX1P2',
    ext: '.smc2',
    software: 'Sysmac Studio',
    description: 'Controlador de máquina integrado',
    protocols: ['EtherNet/IP', 'EtherCAT', 'OPC UA'],
  },
  'schneider-m340': {
    key: 'schneider-m340',
    label: 'Schneider Modicon M340',
    manufacturer: 'Schneider Electric',
    model: 'Modicon M340',
    ext: '.stu',
    software: 'Unity Pro / EcoStruxure Control Expert',
    description: 'PLC modular para control de procesos',
    protocols: ['Modbus TCP', 'Ethernet/IP', 'CANopen'],
  },
  'schneider-m580': {
    key: 'schneider-m580',
    label: 'Schneider Modicon M580',
    manufacturer: 'Schneider Electric',
    model: 'Modicon M580',
    ext: '.stu',
    software: 'EcoStruxure Control Expert',
    description: 'ePAC para la industria 4.0',
    protocols: ['Modbus TCP', 'Ethernet/IP', 'OPC UA', 'PROFIBUS'],
  },
  'beckhoff-cx': {
    key: 'beckhoff-cx',
    label: 'Beckhoff CX Series',
    manufacturer: 'Beckhoff',
    model: 'CX5140',
    ext: '.tpy',
    software: 'TwinCAT 3',
    description: 'PC-based controller con EtherCAT',
    protocols: ['EtherCAT', 'OPC UA', 'ADS', 'Modbus TCP'],
  },
  'abb-ac500': {
    key: 'abb-ac500',
    label: 'ABB AC500',
    manufacturer: 'ABB',
    model: 'AC500-eCo',
    ext: '.pro',
    software: 'Automation Builder',
    description: 'PLC escalable para automatización flexible',
    protocols: ['PROFINET', 'EtherNet/IP', 'Modbus TCP', 'CANopen'],
  },
};

/** Lista ordenada de marcas para select */
export const PLC_BRANDS_LIST = Object.values(PLC_BRANDS).sort((a, b) =>
  a.manufacturer.localeCompare(b.manufacturer)
);

/** Agrupación por fabricante */
export const PLC_BRANDS_GROUPED = PLC_BRANDS_LIST.reduce<Record<string, PLCBrandInfo[]>>(
  (acc, brand) => {
    if (!acc[brand.manufacturer]) acc[brand.manufacturer] = [];
    acc[brand.manufacturer].push(brand);
    return acc;
  },
  {}
);

// ─── Lenguajes IEC 61131-3 ────────────────────────────────

export const PLC_LANGUAGES: PLCLanguageInfo[] = [
  {
    key: 'ladder',
    label: 'Diagrama Ladder (LD)',
    shortLabel: 'LAD',
    description: 'Lógica visual con contactos, bobinas y peldaños. Ideal para secuencias discretas y es el más utilizado en la industria.',
    standard: 'IEC 61131-3 §8',
  },
  {
    key: 'st',
    label: 'Texto Estructurado (ST)',
    shortLabel: 'ST',
    description: 'Lenguaje de alto nivel similar a Pascal. Óptimo para algoritmos complejos, PID, cálculos matemáticos y manejo de datos.',
    standard: 'IEC 61131-3 §7',
  },
  {
    key: 'fbd',
    label: 'Bloques Funcionales (FBD)',
    shortLabel: 'FBD',
    description: 'Diagrama de bloques funcionales conectados por señales. Muy usado en control de procesos y lazos de regulación.',
    standard: 'IEC 61131-3 §9',
  },
  {
    key: 'il',
    label: 'Lista de Instrucciones (IL)',
    shortLabel: 'IL',
    description: 'Instrucciones tipo ensamblador. Ahora deprecado en IEC 61131-3 3ra edición pero aún vigente en equipos legacy.',
    standard: 'IEC 61131-3 §6 (deprecado)',
  },
  {
    key: 'sfc',
    label: 'Diagrama Secuencial (SFC)',
    shortLabel: 'SFC',
    description: 'Secuencia de pasos y transiciones para procesos batch. Ideal para máquinas de estados y procesos secuenciales.',
    standard: 'IEC 61131-3 §10',
  },
  {
    key: 'grafcet',
    label: 'GRAFCET',
    shortLabel: 'GFC',
    description: 'Modelo gráfico normalizado para automatismos secuenciales. Base de SFC y ampliamente usado en Europa.',
    standard: 'IEC 60848',
  },
];

// ─── Niveles de seguridad ──────────────────────────────────

export const SAFETY_LEVELS = [
  { key: 'none' as const, label: 'Sin requisito de seguridad', description: 'Proceso estándar sin SIL/PL requerido' },
  { key: 'sil1' as const, label: 'SIL 1', description: 'Riesgo bajo — IEC 61508/62061' },
  { key: 'sil2' as const, label: 'SIL 2', description: 'Riesgo medio — IEC 61508/62061' },
  { key: 'sil3' as const, label: 'SIL 3', description: 'Riesgo alto — IEC 61508/62061' },
  { key: 'pl-a' as const, label: 'PL a', description: 'Performance Level a — ISO 13849' },
  { key: 'pl-d' as const, label: 'PL d', description: 'Performance Level d — ISO 13849' },
  { key: 'pl-e' as const, label: 'PL e', description: 'Performance Level e — ISO 13849' },
];

// ─── Plantillas predefinidas ───────────────────────────────

export const TEMPLATE_LIBRARY: PLCTemplate[] = [
  {
    id: 'motor-trifasico',
    name: 'Control de motor trifásico',
    category: 'motores',
    description: 'Arrancador trifásico con soft-start, protección térmica y paro de emergencia',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    difficulty: 'intermedio',
    tags: ['motor', 'trifásico', 'arranque', 'protección'],
    template: `Diseña un control completo de motor trifásico que:
1. Ejecute arranque estrella-triángulo con temporización configurable
2. Supervise corriente del motor en las 3 fases (desbalance > 10% → alarma)
3. Monitoree temperatura del motor vía PTC/Pt100 — desconecte si > 80 °C
4. Incluya paro de emergencia con enclavamiento (requiere reset manual)
5. Cuente horas de operación para mantenimiento preventivo
6. Publique estados: Listo, Marcha, Fallo, Mantenimiento
7. Integre protección contra inversión de fases
8. Registre los últimos 10 eventos de fallo con timestamp`,
  },
  {
    id: 'nivel-tanque',
    name: 'Control de nivel de tanque',
    category: 'procesos',
    description: 'Supervisión de nivel con control de bomba y protecciones',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    difficulty: 'intermedio',
    tags: ['nivel', 'tanque', 'bomba', 'analógico'],
    template: `Implementa un control de nivel de tanque que:
1. Lea transmisor analógico de nivel 4-20 mA (0%-100%)
2. Arranque bomba de llenado si nivel < 30%
3. Detenga bomba al alcanzar 90% (histéresis de 5%)
4. Dispare alarma sonora al 95% (nivel alto-alto)
5. Abra válvula de descarga de emergencia al 100%
6. Protección contra marcha en seco (nivel < 5%)
7. Modo manual/automático con enclavamiento
8. Registro de ciclos de arranque de la bomba
9. Alarma de fugas: si nivel baja > 10% en 1 minuto sin consumo`,
  },
  {
    id: 'transportador',
    name: 'Transportador inteligente',
    category: 'transporte',
    description: 'Banda transportadora con encoder, conteo de piezas y enclavamientos',
    icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4',
    difficulty: 'avanzado',
    tags: ['transportador', 'banda', 'encoder', 'velocidad'],
    template: `Construye el control de una banda transportadora que:
1. Permita avance/retroceso con rampa de aceleración y desaceleración configurable
2. Pare inmediatamente si se abre una guarda de seguridad (entrada segura)
3. Supervise sobrecarga del motor (corriente > 120% nominal → alarma)
4. Integre paro de emergencia en serie con otras líneas de producción
5. Utilice encoder para medir velocidad real y compare con setpoint
6. Gestione ramp-up (0-100% en T configurable) y ramp-down
7. Cuente piezas producidas con sensor de proximidad
8. Detecte atasco (encoder parado con motor encendido > 3s)
9. Genere reporte de producción por turno`,
  },
  {
    id: 'control-temperatura',
    name: 'Control de temperatura PID',
    category: 'temperatura',
    description: 'Regulación de temperatura con PID, calefacción y enfriamiento',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    difficulty: 'avanzado',
    tags: ['temperatura', 'PID', 'calefacción', 'enfriamiento'],
    template: `Desarrolla un control de temperatura con regulación PID que:
1. Acepte sonda Pt100 o termopar tipo K (4-20 mA)
2. Calcule PID con parámetros Kp, Ki, Kd configurables
3. Module SSR de calefacción mediante salida PWM
4. Controle ventilador de enfriamiento con PWM independiente
5. Ejecute auto-tuning para optimizar parámetros PID
6. Corte calefacción si temperatura > 150 °C (protección independiente)
7. Genere alarma si desviación > ±5 °C del setpoint por > 30s
8. Incluya rampa de calentamiento configurable (°C/min)
9. Registre curva de temperatura en buffer circular (últimas 24h)
10. Permita setpoints por receta/programa`,
  },
  {
    id: 'presion-compresor',
    name: 'Control de presión neumática',
    category: 'procesos',
    description: 'Supervisión de red neumática con compresor y protecciones',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    difficulty: 'intermedio',
    tags: ['presión', 'compresor', 'neumática', 'seguridad'],
    template: `Configura el control de presión neumática que:
1. Lea transmisor de presión 0-10 V (0-10 bar)
2. Arranque compresor si presión < 6 bar
3. Detenga compresor si presión > 8 bar (histéresis)
4. Abra válvula de alivio a 9 bar
5. Shutdown del sistema a > 10 bar (parada de emergencia)
6. Detecte caída rápida de presión (fuga > 1 bar/s)
7. Cuente ciclos del compresor para mantenimiento preventivo
8. Registre horas de funcionamiento del compresor
9. Alarma por filtro de aire saturado (presión diferencial)`,
  },
  {
    id: 'acceso-seguro',
    name: 'Control de acceso industrial',
    category: 'seguridad',
    description: 'Puerta segura con autenticación, temporización y registros',
    icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
    difficulty: 'intermedio',
    tags: ['acceso', 'seguridad', 'puerta', 'RFID'],
    template: `Crea un control de acceso industrial que:
1. Acepte entrada de lector RFID (datos por comunicación serial)
2. Valide credenciales contra tabla interna de 50 usuarios
3. Desbloquee cerradura electromagnética por 5 s si autorizado
4. Señalice con indicador verde/rojo el estado de acceso
5. Active alarma sonora tras 3 intentos fallidos consecutivos
6. Registre eventos (usuario, fecha/hora, resultado) en buffer FIFO
7. Permita apertura de emergencia por supervisor (bypass con PIN)
8. Integre sensor de puerta abierta con temporización (alarma si abierta > 30s)
9. Interfaz con sistema de alarmas central vía salida digital`,
  },
  {
    id: 'variador-frecuencia',
    name: 'Control de variador de frecuencia',
    category: 'motores',
    description: 'Gestión de VFD con rampas, protecciones y comunicación',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    difficulty: 'avanzado',
    tags: ['variador', 'VFD', 'frecuencia', 'motor'],
    template: `Diseña el control de un variador de frecuencia (VFD) que:
1. Arranque motor con rampa de aceleración configurable (0-60Hz en T segundos)
2. Permita control de velocidad por setpoint analógico 0-10V
3. Lea velocidad real del motor (feedback del VFD)
4. Supervise corriente, torque y temperatura del motor
5. Implemente protección contra sobrecarga y cortocircuito
6. Gestione frenado regenerativo con módulo de frenado
7. Permita operación en modo local/remoto
8. Maneje fallos del VFD (subcorriente, sobrevoltaje, pérdida de fase)
9. Registre curva de tendencia de velocidad y corriente
10. Comunicación con VFD vía Modbus RTU (lectura de parámetros)`,
  },
  {
    id: 'batch-proceso',
    name: 'Control de proceso batch',
    category: 'procesos',
    description: 'Secuencia de producción batch con recetas y trazabilidad',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    difficulty: 'avanzado',
    tags: ['batch', 'receta', 'secuencia', 'ISA-88'],
    template: `Implementa un control de proceso batch según ISA-88 que:
1. Ejecute secuencia: Carga → Mezcla → Calentamiento → Reacción → Descarga
2. Permita selección de receta con parámetros configurables
3. Controle válvulas de dosificación por peso o volumen
4. Regule temperatura con PID durante fase de calentamiento
5. Controle agitador con velocidad variable según la fase
6. Registre trazabilidad completa del lote (tiempos, cantidades)
7. Permita pausa y reanudación de la secuencia
8. Maneje alarmas por fase con niveles de severidad
9. Genere reporte de fin de lote automáticamente
10. Soporte modo paso a paso para comisionamiento`,
  },
];

// ─── Categorías de plantillas ──────────────────────────────

export const TEMPLATE_CATEGORIES = [
  { key: 'motores', label: 'Motores y Drives', icon: '⚡' },
  { key: 'procesos', label: 'Control de Procesos', icon: '🏭' },
  { key: 'transporte', label: 'Transporte y Logística', icon: '🔄' },
  { key: 'temperatura', label: 'Temperatura y HVAC', icon: '🌡️' },
  { key: 'seguridad', label: 'Seguridad Industrial', icon: '🔒' },
  { key: 'energia', label: 'Energía y Potencia', icon: '🔋' },
  { key: 'comunicacion', label: 'Comunicaciones', icon: '📡' },
  { key: 'hmi', label: 'HMI y Supervisión', icon: '🖥️' },
] as const;

// ─── App constants ─────────────────────────────────────────

export const APP_CONFIG = {
  name: 'PLC AI Studio',
  version: '2.0.0',
  author: 'Diego Martinez',
  year: 2026,
  maxHistory: 50,
  minDescriptionLength: 10,
  maxDescriptionLength: 5000,
  geminiModel: 'gemini-2.0-flash',
  geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
} as const;
