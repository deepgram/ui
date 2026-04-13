/**
 * Deepgram UI component registry manifest.
 *
 * Each entry maps to one or more source files in packages/ui/src/.
 * The build script reads these files, rewrites import paths to shadcn
 * conventions, and emits static JSON to dist/r/.
 *
 * registryDependencies: other shadcn components the consumer must have
 * dependencies: npm packages to install (shadcn CLI handles this automatically)
 */

export interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:lib";
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  /** Source file paths relative to packages/ui/src/ */
  files: string[];
  /** Additional files needed (e.g. shared shadcn primitives) */
  internalDependencies?: string[];
}

export const registry: RegistryItem[] = [
  // ── Shared primitives (shadcn source copies) ────────────────────────────
  {
    name: "utils",
    type: "registry:lib",
    description: "cn() utility — clsx + tailwind-merge",
    dependencies: ["clsx", "tailwind-merge"],
    files: ["lib/utils.ts"],
  },

  // ── Core shadcn primitives used by Deepgram components ──────────────────
  {
    name: "button",
    type: "registry:ui",
    description: "shadcn Button primitive",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    registryDependencies: ["utils"],
    files: ["components/ui/button.tsx"],
  },
  {
    name: "textarea",
    type: "registry:ui",
    description: "shadcn Textarea primitive",
    registryDependencies: ["utils"],
    files: ["components/ui/textarea.tsx"],
  },
  {
    name: "toggle",
    type: "registry:ui",
    description: "shadcn Toggle primitive",
    dependencies: ["@radix-ui/react-toggle", "class-variance-authority"],
    registryDependencies: ["utils"],
    files: ["components/ui/toggle.tsx"],
  },
  {
    name: "select",
    type: "registry:ui",
    description: "shadcn Select primitive",
    dependencies: ["@radix-ui/react-select", "lucide-react"],
    registryDependencies: ["utils"],
    files: ["components/ui/select.tsx"],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    description: "shadcn ScrollArea primitive",
    dependencies: ["@radix-ui/react-scroll-area"],
    registryDependencies: ["utils"],
    files: ["components/ui/scroll-area.tsx"],
  },

  // ── Deepgram UI components ───────────────────────────────────────────────
  {
    name: "agent-status",
    type: "registry:ui",
    description: "Status indicator that reflects the agent connection state",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils"],
    files: ["components/AgentStatus.tsx"],
  },
  {
    name: "agent-conversation",
    type: "registry:ui",
    description: "Scrollable conversation transcript with auto-scroll",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "scroll-area"],
    files: ["components/AgentConversation.tsx"],
  },
  {
    name: "agent-text-input",
    type: "registry:ui",
    description: "Text input for sending messages to the agent",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "button", "textarea"],
    files: ["components/AgentTextInput.tsx"],
  },
  {
    name: "agent-microphone-button",
    type: "registry:ui",
    description: "Toggle button for muting/unmuting the microphone",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "button", "toggle"],
    files: ["components/AgentMicrophoneButton.tsx"],
  },
  {
    name: "agent-speaker-button",
    type: "registry:ui",
    description: "Toggle button for muting/unmuting agent audio output",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "toggle"],
    files: ["components/AgentSpeakerButton.tsx"],
  },
  {
    name: "agent-start-button",
    type: "registry:ui",
    description: "Start/stop button for the agent session",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "button"],
    files: ["components/AgentStartButton.tsx"],
  },
  {
    name: "voice-button",
    type: "registry:ui",
    description: "All-in-one voice button with 5 lifecycle states",
    dependencies: ["@deepgram/react"],
    registryDependencies: ["utils", "button"],
    files: ["components/VoiceButton.tsx"],
  },
  {
    name: "mic-selector",
    type: "registry:ui",
    description: "Microphone device selector with permission handling",
    registryDependencies: ["utils", "select"],
    files: ["components/MicSelector.tsx"],
  },
  {
    name: "response",
    type: "registry:ui",
    description: "Lightweight markdown renderer for AI responses with Tailwind Typography prose",
    devDependencies: ["@tailwindcss/typography"],
    registryDependencies: ["utils"],
    files: ["components/Response.tsx"],
  },
  {
    name: "bar-visualizer",
    type: "registry:ui",
    description: "Real-time audio frequency bar visualizer (canvas)",
    dependencies: ["@deepgram/react"],
    files: ["components/BarVisualizer.tsx"],
  },
  {
    name: "live-waveform",
    type: "registry:ui",
    description: "Canvas-based real-time waveform driven by a volume getter",
    files: ["components/LiveWaveform.tsx"],
  },
  {
    name: "orb",
    type: "registry:ui",
    description: "Animated canvas orb with idle/listening/talking states, audio-reactive",
    files: ["components/Orb.tsx"],
  },
];

/** All component names for index generation */
export const componentNames = registry.map((r) => r.name);
