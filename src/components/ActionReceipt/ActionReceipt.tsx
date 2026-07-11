import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface ReceiptChange {
  /** Field or entity that changed. */
  field: string;
  /** Value before the agent acted. */
  before?: string;
  /** Value after the agent acted. */
  after: string;
}

export interface ActionReceiptProps {
  /** What the agent did, past tense. e.g. "Updated 3 invoices". */
  summary: string;
  /** Who performed it. Defaults to "AI agent". */
  actor?: string;
  /** Human-readable time. e.g. "just now", "2:41 PM". */
  timestamp?: string;
  /** Before/after changes to render as a compact diff. */
  changes?: ReceiptChange[];
  /** Optional confidence in the action taken (0-1). */
  confidence?: number;
  /** Whether the action can still be undone. */
  undoable?: boolean;
  /** Set true once the action has been reverted. */
  undone?: boolean;
  undoLabel?: string;
  onUndo?: () => void;
  className?: string;
}

function DiffRow({ change }: { change: ReceiptChange }) {
  const theme = useHaloTheme();
  const hasBefore = change.before !== undefined && change.before !== "";
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", fontSize: "12.5px", lineHeight: 1.5 }}>
      <span style={{ color: theme.colors.textMuted, minWidth: "84px", flexShrink: 0 }}>{change.field}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap", fontVariantNumeric: "tabular-nums" }}>
        {hasBefore && (
          <>
            <span style={{ color: theme.colors.textMuted, textDecoration: "line-through", textDecorationColor: `${theme.colors.textMuted}99` }}>
              {change.before}
            </span>
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: "translateY(1px)", flexShrink: 0 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke={theme.colors.textMuted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
        <span style={{ color: theme.colors.text, fontWeight: 500 }}>{change.after}</span>
      </span>
    </div>
  );
}

export function ActionReceipt({
  summary,
  actor = "AI agent",
  timestamp,
  changes = [],
  confidence,
  undoable = true,
  undone = false,
  undoLabel = "Undo",
  onUndo,
  className,
}: ActionReceiptProps) {
  const theme = useHaloTheme();

  return (
    <div
      className={cn("halo-action-receipt", className)}
      role="status"
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
        padding: "13px 15px",
        fontFamily: theme.font.sans,
        opacity: undone ? 0.65 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div
          style={{
            flexShrink: 0,
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            backgroundColor: undone ? theme.colors.surfaceRaised : `${theme.colors.success}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1px",
          }}
        >
          {undone ? (
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5L2.5 7 6 10.5M2.5 7H10a3.5 3.5 0 010 7H7" stroke={theme.colors.textMuted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 8.5l2.5 2.5L12 5.5" stroke={theme.colors.success} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 550, color: theme.colors.text, lineHeight: 1.4 }}>
              {undone ? "Reverted: " : ""}{summary}
            </p>
            {undoable && !undone && (
              <button
                type="button"
                className="halo-btn"
                onClick={onUndo}
                style={{
                  flexShrink: 0,
                  fontSize: "12.5px",
                  fontWeight: 500,
                  color: theme.colors.textSecondary,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  fontFamily: theme.font.sans,
                }}
              >
                {undoLabel}
              </button>
            )}
          </div>

          <div style={{ marginTop: "3px", fontSize: "12px", color: theme.colors.textMuted, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span>{actor}</span>
            {timestamp && (
              <>
                <span aria-hidden="true">·</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{timestamp}</span>
              </>
            )}
            {typeof confidence === "number" && (
              <>
                <span aria-hidden="true">·</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(Math.max(0, Math.min(1, confidence)) * 100)}% confident</span>
              </>
            )}
          </div>

          {changes.length > 0 && !undone && (
            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: `1px solid ${theme.colors.border}`,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {changes.map((c, i) => (
                <DiffRow key={i} change={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
