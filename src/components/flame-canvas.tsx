"use client";

import { useEffect, useRef, useState } from "react";

// The Flame Lab's flame: a WebGL2 raymarched diffusion flame around a fuel droplet.
// ILLUSTRATION (DESIGN.md › Don'ts): its shape and colour follow trends NASA documented
// (spherical, dim and blue in microgravity; a flickering sooty teardrop under gravity; larger
// and brighter with more oxygen). It computes no numbers; the numbers on the page come from data.

export type FlameParams = {
  gravityG: number; // 0 … 1
  o2: number; // % O₂
  pressureKPa: number;
  flow: number; // cm/s, from the left
  soot: number; // 0 (methanol, almost no soot) … 1 (heptane)
};

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime, uG, uO2, uP, uFlow, uSoot;
out vec4 outColor;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s;
}

// Flame frame: droplet at the origin.
float buoy, o2n, pn, flowN, R;

vec3 shapeSpace(vec3 q) {
  // Airflow from the left pushes the flame downstream.
  q.x -= flowN * 0.32 * smoothstep(0.0, 0.7, length(q));
  float h = q.y;
  float up = max(h, 0.0);
  float taper = 1.0 + buoy * 2.4 * up;
  // Under gravity the flame stretches up into a teardrop and hugs the droplet below.
  float hs = h < 0.0 ? h * (1.0 + 1.8 * buoy) : h / (1.0 + buoy * 2.1);
  vec3 s = vec3(q.x * taper, hs, q.z * taper);
  s.x *= s.x < 0.0 ? 1.0 + flowN * 1.3 : 1.0 / (1.0 + flowN * 0.9);
  return s;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  buoy = sqrt(clamp(uG, 0.0, 1.0));
  o2n = clamp((uO2 - 12.0) / 28.0, 0.0, 1.0);
  pn = clamp((uP - 30.0) / 170.0, 0.0, 1.0);
  flowN = clamp(uFlow / 40.0, 0.0, 1.0);
  R = 0.22 + 0.16 * o2n + 0.04 * pn;

  float lift = 0.32 * buoy;           // the droplet sits lower when the flame rises
  vec3 ro = vec3(0.0, 0.0, -2.4);
  vec3 rd = normalize(vec3(uv * 1.15, 1.6));
  float t = uTime * (0.35 + 2.6 * buoy);

  // Bounding sphere.
  vec3 c = vec3(0.0, lift * 0.6, 0.0);
  float b = dot(ro - c, rd), cc = dot(ro - c, ro - c) - 1.25;
  float disc = b * b - cc;
  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // Droplet: a small dark sphere lit by its own flame.
  vec3 dc = vec3(0.0, -lift, 0.0);
  float dr = 0.045;
  float db = dot(ro - dc, rd), dcc = dot(ro - dc, ro - dc) - dr * dr;
  float ddisc = db * db - dcc;
  float tDrop = ddisc > 0.0 ? -db - sqrt(ddisc) : 1e9;

  float bright = mix(0.55, 1.15, buoy) * (0.45 + 1.0 * o2n) * (0.85 + 0.3 * pn);

  if (disc > 0.0) {
    float t0 = max(-b - sqrt(disc), 0.0), t1 = min(-b + sqrt(disc), tDrop);
    const int STEPS = 64;
    float dt = (t1 - t0) / float(STEPS);
    for (int i = 0; i < STEPS; i++) {
      float tt = t0 + (float(i) + 0.5) * dt;
      vec3 p = ro + rd * tt;
      vec3 q = p - dc;
      vec3 s = shapeSpace(q);
      float h = q.y;
      float n = fbm(q * 3.4 + vec3(0.0, -t, 0.0)) - 0.5;
      float wob = 0.02 + 0.2 * buoy * smoothstep(-0.05, 0.55, h) + 0.04 * flowN;
      float d = length(s) - R + n * wob * 2.0;
      float w = 0.02 + 0.026 * buoy + 0.008 * pn;
      float shell = exp(-(d * d) / (w * w));
      float inner = smoothstep(R, 0.0, length(s));

      // Blue chemiluminescent zone: everywhere in microgravity, only at the base under gravity.
      float blueW = mix(1.0, smoothstep(0.18, -0.25, h), buoy);
      // Yellow soot glow: strong under gravity for a sooty fuel, faint in microgravity.
      float sootW = uSoot * (buoy * (0.6 + 0.6 * pn) * smoothstep(-0.15, 0.45, h) + (1.0 - buoy) * 0.22 * o2n);
      float sootCore = uSoot * buoy * inner * smoothstep(0.02, 0.5, h) * 0.42 * (0.8 + 0.6 * n);

      vec3 blue = vec3(0.22, 0.45, 1.0);
      vec3 soot = mix(vec3(1.0, 0.26, 0.03), vec3(1.0, 0.68, 0.24), clamp(0.25 + h * 0.9, 0.0, 1.0));
      vec3 e = (blue * blueW * mix(0.9, 0.55, buoy) + soot * sootW * 1.3) * shell + soot * sootCore;
      float dens = shell * (0.5 + sootW) + sootCore;
      col += e * bright * dt * 7.0 * (1.0 - alpha);
      alpha += dens * dt * 2.2 * (1.0 - alpha);
    }
  }

  if (tDrop < 1e8) {
    vec3 hp = ro + rd * tDrop;
    vec3 nrm = normalize(hp - dc);
    float rim = pow(1.0 - max(dot(-rd, nrm), 0.0), 2.0);
    vec3 lit = mix(vec3(0.25, 0.45, 1.0), vec3(1.0, 0.7, 0.35), uSoot * buoy);
    col = col + (vec3(0.02) + lit * rim * 0.6) * (1.0 - alpha);
    alpha = max(alpha, 0.96);
  }

  // Soft halo so the flame lights the scene a little.
  vec2 hc = uv - vec2(0.0, -lift * 0.35 + 0.25 * buoy);
  float halo = exp(-dot(hc, hc) * (14.0 - 6.0 * buoy)) * 0.18 * bright;
  vec3 haloCol = mix(vec3(0.25, 0.45, 1.0), vec3(1.0, 0.6, 0.25), uSoot * buoy);
  col += haloCol * halo;
  alpha = clamp(alpha + halo * 0.8, 0.0, 1.0);

  col = 1.0 - exp(-col * 1.25);  // gentle tone map, keeps the soot orange instead of white
  outColor = vec4(col, alpha);   // premultiplied
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
  return s;
}

