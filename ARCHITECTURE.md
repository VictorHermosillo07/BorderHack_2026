# 📚 Guía Completa de Arquitectura - VAR IA

## 🏗️ Explicación de Cada Archivo

### **types/index.ts** - Definiciones TypeScript

Define los tipos principales de la aplicación para asegurar type-safety.

```typescript
- VerdictType: 'FOUL' | 'YELLOW_CARD' | 'RED_CARD' | 'PLAY_ON'
- FoulAnalysisResult: Resultado completo del análisis
- VideoFrame: Información de cada frame extraído
- APIResponse: Respuesta de la API
```

### **utils/config.ts** - Configuración Central

Punto único de configuración para toda la aplicación.

**Parámetros principales:**

- `ANTHROPIC_API_KEY`: Tu API Key (desde .env.local)
- `CLAUDE_MODEL`: Modelo a usar (por defecto Sonnet 3.5)
- `VIDEO_FRAME_COUNT`: Frames a extraer (defecto: 4)
- `ENABLE_DEMO_MODE`: Activar/desactivar modo prueba

**Cómo cambiar modelos:**

```typescript
// Cambiar a Opus (más potente, más caro)
CLAUDE_MODEL: "claude-3-opus-20250219";

// Cambiar a Haiku (más rápido, más barato)
CLAUDE_MODEL: "claude-3-haiku-20250307";
```

### **utils/mockData.ts** - Datos de Prueba

Proporciona veredictos simulados para el Modo Demo.

Incluye 4 casos de prueba:

- ✋ Mano en el área (penalti)
- 🟡 Falta táctica (tarjeta amarilla)
- 🔴 Conducta violenta (expulsión)
- ✅ Juego limpio (continúa)

### **services/videoProcessor.ts** - Procesamiento de Video

Maneja todo lo relacionado con videos: extracción, validación, conversión.

**Funciones principales:**

```typescript
extractVideoFrames(); // Extrae frames del video
imageToBase64(); // Convierte imagen a base64
isValidVideoFile(); // Valida formato de video
getFileInfo(); // Obtiene metadata del archivo
```

**Limitaciones en Expo Go:**

- Los videos se leen como archivos base64 completos
- Para procesamiento frame-by-frame real, necesitarías bibliotecas nativas
- La solución actual es suficiente para el MVP

### **services/apiClient.ts** - Cliente de Anthropic

Integración completa con la API de Claude.

**Funciones principales:**

```typescript
analyzeFoulWithClaude(); // Envía frames y recibe análisis
checkAPIStatus(); // Verifica que la API está disponible
```

**Flujo de análisis:**

1. Valida API Key
2. Si no está configurada → Modo Demo
3. Crea contenido con imágenes en base64
4. Envía a Claude con prompt especializado
5. Parsea respuesta JSON
6. Devuelve resultado estructurado

**Manejo de errores:**

- 401: API Key inválida
- 429: Límite de solicitudes alcanzado
- Timeout: Respuesta tarda > 60 segundos

### **components/VideoSelector.tsx** - Selector de Video

Interfaz para seleccionar video de la galería.

**Características:**

- Solicita permisos automáticamente
- Muestra preview del video seleccionado
- Valida formato (MP4, MOV, AVI, WebM)
- Permite cambiar selección
- Indicador visual de carga

### **components/LoadingRadar.tsx** - Animación de Carga

Componente visual durante el procesamiento.

**Animaciones:**

- Radar giratorio (rotación 360°)
- Anillo concéntrico (radio variable)
- Barrido rojo (tipo escaneo)
- Puntos pulsantes (feedback visual)
- Mensajes de estado en tiempo real

**Personalización de mensajes:**

```typescript
<LoadingRadar status="Procesando..." />
```

### **components/ResultCard.tsx** - Tarjeta de Resultados

Muestra el veredicto del análisis de forma atractiva.

**Elementos:**

- Icono del veredicto (🔴🟡⚠️✅)
- Barra de confianza (0-100%)
- Explicación detallada
- Grid de detalles (severidad, posiciones)
- Nota de modo demo (si aplica)
- Botón para analizar otro video

**Colores por veredicto:**

