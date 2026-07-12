import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";
import { safeUrl } from "../../utils/safeUrl";

export interface Source {
  title: string;
  url?: string;
  type?: "document" | "database" | "research" | "web" | "internal";
  domain?: string;
  relevance?: number;
  snippet?: string;
}

export interface SourceCitationProps {
  sources: Source[];
  variant?: "superscript" | "pill" | "panel";
  className?: string;
}

function TypeIcon({ type, color }: { type?: string; color: string }) {
  const iconPaths: Record<string, string> = {
    document: "M4 2h5.5L14 6.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zM9.5 2v5H14",
    database: "M2 5c0-1.7 2.7-3 6-3s6 1.3 6 3v6c0 1.7-2.7 3-6 3s-6-1.3-6-3V5zM2 8c0 1.7 2.7 3 6 3s6-1.3 6-3",
    research: "M3 3h10v10H3V3zM7 6h2M6 8h4M6 10h3",
    web: "M8 1a7 7 0 100 14A7 7 0 108 1zM1 8h14M8 1c2 2 3 4.5 3 7s-1 5-3 7M8 1c-2 2-3 4.5-3 7s1 5 3 7",
    internal: "M2 4h12M2 8h12M2 12h8",
  };

  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d={iconPaths[type || "document"]}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SuperscriptVariant({
  sources,
  theme,
}: {
  sources: Source[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <span style={{ display: "inline" }}>
      {sources.map((source, i) => (
        <a
          key={i}
          href={safeUrl(source.url)}
          target="_blank"
          rel="noopener noreferrer"
          title={source.title}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            fontSize: "10px",
            fontWeight: 500,
            borderRadius: "3px",
            backgroundColor: theme.colors.surfaceRaised,
            color: theme.colors.textSecondary,
            textDecoration: "none",
            verticalAlign: "super",
            margin: "0 1px",
            fontFamily: theme.font.sans,
            lineHeight: 1,
          }}
        >
          {i + 1}
        </a>
      ))}
    </span>
  );
}

function PillVariant({
  sources,
  theme,
}: {
  sources: Source[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surfaceRaised,
        color: theme.colors.textSecondary,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.font.sans,
        cursor: "pointer",
      }}
    >
      <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 2h5.5L14 6.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zM9.5 2v5H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {sources.length} source{sources.length !== 1 ? "s" : ""}
    </span>
  );
}

function PanelVariant({
  sources,
  theme,
}: {
  sources: Source[];
  theme: ReturnType<typeof useHaloTheme>;
}) {
  const typeLabels: Record<string, string> = {
    document: "PDF document",
    database: "Internal database",
    research: "Research paper",
    web: "Web page",
    internal: "Internal record",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {sources.map((source, i) => (
        <a
          key={i}
          href={safeUrl(source.url)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            padding: "10px 12px",
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: theme.font.sans,
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = theme.colors.borderStrong;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = theme.colors.border;
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: theme.radius.sm,
              backgroundColor: theme.colors.surfaceRaised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TypeIcon type={source.type} color={theme.colors.textMuted} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: theme.colors.text,
                lineHeight: 1.3,
              }}
            >
              {source.title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                marginTop: "2px",
              }}
            >
              {typeLabels[source.type || "document"] || "Document"}
              {source.domain && (
                <>
                  <span style={{ margin: "0 4px", opacity: 0.4 }}>|</span>
                  {source.domain}
                </>
              )}
            </div>
          </div>
          {source.relevance !== undefined && (
            <span
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {Math.round(source.relevance * 100)}%
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

export function SourceCitation({
  sources,
  variant = "panel",
  className,
}: SourceCitationProps) {
  const theme = useHaloTheme();
  const Wrapper = variant === "superscript" ? "span" : "div";

  return (
    <Wrapper className={cn("halo-source-citation", className)}>
      {variant === "superscript" && (
        <SuperscriptVariant sources={sources} theme={theme} />
      )}
      {variant === "pill" && <PillVariant sources={sources} theme={theme} />}
      {variant === "panel" && <PanelVariant sources={sources} theme={theme} />}
    </Wrapper>
  );
}
