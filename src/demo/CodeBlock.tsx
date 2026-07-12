import { useState } from "react";
import { useHaloTheme } from "../theme/ThemeProvider";

export function CodeBlock({ code }: { code: string }) {
  const theme = useHaloTheme();
  const [copied, setCopied] = useState(false);

  const flash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      flash();
      return;
    } catch {
      // Fallback for non-secure contexts / older browsers.
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        flash();
      } catch {
        /* give up silently */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        className="halo-btn"
        onClick={copy}
        aria-label="Copy code"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          fontWeight: 500,
          color: copied ? theme.colors.success : theme.colors.textMuted,
          backgroundColor: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.sm,
          padding: "4px 8px",
          cursor: "pointer",
          fontFamily: theme.font.sans,
        }}
      >
        {copied ? (
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 5.5V4A1.5 1.5 0 009 2.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        style={{
          margin: 0,
          padding: "16px 18px",
          overflowX: "auto",
          fontSize: "12.5px",
          lineHeight: 1.65,
          fontFamily: theme.font.mono,
          color: theme.colors.textSecondary,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
