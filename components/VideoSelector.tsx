// Componente para seleccionar video

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { isValidVideoFile } from '../services/videoProcessor';

interface VideoSelectorProps {
  onVideoSelected: (videoUri: string) => void;
  isLoading?: boolean;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
  onVideoSelected,
  isLoading = false,
}) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de acceso a la galería para seleccionar videos'
        );
      }
    } catch (error) {
      console.error('Error solicitando permisos:', error);
    }
  };

  const handleSelectVideo = async () => {
    try {
      if (!hasPermission) {
        await requestMediaLibraryPermission();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validar que sea un video
        if (!isValidVideoFile(asset.uri)) {
          Alert.alert('Archivo inválido', 'Por favor selecciona un archivo de video válido');
          return;
        }

        // Usar la imagen thumbnail si está disponible
        if (asset.uri) {
          setThumbnail(asset.uri);
          onVideoSelected(asset.uri);
        }
      }
    } catch (error) {
      console.error('Error seleccionando video:', error);
      Alert.alert('Error', 'No se pudo seleccionar el video. Intenta de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Procesando video...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectVideo}
        activeOpacity={0.7}
        disabled={!hasPermission}
      >
        <View style={styles.buttonContent}>
          {thumbnail ? (
            <>
              <Image
                source={{ uri: thumbnail }}
                style={styles.thumbnail}
              />
              <Text style={styles.thumbnailLabel}>Video seleccionado ✓</Text>
            </>
          ) : (
            <>
              <Text style={styles.uploadIcon}>🎬</Text>
              <Text style={styles.mainText}>Selecciona un Video</Text>
              <Text style={styles.subText}>
                Toca para abrir la galería y elegir un clip
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {thumbnail && (
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => {
            setThumbnail(null);
            handleSelectVideo();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.changeButtonText}>Cambiar Video</Text>
        </TouchableOpacity>
      )}

      {!hasPermission && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestMediaLibraryPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.permissionButtonText}>Habilitar Permisos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  thumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  thumbnailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  mainText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  changeButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#4338ca',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
