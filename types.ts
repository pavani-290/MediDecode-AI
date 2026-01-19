
export interface MedicineInfo {
  name: string;
  purpose: string;
  usage: string;
  sideEffects: string[];
  warnings: string;
  dosageStatus: string; // "clear" or "Dosage unclear from image"
  interactionWarning?: string;
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Borderline' | 'High' | 'Low';
  explanation: string;
}

export interface ShorthandExpansion {
  term: string;
  meaning: string;
}

export interface AnalysisResult {
  summary: string;
  medicines: MedicineInfo[];
  labResults?: LabResult[];
  keyRecommendations: string[];
  shorthandDecoded?: ShorthandExpansion[];
  timestamp?: number;
  language?: string;
  confidenceScore?: number;
  ocrNotes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type SupportedLanguage = 
  | 'English' | 'Hindi' | 'Spanish' | 'French' 
  | 'Arabic' | 'Bengali' | 'Telugu' | 'Tamil' 
  | 'Marathi' | 'Gujarati' | 'Kannada';

export interface HistoryItem {
  id: string;
  data: AnalysisResult;
  previewUrl: string;
}

export interface PatientProfile {
  age?: string;
  gender?: string;
  tone: 'Simple' | 'Professional' | 'Reassuring';
}
