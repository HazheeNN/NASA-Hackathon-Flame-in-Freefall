"use client";

import { Fan, Flame, Gauge, Map as MapIcon, Maximize2, MessageSquareText, Minimize2, Orbit, Sigma, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlameCanvas } from "@/components/flame-canvas";
import { FormulaHow } from "@/components/formula-how";
import { ConfidenceMeter, EmptyState, MissionChip, RiskBadge, SourceLink, StatusChip, VerifiedBadge } from "@/components/ui";
import { burnTime, coverage, nearestTests, oxygenPartialPressure, type Fuel, type LabTest, type Setup, type WorldId } from "@/lib/lab";
import type { Formula } from "@/lib/schema";
import type { InsightCard, LabWorld } from "@/lib/views";

type Dataset = { tests: LabTest[]; source: { title: string; url: string; locator?: string }; verified: boolean; title: string } | null;

// Static class strings so Tailwind keeps them (DESIGN.md › Components › World card).
const WORLD_STYLE: Record<WorldId, { glow: string; ring: string; text: string; dot: string }> = {
  earth: { glow: "hover:shadow-[0_0_32px_-8px_var(--color-earth)]", ring: "ring-earth shadow-[0_0_32px_-8px_var(--color-earth)]", text: "text-earth", dot: "bg-earth" },
  iss: { glow: "hover:shadow-[0_0_32px_-8px_var(--color-iss)]", ring: "ring-iss shadow-[0_0_32px_-8px_var(--color-iss)]", text: "text-iss", dot: "bg-iss" },
  moon: { glow: "hover:shadow-[0_0_32px_-8px_var(--color-moon)]", ring: "ring-moon shadow-[0_0_32px_-8px_var(--color-moon)]", text: "text-moon", dot: "bg-moon" },
  mars: { glow: "hover:shadow-[0_0_32px_-8px_var(--color-mars)]", ring: "ring-mars shadow-[0_0_32px_-8px_var(--color-mars)]", text: "text-mars", dot: "bg-mars" },
};

const O2_RANGE: [number, number] = [10, 45];
const P_RANGE: [number, number] = [20, 320];
const FLOW_RANGE: [number, number] = [0, 40];
const DROPLET_MM = 2;

const gText = (g: number) => (g === 0 ? "≈ 0 g" : `${g} g`);
const num = (x: number, d = 0) => x.toFixed(d);

