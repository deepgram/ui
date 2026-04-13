import { useAgentState, useAgentMode } from "@deepgram/react";
import { Button } from "./ui/button.js";
import { cn } from "../lib/utils.js";

export type VoiceButtonState = "idle" | "connecting" | "listening" | "speaking" | "error";

export interface VoiceButtonProps {
  className?: string;
  /** Label for each state. Keys: idle, connecting, listening, speaking, error */
  labels?: Partial<Record<VoiceButtonState, unknown>>;
  onClick?: () => void;
}

const DEFAULT_LABELS: Record<VoiceButtonState, string> = {
  idle:       "Start conversation",
  connecting: "Connecting…",
  listening:  "Listening…",
  speaking:   "Agent speaking",
  error:      "Error",
};

/**
 * All-in-one voice interaction button that reflects the full agent lifecycle.
 * Click to start, click again to stop. Shows speaking/listening state.
 *
 * Five visual states exposed via `data-voice-state`:
 * - `idle`       — not connected, ready to start
 * - `connecting` — establishing connection (pulsing)
 * - `listening`  — mic open, accent border glow
 * - `speaking`   — agent producing audio, primary fill, pulsing
 * - `error`      — connection failed, destructive color
 *
 * @example
 * ```tsx
 * <AgentProvider config={config}>
 *   <VoiceButton />
 * </AgentProvider>
 * ```
 */
export function VoiceButton({ className, labels, onClick }: VoiceButtonProps) {
  const { state, isActive, isConnecting, start, stop } = useAgentState();
  const { isSpeaking, isListening } = useAgentMode();

  const voiceState: VoiceButtonState =
    isConnecting ? "connecting"
    : isSpeaking  ? "speaking"
    : isListening ? "listening"
    : "idle";

  const allLabels = { ...DEFAULT_LABELS, ...labels };
  const label = allLabels[voiceState];

  async function handleClick() {
    if (isActive) { stop(); } else { await start(); }
    onClick?.();
  }

  return (
    <Button
      data-agent-voice-button
      data-voice-state={voiceState}
      disabled={isConnecting}
      aria-label={typeof label === "string" ? label : "Voice agent"}
      onClick={handleClick}
      className={cn(
        // Base layout — override Button default sizing
        "inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-semibold h-auto",
        // Idle / base
        "border border-border bg-card text-foreground",
        "hover:bg-accent hover:border-primary",
        "active:bg-[var(--accent-active)]",
        "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        // Connecting — subtle pulse
        voiceState === "connecting" && "animate-dg-pulse-fast",
        // Listening — accent border glow (box-shadow rule lives in @layer components)
        voiceState === "listening" && "border-primary",
        // Speaking — primary fill, pulse
        voiceState === "speaking" && [
          "bg-primary text-primary-foreground border-primary",
          "hover:bg-[var(--primary-hover)]",
          "animate-dg-pulse-slow",
          "[&_svg]:stroke-primary-foreground",
        ],
        // Error (reserved for future use — exposed via data-voice-state for consumer styling)
        (voiceState as string) === "error" && "border-destructive text-destructive hover:border-destructive",
        // Connecting disabled cursor
        isConnecting && "cursor-wait",
        className
      )}
    >
      <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        {isActive ? (
          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
        ) : (
          <>
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </>
        )}
      </svg>
      <span>{label as React.ReactNode}</span>
    </Button>
  );
}
