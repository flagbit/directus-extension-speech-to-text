# directus-extension-speech-to-text

A Directus interface extension that adds a microphone button to string/text fields, recording audio and transcribing it via the OpenAI Whisper API. Published as an npm package and usable in any Directus 10.10.0+ installation.

## Tech Stack

- TypeScript 5.5, Vue 3 (Composition API, `<script setup>`)
- `@directus/extensions-sdk` 12.0.0 (build tooling)
- Node.js ES Modules (`"type": "module"`)
- External API: OpenAI Whisper (`whisper-1`) via `https://api.openai.com/v1/audio/transcriptions`
- Local test environment: Docker Compose with SQLite-backed Directus

## Repository Structure

```
src/
  index.ts              # Extension registration (defineInterface)
  speech-to-text.vue    # Vue component — recording, WAV conversion, Whisper call
dist/                   # Build output (git-ignored); entry point for Directus
index.js                # Pre-built artifact committed for docker-compose dev workflow
docker-compose.yml      # Local Directus instance on :8057 with extension hot-mounted
```

## Local Development

Prerequisites: Node.js, npm, Docker (for the test instance).

```bash
npm install

# Watch mode — rebuilds to dist/ on change
npm run dev

# Production build
npm run build

# Link into a local Directus project (npm link)
npm run link
```

**Docker Compose test instance** (mounts `index.js` directly, no rebuild needed after `npm run build`):

```bash
docker compose up
# Directus available at http://localhost:8057
# Admin: admin@example.com / directus123
```

The compose file mounts `./index.js` (the committed pre-built artifact) into `/directus/extensions/directus-extension-speech-to-text/`. After a `npm run build`, copy/replace `dist/index.js` → `index.js` in the repo root for the docker workflow to pick it up.

## Build / Test / Lint

```bash
npm run build   # directus-extension build → dist/index.js
npm run dev     # watch mode, no minify
```

No test suite is present. TypeScript strict mode (`strict`, `noUnusedLocals`, `noUnusedParameters`) acts as static validation — TypeScript errors fail the build.

## Conventions

- Extension type: `interface`, compatible with Directus field types `string` and `text`
- Interface options (configured per-field in Directus UI): `openai_api_key`, `language`, `placeholder`, `append_mode`, `line_separator`
- Audio pipeline: MediaRecorder (WebM/Opus) → AudioContext decode → custom WAV encoder → Whisper API
- OpenAI API key is stored per-field in Directus field options (not an env var); the component accesses it as a prop

## Gotchas / Notes

- Microphone access requires **HTTPS** in production browsers; `localhost` is exempt.
- The OpenAI API key is passed as a Vue prop from field options — it is visible to the browser. Do not use keys with broad OpenAI permissions in multi-tenant Directus instances.
- The `index.js` in the repo root is a committed build artifact used by `docker-compose.yml`. Keep it in sync with `dist/index.js` when testing locally via Docker.
- Audio size limit: 25 MB per recording (OpenAI Whisper constraint); enforced client-side before upload.
- `npm run link` uses `directus-extension link` which symlinks the extension into the nearest parent Directus installation's `extensions/` directory.
