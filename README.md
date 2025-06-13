# Directus Speech-to-Text Interface

Ein Directus Interface-Modul, das Spracheingabe in Textfelder ermöglicht. Nutzt OpenAI's Whisper API für die Spracherkennung.

## Features

- 🎤 Spracheingabe direkt in Directus-Textfelder
- 🌍 Mehrsprachige Unterstützung (Deutsch, Englisch, Spanisch, Französisch, Italienisch)
- 🔄 Auto-Sprach-Erkennung
- 🎯 Nahtlose Integration in bestehende Textfelder
- ⚡ Echtzeit-Transkription mit OpenAI Whisper

## Installation

1. Modul installieren:
```bash
npm install
npm run build
```

2. Extension in Directus verknüpfen:
```bash
npm run link
```

## Konfiguration

1. **OpenAI API Key**: Erforderlich für die Spracherkennung
2. **Sprache**: Wählbar zwischen Auto-Erkennung und spezifischen Sprachen
3. **Placeholder**: Anpassbarer Platzhaltertext

## Verwendung

1. Interface zu einem String- oder Text-Feld hinzufügen
2. OpenAI API Key in den Interface-Optionen eingeben
3. Sprache auswählen (optional)
4. Mikrofon-Button zum Starten/Stoppen der Aufnahme verwenden

## Technische Details

- **Audioformat**: WebM mit Opus-Codec, konvertiert zu WAV
- **Samplerate**: 16kHz für optimale Whisper-Kompatibilität
- **API**: OpenAI Whisper API v1
- **Framework**: Vue 3 + Directus Extensions SDK

## Entwicklung

```bash
# Development-Modus
npm run dev

# Build für Produktion
npm run build
```

## Anforderungen

- Directus 10.0.0+
- Gültiger OpenAI API Key
- HTTPS für Mikrofonzugriff (in Produktion)