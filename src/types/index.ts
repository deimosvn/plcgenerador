export interface GenerationResult {
  code: string;
  description: string;
  plcBrand: string;
  plcModel: string;
  language: string;
  timestamp: number;
}

export interface APIRequest {
  description: string;
  plcBrand: string;
  plcModel: string;
  language: string;
}
