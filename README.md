# ⚽ VAR IA - AI-Powered Football Foul Analysis

Aplicación móvil inteligente que utiliza Google Gemini API para analizar faltas de fútbol como un árbitro FIFA experto. Creada con React Native, Expo y TypeScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## ✨ Características Principales

- 🎬 **Selección de videos** desde galería
- 🔍 **Extracción de frames** inteligente
- 🤖 **Análisis con Google Gemini API** como árbitro experto
- 📊 **Veredictos estructurados** en JSON (Falta/Amarilla/Roja/Juega)
- ⏳ **Animación radar** durante procesamiento
- 🎨 **Interfaz atractiva** con tarjetas de resultado
- 🚫 **Modo Demo** para probar sin API Key
- 📱 **Expo Go compatible** - desarrollo rápido

## 🚀 Inicio Rápido (3 Pasos)

### 1️⃣ Instalar Dependencias

```bash
npm install
npx expo install expo-image-picker axios expo-media-library
```

### 2️⃣ Configurar API Key

```bash
# Obtén una en: https://aistudio.google.com/
echo "EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...tu-key" > .env.local
```

### 3️⃣ Ejecutar

```bash
npm start
# Presiona 'i' (iOS), 'a' (Android), o 'w' (Web)
```

## 📚 Documentación

| Documento                            | Descripción                              |
| ------------------------------------ | ---------------------------------------- |
| [QUICKSTART.md](QUICKSTART.md)       | 5 pasos y comandos rápidos               |
| [SETUP_GUIDE.md](SETUP_GUIDE.md)     | Instalación completa y detallada         |
| [ARCHITECTURE.md](ARCHITECTURE.md)   | Explicación de cada archivo y componente |
| [API_REFERENCE.md](API_REFERENCE.md) | Tipos, endpoints y flujos de datos       |

## 🏗️ Estructura del Proyecto

```
BorderHack_2026/
├── 📄 Quick Links
│   ├── QUICKSTART.md           # ← EMPIEZA AQUÍ
│   ├── SETUP_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── API_REFERENCE.md
│
├── app/                         # Rutas de Expo Router
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       └── index.tsx            # Pantalla principal
│
├── screens/
│   └── FoulAnalysisScreen.tsx   # Lógica principal
│
├── components/
│   ├── VideoSelector.tsx        # Seleccionar video
│   ├── LoadingRadar.tsx         # Animación de carga
│   └── ResultCard.tsx           # Mostrar resultado
│
├── services/
│   ├── apiClient.ts             # Integración Claude
│   └── videoProcessor.ts        # Procesamiento de video
│
├── types/
│   └── index.ts                 # Tipos TypeScript
│
├── utils/
│   ├── config.ts                # Configuración
│   └── mockData.ts              # Datos de prueba
│
├── .env.local                   # Tu API Key (NO SUBIR)
└── package.json
```

## 🎯 Flujo de la Aplicación

```
Usuario selecciona video
         ↓
   Extrae frames
         ↓
   Envía a Claude
         ↓
Muestra animación radar
         ↓
Claude devuelve análisis
         ↓
Renderiza resultado
         ↓
Usuario puede reanalizar
```

## 🔧 Configuración

### API Key de Anthropic

```bash
# Archivo: .env.local
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-v1-xxxxx
```

**¿Cómo obtener?**

1. Abre https://console.anthropic.com/
2. Crea una cuenta
3. Genera API Key
4. Copia en .env.local

### Cambiar Modelo de IA

En `utils/config.ts`:

```typescript
// Sonnet 3.5 (recomendado - rápido y barato)
CLAUDE_MODEL: "claude-3-5-sonnet-20241022";

// Opus (más potente pero más caro)
CLAUDE_MODEL: "claude-3-opus-20250219";

// Haiku (más rápido pero menos potente)
CLAUDE_MODEL: "claude-3-haiku-20250307";
```

## 📱 Plataformas Soportadas

| Plataforma | Soporte | Comando           |
| ---------- | ------- | ----------------- |
| iOS        | ✅      | `npm run ios`     |
| Android    | ✅      | `npm run android` |
| Web        | ✅      | `npm run web`     |
| Expo Go    | ✅      | `npm start`       |

## 🧪 Modo Demo (Sin API Key)

Perfecto para testing:

```bash
# Deja .env.local vacío o sin API Key
npm start

# Selecciona cualquier video
# Verás resultados de prueba automáticamente
```

## 📊 Uso de Tokens

- Video de 10 segundos: ~500-1000 tokens
- 1 análisis: ~$0.01-0.02
- Plan free: ~50-100 análisis

## 🐛 Troubleshooting

### Error: "Module not found"

```bash
npm install
npx expo install expo-image-picker
```

### Error: "API Key not configured"

- Normal en modo demo
- Para usar API real, configura `.env.local`

### Error: "Cannot access media library"

- iOS/Android: Habilita permisos en Settings
- Web: No aplica

### Timeout de 60s

- Intenta con video más corto (< 30s)
- Verifica conexión a internet

## 🚀 Comandos Útiles

```bash
# Inicio rápido
npm start

# Desarrollo iOS
npm run ios

# Desarrollo Android
npm run android

# Web
npm run web

# Limpiar caché
expo reset

# Instalar paquete
npx expo install [package]

# Linter
npm run lint
```

## 🎓 Aprender Más

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Anthropic API](https://docs.anthropic.com/)
- [FIFA Laws of the Game](https://www.fifa.com/laws-of-game/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -am 'Add feature'`)
4. Push (`git push origin feature/amazing`)
5. Abre Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles

## 👤 Creado para

BorderHack 2026

---

## ⚡ Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
