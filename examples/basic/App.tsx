import {
  AgentProvider,
  AgentConversation,
  AgentMessage,
  AgentStartButton,
  AgentTextInput,
  AgentMicrophoneButton,
  AgentSpeakerButton,
  AgentStatus,
  useAgentConversation,
} from "@deepgram/ui";
import "@deepgram/ui/styles.css";

function Conversation() {
  const { conversation } = useAgentConversation();

  return (
    <AgentConversation>
      {conversation.map((entry) => (
        <AgentMessage key={entry.id} entry={entry} />
      ))}
    </AgentConversation>
  );
}

export default function App() {
  return (
    <AgentProvider
      config={{
        auth: {
          tokenFactory: () =>
            fetch("/api/deepgram-token").then((r) => r.text()),
        },
        agent: {
          think: { provider: { type: "open_ai" }, model: "gpt-4o-mini" },
        },
      }}
    >
      <div
        data-dg-agent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <AgentStatus />
        <Conversation />
        <AgentTextInput />
        <div style={{ display: "flex", gap: 8, padding: 16 }}>
          <AgentMicrophoneButton />
          <AgentSpeakerButton />
          <AgentStartButton />
        </div>
      </div>
    </AgentProvider>
  );
}
