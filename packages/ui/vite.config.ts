import { defineConfig } from "vite";
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
        "@deepgram/agents",
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
    // (including @deepgram/agents-widget) gets the styles automatically
    // when it imports @deepgram/ui/dist/index.js.
    cssInjected(),
    dts({ rollupTypes: true }),
    // The standalone stylesheet for the `@deepgram/ui/styles.css` export is
    // built by a second Vite pass (vite.styles.config.ts) that compiles
    // src/styles.css through Tailwind. It was previously copied verbatim,
    // which shipped raw Tailwind source (@import/@plugin directives) that
    // consumer bundlers reject.
  ],
});
