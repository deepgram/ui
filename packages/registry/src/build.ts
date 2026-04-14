/**
 * Deepgram UI registry build script.
 *
 * Reads component source files from packages/ui/src/, rewrites import paths
 * to shadcn conventions, and emits static JSON registry files to dist/r/.
 *
 * Output structure:
 *   dist/r/index.json        — registry index (all items, no file content)
 *   dist/r/<name>.json       — individual registry items with full file content
 *
 * Note: llms.txt lives at ui.deepgram.com, not on the CDN. See apps/web/public/.
 *
 * Usage:
 *   bun run src/build.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registry, type RegistryItem } from "./registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../..");
const UI_SRC = resolve(ROOT, "packages/ui/src");
const OUT_DIR = resolve(__dirname, "../dist/r");

// ── Path rewriting ─────────────────────────────────────────────────────────
//
// Source files use relative imports within the package:
//   import { cn } from "../../lib/utils.js"
//   import { Button } from "./ui/button.js"
//   import { useAgentState } from "@deepgram/react"
//
// Registry consumers expect shadcn conventions:
//   import { cn } from "@/lib/utils"
//   import { Button } from "@/components/ui/button"
//   import { useAgentState } from "@deepgram/react"   (kept as-is — npm dep)

const IMPORT_REWRITES: Array<[RegExp, string]> = [
  // Relative utils: ../../lib/utils.js or ../lib/utils.js
  [/from ["']\.\.\/+lib\/utils\.js["']/g, 'from "@/lib/utils"'],
  // Relative shadcn UI primitives: ./ui/button.js or ../components/ui/button.js
  [/from ["']\.\.\/+components\/ui\/(\w[\w-]*)\.js["']/g, 'from "@/components/ui/$1"'],
  [/from ["']\.\/ui\/(\w[\w-]*)\.js["']/g, 'from "@/components/ui/$1"'],
  // Remove .js extension from any remaining relative imports
  [/from ["'](\.\.?\/[^'"]+)\.js["']/g, 'from "$1"'],
];

function rewriteImports(source: string): string {
  let out = source;
  for (const [pattern, replacement] of IMPORT_REWRITES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

// ── File reading ────────────────────────────────────────────────────────────

function readSourceFile(relativePath: string): string {
  const fullPath = join(UI_SRC, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Source file not found: ${fullPath}`);
  }
  return readFileSync(fullPath, "utf-8");
}

// ── Registry item builder ───────────────────────────────────────────────────

interface RegistryFile {
  path: string;
  content: string;
  type: "registry:ui" | "registry:lib";
  target?: string;
}

interface RegistryItemJSON {
  $schema: string;
  name: string;
  type: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

function buildItem(item: RegistryItem): RegistryItemJSON {
  const files: RegistryFile[] = item.files.map((filePath) => {
    const source = readSourceFile(filePath);
    const rewritten = rewriteImports(source);

    // Determine output path — lib files go to lib/, everything else to components/ui/
    let outputPath: string;
    if (filePath.startsWith("lib/")) {
      outputPath = filePath; // lib/utils.ts → lib/utils.ts
    } else if (filePath.startsWith("components/ui/")) {
      outputPath = filePath; // components/ui/button.tsx → components/ui/button.tsx
    } else {
      // Top-level components: components/AgentStatus.tsx → components/ui/agent-status.tsx
      // Keep original filename casing for readability
      const filename = filePath.split("/").pop()!;
      outputPath = `components/ui/${filename}`;
    }

    return {
      path: outputPath,
      content: rewritten,
      type: item.type,
      target: "",
    };
  });

  const out: RegistryItemJSON = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    description: item.description,
    files,
  };

  if (item.dependencies?.length) out.dependencies = item.dependencies;
  if (item.devDependencies?.length) out.devDependencies = item.devDependencies;
  if (item.registryDependencies?.length) out.registryDependencies = item.registryDependencies;

  return out;
}

// ── Index builder ───────────────────────────────────────────────────────────

interface RegistryIndex {
  $schema: string;
  name: string;
  homepage: string;
  items: Array<Omit<RegistryItemJSON, "files"> & { files: Array<{ path: string; type: string }> }>;
}

function buildIndex(): RegistryIndex {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "deepgram-ui",
    homepage: "https://cdn.deepgram.com/ui",
    items: registry.map((item) => ({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      description: item.description,
      ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
      ...(item.devDependencies?.length ? { devDependencies: item.devDependencies } : {}),
      ...(item.registryDependencies?.length ? { registryDependencies: item.registryDependencies } : {}),
      files: item.files.map((f) => ({
        path: f.startsWith("lib/") ? f : f.startsWith("components/ui/") ? f : `components/ui/${f.split("/").pop()}`,
        type: item.type,
      })),
    })),
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  // Ensure output directory exists
  mkdirSync(OUT_DIR, { recursive: true });

  let built = 0;
  let failed = 0;

  // Build individual component JSON files
  for (const item of registry) {
    try {
      const json = buildItem(item);
      const outPath = join(OUT_DIR, `${item.name}.json`);
      writeFileSync(outPath, JSON.stringify(json, null, 2) + "\n");
      console.log(`  ✓ ${item.name}`);
      built++;
    } catch (err) {
      console.error(`  ✗ ${item.name}: ${(err as Error).message}`);
      failed++;
    }
  }

  // Build index
  const index = buildIndex();
  writeFileSync(join(OUT_DIR, "index.json"), JSON.stringify(index, null, 2) + "\n");
  console.log(`  ✓ index.json`);

  console.log(`\nRegistry built: ${built} components, ${failed} failed`);
  console.log(`Output: packages/registry/dist/r/`);
  console.log(`Note: llms.txt lives at ui.deepgram.com — see apps/web/public/`);

  if (failed > 0) process.exit(1);
}

main();
