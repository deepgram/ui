import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
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
    // Don't extract CSS into a separate file from the JS bundle —
    // keep it injected so importing components auto-includes styles.
    // We separately copy the standalone styles.css for opt-in import.
    cssCodeSplit: false,
    minify: "terser",
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
    react(),
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
