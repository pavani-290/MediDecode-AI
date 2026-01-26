
export interface MedicineInfo {
  name: string;
  purpose: string;
  usage: string;
  sideEffects: string[];
  warnings: string;
  dosageStatus: string;
  interactionWarning?: string;
  schedule?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
    beforeFood: boolean;
  };
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Borderline' | 'High' | 'Low';
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  medicines: MedicineInfo[];
  labResults?: LabResult[];
  keyRecommendations: string[];
  interactionMatrix?: string;
  confidenceScore: number;
  timestamp: number;
  language: string;
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
  fileType: string;
}

export interface PatientProfile {
  age?: string;
  gender?: string;
  tone: 'Simple' | 'Professional' | 'Reassuring';
}
