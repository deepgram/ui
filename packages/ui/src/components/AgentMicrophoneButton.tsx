import { useAgentMicrophone } from "@deepgram/react";
import { Toggle } from "./ui/toggle.js";
import { Button } from "./ui/button.js";
import { cn } from "../lib/utils.js";

export interface AgentMicrophoneButtonProps {
  className?: string;
  activeLabel?: unknown;
  mutedLabel?: unknown;
  disabledLabel?: unknown;
  onClick?: () => void;
}

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);
const MicOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="2" x2="22" y1="2" y2="22" />
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <path d="M5 10v2a7 7 0 0 0 12 5" />
    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const toggleClasses = cn(
  "h-10 w-10 shrink-0 rounded-[calc(var(--radius)-6px)] border border-border bg-card text-foreground",
  "hover:bg-accent hover:text-accent-foreground",
  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
  "data-[state=on]:hover:bg-[var(--primary-hover)]",
  "data-[state=off]:text-muted-foreground",
);

export function AgentMicrophoneButton({
  className,
  activeLabel  = <MicIcon />,
  mutedLabel   = <MicOffIcon />,
  disabledLabel,
  onClick,
}: AgentMicrophoneButtonProps) {
  const { micMuted, micActive, toggle, enabled } = useAgentMicrophone();

  if (!enabled) {
    return disabledLabel ? (
      <Button
        variant="outline"
        size="icon"
        disabled
        className={cn(toggleClasses, className)}
        data-agent-mic-button
        data-state="disabled"
        aria-label="Microphone unavailable"
      >
        {disabledLabel as React.ReactNode}
      </Button>
    ) : null;
  }

  const label = micMuted ? mutedLabel : activeLabel;
  const state = !micActive ? "inactive" : micMuted ? "muted" : "active";

  return (
    <Toggle
      pressed={!micMuted}
      onPressedChange={() => { toggle(); onClick?.(); }}
      aria-label={typeof label === "string" ? label : "Microphone"}
      data-agent-mic-button
      data-state={state}
      className={cn(toggleClasses, className)}
    >
      {label as React.ReactNode}
    </Toggle>
  );
}
