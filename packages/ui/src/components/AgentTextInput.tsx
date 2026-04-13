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
  submitButton?: unknown;
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
    <div className={cn("flex items-center gap-2 flex-1", className)} data-agent-text-input>
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
        className="min-h-[42px] max-h-[120px] resize-none py-2.5 text-sm"
      />
      {submitButton !== undefined ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          aria-label="Send"
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          {submitButton as React.ReactNode}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          aria-label="Send"
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <SendIcon />
        </Button>
      )}
    </div>
  );
}
