// Componente de animación de carga tipo radar

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

interface LoadingRadarProps {
  status?: string;
}

export const LoadingRadar: React.FC<LoadingRadarProps> = ({ status = 'Analizando...' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Animación de rotación
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinValue, pulseValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}>
        {/* Círculos de radar */}
        {[0, 1, 2].map(index => (
          <Animated.View
            key={index}
            style={[
              styles.radarRing,
              {
                width: 100 + index * 60,
                height: 100 + index * 60,
                opacity: 0.3 - index * 0.08,
              },
            ]}
          />
        ))}

        {/* Centro giratorio */}
        <Animated.View
          style={[
            styles.radarSweep,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.sweepLine} />
        </Animated.View>

        {/* Punto central */}
        <Animated.View
          style={[
            styles.centerPoint,
            {
              transform: [{ scale: pulseValue }],
            },
          ]}
        />
      </View>

      <Animated.Text style={[styles.statusText]}>
        {status}
      </Animated.Text>

      {/* Puntos animados */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map(index => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: Animated.add(
                  0.3,
                  Animated.multiply(
                    Animated.sin(
                      Animated.multiply(
                        Animated.add(spinValue, index * 0.33),
                        Math.PI * 2
                      )
                    ),
                    0.7
                  )
                ),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radarContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1.5,
    borderColor: '#3b82f6',
  },
  radarSweep: {
    position: 'absolute',
    width: 110,
    height: 110,
  },
  sweepLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ef4444',
    top: 0,
    left: '50%',
    marginLeft: -1,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 5,
  },
  centerPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
});
