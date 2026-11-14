"use client";

import { useMemo, useState } from "react";
import { StatusChip, VerifiedBadge } from "@/components/ui";
import { coverage, type Fuel, type LabTest, type WorldId } from "@/lib/lab";
import type { LabWorld } from "@/lib/views";

// Gaps map (F16): every FLEX droplet test as a dot on oxygen × pressure, the empty regions
// shaded red, and the real cabin atmospheres marked. Only data; no interpolation.

const W = 820, H = 500, M = { l: 56, r: 20, t: 20, b: 48 };
const PX: [number, number] = [20, 320];
const OY: [number, number] = [10, 45];
const x = (p: number) => M.l + ((p - PX[0]) / (PX[1] - PX[0])) * (W - M.l - M.r);
const y = (o: number) => H - M.b - ((o - OY[0]) / (OY[1] - OY[0])) * (H - M.t - M.b);
const CELL_P = 20, CELL_O = 2.5;

const WORLD_FILL: Record<WorldId, string> = { earth: "fill-earth", iss: "fill-iss", moon: "fill-moon", mars: "fill-mars" };
const END_TEXT = { extinction: "flame went out", disruption: "droplet broke apart", completion: "burned to the end" } as const;

type Dataset = { tests: LabTest[]; verified: boolean; source: { title: string; url: string } } | null;

