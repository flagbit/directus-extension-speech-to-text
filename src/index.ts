import { defineInterface } from '@directus/extensions-sdk';
import SpeechToTextInterface from './speech-to-text.vue';

export default defineInterface({
	id: 'speech-to-text',
	name: 'Speech to Text',
	description: 'Text input with speech-to-text functionality using OpenAI Whisper',
	icon: 'mic',
	component: SpeechToTextInterface,
	types: ['string', 'text'],
	group: 'standard',
	options: [
		{
			field: 'placeholder',
			name: 'Placeholder',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: 'Enter placeholder text...',
				},
			},
			schema: {
				default_value: 'Text eingeben oder Mikrofon verwenden...',
			},
		},
		{
			field: 'openai_api_key',
			name: 'OpenAI API Key',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					masked: true,
				},
			},
		},
		{
			field: 'language',
			name: 'Language',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Auto-detect', value: 'auto' },
						{ text: 'German', value: 'de' },
						{ text: 'English', value: 'en' },
						{ text: 'Spanish', value: 'es' },
						{ text: 'French', value: 'fr' },
						{ text: 'Italian', value: 'it' },
						{ text: 'Portuguese', value: 'pt' },
						{ text: 'Russian', value: 'ru' },
						{ text: 'Japanese', value: 'ja' },
						{ text: 'Chinese', value: 'zh' },
					],
				},
			},
			schema: {
				default_value: 'auto',
			},
		},
		{
			field: 'append_mode',
			name: 'Append Mode',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: 'Append to existing text (instead of replacing)',
				},
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'line_separator',
			name: 'Text Separator',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Auto (Space for input, Newline for textarea)', value: 'auto' },
						{ text: 'Space', value: 'space' },
						{ text: 'New Line', value: 'newline' },
						{ text: 'No Separator', value: 'none' },
					],
				},
			},
			schema: {
				default_value: 'auto',
			},
		},
	],
	preview: '<svg width="156" height="96" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="15" width="120" height="66" rx="6" fill="var(--theme--background)" class="glow" /><rect x="19" y="16" width="118" height="64" rx="5" stroke="var(--theme--primary)" stroke-width="2" /><circle cx="40" cy="48" r="12" fill="var(--theme--primary)" fill-opacity=".25" /><circle cx="40" cy="48" r="8" fill="var(--theme--primary)" /><rect x="60" y="40" width="60" height="6" rx="2" fill="var(--theme--primary)" fill-opacity=".25" /><rect x="60" y="50" width="40" height="6" rx="2" fill="var(--theme--primary)" fill-opacity=".25" /></svg>',
});