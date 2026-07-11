import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface AIBadgeProps {
  label?: string;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md";
  showIcon?: boolean;
  processingTime?: number;
  className?: string;
}

function SparkleIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AIBadge({
  label = "AI generated",
  variant = "filled",
  size = "md",
  showIcon = true,
  processingTime,
  className,
}: AIBadgeProps) {
  const theme = useHaloTheme();

  const sizes = {
    sm: { fontSize: "11px", padding: "2px 7px", gap: "4px", iconSize: 10 },
    md: { fontSize: "12px", padding: "3px 9px", gap: "5px", iconSize: 12 },
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
      {showIcon && <SparkleIcon size={s.iconSize} />}
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
