import { useState } from "react";
import { useAgentState } from "@deepgram/react";
import { Button } from "./ui/button.js";
import { cn } from "../lib/utils.js";

export interface AgentStartButtonProps {
  className?: string;
  startLabel?: React.ReactNode;
  connectingLabel?: React.ReactNode;
  stopLabel?: React.ReactNode;
  reconnectingLabel?: React.ReactNode;
  onClick?: () => void;
}

export function AgentStartButton({
  className,
  startLabel        = "Start",
  connectingLabel   = "Connecting…",
  stopLabel         = "Stop",
  reconnectingLabel = "Reconnecting…",
  onClick,
}: AgentStartButtonProps) {
  const { state, isActive, isConnecting, isReconnecting, start, stop } = useAgentState();
  const [starting, setStarting] = useState(false);

  async function handleClick() {
    if (isActive || isReconnecting) {
      stop();
    } else {
      setStarting(true);
      try { await start(); } finally { setStarting(false); }
    }
    onClick?.();
  }

  const label = (starting || isConnecting)
    ? connectingLabel
    : isReconnecting
    ? reconnectingLabel
    : isActive
    ? stopLabel
    : startLabel;

  // Ghost style when active/reconnecting; primary fill otherwise
  const isGhost = isActive || isReconnecting;

  return (
    <Button
      variant={isGhost ? "outline" : "default"}
      data-agent-start-button
      data-state={state}
      disabled={starting || isConnecting}
      aria-label={typeof label === "string" ? label : "Start agent"}
      onClick={handleClick}
      className={cn(
        "dg:w-full dg:font-semibold",
        !isGhost && "dg:hover:bg-[var(--primary-hover)] dg:active:bg-[var(--primary-active)]",
        className
      )}
    >
      {label}
    </Button>
  );
}
