# @deepgram/ui

[![npm](https://img.shields.io/npm/v/@deepgram/ui)](https://www.npmjs.com/package/@deepgram/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/deepgram/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/deepgram/ui/actions/workflows/ci.yml)

React UI component library for [Deepgram Voice Agent](https://developers.deepgram.com/docs/voice-agent) — Tailwind v4, shadcn/ui, fully themeable.

## Install

### Via shadcn registry (recommended)

Pick the components you need:

```bash
npx shadcn add https://cdn.deepgram.com/ui/r/orb.json
npx shadcn add https://cdn.deepgram.com/ui/r/agent-conversation.json
npx shadcn add https://cdn.deepgram.com/ui/r/voice-button.json
```

### Via npm

Install the full library:

```bash
npm install @deepgram/ui @deepgram/react @deepgram/agents
```

## Quick Start

```tsx
import {
  AgentProvider,
  AgentStartButton,
  AgentConversation,
  AgentMessage,
  AgentTextInput,
  AgentStatus,
} from "@deepgram/ui";
import "@deepgram/ui/styles.css";

function App() {
  return (
    <AgentProvider
      config={{
        auth: { tokenFactory: () => fetch('/api/deepgram-token').then(r => r.text()) },
        agent: { think: { provider: { type: 'open_ai' }, model: 'gpt-4o-mini' } },
      }}
    >
      <div data-dg-agent>
        <AgentStatus />
        <AgentConversation>
          {conversation.map((entry) => (
            <AgentMessage key={entry.id} entry={entry} />
          ))}
        </AgentConversation>
        <AgentTextInput />
        <AgentStartButton />
      </div>
    </AgentProvider>
  );
}
```

## Components

### Agent UI Components

| Component | Description |
|-----------|-------------|
| [`AgentStatus`](packages/ui/) | Connection state indicator (idle, connecting, connected, reconnecting, disconnected) |
| [`AgentConversation`](packages/ui/) | Scrollable conversation container with auto-scroll |
| [`AgentMessage`](packages/ui/) | Individual message bubble with role-aware styling, avatar, and timestamp |
| [`AgentTextInput`](packages/ui/) | Text input field for sending messages |
| [`AgentMicrophoneButton`](packages/ui/) | Microphone mute/unmute toggle |
| [`AgentSpeakerButton`](packages/ui/) | Speaker mute/unmute toggle |
| [`AgentStartButton`](packages/ui/) | Start/stop connection button |

### Advanced Components

| Component | Description |
|-----------|-------------|
| [`VoiceButton`](packages/ui/) | All-in-one button reflecting full lifecycle (idle/connecting/listening/speaking/error) |
| [`Orb`](packages/ui/) | Canvas 2D animated hoop with idle/listening/talking states, audio-reactive |
| [`LiveWaveform`](packages/ui/) | Canvas-based real-time waveform driven by volume getter(s) |
| [`BarVisualizer`](packages/ui/) | Frequency bar visualization |
| [`Response`](packages/ui/) | Lightweight markdown renderer for AI responses with Tailwind Typography |

## Distribution Models

### shadcn Registry

Individual components are published to `cdn.deepgram.com/ui/r/` as shadcn-compatible JSON. This lets you add only the components you need directly into your project source, with full control over styling and behavior. Components are copied into your codebase — no runtime dependency on `@deepgram/ui`.

```bash
npx shadcn add https://cdn.deepgram.com/ui/r/orb.json
```

### npm Package

The full library is published to npm as `@deepgram/ui`. Import components and the compiled Tailwind CSS stylesheet. Theming is done via CSS custom properties on `[data-dg-agent]`. This is the right choice when you want the complete component set with automatic updates.

```bash
npm install @deepgram/ui @deepgram/react @deepgram/agents
```

## Packages

| Directory | Package | Description |
|-----------|---------|-------------|
| [`packages/ui/`](packages/ui/) | `@deepgram/ui` | React UI components + compiled Tailwind CSS |
| [`packages/registry/`](packages/registry/) | `@deepgram/ui-registry` | shadcn-compatible registry build (private) |
| [`apps/web/`](apps/web/) | -- | Landing page ([ui.deepgram.com](https://ui.deepgram.com)) |

## Links

- [Documentation](https://developers.deepgram.com/docs/voice-agent)
- [API Reference](https://developers.deepgram.com/reference)
- [Landing Page](https://ui.deepgram.com)
- [Component Registry](https://cdn.deepgram.com/ui/r/index.json)

## Development

**Prerequisites:** [Bun](https://bun.sh/) 1.3+

This repo uses `file:` pointers to sibling checkouts of `deepgram/agent` and `deepgram/react`. Clone all three as siblings:

```
~/Projects/deepgram/
  ui/              ← this repo
  agent/           ← deepgram/agent
  react/           ← deepgram/react
```

```bash
git clone git@github.com:deepgram/ui.git
cd ui
bun install
```

```bash
bun run build              # Build @deepgram/ui
bun run build:registry     # Build shadcn registry
bun run build:web          # Build landing page
bun run typecheck           # Type-check @deepgram/ui
bun run dev                 # Watch-build @deepgram/ui
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE)
