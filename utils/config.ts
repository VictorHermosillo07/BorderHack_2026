// Configuración de la aplicación

export const CONFIG = {
  // Reemplaza con tu API key de Google Gemini
  // Obtén una en: https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  
  // Configuración de Gemini
  GEMINI_MODEL: 'gemini-1.5-pro',
  
  // Configuración de video
  VIDEO_FRAME_COUNT: 4,
  VIDEO_FRAME_QUALITY: 0.8,
  
  // Modo demo
  ENABLE_DEMO_MODE: true,
};

export const isApiKeyConfigured = (): boolean => {
  return CONFIG.GEMINI_API_KEY.length > 0;
};
