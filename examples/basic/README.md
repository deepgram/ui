# Basic Example

Minimal example using `AgentConversation`, `AgentMessage`, and `AgentStartButton` from `@deepgram/ui`.

## Setup

1. Ensure you have sibling checkouts of `deepgram/agent`, `deepgram/react`, and `deepgram/ui`
2. Install dependencies from the repo root: `bun install`
3. Build the library: `bun run build`

## Run

This example is a standalone React component. To use it in your own app, copy `App.tsx` into a Vite or Next.js project with `@deepgram/ui` installed.

You will need a backend endpoint at `/api/deepgram-token` that returns a short-lived Deepgram API token.
