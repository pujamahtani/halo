import { useState } from "react";
import { Check, X, RotateCw, Download, Plus, Pencil, Copy, Flag, ThumbsUp, ThumbsDown, ArrowRight, type LucideIcon } from "lucide-react";
import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface ActionItem {
  label: string;
  icon?: "check" | "x" | "refresh" | "download" | "expand" | "apply";
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
}

export interface FeedbackCriterion {
  label: string;
  defaultChecked?: boolean;
}

export interface FollowUp {
  label: string;
  onClick?: () => void;
}

export interface ResponseActionsProps {
  variant?: "bar" | "context" | "feedback" | "follow-ups";
  actions?: ActionItem[];
  feedbackQuestion?: string;
  feedbackCriteria?: FeedbackCriterion[];
  onFeedback?: (selected: string[]) => void;
  followUps?: FollowUp[];
  onAccept?: () => void;
  onDismiss?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onReport?: () => void;
  onRetry?: () => void;
  onGood?: () => void;
  onBad?: () => void;
  className?: string;
}

const ACTION_ICONS: Record<string, LucideIcon> = {
  check: Check,
  x: X,
  refresh: RotateCw,
  download: Download,
  expand: Plus,
  apply: Check,
};

function ActionIcon({ name, size = 12 }: { name: string; size?: number }) {
  const Icon = ACTION_ICONS[name] || Check;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}

function ToolbarIcon({ icon: Icon, label, onClick, active = false, theme }: { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean; theme: ReturnType<typeof useHaloTheme> }) {
  const restColor = active ? theme.colors.text : theme.colors.textMuted;
  return (
    <button
      className="halo-btn"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: theme.radius.sm,
        border: "none",
        backgroundColor: "transparent",
        color: restColor,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = theme.colors.text; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = restColor; }}
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

function ActionButton({
  action,
  theme,
}: {
  action: ActionItem;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const isPrimary = action.variant === "primary";
  return (
    <button
      className="halo-btn"
      onClick={action.onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 14px",
        fontSize: "12px",
        fontWeight: 500,
        borderRadius: theme.radius.md,
        border: isPrimary ? "none" : `1px solid ${theme.colors.border}`,
        backgroundColor: isPrimary ? theme.colors.text : "transparent",
        color: isPrimary ? theme.colors.background : theme.colors.textSecondary,
        cursor: "pointer",
        fontFamily: theme.font.sans,
      }}
    >
      {action.icon && <ActionIcon name={action.icon} />}
      {action.label}
    </button>
  );
}

function BarVariant({
  onCopy,
  onRetry,
  onEdit,
  onGood,
  onBad,
  onReport,
  theme,
}: {
  onCopy?: () => void;
  onRetry?: () => void;
  onEdit?: () => void;
  onGood?: () => void;
  onBad?: () => void;
  onReport?: () => void;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const [rated, setRated] = useState<null | "up" | "down">(null);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        fontFamily: theme.font.sans,
        flexWrap: "wrap",
      }}
    >
      <ToolbarIcon icon={Copy} label="Copy" onClick={onCopy} theme={theme} />
      <ToolbarIcon icon={RotateCw} label="Regenerate" onClick={onRetry} theme={theme} />
      <ToolbarIcon
        icon={ThumbsUp}
        label="Good response"
        active={rated === "up"}
        onClick={() => { setRated((r) => (r === "up" ? null : "up")); onGood?.(); }}
        theme={theme}
      />
      <ToolbarIcon
        icon={ThumbsDown}
        label="Bad response"
        active={rated === "down"}
        onClick={() => { setRated((r) => (r === "down" ? null : "down")); onBad?.(); }}
        theme={theme}
      />
      {onEdit && <ToolbarIcon icon={Pencil} label="Edit" onClick={onEdit} theme={theme} />}
      {onReport && <ToolbarIcon icon={Flag} label="Report" onClick={onReport} theme={theme} />}
    </div>
  );
}

