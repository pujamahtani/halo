import { useState } from "react";
import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface ReasoningStep {
  label: string;
  description?: string;
  status: "complete" | "active" | "pending";
  duration?: number;
}

export interface ReasoningPanelProps {
  variant?: "live" | "collapsed" | "raw";
  steps?: ReasoningStep[];
  title?: string;
  rawContent?: string;
  rawLabel?: string;
  totalDuration?: number;
  defaultOpen?: boolean;
  className?: string;
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ animation: "halo-spin 0.7s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" stroke="#e5e5e5" strokeWidth="2" />
      <path d="M14 8a6 6 0 00-6-6" stroke="#737373" strokeWidth="2" strokeLinecap="round" />
      <style>{`@keyframes halo-spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
      <path d="M8 4.5v4l2.5 1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open, color }: { open: boolean; color: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LiveVariant({
  steps,
  theme,
}: {
  steps: ReasoningStep[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.font.sans,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: theme.colors.textSecondary,
          marginBottom: "12px",
        }}
      >
        <Spinner />
        <span style={{ fontWeight: 500 }}>Thinking...</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "2px 0",
              opacity: step.status === "pending" ? 0.4 : 1,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: "1px" }}>
              {step.status === "complete" && <CheckIcon />}
              {step.status === "active" && <Spinner />}
              {step.status === "pending" && <ClockIcon color={theme.colors.textMuted} />}
            </div>
            <span
              style={{
                flex: 1,
                fontSize: "12px",
                color:
                  step.status === "active"
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                fontWeight: step.status === "active" ? 500 : 400,
                lineHeight: 1.4,
              }}
            >
              {step.label}
            </span>
            {step.duration !== undefined && (
              <span
                style={{
                  fontSize: "11px",
                  color: theme.colors.textMuted,
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0,
                  ...(step.status === "active"
                    ? { animation: "halo-pulse 1.5s ease-in-out infinite" }
                    : {}),
                }}
              >
                {step.duration.toFixed(1)}s
              </span>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes halo-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </div>
  );
}

function CollapsedVariant({
  steps,
  totalDuration,
  defaultOpen,
  theme,
}: {
  steps: ReasoningStep[];
  totalDuration?: number;
  defaultOpen?: boolean;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const [open, setOpen] = useState(defaultOpen || false);
  const stepCount = steps.length;

  return (
    <div
      style={{
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
        fontFamily: theme.font.sans,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontFamily: theme.font.sans,
          fontSize: "12px",
          color: theme.colors.textMuted,
        }}
      >
        <ChevronIcon open={open} color={theme.colors.textMuted} />
        <span style={{ fontWeight: 500 }}>Reasoning complete</span>
        {totalDuration !== undefined && (
          <span style={{ marginLeft: "auto", fontSize: "11px", fontVariantNumeric: "tabular-nums" }}>
            {stepCount} step{stepCount !== 1 ? "s" : ""} in {totalDuration.toFixed(1)}s
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "0 12px 10px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: theme.colors.textSecondary,
                padding: "2px 0",
              }}
            >
              <CheckIcon />
              <span>{step.label}</span>
              {step.duration !== undefined && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    color: theme.colors.textMuted,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {step.duration.toFixed(1)}s
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RawVariant({
  rawContent,
  rawLabel,
  theme,
}: {
  rawContent: string;
  rawLabel?: string;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: theme.font.sans }}>
      {rawLabel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: theme.colors.textSecondary,
            }}
          >
            {rawLabel}
          </span>
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: theme.colors.textMuted,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: theme.font.sans,
              padding: "2px 6px",
              borderRadius: theme.radius.sm,
            }}
          >
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre
        style={{
          padding: "14px 16px",
          borderRadius: theme.radius.lg,
          backgroundColor: "#1a1a1a",
          color: "#d4d4d4",
          fontFamily: theme.font.mono,
          fontSize: "12px",
          lineHeight: 1.6,
          overflowX: "auto",
          whiteSpace: "pre",
          margin: 0,
        }}
      >
        {rawContent}
      </pre>
    </div>
  );
}

export function ReasoningPanel({
  variant = "live",
  steps = [],
  title,
  rawContent = "",
  rawLabel,
  totalDuration,
  defaultOpen,
  className,
}: ReasoningPanelProps) {
  const theme = useHaloTheme();

  return (
    <div className={cn("halo-reasoning", className)} role={title ? "region" : undefined} aria-label={title}>
      {variant === "live" && <LiveVariant steps={steps} theme={theme} />}
      {variant === "collapsed" && (
        <CollapsedVariant
          steps={steps}
          totalDuration={totalDuration}
          defaultOpen={defaultOpen}
          theme={theme}
        />
      )}
      {variant === "raw" && (
        <RawVariant rawContent={rawContent} rawLabel={rawLabel} theme={theme} />
      )}
    </div>
  );
}
