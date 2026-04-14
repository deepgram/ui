# Contributing

Thanks for your interest in contributing to @deepgram/ui!

## Prerequisites

- [Bun](https://bun.sh/) 1.3+

## Setup

This repo uses `file:` pointers to sibling checkouts of `deepgram/agent` and `deepgram/react`. Clone all three repos as siblings:

```bash
git clone git@github.com:deepgram/agent.git
git clone git@github.com:deepgram/react.git
git clone git@github.com:deepgram/ui.git
cd ui
bun install
```

## Development

```bash
bun run dev                # Watch-build @deepgram/ui
bun run build              # Build @deepgram/ui
bun run build:registry     # Build shadcn registry
bun run build:web          # Build landing page
bun run typecheck           # Type-check
bun run test                # Run tests
```

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Ensure the build is clean: `bun run build`
4. Ensure types pass: `bun run typecheck`
5. Commit using [conventional commits](https://www.conventionalcommits.org/) format
6. Open a pull request

## Commit Messages

This project uses conventional commits:

```
feat(ui): add new BarVisualizer component
fix(conversation): resolve auto-scroll edge case
docs: update component API reference
```

## Questions?

Open an issue or reach out in the [Deepgram Discord](https://discord.gg/deepgram).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
