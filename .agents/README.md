# UI Workspace Notes

## Scope

This repo owns:
- `@deepgram/ui` in `packages/ui/`
- `@deepgram/ui-registry` in `packages/registry/` (private)
- landing page in `apps/web/`
- local examples in `examples/`

Sibling dependencies:
- `../agent` → `@deepgram/agents`
- `../react` → `@deepgram/react`

## Commands

```bash
bun run build
bun run typecheck
bun run test
bun run build:registry
bun run build:web
```

## Architecture Notes

- `@deepgram/ui` is distributed two ways: npm and shadcn registry.
- The registry JSON is built from `packages/ui/src/`.
- Widget structural classes (`.dg-panel`, `.dg-overlay`, `.dg-fab`) live in `packages/ui/src/styles.css` so consumers can build widget-like layouts from the same CSS.

## File Layout

```text
packages/
  ui/        # @deepgram/ui
  registry/  # @deepgram/ui-registry
apps/
  web/       # ui.deepgram.com landing page
examples/    # local usage examples
```