export function FlameLab({
  worlds,
  dataset,
  formulas,
  insights,
  sampleInsights,
  hiddenOnLive,
}: {
  worlds: LabWorld[];
  dataset: Dataset;
  formulas: Formula[];
  insights: InsightCard[];
  sampleInsights: boolean;
  hiddenOnLive: number;
}) {
  const start = worlds.find((w) => w.id === "iss") ?? worlds[0];
  const [worldId, setWorldId] = useState<WorldId>(start?.id ?? "iss");
  const world = worlds.find((w) => w.id === worldId) ?? start;
  const [atmosphereId, setAtmosphereId] = useState<string>(start?.atmospheres[0]?.id ?? "custom");
  const [o2, setO2] = useState(start?.atmospheres[0]?.oxygenPercent ?? 21);
  const [pressure, setPressure] = useState(start?.atmospheres[0]?.pressureKPa ?? 101.3);
  const [flow, setFlow] = useState(0);
  const fuels = useMemo(() => [...new Set((dataset?.tests ?? []).map((t) => t.fuel))].sort().reverse() as Fuel[], [dataset]);
  const [fuel, setFuel] = useState<Fuel>("heptane");
  const [fireOnly, setFireOnly] = useState(false);

  const chooseWorld = (id: WorldId) => {
    const w = worlds.find((x) => x.id === id);
    if (!w) return;
    setWorldId(id);
    // Bring the flame back into view so the change is visible.
    document.getElementById("flame-stage")?.scrollIntoView({ behavior: "smooth", block: "center" });
    const a = w.atmospheres[0];
    if (a) {
      setAtmosphereId(a.id);
      setO2(a.oxygenPercent);
      setPressure(a.pressureKPa);
    }
  };
  const chooseAtmosphere = (id: string) => {
    const a = world?.atmospheres.find((x) => x.id === id);
    setAtmosphereId(id);
    if (a) {
      setO2(a.oxygenPercent);
      setPressure(a.pressureKPa);
    }
  };

  const exitFireOnly = useCallback(() => setFireOnly(false), []);
  useEffect(() => {
    if (!fireOnly) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exitFireOnly();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fireOnly, exitFireOnly]);

  if (!world) return <EmptyState title="No verified worlds yet">The world data is waiting for a teammate to verify it.</EmptyState>;

  const setup: Setup = { world: world.id, gravityG: world.gravityG, o2, pressureKPa: pressure, flow, fuel };
  const tests = dataset?.tests ?? [];
  const cov = coverage(setup, tests);
  const near = nearestTests(setup, tests);
  const flameParams = { gravityG: world.gravityG, o2, pressureKPa: pressure, flow, soot: fuel === "heptane" ? 1 : 0.18 };
  const flameLabel = `Illustration of a ${fuel} droplet flame at ${gText(world.gravityG)}, ${num(o2)} % oxygen, ${num(pressure)} kPa`;
  const style = WORLD_STYLE[world.id];
  const pO2 = formulas.find((f) => f.id === "FX-01");
  const d2 = formulas.find((f) => f.id === "FX-02");
  const inRange = cov.gravity.state === "tested" && cov.o2.state === "tested" && cov.pressure.state === "tested";
  const worldInsights = insights.filter((i) => i.missions.some((m) => world.missions.includes(m))).slice(0, 3);

  return (
    <>
      {/* The selected world's real NASA photo, behind the whole page. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {worlds.map((w) => (
          <Image
            key={w.id}
            src={w.image.src}
            alt=""
            fill
            sizes="100vw"
            priority={w.id === world.id}
            className={`world-backdrop object-cover ${w.id === world.id ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="world-scrim absolute inset-0" />
      </div>

      <div className="space-y-12">
        <header className="max-w-3xl space-y-4">
          <p className="eyebrow inline-flex items-center gap-2">
            <Flame size={14} strokeWidth={1.75} aria-hidden className="text-ember" /> Flame Lab
          </p>
          <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">How does fire behave beyond Earth?</h1>
          <p className="text-[18px] leading-relaxed text-muted">
            Set the air, pick a world, and watch the flame change. Beside it: what NASA has actually measured for those conditions,
            in <span className="font-semibold text-tested">blue</span>, and what has never been tested, in{" "}
            <span className="font-semibold text-untested">red</span>.
          </p>
        </header>

        <section aria-label="Flame Lab" className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          {/* Flame first on phones. */}
          <div className="order-1 lg:order-2">
            <div id="flame-stage" className="relative scroll-mt-24 overflow-hidden rounded-xl border border-line bg-page/40">
              <FlameCanvas params={flameParams} label={flameLabel} className="aspect-square w-full sm:aspect-[4/3] xl:aspect-square" />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 pr-36">
                <div>
                  <p className={`text-[13px] font-semibold uppercase tracking-[0.12em] ${style.text}`}>{world.name}</p>
                  <p className="font-mono text-[14px] text-muted tabular">
                    {gText(world.gravityG)} · {num(o2)} % O₂ · {num(pressure, 1)} kPa{flow ? ` · ${flow} cm/s` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFireOnly(true)}
                className="absolute right-3 top-3 inline-flex h-10 items-center gap-2 rounded-full bg-page/70 px-3 text-[13px] font-semibold text-fg backdrop-brightness-75 transition-colors hover:bg-raised"
              >
                <Maximize2 size={16} strokeWidth={1.75} aria-hidden /> Fire only
              </button>
              <p className="absolute bottom-3 left-4 text-[12px] text-muted">
                Illustration: shape and colour follow NASA-documented trends; the numbers come from data.
              </p>
            </div>
          </div>

          <Controls
            className="order-2 lg:order-1"
            world={world}
            atmosphereId={atmosphereId}
            chooseAtmosphere={chooseAtmosphere}
            o2={o2}
            setO2={(v) => (setO2(v), setAtmosphereId("custom"))}
            pressure={pressure}
            setPressure={(v) => (setPressure(v), setAtmosphereId("custom"))}
            flow={flow}
            setFlow={setFlow}
            fuel={fuel}
            setFuel={setFuel}
            fuels={fuels}
            range={cov.range && world.gravityG < 0.01 ? cov.range : null}
          />

          <aside aria-label="What NASA has measured" className="order-3 space-y-4 lg:col-span-2 xl:col-span-1">
            <div className="rounded-xl border border-line bg-surface/90 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-semibold">What NASA has measured</h2>
                {dataset && <VerifiedBadge verified={dataset.verified} />}
              </div>
              <ul className="mt-4 divide-y divide-line">
                {(
                  [
                    ["Gravity", Orbit, cov.gravity],
                    ["Oxygen", Wind, cov.o2],
                    ["Pressure", Gauge, cov.pressure],
                    ["Airflow", Fan, cov.flow],
                  ] as const
                ).map(([name, Icon, s]) => (
                  <li key={name} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
                        <Icon size={18} strokeWidth={1.75} aria-hidden className="text-muted" /> {name}
                      </span>
                      <StatusChip state={s.state} label={s.label} />
                    </div>
                    <p className="mt-1 text-[14px] text-muted">{s.detail}</p>
                  </li>
                ))}
              </ul>
              {dataset && (
                <div className="mt-4 border-t border-line pt-3">
                  <SourceLink source={{ ...dataset.source, title: "FLEX Table IX, NASA/TP—2015-216046" }} />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-line bg-surface/90 p-5">
              <h2 className="text-[17px] font-semibold">Nearest NASA tests</h2>
              {!near ? (
                <p className="mt-2 text-[14px] text-muted">
                  <span className="font-semibold text-untested">None.</span> Every droplet test in our verified data was burned in
                  microgravity, so nothing here was measured at {gText(world.gravityG)}.
                </p>
              ) : near.count === 0 ? (
                <p className="mt-2 text-[14px] text-muted">
                  <span className="font-semibold text-untested">None close.</span> No FLEX {fuel} test within ±2 points of O₂ and
                  ±20 % of this pressure.
                </p>
              ) : (
                <>
                  <p className="mt-2 font-mono text-[32px] font-medium leading-none tabular">{near.count}</p>
                  <p className="mt-1 text-[14px] text-muted">
                    FLEX {fuel} droplets within ±2 points of O₂ and ±20 % of this pressure
                    {near.diluted ? ` (${near.diluted} with CO₂ or helium added)` : ""}.
                  </p>
                  <Outcomes ends={near.ends} />
                  {near.kMedian !== null && (
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
                      <div>
                        <dt className="text-muted">Burning rate K (median)</dt>
                        <dd className="font-mono tabular">{num(near.kMedian, 2)} mm²/s</dd>
                      </div>
                      {d2 && inRange && near.count >= 3 && (
                        <div>
                          <dt className="text-muted">A {DROPLET_MM} mm droplet lasts</dt>
                          <dd className="font-mono tabular">≈ {num(burnTime(DROPLET_MM, near.kMedian), 1)} s</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {d2 && inRange && near.kMedian !== null && near.count >= 3 && (
                    <FormulaHow
                      f={d2}
                      substituted={`t_burn = ${DROPLET_MM}² ÷ ${num(near.kMedian, 2)} ≈ ${num(burnTime(DROPLET_MM, near.kMedian), 1)} s`}
                    />
                  )}
                </>
              )}
            </div>

            {pO2 && (
              <div className="rounded-xl border border-line bg-surface/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[17px] font-semibold">Oxygen partial pressure</h2>
                  <VerifiedBadge verified={pO2.verified} />
                </div>
                <p className="mt-2 font-mono text-[32px] font-medium leading-none tabular">
                  {num(oxygenPartialPressure(pressure, o2), 1)} <span className="text-[16px] text-muted">kPa</span>
                </p>
                <p className="mt-1 text-[14px] text-muted">
                  Calculated from a NASA formula. ISS air is about {num(oxygenPartialPressure(101.3, 21), 1)} kPa.
                </p>
                <FormulaHow
                  f={pO2}
                  substituted={`pO₂ = ${num(pressure, 1)} kPa × ${num(o2 / 100, 3)} ≈ ${num(oxygenPartialPressure(pressure, o2), 1)} kPa`}
                />
              </div>
            )}
          </aside>
        </section>

        <section aria-labelledby="worlds-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Same fire, four worlds</p>
              <h2 id="worlds-title" className="text-[24px] font-bold">
                Choose a world
              </h2>
            </div>
            <p className="max-w-md text-[14px] text-muted">Each world sets the gravity and its cabin air. Click one to switch.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {worlds.map((w) => {
              const s = WORLD_STYLE[w.id];
              const selected = w.id === world.id;
              const a = w.atmospheres[0];
              return (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseWorld(w.id)}
                  className={`group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-line p-5 text-left transition-shadow duration-300 ${s.glow} ${
                    selected ? `ring-2 ${s.ring}` : ""
                  }`}
                >
                  <Image
                    src={w.image.card}
                    alt={w.image.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-page via-page/60 to-transparent" />
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${s.dot}`} aria-hidden />
                    <span className="text-[20px] font-bold">{w.name}</span>
                  </span>
                  <span className="mt-1 font-mono text-[14px] text-muted tabular">
                    {gText(w.gravityG)}
                    {a ? ` · ${num(a.oxygenPercent)} % O₂ · ${num(a.pressureKPa, 1)} kPa` : ""}
                  </span>
                  {selected && <span className={`mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] ${s.text}`}>Selected</span>}
                </button>
              );
            })}
          </div>
          <p className="text-[12px] text-muted">
            Background: {world.image.alt}.{" "}
            <a href={world.image.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Image: {world.image.credit}
            </a>
          </p>
        </section>

        <section aria-labelledby="insights-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Ranked by our SI</p>
              <h2 id="insights-title" className="text-[24px] font-bold">
                Top fire-safety insights for {world.name}
              </h2>
            </div>
            <Link href="/insights" className="text-[14px] font-semibold text-primary hover:text-primary-hover">
              All insights →
            </Link>
          </div>
          {sampleInsights && worldInsights.length > 0 && (
            <p className="text-[13px] text-unverified">Sample cards: layout preview, not real results. Real insights appear after the first SI run.</p>
          )}
          {world.missions.length === 0 ? (
            <EmptyState title="Earth is the reference">
              Insights are ranked for crewed missions. Pick the ISS, the Moon or Mars to see the ones that apply there.
            </EmptyState>
          ) : worldInsights.length === 0 ? (
            <EmptyState title="No insights for this world yet">They appear after the first SI run on verified findings.</EmptyState>
          ) : (
            <ol className="grid gap-4 md:grid-cols-3">
              {worldInsights.map((i) => (
                <li key={i.id} className="relative flex flex-col gap-3 rounded-xl border border-line bg-surface/90 p-5 transition-colors hover:bg-raised">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[13px] text-muted">#{i.rank}</span>
                    <RiskBadge risk={i.risk} />
                  </div>
                  <h3 className="font-semibold leading-snug">
                    <Link href={`/insights/${i.id}`} className="after:absolute after:inset-0">
                      {i.title}
                    </Link>
                  </h3>
                  <p className="text-[14px] text-muted">{i.answer}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {i.missions.map((m) => (
                      <MissionChip key={m} mission={m} />
                    ))}
                  </div>
                  <ConfidenceMeter c={i.confidence} compact />
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-label="Explore" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { href: "/gaps", Icon: MapIcon, title: "Gaps map", text: "Every NASA test as a dot, and the conditions nobody has burned anything in." },
            { href: "/ask", Icon: MessageSquareText, title: "Ask", text: "Questions planners ask, answered from cited NASA findings. Ctrl/⌘ K." },
            { href: "/formulas", Icon: Sigma, title: "Formulas", text: "Every NASA formula we use: what it is for, how we use it, its limits and its page." },
          ].map(({ href, Icon, title, text }) => (
            <Link key={href} href={href} className="group rounded-xl border border-line bg-surface/90 p-5 transition-colors hover:bg-raised">
              <Icon size={20} strokeWidth={1.75} aria-hidden className="text-primary" />
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-[14px] text-muted">{text}</p>
            </Link>
          ))}
        </section>

        {hiddenOnLive > 0 && (
          <p className="text-[13px] text-unverified">
            Preview build: {hiddenOnLive} unverified record{hiddenOnLive === 1 ? " is" : "s are"} shown here; the live site shows only
            verified data.
          </p>
        )}
      </div>

      {fireOnly && (
        <div role="dialog" aria-modal="true" aria-label="Fire only" className="fixed inset-0 z-50 bg-page">
          <Image src={world.image.src} alt="" fill sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-page/40" />
          <FlameCanvas params={flameParams} label={flameLabel} className="absolute inset-0 h-full w-full" />
          <button
            type="button"
            autoFocus
            onClick={exitFireOnly}
            className="absolute right-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-page/60 px-4 text-[13px] font-semibold text-fg opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <Minimize2 size={16} strokeWidth={1.75} aria-hidden /> Exit (Esc)
          </button>
        </div>
      )}
    </>
  );
}

function Outcomes({ ends }: { ends: { extinction: number; disruption: number; completion: number } }) {
  const total = ends.extinction + ends.disruption + ends.completion || 1;
  const parts = [
    { name: "Flame went out", n: ends.extinction, cls: "bg-tested" },
    { name: "Droplet broke apart", n: ends.disruption, cls: "bg-ember" },
    { name: "Burned to the end", n: ends.completion, cls: "bg-muted" },
  ];
  return (
    <div className="mt-4 space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-raised" aria-hidden>
        {parts.map((p) => (
          <div key={p.name} className={p.cls} style={{ width: `${(p.n / total) * 100}%` }} />
        ))}
      </div>
      <ul className="grid gap-1 text-[13px]">
        {parts.map((p) => (
          <li key={p.name} className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-muted">
              <span className={`size-2 rounded-full ${p.cls}`} aria-hidden /> {p.name}
            </span>
            <span className="font-mono tabular">{p.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Controls(props: {
  className: string;
  world: LabWorld;
  atmosphereId: string;
  chooseAtmosphere: (id: string) => void;
  o2: number;
  setO2: (v: number) => void;
  pressure: number;
  setPressure: (v: number) => void;
  flow: number;
  setFlow: (v: number) => void;
  fuel: Fuel;
  setFuel: (f: Fuel) => void;
  fuels: Fuel[];
  range: { o2: readonly [number, number]; pressureKPa: readonly [number, number] } | null;
}) {
  const { world, range } = props;
  return (
    <div className={`space-y-5 rounded-xl border border-line bg-surface/90 p-5 ${props.className}`}>
      <div>
        <label htmlFor="atmosphere" className="eyebrow">
          Cabin air on {world.name}
        </label>
        <select
          id="atmosphere"
          value={props.atmosphereId}
          onChange={(e) => props.chooseAtmosphere(e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-line bg-raised px-3 text-[15px]"
        >
          {world.atmospheres.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
          <option value="custom">Your own mix</option>
        </select>
        {props.atmosphereId !== "custom" && (
          <p className="mt-2 text-[13px] text-muted">{world.atmospheres.find((a) => a.id === props.atmosphereId)?.usedFor}</p>
        )}
      </div>

      <Slider
        id="o2"
        icon={<Wind size={16} strokeWidth={1.75} aria-hidden />}
        name="Oxygen"
        unit="% O₂"
        value={props.o2}
        onChange={props.setO2}
        min={O2_RANGE[0]}
        max={O2_RANGE[1]}
        step={0.5}
        tested={range?.o2 ?? null}
      />
      <Slider
        id="pressure"
        icon={<Gauge size={16} strokeWidth={1.75} aria-hidden />}
        name="Pressure"
        unit="kPa"
        value={props.pressure}
        onChange={props.setPressure}
        min={P_RANGE[0]}
        max={P_RANGE[1]}
        step={0.5}
        tested={range?.pressureKPa ?? null}
        digits={1}
      />
      <Slider
        id="flow"
        icon={<Fan size={16} strokeWidth={1.75} aria-hidden />}
        name="Airflow"
        unit="cm/s"
        value={props.flow}
        onChange={props.setFlow}
        min={FLOW_RANGE[0]}
        max={FLOW_RANGE[1]}
        step={1}
        tested={null}
      />

      <fieldset>
        <legend className="eyebrow">Fuel</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {props.fuels.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={props.fuel === f}
              onClick={() => props.setFuel(f)}
              className={`h-10 rounded-full px-4 text-[14px] font-semibold capitalize transition-colors ${
                props.fuel === f ? "bg-fg text-page" : "bg-raised text-fg hover:bg-line"
              }`}
            >
              {f} droplet
            </button>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted">
          <span className="font-semibold text-untested">Not yet:</span> solids such as fabric and acrylic (BASS, Saffire), gas jets (ACME).
          They appear once their data is verified.
        </p>
      </fieldset>
    </div>
  );
}

function Slider(p: {
  id: string;
  icon: React.ReactNode;
  name: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  tested: readonly [number, number] | null;
  digits?: number;
}) {
  const pct = (x: number) => ((Math.min(Math.max(x, p.min), p.max) - p.min) / (p.max - p.min)) * 100;
  const isTested = p.tested && p.value >= p.tested[0] && p.value <= p.tested[1];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={p.id} className="inline-flex items-center gap-2 text-[15px] font-semibold">
          {p.icon} {p.name}
        </label>
        <span className="font-mono text-[15px] tabular">
          {p.value.toFixed(p.digits ?? 0)} <span className="text-muted">{p.unit}</span>
        </span>
      </div>
      <div className="relative mt-3 h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-untested/45" aria-hidden />
        {p.tested && (
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-tested"
            style={{ left: `${pct(p.tested[0])}%`, width: `${pct(p.tested[1]) - pct(p.tested[0])}%` }}
            aria-hidden
          />
        )}
        <input
          id={p.id}
          type="range"
          min={p.min}
          max={p.max}
          step={p.step}
          value={p.value}
          onChange={(e) => p.onChange(Number(e.target.value))}
          aria-valuetext={`${p.value.toFixed(p.digits ?? 0)} ${p.unit}, ${isTested ? "inside the NASA-tested range" : "never tested"}`}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-page [&::-moz-range-thumb]:bg-fg [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-page [&::-webkit-slider-thumb]:bg-fg"
        />
      </div>
      <p className={`mt-1 text-[12px] ${isTested ? "text-tested" : "text-untested"}`}>
        {p.tested ? (isTested ? "Inside the NASA-tested range" : "Never tested at this value") : "No NASA test data for this control here"}
      </p>
    </div>
  );
}
