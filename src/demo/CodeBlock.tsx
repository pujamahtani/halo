import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import "./code.css";

const CODE_THEME_LIGHT: PrismTheme = {
  plain: { color: "#3f3f46", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "cdata"], style: { color: "#a1a1aa", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "#a1a1aa" } },
    { types: ["keyword", "boolean"], style: { color: "#7c3aed" } },
    { types: ["function", "class-name", "maybe-class-name", "tag"], style: { color: "#2563eb" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#059669" } },
    { types: ["attr-name", "property", "parameter", "variable"], style: { color: "#52525b" } },
    { types: ["number", "constant", "builtin", "symbol"], style: { color: "#d97706" } },
  ],
};

const CODE_THEME_DARK: PrismTheme = {
  plain: { color: "#d4d4d8", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "cdata"], style: { color: "#71717a", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "#71717a" } },
    { types: ["keyword", "boolean"], style: { color: "#c4b5fd" } },
    { types: ["function", "class-name", "maybe-class-name", "tag"], style: { color: "#93c5fd" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#6ee7b7" } },
    { types: ["attr-name", "property", "parameter", "variable"], style: { color: "#d4d4d8" } },
    { types: ["number", "constant", "builtin", "symbol"], style: { color: "#fcd34d" } },
  ],
};

const ICON = 13;
const STROKE = 1.75;

export function CodeBlock({ code, inline = false, dark = false }: { code: string; inline?: boolean; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const theme = dark ? CODE_THEME_DARK : CODE_THEME_LIGHT;

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
        /* silent */
      }
      document.body.removeChild(ta);
    }
  };

  if (inline) {
    return (
      <div className="code-inline">
        <code className="code-inline-text">{code}</code>
        <button type="button" className="code-copy-btn code-copy-btn--inline" onClick={copy} aria-label="Copy to clipboard">
          {copied ? <Check size={ICON} strokeWidth={STROKE} /> : <Copy size={ICON} strokeWidth={STROKE} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div className="code-block">
      <button type="button" className="code-copy-btn code-copy-btn--block" onClick={copy} aria-label="Copy to clipboard">
        {copied ? <Check size={ICON} strokeWidth={STROKE} /> : <Copy size={ICON} strokeWidth={STROKE} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <Highlight theme={theme} code={code.trim()} language="tsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="code-pre">
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
