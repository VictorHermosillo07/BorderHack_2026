// Componente para mostrar el resultado del análisis

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { FoulAnalysisResult } from '../types';

interface ResultCardProps {
  result: FoulAnalysisResult;
  isDemoMode?: boolean;
  onReset: () => void;
}

const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case 'RED_CARD':
      return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444', icon: '🔴' };
    case 'YELLOW_CARD':
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b', icon: '🟡' };
    case 'FOUL':
      return { bg: '#f0f9ff', text: '#0c4a6e', border: '#0284c7', icon: '⚠️' };
    case 'PLAY_ON':
      return { bg: '#f0fdf4', text: '#15803d', border: '#22c55e', icon: '✅' };
    default:
      return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af', icon: '❓' };
  }
};

const getVerdictLabel = (verdict: string): string => {
  switch (verdict) {
    case 'RED_CARD':
      return 'TARJETA ROJA';
    case 'YELLOW_CARD':
      return 'TARJETA AMARILLA';
    case 'FOUL':
      return 'FALTA';
    case 'PLAY_ON':
      return 'SIGA EL JUEGO';
    default:
      return 'DESCONOCIDO';
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  isDemoMode,
  onReset,
}) => {
  const colors = getVerdictColor(result.verdict);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [scaleValue]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Encabezado del veredicto */}
        <View
          style={[
            styles.verdictHeader,
            {
              backgroundColor: colors.bg,
              borderLeftColor: colors.border,
            },
          ]}
        >
          <Text style={styles.verdictIcon}>{colors.icon}</Text>
          <View style={styles.verdictTextContainer}>
            <Text
              style={[
                styles.verdictLabel,
                { color: colors.text },
              ]}
            >
              {getVerdictLabel(result.verdict)}
            </Text>
            <View style={styles.confidenceBar}>
              <View
                style={[
                  styles.confidenceFill,
                  {
                    width: `${(result.confidence || 0) * 100}%`,
                    backgroundColor: colors.border,
                  },
                ]}
              />
            </View>
            <Text style={styles.confidenceText}>
              Confianza: {Math.round((result.confidence || 0) * 100)}%
            </Text>
          </View>
        </View>

        {/* Explicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis Detallado</Text>
          <Text style={styles.explanationText}>{result.explanation}</Text>
        </View>

        {/* Detalles */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Severidad de Contacto</Text>
            <Text style={styles.detailValue}>
              {result.details.contact_severity === 'high'
                ? '🔴 Alta'
                : result.details.contact_severity === 'medium'
                ? '🟡 Media'
                : '🟢 Baja'}
            </Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Posición del Jugador</Text>
            <Text style={styles.detailValue}>{result.details.player_position}</Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Posición del Balón</Text>
            <Text style={styles.detailValue}>{result.details.ball_position}</Text>
          </View>
        </View>

        {/* Nota de modo demo */}
        {isDemoMode && (
          <View style={styles.demoNotice}>
            <Text style={styles.demoText}>
              📋 Este es un resultado de prueba (Modo Demo)
            </Text>
          </View>
        )}

        {/* Botón de reinicio */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Analizar Otro Video</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderLeftWidth: 4,
    gap: 16,
  },
  verdictIcon: {
    fontSize: 48,
  },
  verdictTextContainer: {
    flex: 1,
  },
  verdictLabel: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  demoNotice: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  demoText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  resetButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 14,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
