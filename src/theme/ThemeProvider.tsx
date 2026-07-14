import { createContext, useContext, useEffect, type ReactNode } from "react";

// Minimal interaction styles injected once at runtime, so consumers still
// import no stylesheet. Buttons tagged `halo-btn` get consistent hover/press
// feedback; keyboard focus keeps the browser's default focus ring.
const BASE_STYLE_ID = "halo-base-styles";
const BASE_CSS = `
.halo-btn{transition:opacity .15s ease, transform .08s ease, background-color .15s ease, border-color .15s ease, color .15s ease}
.halo-btn:hover{opacity:.85}
.halo-btn:active{transform:scale(0.98);opacity:.92}
.halo-btn:disabled{opacity:.5;cursor:default;transform:none}
.halo-btn-primary{transition:opacity .15s ease, transform .08s ease}
.halo-btn-primary:hover{opacity:.88}
.halo-btn-primary:active{transform:scale(0.98);opacity:.95}
.halo-btn-outline{transition:background-color .15s ease, border-color .15s ease, transform .08s ease}
.halo-btn-outline:active{transform:scale(0.98)}
.halo-btn-link{transition:color .15s ease}
.halo-btn-link:active{opacity:.75}
.halo-shimmer{
--halo-shimmer-base:currentColor;
--halo-shimmer-hi:currentColor;
background-image:linear-gradient(90deg,var(--halo-shimmer-base) 0%,var(--halo-shimmer-base) 35%,var(--halo-shimmer-hi) 50%,var(--halo-shimmer-base) 65%,var(--halo-shimmer-base) 100%);
background-size:200% 100%;
-webkit-background-clip:text;
background-clip:text;
color:transparent;
-webkit-text-fill-color:transparent;
animation:halo-shimmer-text 1.6s linear infinite;
}
@keyframes halo-shimmer-text{0%{background-position:100% 0}100%{background-position:-100% 0}}
@keyframes halo-pulse-soft{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion: reduce){
.halo-anim{animation:none !important}
.halo-btn,.halo-btn-primary,.halo-btn-outline,.halo-btn-link{transition:none}
.halo-shimmer{animation:none;background:none;-webkit-text-fill-color:var(--halo-shimmer-hi);color:var(--halo-shimmer-hi)}
}
`;

function useBaseStyles() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(BASE_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = BASE_STYLE_ID;
    el.textContent = BASE_CSS;
    document.head.appendChild(el);
  }, []);
}

export interface HaloTheme {
  colors: {
    text: string;
    textSecondary: string;
    textMuted: string;
    background: string;
    surface: string;
    surfaceRaised: string;
    border: string;
    borderStrong: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  font: {
    sans: string;
    mono: string;
  };
}

export const defaultTheme: HaloTheme = {
  colors: {
    text: "#09090b",
    textSecondary: "#52525b",
    textMuted: "#71717a",
    background: "#ffffff",
    surface: "#fafafa",
    surfaceRaised: "#f4f4f5",
    border: "#e4e4e7",
    borderStrong: "#d4d4d8",
    info: "#3b82f6",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  font: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, monospace",
  },
};

export const darkTheme: HaloTheme = {
  colors: {
    text: "#fafafa",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    background: "#09090b",
    surface: "#18181b",
    surfaceRaised: "#27272a",
    border: "#27272a",
    borderStrong: "#3f3f46",
    info: "#60a5fa",
    success: "#4ade80",
    warning: "#fbbf24",
    error: "#f87171",
  },
  radius: { ...defaultTheme.radius },
  font: { ...defaultTheme.font },
};

const ThemeContext = createContext<HaloTheme>(defaultTheme);

export function HaloProvider({
  theme,
  children,
}: {
  theme?: Partial<HaloTheme>;
  children: ReactNode;
}) {
  useBaseStyles();

  const merged: HaloTheme = {
    colors: { ...defaultTheme.colors, ...theme?.colors },
    radius: { ...defaultTheme.radius, ...theme?.radius },
    font: { ...defaultTheme.font, ...theme?.font },
  };

  return (
    <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>
  );
}

export function useHaloTheme() {
  return useContext(ThemeContext);
}
