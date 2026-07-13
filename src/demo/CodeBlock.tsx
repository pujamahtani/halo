import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import "./code.css";

/** Monochrome syntax — zinc only, no rainbow. Matches Linear / Vercel docs. */
const CODE_THEME: PrismTheme = {
  plain: { color: "#a1a1aa", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "cdata"], style: { color: "#52525b", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "#52525b" } },
    { types: ["keyword", "boolean", "tag"], style: { color: "#d4d4d8" } },
    { types: ["function", "class-name", "maybe-class-name"], style: { color: "#fafafa" } },
    { types: ["string", "char", "attr-value", "inserted"], style: { color: "#71717a" } },
    { types: ["attr-name", "property", "parameter", "variable"], style: { color: "#a1a1aa" } },
    { types: ["number", "constant", "builtin", "symbol"], style: { color: "#71717a" } },
  ],
};

const ICON = 13;
const STROKE = 1.75;

export function CodeBlock({ code, inline = false }: { code: string; inline?: boolean }) {
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
      <Highlight theme={CODE_THEME} code={code.trim()} language="tsx">
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
