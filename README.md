# Directus Speech-to-Text Extension

A powerful Directus interface extension that enables voice input for text fields using OpenAI's Whisper API. Transform your Directus admin experience by speaking your content instead of typing!

## Features

🎤 **Voice Input** - Click the microphone button to record audio and automatically transcribe it to text  
📝 **Smart Field Support** - Works with both regular text inputs and textarea fields  
🌍 **Multi-Language** - Supports multiple languages including German, English, Spanish, French, and more  
⚙️ **Configurable** - Customizable placeholder text, language settings, and text separator options  
🔄 **Append Mode** - Choose to append new transcriptions to existing text or replace it entirely  
📱 **Responsive Design** - Clean, compact interface that fits seamlessly into Directus  

## Installation

### Manual Installation

1. Download the latest release or clone this repository
2. Copy the extension files to your Directus extensions directory:
   ```bash
   cp -r directus-extension-speech-to-text /path/to/directus/extensions/
   ```
3. Restart your Directus instance
4. The "Speech to Text" interface should now be available in your field configuration

### Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/flagbit/directus-extension-speech-to-text.git
   cd directus-extension-speech-to-text
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. For development with Docker:
   ```bash
   docker-compose up -d
   ```
   Access Directus at http://localhost:8057/admin (admin@example.com / directus123)

## Configuration

When configuring a field to use the Speech to Text interface, you can set the following options:

### Interface Options

- **Placeholder**: Custom placeholder text for the input field
- **OpenAI API Key**: Your OpenAI API key (required for transcription)
- **Language**: Target language for transcription (auto-detect, German, English, Spanish, French, etc.)
- **Append Mode**: Whether to append new transcriptions to existing text or replace it
- **Text Separator**: How to separate new transcriptions from existing text (auto, space, newline, none)

### Usage

1. Configure a text or textarea field to use the "Speech to Text" interface
2. Add your OpenAI API key in the interface options
3. Select your preferred language and separator settings
4. Click the microphone button (🎤) to start recording
5. Speak clearly into your microphone
6. Click stop (⏹) to end recording and automatically transcribe the audio
7. The transcribed text will appear in your field

## Technical Details

### Supported Field Types
- `string` - Regular text inputs
- `text` - Textarea fields (automatically detected for longer content)

### Audio Processing
- Records audio using the Web Audio API and MediaRecorder
- Converts audio to WAV format for optimal compatibility with OpenAI Whisper
- Supports various audio formats (WebM, MP4) with automatic fallback
- Maximum file size: 25MB per recording

### Browser Requirements
- Modern browsers with Web Audio API support
- Microphone access permissions required
- HTTPS recommended for production use

## Development

### Project Structure
```
src/
├── index.ts              # Extension definition and configuration
├── speech-to-text.vue    # Main Vue component
package.json              # Extension manifest
docker-compose.yml        # Development environment
```

### Build Commands
- `npm run build` - Build the extension for production
- `npm run dev` - Build in watch mode for development
- `npm run link` - Link extension for development

### Docker Development Environment
The included Docker setup provides a complete Directus instance for testing:
- Directus admin interface at http://localhost:8057/admin
- SQLite database with persistent data
- Automatic extension loading via volume mounts

## Troubleshooting

### Common Issues

**Extension not showing up**
- Ensure the extension is properly built (`npm run build`)
- Check that all files are in the correct Directus extensions directory
- Restart your Directus instance

**Microphone not working**
- Grant microphone permissions in your browser
- Ensure you're using HTTPS in production
- Check browser compatibility for Web Audio API

**Transcription errors**
- Verify your OpenAI API key is correct and has credits
- Check your internet connection
- Ensure audio quality is clear (reduce background noise)

## Requirements

- Directus ^10.10.0
- OpenAI API key with Whisper access
- Modern browser with Web Audio API support
- Microphone access

## License

MIT License - see LICENSE file for details

## Author

**Jörg Weller**  
Email: joerg.weller@flagbit.de  
Company: Flagbit GmbH & Co. KG

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### v1.0.0
- Initial release
- OpenAI Whisper integration
- Support for text and textarea fields
- Multi-language support
- Configurable append mode and text separators
- Responsive design with compact button interface