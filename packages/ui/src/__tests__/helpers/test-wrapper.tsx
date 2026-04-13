import React from "react";
import type { AgentProviderProps } from "@deepgram/react";

// Import mock-sdk first to install mocks before provider loads
import "./mock-sdk.js";

// Import provider AFTER mocks are installed
const { AgentProvider } = await import("@deepgram/react");

const DEFAULT_CONFIG = {
  auth: { apiKey: "test-key" },
  agent: { think: { type: "open_ai" as const, model: "gpt-4o-mini" } },
};

export function TestProvider({
  children,
  config = DEFAULT_CONFIG,
  ...props
}: Partial<AgentProviderProps> & { children: React.ReactNode }) {
  return (
    <AgentProvider config={config as AgentProviderProps["config"]} {...props}>
      {children}
    </AgentProvider>
  );
}

export function createWrapper(props?: Partial<AgentProviderProps>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <TestProvider {...props}>{children}</TestProvider>;
  };
}

export { DEFAULT_CONFIG };
