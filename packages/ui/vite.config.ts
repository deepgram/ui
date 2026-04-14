import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import cssInjected from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "@deepgram/agent",
        "@deepgram/react",
      ],
    },
    cssCodeSplit: false,
    minify: "terser",
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
    react(),
    // Embed compiled CSS as a self-executing JS string so any bundler
    // (including @deepgram/agent-widget) gets the styles automatically
    // when it imports @deepgram/ui/dist/index.js.
    cssInjected(),
    dts({ rollupTypes: true }),
    // Copy standalone styles.css to dist for @deepgram/ui/styles.css
    {
      name: "copy-styles",
      closeBundle() {
        mkdirSync(resolve(__dirname, "dist"), { recursive: true });
        copyFileSync(
          resolve(__dirname, "src/styles.css"),
          resolve(__dirname, "dist/styles.css"),
        );
      },
    },
  ],
});
