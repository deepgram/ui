import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Compiles the standalone stylesheet for the `@deepgram/ui/styles.css`
// export. The main build (vite.config.ts) embeds compiled CSS into the JS
// bundle via vite-plugin-css-injected-by-js, so no CSS asset leaves that
// pass; this second pass exists solely to turn src/styles.css (Tailwind v4
// source with @import/@plugin directives) into plain compiled CSS at
// dist/styles.css. Previously the raw source file was copied verbatim,
// which broke consumer builds (lightningcss rejects `@media prefix(dg)`)
// and served no styles to consumers who imported it.
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/styles.css",
      output: {
        assetFileNames: "styles[extname]",
      },
    },
  },
});
