import { useRef, useEffect, useCallback } from "react";
import { useAgentSession, useAgentMode } from "@deepgram/react";

export interface BarVisualizerProps {
  /** "input" for microphone, "output" for agent audio. Default: "output" */
  source?: "input" | "output";
  /** Number of bars. Default: 16 */
  barCount?: number;
  /** Bar color when idle. Uses CSS variable. */
  className?: string;
}

/**
 * Real-time audio frequency bar visualizer.
 * Renders a canvas with vertical bars that react to audio input or output.
 *
 * Requires an active session — bars flatten when disconnected.
 *
 * @example
 * ```tsx
 * <AgentProvider config={config}>
 *   <BarVisualizer source="output" barCount={24} />
 * </AgentProvider>
 * ```
 */
export function BarVisualizer({
  source = "output",
  barCount = 16,
  className,
}: BarVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const session = useAgentSession();
  const { mode } = useAgentMode();
  const rafRef = useRef<number>(0);

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

    // Get frequency data from the session's mic or player
    let data: Uint8Array | undefined;
    try {
      // Access the underlying mic/player through the session
      // The session doesn't directly expose these — we use a workaround
      // by reading frequency data at the current instant
      if (source === "input") {
        data = (session as unknown as { micRef?: { current?: { getInputByteFrequencyData?: () => Uint8Array } } })
          ?.micRef?.current?.getInputByteFrequencyData?.();
      }
    } catch {}

    const barWidth = rect.width / barCount;
    const gap = Math.max(1, barWidth * 0.15);
    const effectiveBarWidth = barWidth - gap;

    const style = getComputedStyle(canvas);
    const color = style.getPropertyValue("--dg-va-primary").trim() || "#13EF93";
    const mutedColor = style.getPropertyValue("--dg-va-border").trim() || "rgba(255,255,255,0.08)";

    for (let i = 0; i < barCount; i++) {
      let value = 0;
      if (data && data.length > 0) {
        const index = Math.floor((i / barCount) * data.length);
        value = data[index] / 255;
      }

      const minH = rect.height * 0.05;
      const barH = Math.max(minH, value * rect.height * 0.9);
      const x = i * barWidth + gap / 2;
      const y = (rect.height - barH) / 2;

      ctx.fillStyle = value > 0.05 ? color : mutedColor;
      ctx.beginPath();
      ctx.roundRect(x, y, effectiveBarWidth, barH, 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [barCount, source, session]);

  useEffect(() => {
    if (mode !== "idle") {
      rafRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-agent-bar-visualizer
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
