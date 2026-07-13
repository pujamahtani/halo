import { Check, CircleCheck, CircleX, Shield } from "lucide-react";
import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export type RiskLevel = "low" | "medium" | "high";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalDetail {
  label: string;
  value: string;
}

export interface ApprovalGateProps {
  /** Short label for the action the agent wants to take. */
  action: string;
  /** One line on why the agent is proposing it. */
  rationale?: string;
  /** How risky / irreversible the action is. Drives the accent. */
  risk?: RiskLevel;
  /** Structured context the reviewer needs before deciding. */
  details?: ApprovalDetail[];
  /** Optional model confidence in the proposed action (0-1). */
  confidence?: number;
  /** Resolved or waiting. */
  status?: ApprovalStatus;
  approveLabel?: string;
  rejectLabel?: string;
  /** When provided, renders a third "Modify" affordance. */
  onModify?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

const RISK_META: Record<RiskLevel, { label: string; token: "textMuted" | "warning" | "error" }> = {
  low: { label: "Low risk", token: "textMuted" },
  medium: { label: "Needs review", token: "warning" },
  high: { label: "High risk", token: "error" },
};

function RiskPill({ risk }: { risk: RiskLevel }) {
  const theme = useHaloTheme();
  const meta = RISK_META[risk];
  const color = theme.colors[meta.token];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "2px 8px",
        borderRadius: "999px",
        color,
        backgroundColor: risk === "low" ? theme.colors.surfaceRaised : `${color}14`,
        border: `1px solid ${risk === "low" ? theme.colors.border : `${color}33`}`,
        fontFamily: theme.font.sans,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "999px",
          backgroundColor: color,
        }}
      />
      {meta.label}
    </span>
  );
}

function ResolvedBanner({ status }: { status: "approved" | "rejected" }) {
  const theme = useHaloTheme();
  const approved = status === "approved";
  const color = approved ? theme.colors.success : theme.colors.error;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "13px",
        fontWeight: 500,
        color,
        fontFamily: theme.font.sans,
      }}
    >
      {approved ? (
        <CircleCheck size={15} color={color} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <CircleX size={15} color={color} strokeWidth={1.5} aria-hidden="true" />
      )}
      {approved ? "Approved" : "Rejected"}
    </div>
  );
}

export function ApprovalGate({
  action,
  rationale,
  risk = "medium",
  details = [],
  confidence,
  status = "pending",
  approveLabel = "Approve",
  rejectLabel = "Reject",
  onModify,
  onApprove,
  onReject,
  className,
}: ApprovalGateProps) {
  const theme = useHaloTheme();
  const resolved = status !== "pending";

  return (
    <div
      className={cn("halo-approval-gate", className)}
      role="group"
      aria-label={`Approval required: ${action}`}
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.background,
        overflow: "hidden",
        fontFamily: theme.font.sans,
        opacity: resolved ? 0.92 : 1,
      }}
    >
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <Shield size={15} color={theme.colors.textSecondary} strokeWidth={1.4} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: theme.colors.textMuted }}>
              Approval required
            </span>
          </div>
          <RiskPill risk={risk} />
        </div>

        <p style={{ margin: "10px 0 0", fontSize: "14px", fontWeight: 550, color: theme.colors.text, lineHeight: 1.4 }}>
          {action}
        </p>
        {rationale && (
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: theme.colors.textMuted, lineHeight: 1.5 }}>
            {rationale}
          </p>
        )}

        {details.length > 0 && (
          <dl
            style={{
              margin: "12px 0 0",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              rowGap: "6px",
              columnGap: "14px",
              fontSize: "12.5px",
            }}
          >
            {details.map((d, i) => (
              <div key={i} style={{ display: "contents" }}>
                <dt style={{ color: theme.colors.textMuted }}>{d.label}</dt>
                <dd style={{ margin: 0, color: theme.colors.textSecondary, fontVariantNumeric: "tabular-nums" }}>{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {typeof confidence === "number" && (
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>Model confidence</span>
            <div style={{ flex: 1, height: "4px", backgroundColor: theme.colors.surfaceRaised, borderRadius: "2px", overflow: "hidden", maxWidth: "160px" }}>
              <div
                style={{
                  width: `${Math.round(Math.max(0, Math.min(1, confidence)) * 100)}%`,
                  height: "100%",
                  backgroundColor: confidence >= 0.75 ? theme.colors.success : confidence >= 0.45 ? theme.colors.warning : theme.colors.error,
                  borderRadius: "2px",
                }}
              />
            </div>
            <span style={{ fontSize: "12px", color: theme.colors.textSecondary, fontVariantNumeric: "tabular-nums" }}>
              {Math.round(Math.max(0, Math.min(1, confidence)) * 100)}%
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: resolved ? "flex-start" : "flex-end",
          gap: "8px",
          padding: "10px 16px",
          borderTop: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.surface,
        }}
      >
        {resolved ? (
          <ResolvedBanner status={status as "approved" | "rejected"} />
        ) : (
          <>
            {onModify && (
              <button
                type="button"
                className="halo-btn-link"
                onClick={onModify}
                style={{
                  marginRight: "auto",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: theme.colors.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 4px",
                  fontFamily: theme.font.sans,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.colors.text;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.colors.textMuted;
                }}
              >
                Modify
              </button>
            )}
            <button
              type="button"
              className="halo-btn-outline"
              onClick={onReject}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: theme.font.sans,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = `${theme.colors.error}0a`;
                el.style.borderColor = `${theme.colors.error}44`;
                el.style.color = theme.colors.error;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = theme.colors.background;
                el.style.borderColor = theme.colors.border;
                el.style.color = theme.colors.textSecondary;
              }}
            >
              {rejectLabel}
            </button>
            <button
              type="button"
              className="halo-btn-success"
              onClick={onApprove}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13px",
                fontWeight: 550,
                color: "#ffffff",
                backgroundColor: theme.colors.success,
                border: `1px solid ${theme.colors.success}`,
                borderRadius: theme.radius.md,
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: theme.font.sans,
              }}
            >
              <Check size={14} strokeWidth={2} aria-hidden="true" />
              {approveLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
