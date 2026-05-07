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
      className={cn("dg:flex-1 dg:min-h-0 dg:overflow-y-auto", className)}
      style={{ scrollbarWidth: "thin" } as React.CSSProperties}
      data-agent-conversation
      aria-live="polite"
      aria-label="Conversation"
    >
      <div className="dg:flex dg:flex-col dg:gap-3 dg:p-5 dg:min-h-full">
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
        "dg:flex dg:flex-col dg:gap-1 dg:max-w-[82%]",
        isUser ? "dg:self-end dg:items-end" : "dg:self-start dg:items-start",
        className,
      )}
    >
      {/* Role label */}
      {showRole && (
        <span className="dg:text-[10px] dg:font-semibold dg:uppercase dg:tracking-widest dg:opacity-50 dg:px-1">
          {isUser ? "You" : "Agent"}
        </span>
      )}

      {/* Avatar + bubble */}
      <div className={cn(
        "dg:flex dg:items-end dg:gap-2",
        isUser ? "dg:flex-row-reverse" : "dg:flex-row",
      )}>
        {/* Gradient avatar — assistant only */}
        {!isUser && (
          <div
            aria-hidden="true"
            className="dg:size-6 dg:rounded-full dg:shrink-0 dg:flex dg:items-center dg:justify-center dg:mb-px dg:bg-gradient-to-br dg:from-primary dg:to-[#149afb]"
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
          "dg:px-4 dg:py-3 dg:text-sm dg:leading-normal dg:break-words dg:border dg:text-foreground",
          isUser
            ? "dg:rounded-2xl dg:rounded-br-sm dg:bg-[var(--msg-user-bg)] dg:border-[var(--msg-user-border)]"
            : "dg:rounded-2xl dg:rounded-bl-sm dg:bg-card dg:border-border dg:shadow-sm",
        )}>
          {children ?? entry.content}
        </div>
      </div>

      {/* Timestamp */}
      {showTimestamp && entry.timestamp && (
        <span className="dg:text-[10px] dg:opacity-40 dg:px-1 dg:tabular-nums">
          {formatTime(entry.timestamp)}
        </span>
      )}
    </div>
  );
}
