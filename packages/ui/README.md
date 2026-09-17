# @deepgram/ui

Pre-built, styled React components for the [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent). Fully customizable via CSS variables. Re-exports all hooks from [`@deepgram/react`](../react/) so you only need one import.

## Status

This package is pre-1.0. Interfaces may change between minor versions.

## Install

```bash
npm install @deepgram/ui react react-dom
```

or with Bun:

```bash
bun add @deepgram/ui react react-dom
```

## Quick Start

```tsx
import {
  AgentProvider,
  AgentStartButton,
  AgentConversation,
  AgentMessage,
  AgentTextInput,
  AgentMicrophoneButton,
  AgentSpeakerButton,
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
        <div>
          <AgentMicrophoneButton />
          <AgentSpeakerButton />
          <AgentStartButton />
        </div>
      </div>
    </AgentProvider>
  );
}
```

## Components

### Agent UI Components

| Component | Description |
|-----------|-------------|
| `AgentStatus` | Connection state indicator (idle, connecting, connected, reconnecting, disconnected) |
| `AgentConversation` | Scrollable conversation container with auto-scroll — render messages via `children` |
| `AgentMessage` | Individual message bubble with role-aware styling, avatar, and timestamp |
| `AgentTextInput` | Text input field for sending messages |
| `AgentMicrophoneButton` | Microphone mute/unmute toggle |
| `AgentSpeakerButton` | Speaker mute/unmute toggle |
| `AgentStartButton` | Start/stop connection button |

### Advanced Components

| Component | Description |
|-----------|-------------|
| `VoiceButton` | All-in-one button reflecting full lifecycle (idle/connecting/listening/speaking/error) |
| `Orb` | Canvas 2D animated hoop with idle/listening/talking states, audio-reactive |
| `LiveWaveform` | Canvas-based real-time waveform driven by volume getter(s) |
| `BarVisualizer` | Frequency bar visualization |
| `MicSelector` | Microphone device selector dropdown |
| `Response` | Lightweight markdown renderer for AI responses with Tailwind Typography |

### AgentConversation + AgentMessage

`AgentConversation` is a scrollable container. Pass messages as `children` using `AgentMessage`:

```tsx
import { AgentConversation, AgentMessage, useAgentConversation } from "@deepgram/ui";

function Conversation() {
  const { conversation } = useAgentConversation();
  return (
    <AgentConversation>
      {conversation.map((entry) => (
        <AgentMessage key={entry.id} entry={entry} showTimestamp />
      ))}
    </AgentConversation>
  );
}
```

AgentMessage props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entry` | `ConversationEntry` | -- | Conversation entry object (required) |
| `children` | `React.ReactNode` | -- | Custom content (overrides `entry.content`) |
| `showRole` | `boolean` | `false` | Show "You" / "Agent" label above bubble |
| `showTimestamp` | `boolean` | `true` | Show timestamp below bubble |
| `className` | `string` | -- | Additional CSS classes |

### VoiceButton

Single button for the entire voice interaction lifecycle. Exposes state via `data-voice-state` attribute.

```tsx
<AgentProvider config={config}>
  <VoiceButton />
</AgentProvider>
```

States: `idle`, `connecting`, `listening`, `speaking`, `error`.

### Orb

Animated hoop visualization with three states and audio reactivity. Uses canvas 2D rendering with idle pulse, listening deflation/rocking, and talking expansion driven by volume.

```tsx
const { getInputVolume } = useAgentMicrophone();
const { getOutputVolume } = useAgentPlayer();
const { mode } = useAgentMode();

<Orb
  state={mode === "speaking" ? "talking" : mode === "listening" ? "listening" : "idle"}
  getInputVolume={getInputVolume}
  getOutputVolume={getOutputVolume}
  size={200}
  colors={["#13EF93", "#149AFB"]}
/>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `"idle" \| "listening" \| "talking"` | `"idle"` | Animation state |
| `colors` | `[string, string]` | Deepgram brand | Gradient colors |
| `size` | `number` | `200` | Size in pixels |
| `getInputVolume` | `() => number` | -- | Input volume getter (0-1), sampled per frame |
| `getOutputVolume` | `() => number` | -- | Output volume getter (0-1), sampled per frame |
| `inputVolume` | `number` | -- | Direct input volume (manual mode) |
| `outputVolume` | `number` | -- | Direct output volume (manual mode) |

### LiveWaveform

Canvas-based waveform that accepts a single getter or an array of getters. When multiple are provided, the maximum value is used per frame.

```tsx
const { getInputVolume } = useAgentMicrophone();
const { getOutputVolume } = useAgentPlayer();

// Single source
<LiveWaveform getVolume={getInputVolume} active={micActive} />

// Multiple sources (max is used)
<LiveWaveform getVolume={[getInputVolume, getOutputVolume]} active={isConnected} />
```

## Styling

All components use `data-dg-*` attribute selectors for styling, not class names. This avoids collisions with host-app CSS frameworks.

### CSS Variables

Import the stylesheet to get styled defaults with `light-dark()` adaptive colors:

```tsx
import "@deepgram/ui/styles.css";
```

Override any token on `[data-dg-agent]`:

```css
[data-dg-agent] {
  --color-primary: #6366f1;
  --color-background: #0d1117;
  --color-foreground: #e6e6e6;
}
```

Theme tokens:

| Token | Description | Default |
|-------|-------------|---------|
| `--color-primary` | Brand/accent color | `#13EF93` |
| `--color-primary-foreground` | Text on primary backgrounds | `#000000` |
| `--color-background` | Panel background | `#ffffff` |
| `--color-foreground` | Primary text | `#111827` |
| `--color-card` / `--color-card-foreground` | Card backgrounds and text | `#f3f4f6` / `#111827` |
| `--color-popover` / `--color-popover-foreground` | Popover backgrounds and text | `#ffffff` / `#111827` |
| `--color-muted` / `--color-muted-foreground` | Muted backgrounds and text | `#f3f4f6` / `#6b7280` |
| `--color-accent` / `--color-accent-foreground` | Accent backgrounds and text | `#f9fafb` / `#111827` |
| `--color-input` | Input background | `#f3f4f6` |
| `--color-border` | Borders | `rgba(0, 0, 0, 0.1)` |
| `--color-ring` | Focus rings | `#13EF93` |
| `--color-secondary` / `--color-secondary-foreground` | Secondary backgrounds and text | `#f3f4f6` / `#111827` |
| `--color-destructive` / `--color-destructive-foreground` | Destructive states | `#dc2626` / `#ffffff` |
| `--radius` | Component corner radius | `1rem` |
| `--font-sans` | Font family | `system-ui, -apple-system, sans-serif` |

### Dark Mode

The default stylesheet uses CSS `light-dark()` which automatically adapts to `prefers-color-scheme`. To force a mode, set `color-scheme` on the container:

```css
[data-dg-agent] { color-scheme: dark; }
```

## Re-exports

This package re-exports everything from `@deepgram/react` for convenience:

```ts
import {
  // Provider
  AgentProvider,
  // All hooks
  useAgentState, useAgentMode, useAgentConversation,
  useAgentMicrophone, useAgentPlayer, useAgentControls,
  useAgentClientTool, useAgentSession, useAgentContext,
  useDeepgramAgent,
} from "@deepgram/ui";
```

## License

MIT
