import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export type AgentState = "idle" | "working" | "needs-input" | "done" | "error";

export interface AgentStatusProps {
  state: AgentState;
  /** Optional label, e.g. the current step the agent is on. */
  label?: string;
  /** Elapsed seconds, shown for the working state. */
  elapsed?: number;
  /** Compact inline pill instead of the full row. */
  variant?: "row" | "pill";
  className?: string;
}

const STATE_META: Record<
  AgentState,
  { text: string; token: "textMuted" | "warning" | "success" | "error"; pulse: boolean }
> = {
  idle: { text: "Idle", token: "textMuted", pulse: false },
  working: { text: "Working", token: "warning", pulse: true },
  "needs-input": { text: "Needs your input", token: "warning", pulse: true },
  done: { text: "Done", token: "success", pulse: false },
  error: { text: "Failed", token: "error", pulse: false },
};

function formatElapsed(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${rem}s`;
}

export function AgentStatus({ state, label, elapsed, variant = "row", className }: AgentStatusProps) {
  const theme = useHaloTheme();
  const meta = STATE_META[state];
  const color = theme.colors[meta.token];

  const dot = (
    <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", flexShrink: 0 }}>
      {meta.pulse && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            backgroundColor: color,
            animation: "halo-pulse 1.4s ease-out infinite",
          }}
        />
      )}
      <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "999px", backgroundColor: color }} />
    </span>
  );

  const keyframes = (
    <style>{`@keyframes halo-pulse{0%{transform:scale(1);opacity:.55}70%{transform:scale(2.4);opacity:0}100%{opacity:0}}`}</style>
  );

  if (variant === "pill") {
    return (
      <span
        className={cn("halo-agent-status", className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 500,
          padding: "3px 9px 3px 8px",
          borderRadius: "999px",
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          fontFamily: theme.font.sans,
        }}
      >
        {keyframes}
        {dot}
        {label ?? meta.text}
      </span>
    );
  }

  return (
    <div
      className={cn("halo-agent-status", className)}
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: theme.font.sans,
      }}
    >
      {keyframes}
      {dot}
      <span style={{ fontSize: "13px", fontWeight: 550, color: theme.colors.text }}>{meta.text}</span>
      {label && (
        <span style={{ fontSize: "13px", color: theme.colors.textMuted, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      )}
      {typeof elapsed === "number" && state === "working" && (
        <span style={{ marginLeft: "auto", fontSize: "12px", color: theme.colors.textMuted, fontVariantNumeric: "tabular-nums" }}>
          {formatElapsed(elapsed)}
        </span>
      )}
    </div>
  );
}
