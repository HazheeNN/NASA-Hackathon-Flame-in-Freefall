import { useId } from "react";

// The brand mark (DESIGN.md › Overview): a flame burning in microgravity is a dim blue
// sphere, not a yellow teardrop, because hot gas doesn't rise without gravity.
export function FlameMark({ size = 28, breathe = false }: { size?: number; breathe?: boolean }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={breathe ? "breathe" : undefined}>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-page)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--color-primary-soft)" stopOpacity="0.6" />
          <stop offset="78%" stopColor="var(--color-primary)" stopOpacity="0.95" />
          <stop offset="92%" stopColor="var(--color-primary-hover)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${id}-core)`} />
      <circle cx="32" cy="32" r="3" fill="var(--color-ember)" />
    </svg>
  );
}
