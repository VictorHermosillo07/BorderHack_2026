import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CameraRecorderProps {
  onVideoRecorded: (videoUri: string) => void;
  isLoading?: boolean;
}

export const CameraRecorder: React.FC<CameraRecorderProps> = ({ onVideoRecorded, isLoading = false }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isSimulator, setIsSimulator] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    // Detectar si estamos en simulador
    checkIfSimulator();
    
    if (!cameraPermission?.granted) requestCameraPermission();
    if (!microphonePermission?.granted) requestMicrophonePermission();
  }, [cameraPermission, microphonePermission]);

  const checkIfSimulator = async () => {
    // En simulador, las características de hardware no están disponibles
    // Podemos detectarlo intentando usar ciertas APIs
    try {
      const { isDevice } = await import('expo-device');
      setIsSimulator(!isDevice);
    } catch {
      setIsSimulator(Platform.OS === 'web');
    }
  };

  const handlePickVideoFallback = async () => {
    try {
      console.log('📷 Abriendo galería de videos...');
      
      // Solicitar permisos de galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar videos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        allowsMultiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('✅ Video seleccionado:', result.assets[0].uri);
        onVideoRecorded(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error seleccionando video:', error);
      Alert.alert('Error', 'No se pudo seleccionar el video.');
    }
  };

  if (!cameraPermission?.granted || !microphonePermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Necesitamos permisos de cámara y micrófono para grabar.</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => {
            requestCameraPermission();
            requestMicrophonePermission();
          }}
        >
          <Text style={styles.permissionText}>Otorgar Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRecordButtonPress = async () => {
    if (!cameraRef.current) return;

    if (isRecording) {
      try {
        console.log('⏹️ Deteniendo grabación...');
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error('Error deteniendo grabación:', error);
        setIsRecording(false);
      }
    } else {
      setIsRecording(true);
      try {
        console.log('🔴 Iniciando grabación...');
        const video = await cameraRef.current.recordAsync({
          maxDuration: 15,
        });
        
        if (video && video.uri) {
          console.log('✅ Video grabado exitosamente');
          console.log('📍 URI del video:', video.uri);
          
          // Pequeña pausa para asegurar que el archivo esté disponible
          await new Promise(resolve => setTimeout(resolve, 500));
          
          onVideoRecorded(video.uri);
        } else {
          throw new Error('No se obtuvo URI del video grabado');
        }
      } catch (error: any) {
        console.error('Error al grabar:', error);
        setIsRecording(false);
        
        const errorMessage = error.message || error.toString();
        console.error('Mensaje de error completo:', errorMessage);
        
        if (errorMessage.includes('simulator') || errorMessage.includes('not supported')) {
          console.log('📱 Simulador detectado, ofreciendo alternativa de galería');
          Alert.alert(
            'Simulador Detectado',
            'La grabación de video no funciona en simuladores. Por favor, elige un video de tu galería para probar la app.',
            [
              {
                text: 'Usar Galería',
                onPress: handlePickVideoFallback,
              },
              {
                text: 'Cancelar',
                onPress: () => {},
              },
            ]
          );
        } else {
          Alert.alert('Error', `No se pudo grabar el video: ${errorMessage}`);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Procesando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        mode="video" 
        ref={cameraRef}
      />
      
      {/* Botones superpuestos con posicionamiento absoluto */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordingButton]} 
          onPress={handleRecordButtonPress}
          disabled={isLoading}
        >
          {isRecording ? (
            <View style={styles.recordButtonInner} />
          ) : (
            <View style={[styles.recordButtonInner, styles.stopButtonInner]} />
          )}
        </TouchableOpacity>
        
        {/* Botón de galería como alternativa (especialmente en simulador) */}
        <TouchableOpacity 
          style={styles.galleryButton}
          onPress={handlePickVideoFallback}
          disabled={isLoading}
        >
          <Text style={styles.galleryButtonText}>📷</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff0000',
  },
  stopButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  galleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButtonText: {
    fontSize: 28,
  },
});