// Tipos para la aplicación de análisis de faltas

export type VerdictType = 'FOUL' | 'YELLOW_CARD' | 'RED_CARD' | 'PLAY_ON';

export interface FoulAnalysisResult {
  verdict: VerdictType;
  explanation: string;
  confidence: number;
  details: {
    contact_severity: 'low' | 'medium' | 'high';
    player_position: string;
    ball_position: string;
  };
}

export interface VideoFrame {
  uri: string;
  base64: string;
  timestamp: number;
}

export interface APIResponse {
  success: boolean;
  result?: FoulAnalysisResult;
  error?: string;
  isDemoMode?: boolean;
}
