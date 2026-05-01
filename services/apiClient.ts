// Cliente para la API de Google Gemini

import axios from 'axios';
import { CONFIG, isApiKeyConfigured } from '../utils/config';
import { FoulAnalysisResult, APIResponse } from '../types';
import { getRandomMockVerdict } from '../utils/mockData';

/**
 * Crea el prompt del sistema para Gemini
 */
const createSystemPrompt = (): string => {
  return `You are an expert FIFA referee with deep knowledge of the Laws of the Game, specifically Law 12 (Fouls and Misconduct). 

Your role is to analyze football/soccer footage and determine if a foul, yellow card, red card, or no offense has occurred.

When analyzing video frames, consider:
- Contact severity and type
- Player positioning and intentions
- Ball possession and trajectory
- Whether the contact impedes play

You MUST respond ONLY with valid JSON in this exact format, with no additional text or markdown blocks:
{
  "verdict": "FOUL" | "YELLOW_CARD" | "RED_CARD" | "PLAY_ON",
  "explanation": "Detailed explanation in Spanish of your decision",
  "confidence": 0.85,
  "details": {
    "contact_severity": "low" | "medium" | "high",
    "player_position": "Description of player position",
    "ball_position": "Description of ball position"
  }
}`;
};

/**
 * Crea el prompt del usuario para analizar los frames
 */
const createUserPrompt = (): string => {
  return `Analyze these football video frames and determine if there is a foul, yellow card offense, red card offense, or if play should continue. Look for:

1. Contact between players
2. Whether contact is within the normal play context
3. Severity and intent of any contact
4. Position of the ball and players
5. Applicable Law 12 violations

Consider the context of the game and whether the action represents a disciplinary offense.

Respond ONLY with the JSON format specified. No other text.`;
};

/**
 * Envía los frames a Gemini para análisis
 */
export const analyzeFoulWithAI = async (
  frames: Array<{ base64: string }>,
  onProgress?: (status: string) => void
): Promise<APIResponse> => {
  try {
    // Verificar si la API key está configurada
    if (!isApiKeyConfigured()) {
      console.warn('⚠️ API Key no configurada, usando modo demo');
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 3000));
      onProgress?.('🤖 Analizando en modo demo...');
      
      return {
        success: true,
        result: getRandomMockVerdict(),
        isDemoMode: true,
      };
    }

    // Validar que tenemos frames
    if (!frames || frames.length === 0) {
      throw new Error('No hay frames para analizar');
    }

    console.log(`📊 Analizando ${frames.length} frames con Gemini`);
    onProgress?.('📤 Enviando frames a Gemini...');

    // Construir el contenido con los frames en base64
    const imageParts = frames.map((frame, idx) => {
      console.log(`  Frame ${idx}: ${frame.base64.substring(0, 50)}...`);
      return {
        inline_data: {
          mime_type: 'image/jpeg',
          data: frame.base64,
        },
      };
    });

    onProgress?.('⏳ Esperando respuesta de Gemini...');

    // Realizar la llamada a la API de Gemini
    console.log('🌐 Realizando llamada a API de Gemini...');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
      {
        system_instruction: {
          parts: [{ text: createSystemPrompt() }]
        },
        contents: [
          {
            parts: [
              { text: createUserPrompt() },
              ...imageParts
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 segundos
      }
    );

    console.log('✅ Respuesta recibida de Gemini');
    onProgress?.('✅ Procesando respuesta...');

    // Extraer el texto de la respuesta
    const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!responseText) {
      throw new Error('Respuesta vacía de Gemini');
    }

    // Parsear el JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Texto de respuesta:', responseText);
      throw new Error('Respuesta inválida de Gemini (sin JSON válido)');
    }

    const result: FoulAnalysisResult = JSON.parse(jsonMatch[0]);
    console.log('✅ Análisis completado:', result.verdict);

    return {
      success: true,
      result,
      isDemoMode: false,
    };
  } catch (error: any) {
    console.error('❌ Error en API de Gemini:', error.message);
    console.error('Stack:', error.stack);
    console.error('Response:', error.response?.data);

    let errorMessage = 'Error analizando el video';

    if (error.response?.status === 400 || error.response?.status === 403) {
      errorMessage = 'API Key inválida o expirada';
    } else if (error.response?.status === 429) {
      errorMessage = 'Límite de solicitudes alcanzado. Intenta más tarde';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Tiempo de espera agotado';
    } else if (error.message.includes('No hay frames')) {
      errorMessage = 'Sin frames para analizar';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Obtiene el estado de la API
 */
export const checkAPIStatus = async (): Promise<boolean> => {
  try {
    if (!isApiKeyConfigured()) {
      return false;
    }

    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${CONFIG.GEMINI_API_KEY}`, {
      timeout: 5000,
    });

    return response.status === 200;
  } catch (error) {
    console.error('API status check failed:', error);
    return false;
  }
};
