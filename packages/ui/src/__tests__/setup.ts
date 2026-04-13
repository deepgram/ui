import { GlobalWindow } from "happy-dom";

const win = new GlobalWindow({ url: "http://localhost" }) as unknown as Window & typeof globalThis;

// Register all window properties on globalThis
for (const key of Object.getOwnPropertyNames(win)) {
  if (key === "undefined" || key === "globalThis") continue;
  try {
    // @ts-expect-error — assigning window properties to global
    if (!(key in globalThis)) globalThis[key] = win[key];
  } catch {
    // Some properties are read-only
  }
}

// Explicitly set the core globals
Object.assign(globalThis, {
  window: win,
  document: win.document,
  navigator: win.navigator,
});