export function GapsMap({ dataset, worlds }: { dataset: Dataset; worlds: LabWorld[] }) {
  const gravities = useMemo(
    () => [...new Map(worlds.map((w) => [w.gravityG, w])).values()].sort((a, b) => a.gravityG - b.gravityG),
    [worlds],
  );
  const [g, setG] = useState(0);
  const [fuel, setFuel] = useState<Fuel | "all">("all");
  const [picked, setPicked] = useState<LabTest | null>(null);
  const tests = (dataset?.tests ?? []).filter((t) => (fuel === "all" || t.fuel === fuel) && t.pKPa !== null && t.o2 !== null);
  const shown = g < 0.01 ? tests : [];

  const filled = new Set(shown.map((t) => `${Math.floor((t.pKPa! - PX[0]) / CELL_P)}:${Math.floor((t.o2! * 100 - OY[0]) / CELL_O)}`));
  const cells: { i: number; j: number }[] = [];
  for (let i = 0; i < (PX[1] - PX[0]) / CELL_P; i++) for (let j = 0; j < (OY[1] - OY[0]) / CELL_O; j++) if (!filled.has(`${i}:${j}`)) cells.push({ i, j });
  const untestedShare = Math.round((cells.length / (((PX[1] - PX[0]) / CELL_P) * ((OY[1] - OY[0]) / CELL_O))) * 100);

  const presets = useMemo(() => {
    // One marker per point: atmospheres with the same pressure and O₂ share a label.
    const byPoint = new Map<string, { a: LabWorld["atmospheres"][number]; world: LabWorld; names: string[] }>();
    for (const w of worlds)
      for (const a of w.atmospheres) {
        const key = `${a.pressureKPa}:${a.oxygenPercent}`;
        const name = a.name.replace(/ \(.*\)$/, "");
        const hit = byPoint.get(key);
        if (!hit) byPoint.set(key, { a, world: w, names: [name] });
        else if (!hit.names.includes(name)) hit.names.push(name);
      }
    return [...byPoint.values()];
  }, [worlds]);

  // What NASA should test next: real habitat atmospheres at their world's gravity with no test.
  const next = worlds.filter((w) => w.gravityG < 1).flatMap((w) =>
    w.atmospheres
      .map((a) => {
        const c = coverage({ world: w.id, gravityG: w.gravityG, o2: a.oxygenPercent, pressureKPa: a.pressureKPa, flow: 0, fuel: "heptane" }, dataset?.tests ?? []);
        const gap = [c.gravity, c.o2, c.pressure].filter((s) => s.state === "untested");
        return gap.length ? { w, a, why: gap[0].detail } : null;
      })
      .filter((v) => v !== null),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Gravity" className="flex flex-wrap gap-2">
          {gravities.map((w) => (
            <button
              key={w.id}
              role="tab"
              aria-selected={g === w.gravityG}
              onClick={() => setG(w.gravityG)}
              className={`h-10 rounded-full px-4 text-[14px] font-semibold transition-colors ${g === w.gravityG ? "bg-fg text-page" : "bg-raised text-fg hover:bg-line"}`}
            >
              {w.gravityG === 0 ? "Microgravity (ISS)" : `${w.name} · ${w.gravityG} g`}
            </button>
          ))}
        </div>
        <label className="ml-auto inline-flex items-center gap-2 text-[14px]">
          <span className="text-muted">Fuel</span>
          <select value={fuel} onChange={(e) => setFuel(e.target.value as Fuel | "all")} className="h-10 rounded-lg border border-line bg-raised px-3">
            <option value="all">All droplets</option>
            <option value="heptane">Heptane</option>
            <option value="methanol">Methanol</option>
          </select>
        </label>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <figcaption className="mb-4">
            <p className="text-[18px] font-semibold">
              {g < 0.01
                ? `NASA burned ${shown.length} droplets in microgravity, yet ${untestedShare} % of this map is still empty`
                : `No NASA droplet tests at ${g} g: the whole map is untested`}
            </p>
            <p className="mt-1 text-[14px] text-muted">Each dot is one FLEX test on the ISS. Red squares: no test in that region.</p>
          </figcaption>
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Scatter of tested conditions: pressure on the x axis, oxygen on the y axis">
              {cells.map(({ i, j }) => (
                <rect
                  key={`${i}:${j}`}
                  x={x(PX[0] + i * CELL_P)}
                  y={y(OY[0] + (j + 1) * CELL_O)}
                  width={x(PX[0] + CELL_P) - x(PX[0])}
                  height={y(OY[0]) - y(OY[0] + CELL_O)}
                  className="fill-untested opacity-[0.13]"
                />
              ))}
              {[50, 100, 150, 200, 250, 300].map((p) => (
                <g key={p}>
                  <line x1={x(p)} x2={x(p)} y1={M.t} y2={H - M.b} className="stroke-line" />
                  <text x={x(p)} y={H - M.b + 20} textAnchor="middle" className="fill-muted font-mono text-[12px]">
                    {p}
                  </text>
                </g>
              ))}
              {[15, 20, 25, 30, 35, 40].map((o) => (
                <g key={o}>
                  <line x1={M.l} x2={W - M.r} y1={y(o)} y2={y(o)} className="stroke-line" />
                  <text x={M.l - 10} y={y(o) + 4} textAnchor="end" className="fill-muted font-mono text-[12px]">
                    {o}
                  </text>
                </g>
              ))}
              <text x={(W + M.l) / 2} y={H - 8} textAnchor="middle" className="fill-muted text-[13px]">
                Pressure (kPa)
              </text>
              <text transform={`translate(16 ${(H - M.b) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted text-[13px]">
                Oxygen (% O₂)
              </text>

              {shown.map((t) => {
                const cx = x(t.pKPa!), cy = y(t.o2! * 100);
                const label = `FLEX-${t.test} · ${t.fuel} · ${(t.o2! * 100).toFixed(0)} % O₂ · ${t.pKPa!.toFixed(0)} kPa · ${END_TEXT[t.end]}`;
                return (
                  <g key={t.test} onClick={() => setPicked(t)} className="cursor-pointer">
                    <title>{label}</title>
                    {t.end === "extinction" && <circle cx={cx} cy={cy} r={4.5} className="fill-tested opacity-80" />}
                    {t.end === "completion" && <circle cx={cx} cy={cy} r={4.5} className="fill-none stroke-fg stroke-[1.5]" />}
                    {t.end === "disruption" && <rect x={cx - 4} y={cy - 4} width={8} height={8} transform={`rotate(45 ${cx} ${cy})`} className="fill-ember opacity-80" />}
                  </g>
                );
              })}

              {presets.map(({ a, world, names }) => (
                <g key={a.id}>
                  <line x1={x(a.pressureKPa) - 9} x2={x(a.pressureKPa) + 9} y1={y(a.oxygenPercent)} y2={y(a.oxygenPercent)} className="stroke-fg stroke-2" />
                  <line x1={x(a.pressureKPa)} x2={x(a.pressureKPa)} y1={y(a.oxygenPercent) - 9} y2={y(a.oxygenPercent) + 9} className="stroke-fg stroke-2" />
                  <circle cx={x(a.pressureKPa)} cy={y(a.oxygenPercent)} r={3} className={WORLD_FILL[world.id]} />
                  <text x={x(a.pressureKPa) + 12} y={y(a.oxygenPercent) - 8} className="fill-fg text-[12px] font-semibold">
                    {names.join(" · ")}
                  </text>
                </g>
              ))}
            </svg>
            {!dataset && <p className="absolute inset-0 grid place-items-center text-muted">No verified test data loaded yet.</p>}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
            <li className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full bg-tested" aria-hidden /> Flame went out</li>
            <li className="inline-flex items-center gap-2"><span className="size-2.5 rotate-45 bg-ember" aria-hidden /> Droplet broke apart</li>
            <li className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full border border-fg" aria-hidden /> Burned to the end</li>
            <li className="inline-flex items-center gap-2"><span className="size-2.5 bg-untested/40" aria-hidden /> Never tested</li>
            <li className="inline-flex items-center gap-2"><span className="font-mono text-fg">+</span> Real cabin air</li>
          </ul>
          {dataset && (
            <p className="mt-3 text-[12px] text-muted">
              Source:{" "}
              <a href={dataset.source.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                FLEX Table IX, NASA/TP—2015-216046
              </a>{" "}
              · <VerifiedBadge verified={dataset.verified} />
            </p>
          )}
        </figure>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-[17px] font-semibold">Selected test</h2>
            {picked ? (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
                <dt className="text-muted">Test</dt>
                <dd className="font-mono">FLEX-{String(picked.test).padStart(3, "0")}</dd>
                <dt className="text-muted">Fuel</dt>
                <dd className="capitalize">{picked.fuel}</dd>
                <dt className="text-muted">Oxygen</dt>
                <dd className="font-mono tabular">{(picked.o2! * 100).toFixed(0)} %</dd>
                <dt className="text-muted">Pressure</dt>
                <dd className="font-mono tabular">{picked.pKPa!.toFixed(1)} kPa</dd>
                <dt className="text-muted">Diluent</dt>
                <dd>{picked.co2 ? `CO₂ ${(picked.co2 * 100).toFixed(0)} %` : picked.he ? `He ${(picked.he * 100).toFixed(0)} %` : "Nitrogen"}</dd>
                <dt className="text-muted">K</dt>
                <dd className="font-mono tabular">{picked.k === null ? "–" : `${picked.k} mm²/s`}</dd>
                <dt className="text-muted">Outcome</dt>
                <dd>{END_TEXT[picked.end]}</dd>
                <dt className="text-muted">Source</dt>
                <dd>Table IX, p. {picked.page}</dd>
              </dl>
            ) : (
              <p className="mt-2 text-[14px] text-muted">Click a dot to see that test.</p>
            )}
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-[17px] font-semibold">What NASA should test next</h2>
            <p className="mt-1 text-[13px] text-muted">
              Real cabin atmospheres, at their world&apos;s gravity, that no verified test covers. Computed from the gaps; SI-written
              proposals appear after the next SI run.
            </p>
            <ul className="mt-4 space-y-3">
              {next.map(({ w, a, why }) => (
                <li key={w.id + a.id} className="rounded-lg bg-raised p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold">
                      {w.name} · {a.name.replace(/ \(.*\)$/, "")}
                    </p>
                    <StatusChip state="untested" label="Never tested" />
                  </div>
                  <p className="mt-1 font-mono text-[13px] text-muted tabular">
                    {w.gravityG === 0 ? "≈ 0" : w.gravityG} g · {a.oxygenPercent} % O₂ · {a.pressureKPa} kPa
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{why}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
