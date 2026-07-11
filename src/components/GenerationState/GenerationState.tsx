import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface GenerationStateProps {
  state: "streaming" | "skeleton" | "error";
  /** Partial text already streamed in (for the streaming state). */
  text?: string;
  /** Number of placeholder lines for the skeleton state. */
  lines?: number;
  errorMessage?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function GenerationState({
  state,
  text,
  lines = 3,
  errorMessage = "Generation failed. The model did not return a response.",
  retryLabel = "Retry",
  onRetry,
  className,
}: GenerationStateProps) {
  const theme = useHaloTheme();

  const keyframes = (
    <style>{`
      @keyframes halo-shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}
      @keyframes halo-caret{0%,49%{opacity:1}50%,100%{opacity:0}}
    `}</style>
  );

  if (state === "streaming") {
    return (
      <div className={cn("halo-generation-state", className)} style={{ fontFamily: theme.font.sans }}>
        {keyframes}
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: theme.colors.text }}>
          {text}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.05em",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              backgroundColor: theme.colors.text,
              animation: "halo-caret 1s step-end infinite",
            }}
          />
        </p>
      </div>
    );
  }

  if (state === "skeleton") {
    return (
      <div
        className={cn("halo-generation-state", className)}
        aria-busy="true"
        aria-label="Generating"
        style={{ display: "flex", flexDirection: "column", gap: "9px" }}
      >
        {keyframes}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "11px",
              width: i === lines - 1 ? "62%" : "100%",
              borderRadius: "4px",
              backgroundColor: theme.colors.surfaceRaised,
              backgroundImage: `linear-gradient(90deg, ${theme.colors.surfaceRaised} 0px, ${theme.colors.surface} 40px, ${theme.colors.surfaceRaised} 80px)`,
              backgroundSize: "200px 100%",
              animation: "halo-shimmer 1.3s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("halo-generation-state", className)}
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 13px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.error}33`,
        backgroundColor: `${theme.colors.error}0d`,
        fontFamily: theme.font.sans,
      }}
    >
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke={theme.colors.error} strokeWidth="1.5" />
        <path d="M8 5v3.5M8 11h.01" stroke={theme.colors.error} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: "13px", color: theme.colors.textSecondary, lineHeight: 1.5, flex: 1 }}>{errorMessage}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            flexShrink: 0,
            fontSize: "12.5px",
            fontWeight: 550,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            padding: "5px 12px",
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
