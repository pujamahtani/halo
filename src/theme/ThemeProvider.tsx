import { createContext, useContext, type ReactNode } from "react";

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
    text: "#0a0a0a",
    textSecondary: "#525252",
    textMuted: "#737373",
    background: "#ffffff",
    surface: "#fafafa",
    surfaceRaised: "#f5f5f5",
    border: "#e5e5e5",
    borderStrong: "#d4d4d4",
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
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, 'SF Mono', monospace",
  },
};

const ThemeContext = createContext<HaloTheme>(defaultTheme);

export function HaloProvider({
  theme,
  children,
}: {
  theme?: Partial<HaloTheme>;
  children: ReactNode;
}) {
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
