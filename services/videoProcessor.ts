// Servicio para procesar videos y extraer frames

import * as FileSystem from 'expo-file-system';
import { CONFIG } from '../utils/config';
import { VideoFrame } from '../types';

/**
 * Extrae frames clave de un video
 * Nota: Expo Go tiene limitaciones para procesar videos directamente.
 * Esta es una solución que convierte el video en base64 para enviar a la API.
 */
export const extractVideoFrames = async (videoUri: string): Promise<VideoFrame[]> => {
  try {
    console.log('🎬 Comenzando extracción de frames de:', videoUri);
    
    // Validar que el URI sea válido
    if (!videoUri || videoUri.trim() === '') {
      throw new Error('URI de video inválido');
    }

    let localUri = videoUri;

    // Normalizar el URI si comienza con file://
    if (!videoUri.startsWith('file://') && !videoUri.startsWith('http')) {
      localUri = `file://${videoUri}`;
    }

    console.log('📍 URI normalizado:', localUri);

    // Intenta acceder al archivo primero
    try {
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      console.log('📊 Información del archivo:', { 
        exists: fileInfo.exists, 
        isDirectory: fileInfo.isDirectory, 
        size: fileInfo.size 
      });
      
      if (!fileInfo.exists) {
        console.log('⚠️ Archivo no existe, intentando copiar a cache...');
        throw new Error('Archivo original no accesible');
      }

      if (fileInfo.size === 0) {
        throw new Error('El archivo tiene tamaño 0');
      }
    } catch (statError) {
      // Si no podemos acceder directamente, intentar copiar a cache
      console.log('📁 Intentando copiar video a cache...');
      
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('No se puede acceder al directorio de cache');
      
      const timestamp = Date.now();
      const cachedUri = `${cacheDir}video_${timestamp}.mp4`;
      
      try {
        await FileSystem.copyAsync({
          from: videoUri,
          to: cachedUri,
        });
        localUri = cachedUri;
        console.log('✅ Video copiado a cache:', cachedUri);
      } catch (copyError) {
        console.error('❌ Error al copiar:', copyError);
        // Intentar usar el URI original de todas formas
        localUri = videoUri;
      }
    }

    const frames: VideoFrame[] = [];
    
    // Intentar leer el archivo como base64
    console.log('📖 Leyendo archivo como base64 desde:', localUri);
    let base64Data: string;
    
    try {
      base64Data = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (readError) {
      console.error('❌ Error al leer de:', localUri, readError);
      // Intentar sin el prefijo file://
      if (localUri.startsWith('file://')) {
        const altUri = localUri.replace('file://', '');
        console.log('🔄 Intentando con URI alternativo:', altUri);
        base64Data = await FileSystem.readAsStringAsync(altUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        throw readError;
      }
    }
    
    if (!base64Data || base64Data.length === 0) {
      throw new Error('El archivo base64 está vacío');
    }
    
    console.log(`✅ Base64 generado: ${base64Data.length} caracteres`);

    // Crear frames simulados
    for (let i = 0; i < CONFIG.VIDEO_FRAME_COUNT; i++) {
      frames.push({
        uri: localUri,
        base64: base64Data,
        timestamp: i * 1000,
      });
    }
    
    console.log(`✅ Se extrajeron ${frames.length} frames del video`);
    return frames;
  } catch (error: any) {
    console.error('❌ Error extrayendo frames:', error.message || error);
    console.error('Stack:', error.stack);
    throw new Error(`No se pudieron extraer frames del video: ${error.message}`);
  }
};

/**
 * Convierte un archivo de imagen a base64
 */
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log('🖼️ Convirtiendo imagen a base64:', imageUri);
    
    const base64Data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    console.log('✅ Imagen convertida a base64');
    return base64Data;
  } catch (error: any) {
    console.error('❌ Error convirtiendo imagen a base64:', error.message || error);
    throw new Error(`No se pudo convertir la imagen: ${error.message}`);
  }
};

/**
 * Valida que el archivo sea un video válido
 */
export const isValidVideoFile = (uri: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const extension = uri.split('.').pop()?.toLowerCase() || '';
  return videoExtensions.includes(extension);
};

/**
 * Obtiene información del archivo
 */
export const getFileInfo = async (fileUri: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  } catch (error) {
    console.error('❌ Error obteniendo información del archivo:', error);
    return null;
  }
};
