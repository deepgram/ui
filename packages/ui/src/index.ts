// Styles are auto-included when you import components.
// For standalone CSS import: import "@deepgram/ui/styles.css";
import "./styles.css";

export { AgentStatus }           from "./components/AgentStatus.js";
export { AgentConversation }     from "./components/AgentConversation.js";
export { AgentTextInput }        from "./components/AgentTextInput.js";
export { AgentMicrophoneButton } from "./components/AgentMicrophoneButton.js";
export { AgentSpeakerButton }    from "./components/AgentSpeakerButton.js";
export { AgentStartButton }      from "./components/AgentStartButton.js";
export type { AgentStatusProps }           from "./components/AgentStatus.js";
export type { AgentConversationProps }     from "./components/AgentConversation.js";
export type { AgentTextInputProps }        from "./components/AgentTextInput.js";
export type { AgentMicrophoneButtonProps } from "./components/AgentMicrophoneButton.js";
export type { AgentSpeakerButtonProps }    from "./components/AgentSpeakerButton.js";
export type { AgentStartButtonProps }      from "./components/AgentStartButton.js";

// Advanced components
export { VoiceButton }    from "./components/VoiceButton.js";
export { BarVisualizer }  from "./components/BarVisualizer.js";
export { LiveWaveform }   from "./components/LiveWaveform.js";
export { MicSelector }    from "./components/MicSelector.js";
export { Response }       from "./components/Response.js";
export { Orb }            from "./components/Orb.js";
export type { VoiceButtonProps, VoiceButtonState } from "./components/VoiceButton.js";
export type { BarVisualizerProps } from "./components/BarVisualizer.js";
export type { LiveWaveformProps }  from "./components/LiveWaveform.js";
export type { MicSelectorProps, AudioDevice } from "./components/MicSelector.js";
export type { ResponseProps } from "./components/Response.js";
export type { OrbProps, OrbState } from "./components/Orb.js";

// Re-export hooks and provider for convenience — consumers can use just this package
export {
  AgentProvider,
  useAgentContext,
  useAgentState,
  useAgentConversation,
  useAgentMicrophone,
  useAgentPlayer,
  useAgentSession,
  useAgentMode,
  useAgentControls,
  useAgentClientTool,
  useDeepgramAgent,
} from "@deepgram/react";

export type {
  AgentProviderProps,
  AgentContextValue,
  AgentMode,
  ConversationEntry,
  UseAgentStateResult,
  UseAgentConversationResult,
  UseAgentMicrophoneResult,
  UseAgentPlayerResult,
  UseAgentModeResult,
  UseAgentControlsResult,
} from "@deepgram/react";
