import { useState } from "react";
import { useAgentConversation, useAgentState } from "@deepgram/react";
import { Textarea } from "./ui/textarea.js";
import { Button } from "./ui/button.js";
import { cn } from "../lib/utils.js";

export interface AgentTextInputProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onSend?: (text: string) => void;
  submitButton?: React.ReactNode;
}

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export function AgentTextInput({
  className,
  placeholder = "Type a message…",
  disabled = false,
  onSend,
  submitButton,
}: AgentTextInputProps) {
  const [value, setValue] = useState("");
  const { sendUserMessage } = useAgentConversation();
  const { isActive } = useAgentState();

  function handleSend() {
    const text = value.trim();
    if (!text || !isActive || disabled) return;
    sendUserMessage(text);
    onSend?.(text);
    setValue("");
  }

  const isDisabled = disabled || !isActive;

  return (
    <div className={cn("dg:flex dg:items-center dg:gap-2 dg:flex-1", className)} data-agent-text-input>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
        }}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-label="Message input"
        rows={1}
        className="dg:min-h-[42px] dg:max-h-[120px] dg:resize-none dg:py-2.5 dg:text-sm"
      />
      {submitButton !== undefined ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          aria-label="Send"
          className="dg:shrink-0 dg:text-muted-foreground dg:hover:text-primary"
        >
          {submitButton}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          aria-label="Send"
          className="dg:shrink-0 dg:text-muted-foreground dg:hover:text-primary"
        >
          <SendIcon />
        </Button>
      )}
    </div>
  );
}
