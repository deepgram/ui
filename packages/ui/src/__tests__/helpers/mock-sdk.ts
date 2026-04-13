import { jest, mock } from "bun:test";
import EventEmitter from "eventemitter3";

/**
 * Mock AgentSession that uses a real EventEmitter so on/emit work
 * naturally in tests. All send/lifecycle methods are jest.fn() spies.
 */
export class MockAgentSession extends EventEmitter {
  state = "idle" as string;

  connect = jest.fn(async () => {
    this.state = "connected";
    this.emit("connecting");
    this.emit("connected");
  });

  disconnect = jest.fn(() => {
    this.state = "disconnected";
    this.emit("disconnected", "user requested disconnect");
  });

  sendAudio = jest.fn();
  sendFunctionCallResponse = jest.fn();
  injectUserMessage = jest.fn();
  injectAgentMessage = jest.fn();
  updateSpeak = jest.fn();
  updateThink = jest.fn();
  updatePrompt = jest.fn();
}

export class MockAgentMicrophone {
  muted = false;
  start = jest.fn(async () => {});
  stop = jest.fn();
  mute = jest.fn(() => { this.muted = true; });
  unmute = jest.fn(() => { this.muted = false; });
  on = jest.fn();
  off = jest.fn();
}

export class MockAgentPlayer {
  muted = false;
  queue = jest.fn();
  interrupt = jest.fn();
  mute = jest.fn(() => { this.muted = true; });
  unmute = jest.fn(() => { this.muted = false; });
  dispose = jest.fn();
}

// Track instances created so tests can access them
export let lastSession: MockAgentSession;
export let lastMicrophone: MockAgentMicrophone;
export let lastPlayer: MockAgentPlayer;

export function resetMocks() {
  lastSession = undefined!;
  lastMicrophone = undefined!;
  lastPlayer = undefined!;
}

// Install module-level mock
mock.module("@deepgram/agent", () => ({
  AgentSession: class extends MockAgentSession {
    constructor(...args: unknown[]) {
      super();
      lastSession = this as unknown as MockAgentSession;
    }
  },
  AgentMicrophone: class extends MockAgentMicrophone {
    constructor(...args: unknown[]) {
      super();
      lastMicrophone = this as unknown as MockAgentMicrophone;
    }
  },
  AgentPlayer: class extends MockAgentPlayer {
    constructor(...args: unknown[]) {
      super();
      lastPlayer = this as unknown as MockAgentPlayer;
    }
  },
}));