export function FlameCanvas({ params, className = "", label }: { params: FlameParams; className?: string; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(params);
  const redraw = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    live.current = params;
    redraw.current();
  }, [params]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
    } catch {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const [uRes, uTime, uG, uO2, uP, uFlow, uSoot] = ["uRes", "uTime", "uG", "uO2", "uP", "uFlow", "uSoot"].map(u);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const size = () => {
      const r = el.getBoundingClientRect();
      // Cap the pixel count so the raymarch stays smooth on laptops and projectors.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const scale = Math.min(1, Math.sqrt(900_000 / Math.max(1, r.width * r.height * dpr * dpr)));
      el.width = Math.max(1, Math.round(r.width * dpr * scale));
      el.height = Math.max(1, Math.round(r.height * dpr * scale));
      gl.viewport(0, 0, el.width, el.height);
    };
    const draw = (now: number) => {
      const p = live.current;
      gl.uniform2f(uRes, el.width, el.height);
      gl.uniform1f(uTime, reduced ? 0 : (now - start) / 1000);
      gl.uniform1f(uG, p.gravityG);
      gl.uniform1f(uO2, p.o2);
      gl.uniform1f(uP, p.pressureKPa);
      gl.uniform1f(uFlow, p.flow);
      gl.uniform1f(uSoot, p.soot);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    };
    redraw.current = () => {
      if (reduced || !visible) draw(performance.now());
    };

    size();
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      redraw.current = () => {};
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (failed) {
    // Still fallback when WebGL2 is missing: a soft sphere in the flame colours.
    return (
      <div role="img" aria-label={label} className={`flex items-center justify-center ${className}`}>
        <div className="size-40 rounded-full bg-[radial-gradient(circle,transparent_45%,var(--color-tested)_62%,transparent_72%)] opacity-80" />
      </div>
    );
  }
  return <canvas ref={canvas} role="img" aria-label={label} className={className} />;
}
