# 🚀 Guía Rápida de Inicio - VAR IA

## ⚡ 5 Pasos para Empezar

### Paso 1: Instalar Dependencias

```bash
cd /Users/victorhermosillo/BorderHack_2026
npm install
npx expo install expo-image-picker axios expo-media-library
```

### Paso 2: Obtener API Key

1. Abre https://aistudio.google.com/
2. Crea cuenta con tu correo de Google
3. Genera API Key
4. Copia el valor de la clave

### Paso 3: Configurar Environment

```bash
# Abre .env.local
nano .env.local

# Pega tu API Key:
EXPO_PUBLIC_GEMINI_API_KEY=tu-api-key-aqui

# Guarda (Ctrl+O, Enter, Ctrl+X)
```

### Paso 4: Ejecutar la App

```bash
npm start
```

### Paso 5: Usar en Expo Go

- iOS: Abre Expo Go, escanea QR
- Android: Abre Expo Go, escanea QR
- Web: Presiona 'w' en la terminal

---

## 📋 Comandos Útiles

```bash
# Iniciar app en desarrollo
npm start

# Iniciar solo iOS
npm run ios

# Iniciar solo Android
npm run android

# Iniciar solo Web
npm run web

# Limpiar caché de Expo
expo reset

# Ver logs en tiempo real
npm start -- --clear

# Instalar dependencia nueva
npx expo install [package-name]

# Linter TypeScript
npm run lint

# Reset completo del proyecto
npm run reset-project
```

---

## 🎯 Casos de Uso

### Caso 1: Probar sin API Key (Modo Demo)

```bash
1. NO configures .env.local
2. npm start
3. Selecciona cualquier video
4. Verás resultados de prueba automáticamente
5. ¡Perfecto para probar la UI!
```

### Caso 2: Análisis Real con API

```bash
1. Configura tu API Key en .env.local
2. npm start
3. Selecciona un video real
4. Los frames se envían a Gemini
5. Recibirás análisis real
```

### Caso 3: Desarrollo Iterativo

```bash
# Terminal 1
npm start

# Terminal 2 (otra ventana)
# Edita archivos en tu editor
# La app se recarga automáticamente con hot reload
```

---

## 🆘 Troubleshooting

### ❌ "Module not found: expo-image-picker"

**Solución:**

```bash
npx expo install expo-image-picker
npm install
```

### ❌ "API Key not configured, using demo mode"

**Significa:**

- Tu `.env.local` no tiene la API Key
- **Esto es normal** - la app funcionará en modo demo

**Para usar API real:**

```bash
# Verifica que .env.local existe y tiene:
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Reinicia la app
npm start
```

### ❌ "Error 401: Unauthorized"

**Significa:** Tu API Key es inválida

**Solución:**

1. Ve a https://console.anthropic.com/
2. Genera una API Key nueva
3. Copia el valor completo (debe empezar con `sk-ant-`)
4. Actualiza .env.local
5. Reinicia la app

### ❌ "Cannot access media library"

**Significa:** Permisos no concedidos

**Solución:**

- iOS: Settings → App → Permissions → Allow
- Android: Long press app → Permissions → Allow
- Web: No aplica

### ❌ "The app crashed"

**Pasos para debuggear:**

1. Abre la consola de Expo Go (shake device)
2. Busca el error rojo
3. Revisa [ARCHITECTURE.md](ARCHITECTURE.md) para entender el flujo

### ❌ "Timeout de 60 segundos"

**Significa:** Claude tardó mucho en responder

**Causas posibles:**

- Red lenta
- Video muy largo
- Servidor de Anthropic ocupado

**Solución:**

- Intenta con video más corto (< 30s)
- Espera unos minutos y reintenta
- Verifica tu conexión a internet

---

## 🎨 Personalización Rápida

### Cambiar Colores

En `components/ResultCard.tsx`:

```typescript
const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "RED_CARD":
      return { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" };
    // Cambia estos valores hex por otros colores
  }
};
```

### Cambiar Modelo Claude

En `utils/config.ts`:

```typescript
// Cambiar de Sonnet a Opus (más potente)
CLAUDE_MODEL: 'claude-3-opus-20250219',

// O a Haiku (más rápido)
CLAUDE_MODEL: 'claude-3-haiku-20250307',
```

### Cambiar Número de Frames

En `utils/config.ts`:

```typescript
VIDEO_FRAME_COUNT: 6,  // En lugar de 4
```

---

## 📊 Monitoreo

### Ver uso de tokens

La API de Anthropic muestra:

- Input tokens: tokens del prompt + imágenes
- Output tokens: tokens de la respuesta

Cada imagen ≈ 200-300 tokens

### Estimaciones de costo

- Video de 10s con 4 frames: ~500 tokens → $0.01
- 100 análisis: ~$1.00

---

## 🔗 Enlaces Importantes

| Recurso                 | URL                                |
| ----------------------- | ---------------------------------- |
| Obtener API Key         | https://console.anthropic.com/     |
| Documentación Anthropic | https://docs.anthropic.com/        |
| Expo Docs               | https://docs.expo.dev/             |
| React Native Docs       | https://reactnative.dev/           |
| FIFA Laws               | https://www.fifa.com/laws-of-game/ |

---

## ✅ Checklist de Verificación

- [ ] Node.js v18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Expo CLI instalado (`expo --version`)
- [ ] Carpeta BorderHack_2026 existe
- [ ] `npm install` ejecutado exitosamente
- [ ] API Key obtenida de Anthropic
- [ ] `.env.local` configurado con API Key
- [ ] `npm start` ejecuta sin errores
- [ ] Expo Go funciona en tu dispositivo
- [ ] Puedes seleccionar un video
- [ ] El análisis devuelve resultado

Si todo está ✓, ¡estás listo para usar VAR IA! 🚀

---

## 💡 Pro Tips

### Tip 1: Usa Modo Demo para Testing

```bash
# Comenta la línea en .env.local
# EXPO_PUBLIC_ANTHROPIC_API_KEY=...

# Así pruebas la UI sin gastar tokens
```

### Tip 2: Crea Alias de Comandos

```bash
# En tu .zshrc o .bashrc
alias vai='cd ~/BorderHack_2026 && npm start'
```

### Tip 3: Monitorea Network

```bash
# En Expo Go: Shake → Network tab
# Verás todas las solicitudes en tiempo real
```

### Tip 4: Usa Videos Cortos para Testing

- 5-10 segundos es ideal
- Menos de 1MB de tamaño
- Resolución 720p es suficiente

### Tip 5: Mantén tu API Key Segura

```bash
# NUNCA hagas esto:
# - Comitear .env.local
# - Compartir tu API Key
# - Hardcodear la key en el código

# Siempre:
git add -A
git status  # Verifica que no incluya .env.local
```

---

**¿Necesitas ayuda?** Lee [ARCHITECTURE.md](ARCHITECTURE.md) para más detalles técnicos.
