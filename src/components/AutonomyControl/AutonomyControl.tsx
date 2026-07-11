import { useHaloTheme } from "../../theme/ThemeProvider";
import { cn } from "../../utils/cn";

export interface AutonomyLevel {
  id: string;
  label: string;
  /** One line describing what the agent may do at this level. */
  description: string;
}

export interface AutonomyControlProps {
  /** Ordered from least to most autonomous. Defaults to a 3-step scale. */
  levels?: AutonomyLevel[];
  /** Currently selected level id. */
  value: string;
  onChange?: (id: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_LEVELS: AutonomyLevel[] = [
  { id: "suggest", label: "Suggest", description: "The agent proposes actions but never runs them. You do everything." },
  { id: "approve", label: "Ask first", description: "The agent prepares each action and waits for your approval before acting." },
  { id: "auto", label: "Autonomous", description: "The agent acts on its own and reports back. You can undo afterward." },
];

export function AutonomyControl({
  levels = DEFAULT_LEVELS,
  value,
  onChange,
  label = "Agent autonomy",
  disabled = false,
  className,
}: AutonomyControlProps) {
  const theme = useHaloTheme();
  const activeIndex = Math.max(0, levels.findIndex((l) => l.id === value));
  const active = levels[activeIndex] ?? levels[0];

  return (
    <div
      className={cn("halo-autonomy-control", className)}
      style={{ fontFamily: theme.font.sans, opacity: disabled ? 0.6 : 1 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: theme.colors.textSecondary, letterSpacing: "0.01em" }}>
          {label}
        </span>
        <span style={{ fontSize: "11px", color: theme.colors.textMuted, fontVariantNumeric: "tabular-nums" }}>
          Level {activeIndex + 1} of {levels.length}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${levels.length}, 1fr)`,
          gap: "3px",
          padding: "3px",
          backgroundColor: theme.colors.surfaceRaised,
          borderRadius: theme.radius.md,
        }}
      >
        {levels.map((level, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={level.id}
              type="button"
              className="halo-btn"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => !disabled && onChange?.(level.id)}
              style={{
                fontSize: "12.5px",
                fontWeight: selected ? 600 : 500,
                color: selected ? theme.colors.text : theme.colors.textMuted,
                backgroundColor: selected ? theme.colors.background : "transparent",
                border: selected ? `1px solid ${theme.colors.border}` : "1px solid transparent",
                borderRadius: theme.radius.sm,
                padding: "6px 8px",
                cursor: disabled ? "default" : "pointer",
                fontFamily: theme.font.sans,
                boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                transition: "color 0.15s ease, background-color 0.15s ease",
              }}
            >
              {level.label}
            </button>
          );
        })}
      </div>

      <p style={{ margin: "9px 0 0", fontSize: "12.5px", color: theme.colors.textMuted, lineHeight: 1.5 }}>
        {active.description}
      </p>
    </div>
  );
}
