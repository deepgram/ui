import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.js";
import { cn } from "../lib/utils.js";

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface MicSelectorProps {
  /** Selected device ID (controlled). */
  value?: string;
  /** Called when the user selects a different device. */
  onValueChange?: (deviceId: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Microphone device selector dropdown.
 * Enumerates available audio input devices and lets the user pick one.
 *
 * Requests microphone permission on first open if not already granted.
 * Listens for device changes (plug/unplug) and updates automatically.
 *
 * @example
 * ```tsx
 * const [deviceId, setDeviceId] = useState("");
 * <MicSelector value={deviceId} onValueChange={setDeviceId} />
 * ```
 */
export function MicSelector({
  value,
  onValueChange,
  className,
  disabled = false,
}: MicSelectorProps) {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    try {
      if (!hasPermission) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setHasPermission(true);
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 5)}`,
          groupId: d.groupId,
        }));

      setDevices(audioInputs);
    } catch {
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    loadDevices();
    const handler = () => loadDevices();
    navigator.mediaDevices?.addEventListener("devicechange", handler);
    return () => navigator.mediaDevices?.removeEventListener("devicechange", handler);
  }, [loadDevices]);

  return (
    <Select
      value={value || ""}
      onValueChange={onValueChange}
      disabled={disabled || loading}
    >
      <SelectTrigger
        className={cn("dg:text-sm", className)}
        data-agent-mic-selector
        aria-label="Select microphone"
      >
        <SelectValue placeholder={loading ? "Loading…" : "Select microphone"} />
      </SelectTrigger>
      <SelectContent>
        {devices.length === 0 && !loading && (
          <SelectItem value="__none__" disabled>
            No microphones found
          </SelectItem>
        )}
        {devices.map((d) => (
          <SelectItem key={d.deviceId} value={d.deviceId}>
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
