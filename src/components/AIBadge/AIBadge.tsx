import { Sparkles, type LucideIcon } from "lucide-react";
import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface AIBadgeProps {
  label?: string;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md";
  showIcon?: boolean;
  /** Icon to show. Defaults to a sparkle; pass a different one for
   *  non-AI states like human-verified content. */
  icon?: LucideIcon;
  processingTime?: number;
  className?: string;
}

export function AIBadge({
  label = "AI generated",
  variant = "filled",
  size = "md",
  showIcon = true,
  icon,
  processingTime,
  className,
}: AIBadgeProps) {
  const theme = useHaloTheme();
  const Icon = icon ?? Sparkles;

  const sizes = {
    sm: { fontSize: "11px", padding: "2px 7px", gap: "4px", iconSize: 12 },
    md: { fontSize: "12px", padding: "3px 9px", gap: "5px", iconSize: 14 },
  };

  const variants = {
    filled: {
      backgroundColor: theme.colors.surfaceRaised,
      color: theme.colors.textSecondary,
      border: `1px solid ${theme.colors.border}`,
    },
    outlined: {
      backgroundColor: "transparent",
      color: theme.colors.textSecondary,
      border: `1px solid ${theme.colors.border}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.colors.textMuted,
      border: "1px solid transparent",
    },
  };

  const s = sizes[size];
  const v = variants[variant];

  return (
    <span
      className={cn("halo-ai-badge", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        fontSize: s.fontSize,
        padding: s.padding,
        borderRadius: theme.radius.md,
        fontFamily: theme.font.sans,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...v,
      }}
    >
      {showIcon && <Icon size={s.iconSize} strokeWidth={2} style={{ flexShrink: 0 }} />}
      {label}
      {processingTime !== undefined && (
        <span
          style={{
            color: theme.colors.textMuted,
            fontWeight: 400,
            marginLeft: "2px",
          }}
        >
          in {processingTime.toFixed(1)}s
        </span>
      )}
    </span>
  );
}
