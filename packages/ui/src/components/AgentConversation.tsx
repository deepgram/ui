import { useEffect, useRef } from "react";
import { useAgentConversation, type ConversationEntry } from "@deepgram/react";
import { ScrollArea } from "./ui/scroll-area.js";
import { cn } from "../lib/utils.js";

export interface AgentConversationProps {
  className?: string;
  itemClassName?: string;
  renderMessage?: (entry: ConversationEntry) => unknown;
  emptyState?: unknown;
  autoScroll?: boolean;
}

export function AgentConversation({
  className,
  itemClassName,
  renderMessage,
  emptyState,
  autoScroll = true,
}: AgentConversationProps) {
  const { conversation } = useAgentConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && conversation.length > 0) {
      // scrollIntoView with block: "nearest" scrolls the Radix viewport
      // without affecting the page scroll position.
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [conversation, autoScroll]);

  return (
    <ScrollArea
      className={cn("flex-1", className)}
      data-agent-conversation
      aria-live="polite"
      aria-label="Conversation"
    >
      <div className="flex flex-col gap-2.5 p-4">
        {conversation.length === 0
          ? (emptyState as React.ReactNode ?? null)
          : conversation.map((entry) => (
              <div
                key={entry.id}
                data-role={entry.role}
                className={cn(
                  "max-w-[85%] rounded-[calc(var(--radius)-4px)] px-3.5 py-2.5 text-sm leading-relaxed break-words",
                  entry.role === "user"
                    ? "self-end bg-[var(--msg-user-bg)] border border-[var(--msg-user-border)] text-foreground"
                    : "self-start bg-card border border-border text-foreground",
                  itemClassName
                )}
              >
                {renderMessage ? renderMessage(entry) as React.ReactNode : entry.content}
              </div>
            ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
