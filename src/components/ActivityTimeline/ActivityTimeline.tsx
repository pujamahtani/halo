import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export type ActivityStatus = "done" | "pending" | "failed" | "undone";

export interface ActivityEntry {
  id: string;
  /** Who acted. e.g. "Billing agent", "You". */
  actor: string;
  /** What happened, past tense. e.g. "Repriced invoice #1043". */
  action: string;
  timestamp: string;
  status?: ActivityStatus;
  /** Whether this entry can still be undone. */
  undoable?: boolean;
}

export interface ActivityTimelineProps {
  entries: ActivityEntry[];
  onUndo?: (id: string) => void;
  undoLabel?: string;
  className?: string;
}

function StatusDot({ status }: { status: ActivityStatus }) {
  const theme = useHaloTheme();
  const color =
    status === "done"
      ? theme.colors.success
      : status === "failed"
      ? theme.colors.error
      : status === "undone"
      ? theme.colors.textMuted
      : theme.colors.warning;

  return (
    <span
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "18px",
        height: "18px",
        borderRadius: "999px",
        backgroundColor: theme.colors.background,
        border: `1.5px solid ${color}`,
        flexShrink: 0,
      }}
    >
      {status === "done" && (
        <svg width={10} height={10} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 8.5l2.5 2.5L12 5.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {status === "failed" && (
        <svg width={9} height={9} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {status === "undone" && (
        <svg width={10} height={10} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3.5L2.5 7 6 10.5M2.5 7H10a3.5 3.5 0 010 7H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export function ActivityTimeline({ entries, onUndo, undoLabel = "Undo", className }: ActivityTimelineProps) {
  const theme = useHaloTheme();

  return (
    <ol
      className={cn("halo-activity-timeline", className)}
      style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: theme.font.sans }}
    >
      {entries.map((entry, i) => {
        const status = entry.status ?? "done";
        const isLast = i === entries.length - 1;
        const dimmed = status === "undone";

        return (
          <li key={entry.id} style={{ position: "relative", display: "flex", gap: "12px", paddingBottom: isLast ? 0 : "16px" }}>
            {!isLast && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "8.5px",
                  top: "18px",
                  bottom: 0,
                  width: "1px",
                  backgroundColor: theme.colors.border,
                }}
              />
            )}
            <StatusDot status={status} />
            <div style={{ minWidth: 0, flex: 1, opacity: dimmed ? 0.6 : 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: theme.colors.text, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 550 }}>{entry.actor}</span>{" "}
                  <span style={{ color: theme.colors.textSecondary, textDecoration: status === "undone" ? "line-through" : "none" }}>
                    {entry.action}
                  </span>
                </p>
                {entry.undoable && status !== "undone" && status !== "failed" && (
                  <button
                    type="button"
                    className="halo-btn"
                    onClick={() => onUndo?.(entry.id)}
                    style={{
                      flexShrink: 0,
                      fontSize: "12px",
                      fontWeight: 500,
                      color: theme.colors.textSecondary,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: theme.font.sans,
                    }}
                  >
                    {undoLabel}
                  </button>
                )}
              </div>
              <span style={{ fontSize: "11.5px", color: theme.colors.textMuted, fontVariantNumeric: "tabular-nums" }}>
                {entry.timestamp}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
