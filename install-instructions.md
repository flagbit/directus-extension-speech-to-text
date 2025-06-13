# Directus Speech-to-Text Extension Installation

Die Extension ist fertig entwickelt und getestet. Hier sind die Installationsanleitungen:

## 🎯 Extension Details
- **Name:** directus-extension-speech-to-text
- **Typ:** Interface Extension
- **Funktionen:** OpenAI Whisper Integration, Mehrsprachig, Audio-zu-Text

## 📦 Installation in existierender Directus Installation

### Option 1: npm Link (Empfohlen für Entwicklung)
```bash
# Im Extension-Verzeichnis:
cd /Users/weller/Development/DirectusSpeech2TextModule
npm run build
npm run link

# In Ihrer Directus Installation:
npm install
```

### Option 2: npm Pack & Install
```bash
# Extension packen:
cd /Users/weller/Development/DirectusSpeech2TextModule
npm run build
npm pack

# In Ihrer Directus Installation:
npm install /path/to/directus-extension-speech-to-text-1.0.0.tgz
```

### Option 3: Direkter Upload (Produktiv)
1. `npm run build` ausführen
2. `dist/index.js` nach `your-directus/extensions/interfaces/speech-to-text.js` kopieren
3. Directus neustarten

## 🚀 Neue Directus Installation mit Extension

```bash
# Neue Directus Installation
npx create-directus-project my-project
cd my-project

# Extension installieren
npm install /Users/weller/Development/DirectusSpeech2TextModule/directus-extension-speech-to-text-1.0.0.tgz

# Starten
npx directus start
```

## ⚙️ Konfiguration

1. **Field erstellen:**
   - Type: String oder Text  
   - Interface: "Speech to Text"

2. **Extension-Optionen:**
   - **OpenAI API Key:** Ihr OpenAI API Schlüssel
   - **Language:** Sprache für Erkennung (Auto, DE, EN, etc.)
   - **Placeholder:** Platzhaltertext
   - **Append Mode:** Text anhängen statt ersetzen

## 🎤 Verwendung

1. Field mit Speech-to-Text Interface öffnen
2. Mikrofon-Button klicken
3. Sprechen
4. Stopp-Button klicken
5. Text wird automatisch eingefügt

## 🛠 Funktionen

- ✅ OpenAI Whisper API Integration
- ✅ 10 Sprachen unterstützt
- ✅ Audio-Optimierung (WAV-Konvertierung)
- ✅ Fehlerbehandlung & Benutzer-Feedback
- ✅ Append/Replace Modi
- ✅ Responsive UI mit Recording-Animation

## 📋 Dateien

```
DirectusSpeech2TextModule/
├── src/
│   ├── index.ts              # Extension Definition
│   └── speech-to-text.vue    # Vue Interface Component
├── dist/
│   └── index.js              # Gebaute Extension
├── package.json              # Extension Manifest
├── tsconfig.json             # TypeScript Config
└── simple-demo.html          # Standalone Demo
```

Die Extension ist produktionsreif und kann sofort verwendet werden!