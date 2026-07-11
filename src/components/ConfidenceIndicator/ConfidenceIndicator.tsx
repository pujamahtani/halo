import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface ConfidenceDimension {
  label: string;
  score: number;
}

export interface ConfidenceIndicatorProps {
  variant?: "score" | "dimensions" | "disclaimer" | "inline";
  score?: number;
  explanation?: string;
  dimensions?: ConfidenceDimension[];
  disclaimer?: string;
  className?: string;
}

function getLevel(score: number) {
  if (score >= 0.75) return "high";
  if (score >= 0.45) return "medium";
  return "low";
}

function StatusIcon({ level, size = 14 }: { level: string; size?: number }) {
  if (level === "high") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M5 8.5l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (level === "medium") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5l6 11H2l6-11z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v3M8 11h.01" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ScoreVariant({
  score,
  explanation,
  theme,
}: {
  score: number;
  explanation?: string;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: theme.colors.text,
            fontFamily: theme.font.sans,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(score * 100)}%
        </span>
        <span
          style={{
            fontSize: "13px",
            color: theme.colors.textMuted,
            fontFamily: theme.font.sans,
          }}
        >
          confidence
        </span>
      </div>
      {explanation && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "13px",
            color: theme.colors.textMuted,
            lineHeight: 1.5,
            fontFamily: theme.font.sans,
          }}
        >
          {explanation}
        </p>
      )}
    </div>
  );
}

function DimensionsVariant({
  dimensions,
  theme,
}: {
  dimensions: ConfidenceDimension[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {dimensions.map((dim, i) => {
        const level = getLevel(dim.score);
        const barColor =
          level === "high"
            ? theme.colors.success
            : level === "medium"
            ? theme.colors.warning
            : theme.colors.error;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: theme.font.sans,
            }}
          >
            <StatusIcon level={level} />
            <span
              style={{
                fontSize: "12px",
                color: theme.colors.textSecondary,
                minWidth: "90px",
              }}
            >
              {dim.label}
            </span>
            <div
              style={{
                flex: 1,
                height: "4px",
                backgroundColor: theme.colors.surfaceRaised,
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(dim.score * 100)}%`,
                  height: "100%",
                  backgroundColor: barColor,
                  borderRadius: "2px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                minWidth: "28px",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(dim.score * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DisclaimerVariant({
  disclaimer,
  theme,
}: {
  disclaimer: string;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        padding: "10px 12px",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        fontFamily: theme.font.sans,
      }}
    >
      <svg
        width={14}
        height={14}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: "1px" }}
      >
        <circle cx="8" cy="8" r="7" stroke={theme.colors.textMuted} strokeWidth="1.5" />
        <path d="M8 5v3M8 10.5h.01" stroke={theme.colors.textMuted} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: "12px", color: theme.colors.textMuted, lineHeight: 1.5 }}>
        {disclaimer}
      </span>
    </div>
  );
}

function InlineVariant({
  score,
  theme,
}: {
  score: number;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "11px",
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surfaceRaised,
        color: theme.colors.textSecondary,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.font.sans,
        fontVariantNumeric: "tabular-nums",
        verticalAlign: "middle",
      }}
    >
      {Math.round(score * 100)}% confident
    </span>
  );
}

export function ConfidenceIndicator({
  variant = "score",
  score = 0,
  explanation,
  dimensions = [],
  disclaimer = "This response is generated by AI and may contain errors.",
  className,
}: ConfidenceIndicatorProps) {
  const theme = useHaloTheme();

  const Wrapper = variant === "inline" ? "span" : "div";

  return (
    <Wrapper className={cn("halo-confidence", className)}>
      {variant === "score" && (
        <ScoreVariant
          score={Math.max(0, Math.min(1, score))}
          explanation={explanation}
          theme={theme}
        />
      )}
      {variant === "dimensions" && (
        <DimensionsVariant dimensions={dimensions} theme={theme} />
      )}
      {variant === "disclaimer" && (
        <DisclaimerVariant disclaimer={disclaimer} theme={theme} />
      )}
      {variant === "inline" && (
        <InlineVariant score={Math.max(0, Math.min(1, score))} theme={theme} />
      )}
    </Wrapper>
  );
}
