# 📖 API y Tipos de Datos - Referencia Completa

## 📦 Tipos TypeScript

```typescript
// types/index.ts

// Veredicto posible de la IA
export type VerdictType = "FOUL" | "YELLOW_CARD" | "RED_CARD" | "PLAY_ON";

// Resultado completo del análisis
export interface FoulAnalysisResult {
  verdict: VerdictType; // El veredicto
  explanation: string; // Explicación en español
  confidence: number; // 0.0 a 1.0
  details: {
    contact_severity: "low" | "medium" | "high"; // Severidad del contacto
    player_position: string; // Ej: "Área de penalti, defensor"
    ball_position: string; // Ej: "En trayecto hacia gol"
  };
}

// Información de un frame extraído
export interface VideoFrame {
  uri: string; // URI local del frame
  base64: string; // Contenido en base64
  timestamp: number; // Timestamp en ms
}

// Respuesta de la API
export interface APIResponse {
  success: boolean; // ¿Fue exitoso?
  result?: FoulAnalysisResult; // Si success=true
  error?: string; // Si success=false
  isDemoMode?: boolean; // True si es modo demo
}
```

---

## 🌐 Comunicación con Anthropic API

### Estructura de Solicitud

```javascript
POST https://api.anthropic.com/v1/messages

Headers:
{
  "x-api-key": "sk-ant-...",
  "anthropic-version": "2023-06-01",
  "content-type": "application/json"
}

Body:
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "system": "You are an expert FIFA referee...",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "iVBORw0KGgoAAAANSU..."  // Base64 de imagen
          }
        },
        {
          "type": "image",
          "source": { ... }  // Más imágenes
        },
        {
          "type": "text",
          "text": "Analyze these football frames..."
        }
      ]
    }
  ]
}
```

### Estructura de Respuesta

```javascript
{
  "id": "msg_xyz123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "{\"verdict\": \"FOUL\", \"explanation\": \"...\", ...}"
    }
  ],
  "model": "claude-3-5-sonnet-20241022",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1250,
    "output_tokens": 287
  }
}
```

---

## 🔄 Flujos de Datos

### Flujo 1: Selección de Video

```
VideoSelector.tsx
    ↓ onVideoSelected(videoUri)
FoulAnalysisScreen.tsx
    ↓ setState('loading')
    ↓ handleVideoSelected(videoUri)
```

### Flujo 2: Extracción de Frames

```
FoulAnalysisScreen.tsx
    ↓ extractVideoFrames(videoUri)
services/videoProcessor.ts
    ↓ FileSystem.readAsStringAsync()
    ↓ convertToBase64()
    ↓ createFrameObjects()
    ↓ return VideoFrame[]
```

### Flujo 3: Análisis de Claude

```
FoulAnalysisScreen.tsx
    ↓ analyzeFoulWithClaude(frames)
services/apiClient.ts
    ↓ createSystemPrompt()
    ↓ createUserPrompt()
    ↓ axios.post() → Anthropic API
    ↓ parseJSON()
    ↓ return APIResponse
```

### Flujo 4: Mostrar Resultado

```
FoulAnalysisScreen.tsx
    ↓ setAnalysisResult()
ResultCard.tsx
    ↓ getVerdictColor()
    ↓ getVerdictLabel()
    ↓ render JSX
```

---

## 🔌 Funciones Exportadas por Módulo

### services/apiClient.ts

```typescript
// Analiza frames con Claude
export const analyzeFoulWithClaude = async (
  frames: Array<{ base64: string }>,
  onProgress?: (status: string) => void
): Promise<APIResponse>

// Verifica si la API está disponible
export const checkAPIStatus = async (): Promise<boolean>
```

### services/videoProcessor.ts

```typescript
// Extrae frames del video
export const extractVideoFrames = async (
  videoUri: string
): Promise<VideoFrame[]>

// Convierte imagen a base64
export const imageToBase64 = async (
  imageUri: string
): Promise<string>

// Valida formato de archivo
export const isValidVideoFile = (uri: string): boolean

// Obtiene info del archivo
export const getFileInfo = async (
  fileUri: string
): Promise<FileInfo | null>
```

### utils/config.ts

```typescript
// Configuración centralizada
export const CONFIG = { ... }

// Verifica si API Key está configurada
export const isApiKeyConfigured = (): boolean
```

### utils/mockData.ts

```typescript
// Array de veredictos de prueba
export const MOCK_VERDICTS: FoulAnalysisResult[]

// Devuelve veredicto aleatorio
export const getRandomMockVerdict = (): FoulAnalysisResult
```

---

## 📱 Props de Componentes

### VideoSelector

```typescript
interface VideoSelectorProps {
  onVideoSelected: (videoUri: string) => void; // Callback cuando selecciona
  isLoading?: boolean; // Mostrar loading
}
```

### LoadingRadar

```typescript
interface LoadingRadarProps {
  status?: string; // Mensaje de estado actual
}
```

### ResultCard

```typescript
interface ResultCardProps {
  result: FoulAnalysisResult; // Resultado del análisis
  isDemoMode?: boolean; // Si es de prueba
  onReset: () => void; // Callback para reiniciar
}
```

