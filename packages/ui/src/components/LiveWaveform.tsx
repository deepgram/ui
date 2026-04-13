import { useRef, useEffect, useCallback } from "react";

export interface LiveWaveformProps {
  /** One or more functions returning volume (0–1). When multiple are given, the max is used. */
  getVolume: (() => number) | (() => number)[];
  /** Whether to animate. When false, renders a flat line. */
  active?: boolean;
  /** Waveform color. Default: uses --dg-va-primary CSS variable. */
  color?: string;
  /** Line width. Default: 2 */
  lineWidth?: number;
  className?: string;
}

/**
 * Canvas-based real-time waveform visualization.
 * Renders a smooth oscillating line driven by a volume source.
 *
 * @example
 * ```tsx
 * const mic = useAgentMicrophone();
 * // Pass a function that returns volume 0–1
 * <LiveWaveform getVolume={() => mic.getInputVolume()} active={mic.micActive} />
 * ```
 */
export function LiveWaveform({
  getVolume,
  active = true,
  color,
  lineWidth = 2,
  className,
}: LiveWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const fns = Array.isArray(getVolume) ? getVolume : [getVolume];
    const volume = active ? Math.max(...fns.map((fn) => fn())) : 0;
    const amplitude = Math.min(1, volume * 2) * rect.height * 0.35;
    const midY = rect.height / 2;

    const style = getComputedStyle(canvas);
    const strokeColor = color || style.getPropertyValue("--dg-va-primary").trim() || "#13EF93";

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    phaseRef.current += 0.06;

    for (let x = 0; x < rect.width; x++) {
      const t = x / rect.width;
      // Blend two sine waves for organic feel
      const y = midY
        + Math.sin(t * Math.PI * 4 + phaseRef.current) * amplitude * 0.6
        + Math.sin(t * Math.PI * 7 + phaseRef.current * 1.3) * amplitude * 0.4;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, [active, getVolume, color, lineWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-agent-live-waveform
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
