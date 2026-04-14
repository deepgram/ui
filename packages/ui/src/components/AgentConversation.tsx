import { useEffect, useRef } from "react";
import { useAgentConversation, type ConversationEntry } from "@deepgram/react";
import { cn } from "../lib/utils.js";

// ── AgentConversation ─────────────────────────────────────────────────────────

export interface AgentConversationProps {
  children?: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

export function AgentConversation({
  children,
  className,
  autoScroll = true,
}: AgentConversationProps) {
  const { conversation } = useAgentConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && conversation.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [conversation, autoScroll]);

  return (
    <div
      className={cn("flex-1 min-h-0 overflow-y-auto", className)}
      style={{ scrollbarWidth: "thin" } as React.CSSProperties}
      data-agent-conversation
      aria-live="polite"
      aria-label="Conversation"
    >
      <div className="flex flex-col gap-3 p-5 min-h-full">
        {children}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}

// ── AgentMessage ──────────────────────────────────────────────────────────────

export interface AgentMessageProps {
  entry: ConversationEntry;
  children?: React.ReactNode;
  className?: string;
  showRole?: boolean;
  showTimestamp?: boolean;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AgentMessage({
  entry,
  children,
  className,
  showRole = false,
  showTimestamp = true,
}: AgentMessageProps) {
  const isUser = entry.role === "user";

  return (
    <div
      data-role={entry.role}
      className={cn(
        "flex flex-col gap-1 max-w-[82%]",
        isUser ? "self-end items-end" : "self-start items-start",
        className,
      )}
    >
      {/* Role label */}
      {showRole && (
        <span className="text-[10px] font-semibold uppercase tracking-widest opacity-50 px-1">
          {isUser ? "You" : "Agent"}
        </span>
      )}

      {/* Avatar + bubble */}
      <div className={cn(
        "flex items-end gap-2",
        isUser ? "flex-row-reverse" : "flex-row",
      )}>
        {/* Gradient avatar — assistant only */}
        {!isUser && (
          <div
            aria-hidden="true"
            className="size-6 rounded-full shrink-0 flex items-center justify-center mb-px bg-gradient-to-br from-primary to-[#149afb]"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" fill="white"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <line x1="12" x2="12" y1="19" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          "px-4 py-3 text-sm leading-normal break-words border text-foreground",
          isUser
            ? "rounded-2xl rounded-br-sm bg-[var(--msg-user-bg)] border-[var(--msg-user-border)]"
            : "rounded-2xl rounded-bl-sm bg-card border-border shadow-sm",
        )}>
          {children ?? entry.content}
        </div>
      </div>

      {/* Timestamp */}
      {showTimestamp && entry.timestamp && (
        <span className="text-[10px] opacity-40 px-1 tabular-nums">
          {formatTime(entry.timestamp)}
        </span>
      )}
    </div>
  );
}