---

## 🔐 Configuración de Variables de Entorno

### .env.local (NO incluir en Git)

```bash
# REQUERIDO
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-v1-xxxxx

# OPCIONAL
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### utils/config.ts (Carga automáticamente)

```typescript
const CONFIG = {
  ANTHROPIC_API_KEY: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || "",
  // ... más configuración
};
```

---

## 🎯 Estados de la Pantalla Principal

```typescript
type ScreenState = "selection" | "loading" | "result" | "error";

// selection: Esperando que seleccione video
// loading: Procesando video y enviando a API
// result: Mostrando resultado exitoso
// error: Mostrando error
```

### Transiciones de Estado

```
selection → loading   (usuario selecciona video)
loading → result      (análisis exitoso)
loading → error       (análisis falló)
result → selection    (usuario presiona "Analizar Otro")
error → selection     (usuario presiona "Reintentar")
```

---

## 📊 Estructuras de Respuesta

### Respuesta Exitosa

```json
{
  "success": true,
  "result": {
    "verdict": "YELLOW_CARD",
    "explanation": "Falta táctica clara sin intención de jugar...",
    "confidence": 0.88,
    "details": {
      "contact_severity": "medium",
      "player_position": "Mediocampo",
      "ball_position": "A 3 metros del jugador"
    }
  },
  "isDemoMode": false
}
```

### Respuesta Modo Demo

```json
{
  "success": true,
  "result": {
    "verdict": "FOUL",
    "explanation": "Contacto claro de mano contra el balón...",
    "confidence": 0.95,
    "details": { ... }
  },
  "isDemoMode": true
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": "API Key inválida o expirada",
  "isDemoMode": false
}
```

---

## 🌈 Mapeo de Colores por Veredicto

```typescript
RED_CARD: {
  bg: '#fee2e2',          // Fondo rojo claro
  text: '#991b1b',        // Texto rojo oscuro
  border: '#ef4444',      // Borde rojo
  icon: '🔴'
}

YELLOW_CARD: {
  bg: '#fef3c7',          // Fondo amarillo claro
  text: '#92400e',        // Texto marrón oscuro
  border: '#f59e0b',      // Borde amarillo
  icon: '🟡'
}

FOUL: {
  bg: '#f0f9ff',          // Fondo azul claro
  text: '#0c4a6e',        // Texto azul oscuro
  border: '#0284c7',      // Borde azul
  icon: '⚠️'
}

PLAY_ON: {
  bg: '#f0fdf4',          // Fondo verde claro
  text: '#15803d',        // Texto verde oscuro
  border: '#22c55e',      // Borde verde
  icon: '✅'
}
```

---

## ⚡ Prompts del Sistema

### System Prompt

```
You are an expert FIFA referee with deep knowledge of the Laws of the Game,
specifically Law 12 (Fouls and Misconduct).

Your role is to analyze football/soccer footage and determine if a foul,
yellow card, red card, or no offense has occurred.

[Criterios detallados...]

You MUST respond ONLY with valid JSON in this exact format, with no additional text.
```

### User Prompt

```
Analyze these football video frames and determine if there is a foul,
yellow card offense, red card offense, or if play should continue.

[Instrucciones específicas...]

Respond ONLY with the JSON format specified. No other text.
```

---

## 🧪 Ejemplos de Uso

### Usar solo el componente ResultCard

```typescript
import { ResultCard } from '@/components/ResultCard';

<ResultCard
  result={{
    verdict: 'YELLOW_CARD',
    explanation: 'Falta táctica...',
    confidence: 0.88,
    details: {
      contact_severity: 'medium',
      player_position: 'Mediocampo',
      ball_position: 'A 3m del jugador'
    }
  }}
  isDemoMode={false}
  onReset={() => console.log('Reset')}
/>
```

### Usar solo analyzeFoulWithClaude

```typescript
import { analyzeFoulWithClaude } from "@/services/apiClient";

const response = await analyzeFoulWithClaude(frames, (status) => {
  console.log("Status:", status);
});

if (response.success) {
  console.log("Verdict:", response.result?.verdict);
} else {
  console.error("Error:", response.error);
}
```

### Verificar Configuración

```typescript
import { isApiKeyConfigured } from "@/utils/config";

if (isApiKeyConfigured()) {
  console.log("API Key configurada, usando análisis real");
} else {
  console.log("API Key no encontrada, usando modo demo");
}
```

---

## 🚀 Optimizaciones de Performance

### Memoization

```typescript
const memoizedResult = useMemo(() => getVerdictColor(verdict), [verdict]);
```

### Lazy Loading

```typescript
const LoadingRadar = lazy(() => import("../components/LoadingRadar"));
```

### Cancelación de Requests

```typescript
const controller = new AbortController();

fetch(url, { signal: controller.signal });

// Si el usuario cancela:
controller.abort();
```

---

## 📚 Recursos Relacionados

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guía de instalación
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura detallada
- [QUICKSTART.md](QUICKSTART.md) - Inicio rápido
- [Anthropic API Docs](https://docs.anthropic.com/)

---

**Referencia actualizada**: Abril 2026
