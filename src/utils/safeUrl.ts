// Guards href values against executable URL schemes (javascript:, data:,
// vbscript:, ...). Halo renders links that often come from AI output, which a
// prompt injection could poison, so a url with an unexpected scheme is
// dropped to "#". Relative, anchor, and protocol-relative links pass through.
const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];
// Whitespace and control chars (tab/newline/etc.) that browsers strip but
// attackers use to smuggle a scheme, e.g. "java\tscript:alert(1)".
const STRIP = /[\s\p{Cc}]/gu;

export function safeUrl(url?: string): string {
  if (!url) return "#";
  const cleaned = url.replace(STRIP, "");
  const scheme = cleaned.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    return ALLOWED_SCHEMES.includes(scheme[1].toLowerCase()) ? cleaned : "#";
  }
  // No explicit scheme: relative path, "#anchor", "/root", or "//host". Safe.
  return cleaned;
}
