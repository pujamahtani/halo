import { useState, type CSSProperties } from "react";
import { Copy, Check } from "lucide-react";
import { useHaloTheme } from "../theme/ThemeProvider";

export function CodeBlock({ code, inline = false }: { code: string; inline?: boolean }) {
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

  const icon = copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />;

  const copyButton = (extra: CSSProperties) => (
    <button
      type="button"
      className="halo-btn"
      onClick={copy}
      aria-label="Copy to clipboard"
      style={{
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
        ...extra,
      }}
    >
      {icon}
      {copied ? "Copied" : "Copy"}
    </button>
  );

  if (inline) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "100%",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
          padding: "5px 5px 5px 14px",
        }}
      >
        <code
          style={{
            fontSize: "13px",
            fontFamily: theme.font.mono,
            color: theme.colors.textSecondary,
            whiteSpace: "nowrap",
            overflowX: "auto",
          }}
        >
          {code}
        </code>
        {copyButton({ flexShrink: 0 })}
      </div>
    );
  }

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
      {copyButton({ position: "absolute", top: "8px", right: "8px" })}
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
