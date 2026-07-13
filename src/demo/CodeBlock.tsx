import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useHaloTheme } from "../theme/ThemeProvider";

// One muted, near-monochrome syntax theme, used on a dark panel in both light
// and dark site modes (the Vercel / Linear / shadcn convention). Restrained
// pastels, not rainbow.
const CODE_THEME: PrismTheme = {
  plain: { color: "#e4e4e7", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "cdata"], style: { color: "#6b7280", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#8b8b93" } },
    { types: ["keyword", "operator", "boolean", "rule"], style: { color: "#c4b5fd" } },
    { types: ["function", "class-name", "tag", "maybe-class-name"], style: { color: "#93c5fd" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#a3d9a5" } },
    { types: ["attr-name", "property", "parameter"], style: { color: "#f0a5a5" } },
    { types: ["number", "constant", "builtin", "symbol"], style: { color: "#f0b880" } },
  ],
};

const PANEL_BG = "#101014";
const PANEL_BORDER = "rgba(255,255,255,0.08)";

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

  // Inline install command: a light pill that matches the page chrome.
  if (inline) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          maxWidth: "100%",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
          padding: "6px 6px 6px 14px",
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
        <button
          type="button"
          className="halo-btn"
          onClick={copy}
          aria-label="Copy to clipboard"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 500,
            color: copied ? theme.colors.success : theme.colors.textMuted,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            padding: "5px 9px",
            cursor: "pointer",
            fontFamily: theme.font.sans,
          }}
        >
          {copied ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={2} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  // Block: dark code panel with a subtle ghost copy button.
  return (
    <div
      style={{
        position: "relative",
        border: `1px solid ${PANEL_BORDER}`,
        borderRadius: theme.radius.lg,
        backgroundColor: PANEL_BG,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        className="halo-btn"
        onClick={copy}
        aria-label="Copy to clipboard"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 500,
          color: copied ? "#86efac" : "#a1a1aa",
          backgroundColor: "#1c1c22",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: theme.radius.sm,
          padding: "5px 9px",
          cursor: "pointer",
          fontFamily: theme.font.sans,
        }}
      >
        {copied ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={2} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <Highlight theme={CODE_THEME} code={code.trim()} language="tsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              margin: 0,
              padding: "16px 18px",
              overflowX: "auto",
              fontSize: "13px",
              lineHeight: 1.7,
              fontFamily: theme.font.mono,
              backgroundColor: "transparent",
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
