// Pantalla principal de análisis de faltas

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraRecorder } from '../components/CameraRecorder';
import { LoadingRadar } from '../components/LoadingRadar';
import { ResultCard } from '../components/ResultCard';
import { extractVideoFrames } from '../services/videoProcessor';
import { analyzeFoulWithAI } from '../services/apiClient';
import { isApiKeyConfigured } from '../utils/config';
import { FoulAnalysisResult, APIResponse } from '../types';

type ScreenState = 'selection' | 'loading' | 'result' | 'error';

export const FoulAnalysisScreen: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('selection');
  const [loadingStatus, setLoadingStatus] = useState('Preparando análisis...');
  const [analysisResult, setAnalysisResult] = useState<FoulAnalysisResult | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVideoSelected = async (videoUri: string) => {
    try {
      console.log('📹 Video recibido:', videoUri);
      setScreenState('loading');
      setLoadingStatus('📂 Extrayendo frames del video...');

      // Extraer frames del video
      const frames = await extractVideoFrames(videoUri);

      if (frames.length === 0) {
        throw new Error('No se pudieron extraer frames del video (lista vacía)');
      }

      setLoadingStatus('📤 Enviando a Gemini para análisis...');

      // Analizar con Gemini
      const response: APIResponse = await analyzeFoulWithAI(frames, status => {
        setLoadingStatus(status);
      });

      if (response.success && response.result) {
        setAnalysisResult(response.result);
        setIsDemoMode(response.isDemoMode || false);
        setScreenState('result');
      } else {
        throw new Error(response.error || 'Error analizando el video');
      }
    } catch (error: any) {
      console.error('Error en análisis:', error);
      console.error('Error stack:', error.stack);
      const errorMsg = error.message || 'Error desconocido';
      setErrorMessage(errorMsg);
      setScreenState('error');

      Alert.alert(
        'Error en el Análisis',
        errorMsg,
        [{ text: 'Reintentar', onPress: handleReset }]
      );
    }
  };

  const handleReset = () => {
    setScreenState('selection');
    setAnalysisResult(null);
    setLoadingStatus('Preparando análisis...');
    setErrorMessage('');
    setIsDemoMode(false);
  };

  React.useEffect(() => {
    // Mostrar alerta si no hay API key configurada
    if (!isApiKeyConfigured()) {
      console.warn(
        '⚠️ ATENCIÓN: API Key de Gemini no configurada. Se usará el Modo Demo.'
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {screenState === 'selection' && (
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.emoji}>⚽</Text>
              <View>
                <Text style={styles.title}>VAR IA</Text>
                <Text style={styles.subtitle}>Análisis Inteligente de Faltas</Text>
              </View>
            </View>
          </View>
        )}

        {screenState === 'selection' && (
          <CameraRecorder
            onVideoRecorded={handleVideoSelected}
            isLoading={screenState === 'loading'}
          />
        )}

        {screenState === 'loading' && (
          <LoadingRadar status={loadingStatus} />
        )}

        {screenState === 'result' && analysisResult && (
          <ResultCard
            result={analysisResult}
            isDemoMode={isDemoMode}
            onReset={handleReset}
          />
        )}

        {screenState === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Error en el Análisis</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.errorButtonText}>Intentar de Nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
