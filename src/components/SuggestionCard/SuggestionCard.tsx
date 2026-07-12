import { useState } from "react";
import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface TextDiff {
  type: "unchanged" | "removed" | "added";
  text: string;
}

export interface SuggestionCardProps {
  variant?: "inline-diff" | "suggestion-list" | "diff-card";
  diffs?: TextDiff[];
  suggestions?: string[];
  selectedIndex?: number;
  toneOptions?: string[];
  currentTone?: string;
  before?: string;
  after?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
  onRegenerate?: (tone?: string) => void;
  onSelectSuggestion?: (index: number) => void;
  className?: string;
}

function InlineDiffVariant({
  diffs,
  showChanges,
  setShowChanges,
  onAccept,
  onDismiss,
  theme,
}: {
  diffs: TextDiff[];
  showChanges: boolean;
  setShowChanges: (v: boolean) => void;
  onAccept?: () => void;
  onDismiss?: () => void;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.font.sans,
      }}
    >
      <div style={{ fontSize: "14px", lineHeight: 1.7, color: theme.colors.text }}>
        {diffs.map((d, i) => {
          if (d.type === "unchanged") return <span key={i}>{d.text}</span>;
          if (!showChanges) {
            if (d.type === "removed") return null;
            return <span key={i}>{d.text}</span>;
          }
          if (d.type === "removed") {
            return (
              <span
                key={i}
                style={{
                  textDecoration: "line-through",
                  color: theme.colors.error,
                  backgroundColor: `${theme.colors.error}14`,
                  padding: "1px 2px",
                  borderRadius: "2px",
                }}
              >
                {d.text}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                color: theme.colors.success,
                backgroundColor: `${theme.colors.success}14`,
                padding: "1px 2px",
                borderRadius: "2px",
              }}
            >
              {d.text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "14px",
        }}
      >
        <button
          onClick={onAccept}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: theme.radius.md,
            border: "none",
            backgroundColor: theme.colors.text,
            color: theme.colors.background,
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8.5l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Accept
        </button>
        <button
          onClick={onDismiss}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: "transparent",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          Dismiss
        </button>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
            color: theme.colors.textMuted,
            marginLeft: "auto",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={showChanges}
            onChange={(e) => setShowChanges(e.target.checked)}
            style={{ accentColor: theme.colors.textSecondary }}
          />
          Show changes
        </label>
      </div>
    </div>
  );
}

function SuggestionListVariant({
  suggestions,
  selectedIndex,
  toneOptions,
  currentTone,
  onSelectSuggestion,
  onRegenerate,
  theme,
}: {
  suggestions: string[];
  selectedIndex: number;
  toneOptions?: string[];
  currentTone?: string;
  onSelectSuggestion?: (i: number) => void;
  onRegenerate?: (tone?: string) => void;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const [tone, setTone] = useState(currentTone || toneOptions?.[0] || "");

  return (
    <div style={{ fontFamily: theme.font.sans }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {suggestions.map((s, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={i}
              onClick={() => onSelectSuggestion?.(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 12px",
                borderRadius: theme.radius.md,
                fontSize: "13px",
                color: theme.colors.text,
                cursor: "pointer",
                border: `1px solid ${isSelected ? theme.colors.borderStrong : theme.colors.border}`,
                backgroundColor: isSelected ? theme.colors.surface : theme.colors.background,
                textAlign: "left",
                fontFamily: theme.font.sans,
                lineHeight: 1.4,
                transition: "border-color 0.15s, background-color 0.15s",
              }}
            >
              {isSelected && (
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M3 8.5l3.5 3.5 7-7" stroke={theme.colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {s}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "10px",
        }}
      >
        {toneOptions && toneOptions.length > 0 && (
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            style={{
              fontSize: "12px",
              padding: "5px 8px",
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.textSecondary,
              fontFamily: theme.font.sans,
              cursor: "pointer",
            }}
          >
            {toneOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => onRegenerate?.(tone)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: "transparent",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8a6 6 0 0110.2-4.3M14 2v4h-4M14 8a6 6 0 01-10.2 4.3M2 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Regenerate
        </button>
      </div>
    </div>
  );
}

function DiffCardVariant({
  before,
  after,
  theme,
}: {
  before: string;
  after: string;
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        fontFamily: theme.font.sans,
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: theme.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          Current
        </div>
        <div
          style={{
            fontSize: "13px",
            color: theme.colors.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {before}
        </div>
      </div>
      <div
        style={{
          padding: "12px 14px",
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.surface,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: theme.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}
        >
          Suggested
        </div>
        <div
          style={{
            fontSize: "13px",
            color: theme.colors.text,
            lineHeight: 1.6,
          }}
        >
          {after}
        </div>
      </div>
    </div>
  );
}

export function SuggestionCard({
  variant = "inline-diff",
  diffs = [],
  suggestions = [],
  selectedIndex = 0,
  toneOptions,
  currentTone,
  before = "",
  after = "",
  onAccept,
  onDismiss,
  onRegenerate,
  onSelectSuggestion,
  className,
}: SuggestionCardProps) {
  const theme = useHaloTheme();
  const [showChanges, setShowChanges] = useState(true);

  return (
    <div className={cn("halo-suggestion", className)}>
      {variant === "inline-diff" && (
        <InlineDiffVariant
          diffs={diffs}
          showChanges={showChanges}
          setShowChanges={setShowChanges}
          onAccept={onAccept}
          onDismiss={onDismiss}
          theme={theme}
        />
      )}
      {variant === "suggestion-list" && (
        <SuggestionListVariant
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          toneOptions={toneOptions}
          currentTone={currentTone}
          onSelectSuggestion={onSelectSuggestion}
          onRegenerate={onRegenerate}
          theme={theme}
        />
      )}
      {variant === "diff-card" && (
        <DiffCardVariant before={before} after={after} theme={theme} />
      )}
    </div>
  );
}