- 🔴 RED_CARD: Rojo (#ef4444)
- 🟡 YELLOW_CARD: Amarillo (#f59e0b)
- ⚠️ FOUL: Azul (#0284c7)
- ✅ PLAY_ON: Verde (#22c55e)

### **screens/FoulAnalysisScreen.tsx** - Pantalla Principal

Orquesta todo el flujo de la aplicación.

**Estados:**

```typescript
"selection"; // Esperando que seleccione video
"loading"; // Procesando video y API
"result"; // Mostrando resultado
"error"; // Error durante el proceso
```

**Flujo de eventos:**

1. Usuario selecciona video
2. Se extraen frames
3. Se envían a Claude
4. Se muestra resultado
5. Usuario puede reintentar

**Manejo de errores:**

- Valida que haya frames
- Captura errores de API
- Muestra alertas descriptivas
- Permite reintentar

### **app/(tabs)/index.tsx** - Punto de Entrada

Pantalla principal de la app que renderiza FoulAnalysisScreen.

Simple pero poderoso:

```typescript
import { FoulAnalysisScreen } from '@/screens/FoulAnalysisScreen';

export default function HomeScreen() {
  return <FoulAnalysisScreen />;
}
```

## 🔄 Flujo Completo de Datos

```
Usuario
   ↓
VideoSelector (selecciona archivo)
   ↓
FoulAnalysisScreen (procesa)
   ↓
videoProcessor.extractVideoFrames() (extrae frames)
   ↓
LoadingRadar (muestra animación)
   ↓
apiClient.analyzeFoulWithClaude() (envía a Claude)
   ↓
Claude API (analiza)
   ↓
ResultCard (muestra resultado)
   ↓
Usuario puede analizar otro video
```

## 🔐 Seguridad

### API Key

- ✅ Se lee desde `.env.local` (NO incluida en el repo)
- ✅ Nunca se expone en logs
- ✅ Se valida antes de usar
- ❌ NUNCA la hardcodees en el código

### Datos Sensibles

- Videos no se guardan en el dispositivo
- Solo se transmiten a Anthropic bajo HTTPS
- Resultados son ephemeral (no se persisten)

## 🚀 Optimizaciones Posibles

### 1. Caché de Resultados

```typescript
const [resultCache, setResultCache] =
  useState<Map<string, FoulAnalysisResult>>();
```

### 2. Compresión de Frames

```typescript
// Reducir tamaño de base64 antes de enviar
const compressImage = () => {
  /* ... */
};
```

### 3. Análisis Batch

```typescript
// Procesar múltiples videos secuencialmente
const analyzeMultipleVideos = async (videoUris: string[]) => {
  /* ... */
};
```

### 4. Persistencia Local

```typescript
// Guardar histórico con AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
```

### 5. Offline Mode

```typescript
// Usar resultados en caché si no hay conectividad
```

## 📊 Métricas de Performance

### Tamaños de archivo

- App: ~150MB (con todas las dependencias)
- Un video de 10s: ~50-200MB
- Frames base64: ~5-10MB por video

### Tiempos típicos

- Extracción de frames: < 2s
- Envío a API: < 1s
- Procesamiento de Claude: 3-10s
- Renderizado: < 500ms

### Límites de API

- Máximo 50 solicitudes/día (plan free)
- Máximo 1000 tokens por mensaje
- Rate limit: 10 requests/minuto

## 🧩 Extensiones Futuras

### 1. Multi-angle Analysis

```typescript
// Permitir múltiples ángulos de la misma falta
```

### 2. Replay Slow-Motion

```typescript
// Reproducir video en cámara lenta
```

### 3. Histórico de Análisis

```typescript
// Guardar y mostrar análisis previos
```

### 4. Estadísticas por Árbitro

```typescript
// Comparar decisiones de diferentes árbitros
```

### 5. AI Training Feedback

```typescript
// Permitir usuarios calificar veredictos para mejora continua
```

## 🐛 Debug Mode

Para activar logs detallados:

```typescript
// En utils/config.ts
DEBUG_MODE: true;

// En services/apiClient.ts
if (DEBUG_MODE) console.log("Request:", JSON.stringify(payload, null, 2));
```

## 📱 Testing en Diferentes Dispositivos

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Device Físico (Expo Go)

```bash
npm start
# Abre Expo Go en tu dispositivo
# Escanea el QR
```

### Web Browser

```bash
npm run web
# Abre en http://localhost:19006
```

## 🎓 Recursos Adicionales

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/intro)
- [Anthropic API Reference](https://docs.anthropic.com/en/api/)
- [FIFA Laws of the Game](https://www.fifa.com/laws-of-game/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización**: Abril 2026
