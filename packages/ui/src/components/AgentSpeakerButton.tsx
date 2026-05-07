import { useAgentPlayer } from "@deepgram/react";
import { Toggle } from "./ui/toggle.js";
import { cn } from "../lib/utils.js";

export interface AgentSpeakerButtonProps {
  className?: string;
  activeLabel?: React.ReactNode;
  mutedLabel?: React.ReactNode;
  onClick?: () => void;
}

const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);
const SpeakerOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <line x1="22" x2="16" y1="9" y2="15" />
    <line x1="16" x2="22" y1="9" y2="15" />
  </svg>
);

export function AgentSpeakerButton({
  className,
  activeLabel = <SpeakerIcon />,
  mutedLabel  = <SpeakerOffIcon />,
  onClick,
}: AgentSpeakerButtonProps) {
  const { outputMuted, toggle, enabled } = useAgentPlayer();

  if (!enabled) return null;

  const label = outputMuted ? mutedLabel : activeLabel;

  return (
    <Toggle
      pressed={!outputMuted}
      onPressedChange={() => { toggle(); onClick?.(); }}
      aria-label={typeof label === "string" ? label : "Speaker"}
      data-agent-speaker-button
      data-state={outputMuted ? "muted" : "active"}
      className={cn(
        "dg:h-10 dg:w-10 dg:shrink-0 dg:rounded-[calc(var(--radius)-6px)] dg:border dg:border-border dg:bg-card dg:text-foreground",
        "dg:hover:bg-accent dg:hover:text-accent-foreground",
        "dg:data-[state=on]:bg-primary dg:data-[state=on]:text-primary-foreground dg:data-[state=on]:border-primary",
        "dg:data-[state=on]:hover:bg-[var(--primary-hover)]",
        "dg:data-[state=off]:text-muted-foreground",
        className
      )}
    >
      {label}
    </Toggle>
  );
}
