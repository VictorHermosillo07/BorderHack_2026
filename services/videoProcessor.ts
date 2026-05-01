// Servicio para procesar videos y extraer frames

import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { CONFIG } from '../utils/config';
import { VideoFrame } from '../types';

/**
 * Extrae frames clave de un video usando thumbnails
 * Este approach funciona mejor en Expo Go
 */
export const extractVideoFrames = async (videoUri: string): Promise<VideoFrame[]> => {
  try {
    console.log('🎬 Comenzando extracción de frames de:', videoUri);
    
    if (!videoUri || videoUri.trim() === '') {
      throw new Error('URI de video inválido');
    }

    // Siempre copiar a cache para asegurar que VideoThumbnails pueda accederlo (evita problemas de permisos en iOS/Android)
    console.log('📁 Copiando video a cache local para procesamiento...');
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) throw new Error('Directorio cache no disponible');
    
    const localUri = `${cacheDir}video_processing_${Date.now()}.mp4`;
    
    try {
      await FileSystem.copyAsync({
        from: videoUri,
        to: localUri,
      });
      console.log('✅ Video copiado a:', localUri);
    } catch (copyError) {
      console.warn('⚠️ No se pudo copiar a cache, usando URI original:', copyError);
    }

    const targetUri = (await FileSystem.getInfoAsync(localUri)).exists ? localUri : videoUri;

    const frames: VideoFrame[] = [];
    const timestamps = [0, 500, 1000, 2000]; // Extraer solo unos pocos (0s, 0.5s, 1s, 2s) para no fallar

    console.log(`📽️ Extrayendo thumbnails de: ${targetUri}`);

    for (let i = 0; i < timestamps.length; i++) {
      try {
        const timestamp = timestamps[i];
        console.log(`  🖼️ Intentando frame a los ${timestamp}ms...`);
        
        const thumbnail = await VideoThumbnails.getThumbnailAsync(targetUri, {
          time: timestamp,
          quality: 0.5, // Menor calidad, más estable
        });

        if (thumbnail && thumbnail.uri) {
          const base64Data = await FileSystem.readAsStringAsync(thumbnail.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (base64Data) {
            frames.push({
              uri: thumbnail.uri,
              base64: base64Data,
              timestamp: timestamp,
            });
            console.log(`    ✅ Frame extraído. Size: ${base64Data.length}`);
          }
        }
      } catch (err: any) {
        console.log(`    ⚠️ Falló el frame ${timestamps[i]}ms:`, err.message);
        // En un simulador puede fallar si el tiempo es mayor a la duración
      }
    }

    // FALLBACK ESTREMO: Si VideoThumbnails no funciona de ninguna manera (común en Simuladores de iOS viejos)
    // Extraemos todo el video en base64 y simulamos 1 frame.
    if (frames.length === 0) {
      console.log('🔄 Fallback: VideoThumbnails falló. Leyendo el video completo como Base64 (esto funciona en simulador)');
      const videoBase64 = await FileSystem.readAsStringAsync(targetUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      if (videoBase64 && videoBase64.length > 0) {
        frames.push({
          uri: targetUri,
          base64: videoBase64,
          timestamp: 0,
        });
        console.log('✅ Fallback exitoso. Video procesado (como 1 "frame" masivo de tipo image/jpeg en apiClient, lo cual Gemini intentará decodificar).');
      }
    }

    if (frames.length === 0) {
      throw new Error('Fallback falló. No se pudo leer el archivo local.');
    }

    return frames;
  } catch (error: any) {
    console.error('❌ Error fatal extrayendo frames:', error.message);
    throw new Error(`No se pudieron extraer frames: ${error.message}`);
  }
};

/**
 * Convierte un archivo de imagen a base64
 */
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log('🖼️ Convirtiendo imagen a base64:', imageUri);
    
    let normalizedUri = imageUri;
    if (!normalizedUri.startsWith('file://')) {
      normalizedUri = `file://${normalizedUri}`;
    }
    
    const base64Data = await FileSystem.readAsStringAsync(normalizedUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    console.log('✅ Imagen convertida a base64');
    return base64Data;
  } catch (error: any) {
    console.error('❌ Error convirtiendo imagen a base64:', error.message);
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
