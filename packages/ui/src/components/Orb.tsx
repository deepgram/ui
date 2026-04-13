import { useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OrbState = "idle" | "listening" | "talking";

export interface OrbProps {
  /** Agent state — controls animation speed, deflation, rocking, and pulse. */
  state?: OrbState;
  /** Two gradient colors. Default: Deepgram brand palette. */
  colors?: [string, string];
  /** Size in px. Default: 200. */
  size?: number;

  // ── Audio reactivity (automatic mode — getter sampled per frame) ──
  /** Getter returning current input volume (0–1). Sampled per animation frame. */
  getInputVolume?: () => number;
  /** Getter returning current output volume (0–1). Sampled per animation frame. */
  getOutputVolume?: () => number;

  // ── Audio reactivity (manual mode — direct values) ──
  /** Direct input volume value (0–1). Use when you control the value yourself. */
  inputVolume?: number;
  /** Direct output volume value (0–1). Use when you control the value yourself. */
  outputVolume?: number;

  className?: string;
}

// ---------------------------------------------------------------------------
// Constants (from deepgram/browser-agent hoop.ts)
// ---------------------------------------------------------------------------

const PULSE_PERIOD_SECONDS = 3;
const PULSE_SIZE_MULTIPLIER = 1.02;
const AVERAGE_ROTATION_PERIOD_SECONDS = 6;
const ROCKING_PERIOD_SECONDS = 3;
const ROCKING_TRANSITION_TIME_MS = 1000;
const DEFLATE_PULL = 2;
const DEFLATE_TRANSITION_TIME_MS = 1000;
const INFLATE_TRANSITION_TIME_MS = 300;
const CHATTER_SIZE_MULTIPLIER = 1.15;
const CHATTER_WINDOW_SIZE = 10;
const CHATTER_FRAME_LAG = 3;

const pi = (n: number): number => Math.PI * n;

// ---------------------------------------------------------------------------
// Default color palette
// ---------------------------------------------------------------------------

interface Point { x: number; y: number }
interface ColorStop { pct: number; color: string }
interface LineConfig {
  segments: ColorStop[];
  startAngle: number;
  speedMultiplier: number;
  centerOffset: Point;
  radiusOffset: number;
  width: number;
}

function buildPalette(colors?: [string, string]) {
  const c1 = colors?.[0] ?? "#13ef93";
  const c2 = colors?.[1] ?? "#ee028c";
  return {
    primary: c1 + "cc",
    secondary: c2 + "cc",
    lightPurple: "#ae63f9cc",
    lightBlue: "#14a9fbcc",
    green: "#a1f9d4cc",
    transparent: "transparent",
  };
}

function buildLines(colors?: [string, string]): LineConfig[] {
  const c = buildPalette(colors);
  return [
    {
      segments: [
        { pct: 0.42, color: c.transparent },
        { pct: 0.61, color: c.secondary },
      ],
      startAngle: 3.52, speedMultiplier: 1.21,
      centerOffset: { x: 0.01, y: -0.01 }, radiusOffset: 0.02, width: 3.38,
    },
    {
      segments: [
        { pct: 0.28, color: c.primary },
        { pct: 0.62, color: c.secondary },
        { pct: 0.8, color: c.transparent },
      ],
      startAngle: 1.59, speedMultiplier: 0.64,
      centerOffset: { x: -0.03, y: -0.01 }, radiusOffset: 0.05, width: 2.39,
    },
    {
      segments: [
        { pct: 0.1, color: c.transparent },
        { pct: 0.31, color: c.green },
        { pct: 0.45, color: c.lightBlue },
        { pct: 0.66, color: c.lightPurple },
      ],
      startAngle: 2.86, speedMultiplier: 0.94,
      centerOffset: { x: 0.02, y: 0.02 }, radiusOffset: -0.06, width: 2.64,
    },
    {
      segments: [
        { pct: 0.1, color: c.lightPurple },
        { pct: 0.5, color: c.transparent },
        { pct: 0.9, color: c.green },
      ],
      startAngle: 5.67, speedMultiplier: 1.3,
      centerOffset: { x: -0.01, y: 0.01 }, radiusOffset: 0.04, width: 2.95,
    },
  ];
}

const LINE_COUNT = 4;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const coordsFrom = (p: Point, d: number, a: number): Point => ({
  x: p.x + d * Math.cos(a), y: p.y + d * Math.sin(a),
});

const lerp = (a: number, b: number, t: number): number => t * (b - a) + a;
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const easeInOutQuad = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

interface Shape {
  time: number;
  speed: number;
  deflation: number;
  rockingAngle: number;
  agentNoise: number[];
  userNoise: number[];
  targetDeflation: number;
  targetRocking: number;
  transitionStart: number;
  startDeflation: number;
  startRocking: number;
}

function makeGradient(
  ctx: CanvasRenderingContext2D, offset: Point, angle: number, parts: ColorStop[],
): CanvasGradient {
  const w = ctx.canvas.width / 2;
  const h = ctx.canvas.height / 2;
  const g = ctx.createLinearGradient(
    w * (1 - Math.cos(angle) + offset.x),
    h * (1 - Math.sin(angle) + offset.y),
    w * (1 + Math.cos(angle) + offset.x),
    h * (1 + Math.sin(angle) + offset.y),
  );
  parts.forEach(({ pct, color }) => g.addColorStop(pct, color));
  return g;
}

function drawCrescent(
  ctx: CanvasRenderingContext2D, offset: Point, radius: number,
  deflDepth: number, deflAngle: number, gradient: CanvasGradient,
) {
  const w = ctx.canvas.width / 2;
  const h = ctx.canvas.height / 2;
  const center = { x: w * (1 + offset.x), y: h * (1 + offset.y) };
  const bezD = radius * (4 / 3) * Math.tan(pi(1 / 8));

  ctx.strokeStyle = gradient;
  ctx.beginPath();

  const arcStart = deflAngle + pi(1 / 2);
  const arcEnd = deflAngle + pi(3 / 2);
  ctx.arc(center.x, center.y, radius, arcStart, arcEnd, false);

  const start = coordsFrom(center, radius, arcEnd);
  const angleToX = pi(3 / 2) - deflAngle;
  const distDown = Math.cos(angleToX) * radius;
  const mid = coordsFrom(
    coordsFrom(center, radius, deflAngle),
    distDown * deflDepth * DEFLATE_PULL,
    pi(1 / 2),
  );
  const end = coordsFrom(center, radius, arcStart);

  ctx.bezierCurveTo(
    ...Object.values(coordsFrom(start, bezD, arcEnd + pi(1 / 2))) as [number, number],
    ...Object.values(coordsFrom(mid, bezD, deflAngle + pi(3 / 2))) as [number, number],
    mid.x, mid.y,
  );
  ctx.bezierCurveTo(
    ...Object.values(coordsFrom(mid, bezD, deflAngle + pi(1 / 2))) as [number, number],
    ...Object.values(coordsFrom(end, bezD, arcStart + pi(3 / 2))) as [number, number],
    end.x, end.y,
  );
  ctx.stroke();
}

function rollingAvg(noise: number[], start: number): number {
  const win = noise.slice(start, start + CHATTER_WINDOW_SIZE);
  return win.reduce((a, b) => a + b, 0) / win.length;
}

function drawFrame(ctx: CanvasRenderingContext2D, shape: Shape, dt: number, lineConfigs: LineConfig[]) {
  shape.time += dt * lerp(1, shape.speed, shape.deflation);

  const elapsed = performance.now() - shape.transitionStart;
  if (shape.deflation !== shape.targetDeflation) {
    const dur = shape.targetDeflation > shape.startDeflation
      ? DEFLATE_TRANSITION_TIME_MS : INFLATE_TRANSITION_TIME_MS;
    const p = easeInOutQuad(clamp01(elapsed / dur));
    shape.deflation = p >= 1 ? shape.targetDeflation
      : lerp(shape.startDeflation, shape.targetDeflation, p);
  }
  if (shape.rockingAngle !== shape.targetRocking) {
    const p = easeInOutQuad(clamp01(elapsed / ROCKING_TRANSITION_TIME_MS));
    shape.rockingAngle = p >= 1 ? shape.targetRocking
      : lerp(shape.startRocking, shape.targetRocking, p);
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const maxR = Math.min(ctx.canvas.width, ctx.canvas.height) / 2;
  const pulse = 1 + (PULSE_SIZE_MULTIPLIER - 1)
    * Math.sin(shape.time * pi(1) / PULSE_PERIOD_SECONDS / 1000)
    * lerp(1, 0, shape.deflation);

  // Base deflation from state transition
  const baseDeflation = easeInOutQuad(shape.deflation);
  // When in talking state (deflation ~0.85), agent volume modulates the mouth:
  // high volume → less deflation (mouth opens), low volume → more deflation (mouth closes)
  const isTalking = shape.targetDeflation > 0.3 && shape.targetDeflation < 1;

  lineConfigs.forEach((line, i) => {
    ctx.lineWidth = line.width;
    ctx.shadowColor = line.segments[0].color;
    ctx.shadowBlur = line.width * 1.1;

    let r = maxR * 0.8 * pulse;

    // Listening: subtle radius flutter from mic input volume
    const isListening = shape.targetDeflation === 0 && shape.deflation < 0.05;
    if (isListening) {
      const vol = Math.min(0.7, rollingAvg(shape.userNoise, i * CHATTER_FRAME_LAG));
      r = Math.min(r * (1 + vol * (CHATTER_SIZE_MULTIPLIER - 1) * 2), maxR * 0.92);
    }

    const gradient = makeGradient(
      ctx, line.centerOffset,
      line.startAngle + (shape.time * pi(1) / 1000 / AVERAGE_ROTATION_PERIOD_SECONDS) * line.speedMultiplier,
      line.segments,
    );

    // Mouth movement: volume modulates deflation depth per-line with lag
    let deflation = baseDeflation;
    if (isTalking) {
      const vol = rollingAvg(shape.agentNoise, i * CHATTER_FRAME_LAG);
      deflation = baseDeflation * (1 - vol * 0.4);
    }

    drawCrescent(
      ctx, line.centerOffset,
      r + line.radiusOffset * r,
      deflation,
      pi(3 / 2) + Math.sin(shape.time * pi(2) / ROCKING_PERIOD_SECONDS / 1000) * shape.rockingAngle,
      gradient,
    );
  });
}

// ---------------------------------------------------------------------------
// State mapping
// ---------------------------------------------------------------------------

function deflationFor(state: OrbState): number {
  switch (state) {
    case "talking":   return 0.55; // gentle crescent mouth
    case "listening": return 0;    // full circle
    case "idle": default: return 1; // fully pinched
  }
}

function rockingFor(state: OrbState): number {
  switch (state) {
    case "talking":   return 0;        // no rocking — mouth stays oriented
    case "listening": return pi(1 / 15);
    case "idle": default: return pi(1 / 2);
  }
}

function speedFor(state: OrbState): number {
  switch (state) {
    case "talking":   return 1;
    case "listening": return 0.7;
    case "idle": default: return 0.2;
  }
}

// ---------------------------------------------------------------------------
// React component
// ---------------------------------------------------------------------------

/**
 * Deepgram animated orb — the signature hoop visualization.
 *
 * Canvas 2D rendering of 4 crescent arcs with gradient colors that
 * change behavior based on agent state:
 *
 * - `idle` — deflated, slow rocking, minimal animation
 * - `listening` — fully inflated, gentle pulse, awaiting speech
 * - `talking` — fully inflated, fast rotation, active pulse
 *
 * Audio reactivity (optional, two modes):
 * - **Automatic:** pass `getInputVolume` / `getOutputVolume` getter functions
 *   (sampled per animation frame — zero re-renders)
 * - **Manual:** pass `inputVolume` / `outputVolume` number props
 *   (push new values via state/props)
 *
 * Without any volume props the orb animates on state alone.
 *
 * Ported from deepgram/browser-agent `hoop.ts`. No external dependencies.
 *
 * @example State-only:
 * ```tsx
 * <Orb state="listening" />
 * ```
 *
 * @example Automatic volume (getter functions):
 * ```tsx
 * <Orb
 *   state="talking"
 *   getOutputVolume={() => player.getOutputVolume()}
 *   getInputVolume={() => mic.getInputVolume()}
 * />
 * ```
 *
 * @example Manual volume (direct values):
 * ```tsx
 * <Orb state="talking" outputVolume={0.6} inputVolume={0.2} />
 * ```
 *
 * @example Custom colors:
 * ```tsx
 * <Orb state="listening" colors={["#6366f1", "#ec4899"]} />
 * ```
 */
export function Orb({
  state = "idle",
  colors,
  size = 200,
  getInputVolume,
  getOutputVolume,
  inputVolume,
  outputVolume,
  className,
}: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef(buildLines(colors));
  const shapeRef = useRef<Shape>({
    time: 0,
    speed: speedFor("idle"),
    deflation: deflationFor("idle"),
    rockingAngle: rockingFor("idle"),
    agentNoise: Array(LINE_COUNT * CHATTER_FRAME_LAG + CHATTER_WINDOW_SIZE).fill(0),
    userNoise: Array(LINE_COUNT * CHATTER_FRAME_LAG + CHATTER_WINDOW_SIZE).fill(0),
    targetDeflation: deflationFor("idle"),
    targetRocking: rockingFor("idle"),
    transitionStart: 0,
    startDeflation: deflationFor("idle"),
    startRocking: rockingFor("idle"),
  });

  // Rebuild line configs when colors change
  useEffect(() => {
    linesRef.current = buildLines(colors);
  }, [colors]);

  // Update state transitions
  useEffect(() => {
    const shape = shapeRef.current;
    shape.speed = speedFor(state);
    shape.transitionStart = performance.now();
    shape.startDeflation = shape.deflation;
    shape.startRocking = shape.rockingAngle;
    shape.targetDeflation = deflationFor(state);
    shape.targetRocking = rockingFor(state);
  }, [state]);

  // Manual volume: push values into noise buffers when props change
  useEffect(() => {
    if (outputVolume != null) {
      const shape = shapeRef.current;
      shape.agentNoise.shift();
      shape.agentNoise.push(outputVolume);
    }
  }, [outputVolume]);

  useEffect(() => {
    if (inputVolume != null) {
      const shape = shapeRef.current;
      shape.userNoise.shift();
      shape.userNoise.push(inputVolume);
    }
  }, [inputVolume]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();
    let raf = 0;

    function loop(now: number) {
      const dt = now - last;
      last = now;

      // Automatic mode: sample volume getters per frame
      const shape = shapeRef.current;
      if (getOutputVolume) {
        shape.agentNoise.shift();
        shape.agentNoise.push(getOutputVolume());
      }
      if (getInputVolume) {
        shape.userNoise.shift();
        shape.userNoise.push(getInputVolume());
      }

      drawFrame(ctx!, shape, dt, linesRef.current);
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [getInputVolume, getOutputVolume]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-agent-orb
      data-orb-state={state}
      width={size * dpr}
      height={size * dpr}
      style={{ width: size, height: size, display: "block" }}
      aria-hidden="true"
    />
  );
}
