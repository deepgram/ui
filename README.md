# @deepgram/ui

[![npm](https://img.shields.io/npm/v/@deepgram/ui)](https://www.npmjs.com/package/@deepgram/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/deepgram/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/deepgram/ui/actions/workflows/ci.yml)

React UI component library for [Deepgram Voice Agent](https://developers.deepgram.com/docs/voice-agent) — Tailwind v4, shadcn/ui, fully themeable.

## Status

This library is experimental and pre-1.0. Interfaces may change between minor versions, and releases are cut as the library evolves rather than on a fixed schedule. For a production integration with the [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent), the documented and supported path is the official JavaScript SDK, [`@deepgram/sdk`](https://github.com/deepgram/deepgram-js-sdk). This package and its siblings — [`@deepgram/agents`](https://github.com/deepgram/agent), [`@deepgram/react`](https://github.com/deepgram/react), and [`@deepgram/agents-widget`](https://github.com/deepgram/agent) — build on that API to provide embeddable browser components and are ready to evaluate and prototype with today.

## Install

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
  useAgentConversation,
} from "@deepgram/ui";
import "@deepgram/ui/styles.css";

function Conversation() {
  const { conversation } = useAgentConversation();
  return (
    <AgentConversation>
      {conversation.map((entry) => (
        <AgentMessage key={entry.id} entry={entry} />
      ))}
    </AgentConversation>
  );
}

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
        <Conversation />
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

## Development

**Prerequisites:** [Bun](https://bun.sh/) 1.3+

```bash
git clone git@github.com:deepgram/ui.git
cd ui
bun install
```

`@deepgram/agents` and `@deepgram/react` install from npm. No sibling checkouts required.

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
