// ─────────────────────────────────────────────────────────────
// Tipos centrales — PLC AI Studio v2.0
// ─────────────────────────────────────────────────────────────

/** Resultado de una generación de código */
export interface GenerationResult {
  id: string;
  code: string;
  description: string;
  plcBrand: string;
  plcModel: string;
  language: string;
  timestamp: number;
  codeStats?: CodeStats;
  warning?: string;
}

/** Estadísticas del código generado */
export interface CodeStats {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  characters: number;
  variables: number;
  functions: number;
}

/** Claves de marcas de PLC soportadas */
export type PLCBrandKey =
  | 'siemens-s7-1200'
  | 'siemens-s7-1500'
  | 'siemens-s7-300'
  | 'allen-bradley-compactlogix'
  | 'allen-bradley-controllogix'
  | 'allen-bradley-micrologix'
  | 'mitsubishi-fx5u'
  | 'mitsubishi-q-series'
  | 'mitsubishi-iq-r'
  | 'omron-cp1e'
  | 'omron-cj2m'
  | 'omron-nx1p'
  | 'schneider-m340'
  | 'schneider-m580'
  | 'beckhoff-cx'
  | 'abb-ac500';

/** Info de marca PLC */
export interface PLCBrandInfo {
  key: string;
  label: string;
  manufacturer: string;
  model: string;
  ext: string;
  software: string;
  description: string;
  protocols: string[];
}

/** Lenguajes IEC 61131-3 */
export type PLCLanguage = 'st' | 'ladder' | 'fbd' | 'il' | 'sfc' | 'grafcet';

/** Info de lenguaje PLC */
export interface PLCLanguageInfo {
  key: PLCLanguage;
  label: string;
  shortLabel: string;
  description: string;
  standard: string;
}

/** Niveles de seguridad */
export type SafetyLevel = 'none' | 'sil1' | 'sil2' | 'sil3' | 'pl-a' | 'pl-d' | 'pl-e';

/** Datos del formulario de generación */
export interface GenerationFormData {
  description: string;
  plcBrand: string;
  plcModel: string;
  language: string;
  safetyLevel: SafetyLevel;
  includeComments: boolean;
  includeIOMapping: boolean;
  includeErrorHandling: boolean;
}

/** Template de código PLC */
export interface PLCTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  template: string;
}

/** Configuración de exportación */
export interface ExportConfig {
  includeReadme: boolean;
  includeIOMapping: boolean;
  includeTestPlan: boolean;
  projectName: string;
}

/** Categorías de plantillas */
export type TemplateCategory = 'motores' | 'procesos' | 'transporte' | 'temperatura' | 'seguridad' | 'energia' | 'comunicacion' | 'hmi';

/** Petición a la API */
export interface APIRequest {
  description: string;
  plcBrand: string;
  plcModel: string;
  language: string;
}

/** Resultado de análisis de código */
export interface AnalysisResult {
  id: string;
  originalCode: string;
  fileName: string;
  analysisText: string;
  timestamp: number;
}

/** Punto de I/O extraído de un diagrama */
export interface ExtractedIO {
  type: 'DI' | 'DO' | 'AI' | 'AO' | string;
  tag: string;
  description: string;
  device?: string;
  signal?: string;
}

/** Resultado de la extracción por visión de un diagrama eléctrico */
export interface ExtractionData {
  summary: string;
  suggestedDescription: string;
  io: ExtractedIO[];
  devices: string[];
  notes?: string[];
}

/** Componente de la lista de materiales del tablero */
export interface BOMItem {
  item: string;
  reference: string;
  quantity: number;
  notes?: string;
}

/** Conexión de un terminal del PLC */
export interface WiringConnection {
  terminal: string;
  type: 'DI' | 'DO' | 'AI' | 'AO' | string;
  tag: string;
  device: string;
  wire?: string;
}

/** Diagrama de conexión + BOM generado por la IA */
export interface WiringData {
  plc: string;
  powerSupply: string;
  connections: WiringConnection[];
  bom: BOMItem[];
  notes?: string[];
}
