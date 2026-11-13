// Numbers and units, one way everywhere (DESIGN.md › Typography). Thin space before units.
const THIN = " ";

export function withUnit(value: number, unit: string, digits = 2) {
  const n = Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.?0+$/, "");
  return `${n}${THIN}${unit}`;
}

export const gravity = (g: number) => withUnit(g, "g");
export const oxygen = (pct: number) => withUnit(pct, "% O₂", 1);
export const pressure = (kPa: number) => withUnit(kPa, "kPa", 1);
