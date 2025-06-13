<template>
  <div class="speech-to-text-interface">
    <div class="input-container">
      <component
        :is="isTextarea ? 'v-textarea' : 'v-input'"
        :model-value="value"
        :placeholder="placeholder"
        @update:model-value="$emit('input', $event)"
        :disabled="isRecording"
        :trim="false"
        :rows="isTextarea ? 6 : undefined"
        :expand-on-focus="false"
        :auto-grow="false"
        class="speech-input"
      />
      
      <div class="mic-button-container">
        <button
          @click="toggleRecording"
          :disabled="!apiKey || isProcessing"
          :title="getButtonTooltip()"
          class="mic-button"
          :class="{ 'recording': isRecording, 'processing': isProcessing }"
        >
          <span v-if="isProcessing">⏳</span>
          <span v-else-if="isRecording">⏹</span>
          <span v-else>🎤</span>
        </button>
      </div>
    </div>
    
    <div v-if="!apiKey" class="warning-message">
      <v-notice type="warning">
        OpenAI API Key is required. Please configure it in the interface options.
      </v-notice>
    </div>
    
    <div v-if="error" class="error-message">
      <v-notice type="danger">
        {{ error }}
      </v-notice>
    </div>
    
    <div v-if="isRecording" class="recording-indicator">
      <v-icon name="radio_button_checked" class="recording-pulse" />
      <span>Recording... Click stop to finish</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  value?: string;
  placeholder?: string;
  openai_api_key?: string;
  language?: string;
  append_mode?: boolean;
  line_separator?: string;
  type?: string;
  field?: {
    type?: string;
  };
}

interface Emits {
  (event: 'input', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Text eingeben oder Mikrofon verwenden...',
  language: 'auto',
  append_mode: true,
  line_separator: 'auto',
});

const emit = defineEmits<Emits>();

const isRecording = ref(false);
const isProcessing = ref(false);
const error = ref<string>('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);

const apiKey = computed(() => props.openai_api_key);
const isTextarea = computed(() => 
  props.type === 'text' || 
  props.field?.type === 'text' || 
  (props.value && props.value.length > 100)
);

function getButtonTooltip(): string {
  if (!apiKey.value) return 'OpenAI API Key required';
  if (isRecording.value) return 'Stop recording';
  if (isProcessing.value) return 'Processing audio...';
  return 'Start voice recording';
}

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  try {
    error.value = '';
    
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });
    
    audioChunks.value = [];
    
    // Use the most compatible format
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }
    }
    
    mediaRecorder.value = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    
    mediaRecorder.value.onstop = async () => {
      stream.getTracks().forEach(track => track.stop());
      await processAudio();
    };
    
    mediaRecorder.value.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      error.value = 'Recording error occurred';
      stream.getTracks().forEach(track => track.stop());
      isRecording.value = false;
    };
    
    mediaRecorder.value.start(1000); // Collect data every second
    isRecording.value = true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      error.value = 'Microphone access denied. Please allow microphone permissions and try again.';
    } else if (errorMessage.includes('NotFoundError')) {
      error.value = 'No microphone found. Please connect a microphone and try again.';
    } else {
      error.value = `Failed to access microphone: ${errorMessage}`;
    }
    console.error('Error accessing microphone:', err);
  }
}

function stopRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
}

async function processAudio() {
  if (audioChunks.value.length === 0) {
    error.value = 'No audio data recorded. Please try again.';
    return;
  }
  
  try {
    isProcessing.value = true;
    error.value = '';
    
    // Create blob from recorded chunks
    const audioBlob = new Blob(audioChunks.value, { type: audioChunks.value[0].type });
    
    // Check file size (OpenAI has a 25MB limit)
    if (audioBlob.size > 25 * 1024 * 1024) {
      error.value = 'Audio file too large. Please record shorter audio clips.';
      return;
    }
    
    // Convert to WAV format for better compatibility
    const arrayBuffer = await audioBlob.arrayBuffer();
    let processedBlob: Blob;
    
    try {
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      processedBlob = audioBufferToWav(audioBuffer);
      audioContext.close();
    } catch (decodeError) {
      console.warn('Could not decode audio, using original blob:', decodeError);
      processedBlob = audioBlob;
    }
    
    const formData = new FormData();
    formData.append('file', processedBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    
    if (props.language !== 'auto') {
      formData.append('language', props.language);
    }
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.value}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`OpenAI API Error: ${errorMessage}`);
    }
    
    const result = await response.json();
    
    if (result.text && result.text.trim()) {
      const currentValue = props.value || '';
      let newValue: string;
      
      if (props.append_mode && currentValue) {
        let separator = '';
        
        // Determine separator based on configuration
        switch (props.line_separator) {
          case 'space':
            separator = currentValue.endsWith(' ') ? '' : ' ';
            break;
          case 'newline':
            separator = currentValue.endsWith('\n') ? '' : '\n';
            break;
          case 'none':
            separator = '';
            break;
          case 'auto':
          default:
            // Auto mode: newline for textarea, space for input
            if (isTextarea.value) {
              separator = currentValue.endsWith('\n') ? '' : '\n';
            } else {
              separator = currentValue.endsWith(' ') || currentValue.endsWith('\n') ? '' : ' ';
            }
            break;
        }
        
        newValue = currentValue + separator + result.text.trim();
      } else {
        newValue = result.text.trim();
      }
      
      emit('input', newValue);
    } else {
      error.value = 'No speech detected. Please try speaking more clearly or check your microphone.';
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      error.value = 'Network error. Please check your internet connection and try again.';
    } else if (errorMessage.includes('API key')) {
      error.value = 'Invalid API key. Please check your OpenAI API key.';
    } else {
      error.value = `Speech recognition error: ${errorMessage}`;
    }
    console.error('Speech recognition error:', err);
  } finally {
    isProcessing.value = false;
  }
}

function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = Math.min(audioBuffer.numberOfChannels, 2); // Limit to stereo
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = audioBuffer.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Convert audio data
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}
</script>

<style scoped>
.speech-to-text-interface {
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.speech-input {
  flex: 1;
}

/* Force textarea to maintain consistent size */
.speech-input :deep(.v-textarea) {
  min-height: auto !important;
}

.speech-input :deep(.v-textarea .v-field__input) {
  min-height: 120px !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.speech-input :deep(.v-input .v-field) {
  min-height: auto !important;
}

.mic-button-container {
  display: flex;
  align-items: flex-start;
  padding-top: 12px;
}

.mic-button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: var(--theme--primary);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
}

.mic-button:hover:not(:disabled) {
  background: var(--theme--primary-125);
  transform: scale(1.05);
}

.mic-button.recording {
  background: var(--theme--danger);
}

.mic-button.recording:hover {
  background: var(--theme--danger-125);
}

.mic-button.processing {
  background: var(--theme--warning);
  cursor: wait;
}

.mic-button:disabled {
  background: var(--theme--foreground-subdued);
  cursor: not-allowed;
  opacity: 0.6;
}

.warning-message,
.error-message {
  margin-top: 8px;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: var(--theme--danger);
  font-size: 14px;
  font-weight: 500;
}

.recording-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Dark mode compatibility */
@media (prefers-color-scheme: dark) {
  .recording-indicator {
    color: var(--theme--danger);
  }
}
</style>