import React from "react";
import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, act } from "@testing-library/react";

import { resetMocks, lastSession } from "./helpers/mock-sdk.js";
import { TestProvider } from "./helpers/test-wrapper.js";

const { AgentStatus } = await import("../components/AgentStatus.js");
const { AgentConversation } = await import("../components/AgentConversation.js");
const { AgentTextInput } = await import("../components/AgentTextInput.js");
const { AgentStartButton } = await import("../components/AgentStartButton.js");
const { AgentMicrophoneButton } = await import("../components/AgentMicrophoneButton.js");
const { AgentSpeakerButton } = await import("../components/AgentSpeakerButton.js");

function renderInProvider(ui: React.ReactElement, props = {}) {
  return render(<TestProvider {...props}>{ui}</TestProvider>);
}

describe("AgentStatus", () => {
  beforeEach(resetMocks);

  it("renders default label for idle state", () => {
    renderInProvider(<AgentStatus />);
    expect(screen.getByText("Not started")).toBeDefined();
  });

  it("has data-state attribute", () => {
    const { container } = renderInProvider(<AgentStatus />);
    const el = container.querySelector("[data-agent-status]");
    expect(el?.getAttribute("data-state")).toBe("idle");
  });

  it("uses custom labels", () => {
    renderInProvider(<AgentStatus labels={{ idle: "Ready" }} />);
    expect(screen.getByText("Ready")).toBeDefined();
  });
});

describe("AgentConversation", () => {
  beforeEach(resetMocks);

  it("renders empty state when no messages", () => {
    renderInProvider(
      <AgentConversation emptyState={<span>No messages</span>} />,
    );
    expect(screen.getByText("No messages")).toBeDefined();
  });

  it("renders messages with data-role after event", () => {
    const { container } = renderInProvider(<AgentConversation />);

    act(() => {
      lastSession.emit("conversation-text", {
        type: "ConversationText",
        role: "assistant",
        content: "Hello!",
      });
    });

    const msg = container.querySelector("[data-role='assistant']");
    expect(msg).toBeDefined();
    expect(msg?.textContent).toBe("Hello!");
  });
});

describe("AgentTextInput", () => {
  beforeEach(resetMocks);

  it("is disabled when not active", () => {
    renderInProvider(<AgentTextInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });

  it("has the correct placeholder", () => {
    renderInProvider(<AgentTextInput placeholder="Say something..." />);
    expect(screen.getByPlaceholderText("Say something...")).toBeDefined();
  });
});

describe("AgentStartButton", () => {
  beforeEach(resetMocks);

  it("shows Start label in idle state", () => {
    renderInProvider(<AgentStartButton />);
    expect(screen.getByText("Start")).toBeDefined();
  });

  it("has data-agent-start-button attribute", () => {
    const { container } = renderInProvider(<AgentStartButton />);
    const btn = container.querySelector("[data-agent-start-button]");
    expect(btn).toBeDefined();
  });
});

describe("AgentMicrophoneButton", () => {
  beforeEach(resetMocks);

  it("renders when microphone is enabled", () => {
    const { container } = renderInProvider(<AgentMicrophoneButton />);
    expect(container.querySelector("[data-agent-mic-button]")).toBeDefined();
  });

  it("returns null when microphone={false}", () => {
    const { container } = renderInProvider(
      <AgentMicrophoneButton />,
      { microphone: false },
    );
    expect(container.querySelector("[data-agent-mic-button]")).toBeNull();
  });
});

describe("AgentSpeakerButton", () => {
  beforeEach(resetMocks);

  it("renders when tts is enabled", () => {
    const { container } = renderInProvider(<AgentSpeakerButton />);
    expect(container.querySelector("[data-agent-speaker-button]")).toBeDefined();
  });

  it("returns null when tts={false}", () => {
    const { container } = renderInProvider(
      <AgentSpeakerButton />,
      { tts: false },
    );
    expect(container.querySelector("[data-agent-speaker-button]")).toBeNull();
  });
});