function ContextVariant({
  actions,
  theme,
}: {
  actions: ActionItem[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: theme.font.sans,
        flexWrap: "wrap",
      }}
    >
      {actions.map((action, i) => (
        <ActionButton key={i} action={action} theme={theme} />
      ))}
    </div>
  );
}

function FeedbackVariant({
  feedbackQuestion,
  feedbackCriteria,
  onFeedback,
  onAccept,
  onDismiss,
  theme,
}: {
  feedbackQuestion: string;
  feedbackCriteria: FeedbackCriterion[];
  onFeedback?: (selected: string[]) => void;
  onAccept?: () => void;
  onDismiss?: () => void;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(feedbackCriteria.filter((c) => c.defaultChecked).map((c) => c.label))
  );

  const toggle = (label: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div style={{ fontFamily: theme.font.sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <ActionButton action={{ label: "Accept", icon: "check", variant: "primary", onClick: onAccept }} theme={theme} />
        <ActionButton action={{ label: "Dismiss", icon: "x", variant: "secondary", onClick: onDismiss }} theme={theme} />
        <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
          <ToolbarIcon icon={ThumbsUp} label="Helpful" theme={theme} />
          <ToolbarIcon icon={ThumbsDown} label="Not helpful" theme={theme} />
        </div>
      </div>

      <div
        style={{
          marginTop: "10px",
          padding: "12px 14px",
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.surface,
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: theme.colors.textSecondary,
            fontWeight: 500,
            marginBottom: "10px",
          }}
        >
          {feedbackQuestion}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {feedbackCriteria.map((c) => (
            <label
              key={c.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: theme.colors.textSecondary,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={checked.has(c.label)}
                onChange={() => toggle(c.label)}
                style={{ accentColor: theme.colors.textSecondary }}
              />
              {c.label}
            </label>
          ))}
        </div>
        <button
          className="halo-btn"
          onClick={() => onFeedback?.(Array.from(checked))}
          style={{
            marginTop: "10px",
            fontSize: "11px",
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: "transparent",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          Send feedback
        </button>
      </div>
    </div>
  );
}

function FollowUpsVariant({
  followUps,
  onAccept,
  onDismiss,
  theme,
}: {
  followUps: FollowUp[];
  onAccept?: () => void;
  onDismiss?: () => void;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div style={{ fontFamily: theme.font.sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <ActionButton action={{ label: "Accept", icon: "check", variant: "primary", onClick: onAccept }} theme={theme} />
        <ActionButton action={{ label: "Dismiss", icon: "x", variant: "secondary", onClick: onDismiss }} theme={theme} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {followUps.map((f, i) => (
          <button
            key={i}
            className="halo-btn"
            onClick={f.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              border: `1px dashed ${theme.colors.border}`,
              fontSize: "12px",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontFamily: theme.font.sans,
              textAlign: "left",
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = theme.colors.borderStrong; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = theme.colors.border; }}
          >
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" style={{ flexShrink: 0 }} />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ResponseActions({
  variant = "bar",
  actions = [],
  feedbackQuestion = "Was this response helpful?",
  feedbackCriteria = [],
  onFeedback,
  followUps = [],
  onAccept,
  onDismiss,
  onCopy,
  onEdit,
  onReport,
  onRetry,
  onGood,
  onBad,
  className,
}: ResponseActionsProps) {
  const theme = useHaloTheme();

  return (
    <div className={cn("halo-response-actions", className)}>
      {variant === "bar" && (
        <BarVariant onCopy={onCopy} onRetry={onRetry} onEdit={onEdit} onGood={onGood} onBad={onBad} onReport={onReport} theme={theme} />
      )}
      {variant === "context" && <ContextVariant actions={actions} theme={theme} />}
      {variant === "feedback" && (
        <FeedbackVariant
          feedbackQuestion={feedbackQuestion}
          feedbackCriteria={feedbackCriteria}
          onFeedback={onFeedback}
          onAccept={onAccept}
          onDismiss={onDismiss}
          theme={theme}
        />
      )}
      {variant === "follow-ups" && (
        <FollowUpsVariant followUps={followUps} onAccept={onAccept} onDismiss={onDismiss} theme={theme} />
      )}
    </div>
  );
}
