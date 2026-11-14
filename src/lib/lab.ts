// Flame Lab logic (pure, used on the server and in the browser). Every number here comes from a
// dataset row or a NASA formula used inside its tested range; nothing is simulated.

export type WorldId = "earth" | "iss" | "moon" | "mars";
export type Fuel = "methanol" | "heptane";

export type LabTest = {
  test: number;
  fuel: Fuel;
  pKPa: number | null;
  o2: number | null; // mole fraction
  co2: number | null;
  he: number | null;
  k: number | null; // burning-rate constant, mm²/s
  end: "extinction" | "disruption" | "completion";
  page: number;
};

export type Setup = { world: WorldId; gravityG: number; o2: number; pressureKPa: number; flow: number; fuel: Fuel };

export type Status = { state: "tested" | "untested" | "neutral"; label: string; detail: string };

const KPA_PER_MMHG = 0.133322;
export const mmHgToKPa = (mmHg: number) => mmHg * KPA_PER_MMHG;

export function testedRange(tests: LabTest[], fuel: Fuel) {
  const rows = tests.filter((t) => t.fuel === fuel);
  const p = rows.map((t) => t.pKPa).filter((x): x is number => x !== null);
  const o = rows.map((t) => t.o2).filter((x): x is number => x !== null).map((x) => x * 100);
  if (!p.length || !o.length) return null;
  return { pressureKPa: [Math.min(...p), Math.max(...p)] as const, o2: [Math.min(...o), Math.max(...o)] as const, count: rows.length };
}

const inside = (x: number, [a, b]: readonly [number, number]) => x >= a - 1e-9 && x <= b + 1e-9;
const fmt = (x: number, d = 0) => x.toFixed(d);

// What NASA has measured for this setup. FLEX droplets were all burned in microgravity on the ISS.
export function coverage(setup: Setup, tests: LabTest[]) {
  const range = testedRange(tests, setup.fuel);
  const zeroG = setup.gravityG < 0.01;
  const g = fmt(setup.gravityG, setup.gravityG < 0.2 ? 3 : 2);
  const gravity: Status = !range
    ? { state: "untested", label: "No verified data", detail: "No verified droplet tests are loaded yet." }
    : zeroG
      ? { state: "tested", label: "Tested", detail: `FLEX burned ${range.count} ${setup.fuel} droplets in microgravity on the ISS.` }
      : { state: "untested", label: "Never tested", detail: `No NASA droplet tests at ${g} g in our verified data.` };
  const dim = (x: number, r: readonly [number, number] | undefined, unit: string, d: number): Status => {
    if (!range || !r) return { state: "untested", label: "No verified data", detail: "Nothing verified to compare with." };
    const span = `${fmt(r[0], d)}–${fmt(r[1], d)} ${unit}`;
    if (!zeroG) return { state: "untested", label: "Never tested here", detail: `Tested only in microgravity (${span}).` };
    return inside(x, r)
      ? { state: "tested", label: "Tested", detail: `Inside the FLEX range, ${span}.` }
      : { state: "untested", label: "Beyond the tests", detail: `Outside the FLEX range, ${span}.` };
  };
  const flow: Status =
    setup.flow === 0
      ? { state: "neutral", label: "Still air", detail: "FLEX Table IX lists no forced airflow." }
      : { state: "untested", label: "Not in this dataset", detail: "FLEX Table IX has no airflow column; flow data comes from solid-fuel experiments once verified." };
  return {
    gravity,
    o2: dim(setup.o2, range?.o2, "% O₂", 0),
    pressure: dim(setup.pressureKPa, range?.pressureKPa, "kPa", 0),
    flow,
    range,
  };
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
};

// FLEX tests close to this setup: same fuel, O₂ within ±2 points, pressure within ±20 %.
export function nearestTests(setup: Setup, tests: LabTest[]) {
  if (setup.gravityG >= 0.01) return null;
  const rows = tests.filter(
    (t) =>
      t.fuel === setup.fuel &&
      t.o2 !== null &&
      Math.abs(t.o2 * 100 - setup.o2) <= 2 &&
      t.pKPa !== null &&
      Math.abs(t.pKPa - setup.pressureKPa) <= setup.pressureKPa * 0.2,
  );
  const ends = { extinction: 0, disruption: 0, completion: 0 };
  for (const r of rows) ends[r.end]++;
  const k = median(rows.map((r) => r.k).filter((x): x is number => x !== null));
  const diluted = rows.filter((r) => (r.co2 ?? 0) > 0 || (r.he ?? 0) > 0).length;
  return { count: rows.length, ends, kMedian: k, diluted, examples: rows.slice(0, 4) };
}

// FX-01: oxygen partial pressure.
export const oxygenPartialPressure = (pressureKPa: number, o2Percent: number) => (pressureKPa * o2Percent) / 100;

// FX-02: d² law, burn time = d0² / K. Only called with a K measured inside the tested range.
export const burnTime = (d0Mm: number, kMm2PerS: number) => (d0Mm * d0Mm) / kMm2PerS;
