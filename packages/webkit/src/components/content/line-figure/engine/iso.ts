export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export type Sample = { u: number; v: number; nu: number; nv: number }
export type Ring = Sample[]

export type Camera = { az: number; k: number; S: number; ox: number; oy: number }
export type Projector = (x: number, y: number, z: number) => Vec2

export type PrismPaths = { sil: string; crease: string }

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const rad = (d: number) => (d * Math.PI) / 180
export const r2 = (n: number) => Math.round(n * 100) / 100

export const poly = (pts: readonly Vec2[]) =>
  'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L') + 'Z'
export const seg = (a: Vec2, b: Vec2) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`
export const open = (pts: readonly Vec2[]) =>
  pts.length < 2 ? '' : 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L')

export const Cam = (azDeg: number, k: number, S: number): Camera => ({
  az: rad(azDeg),
  k,
  S,
  ox: 0,
  oy: 0
})

export function proj(C: Camera): Projector {
  const c = Math.cos(C.az)
  const s = Math.sin(C.az)
  const zf = Math.sqrt(1 - C.k * C.k)
  return (x, y, z) => {
    const X = x * c - y * s
    const Y = x * s + y * c
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)]
  }
}

export function unproj(C: Camera, sx: number, sy: number, z: number): Vec2 {
  const c = Math.cos(C.az)
  const s = Math.sin(C.az)
  const zf = Math.sqrt(1 - C.k * C.k)
  const X = (sx - C.ox) / C.S
  const Y = ((sy - C.oy) / C.S + z * zf) / C.k
  return [X * c + Y * s, -X * s + Y * c]
}

export function fit(C: Camera, pts: readonly Vec3[], cx: number, cy: number) {
  C.ox = 0
  C.oy = 0
  const P = proj(C)
  let a = 1e9
  let b = -1e9
  let c = 1e9
  let d = -1e9
  for (const p of pts) {
    const q = P(p[0], p[1], p[2])
    a = Math.min(a, q[0])
    b = Math.max(b, q[0])
    c = Math.min(c, q[1])
    d = Math.max(d, q[1])
  }
  C.ox = cx - (a + b) / 2
  C.oy = cy - (c + d) / 2
}

export function rrect(u0: number, v0: number, u1: number, v1: number, r: number, n = 4): Ring {
  const rr = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2))
  const out: Ring = []
  const corners: Array<[number, number, number]> = [
    [u1 - rr, v1 - rr, 0],
    [u0 + rr, v1 - rr, 90],
    [u0 + rr, v0 + rr, 180],
    [u1 - rr, v0 + rr, 270]
  ]
  for (const [cu, cv, a0] of corners)
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n)
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      out.push({ u: cu + rr * ca, v: cv + rr * sa, nu: ca, nv: sa })
    }
  return out
}

export function circ(R: number, n = 96): Ring {
  const out: Ring = []
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    out.push({ u: R * ca, v: R * sa, nu: ca, nv: sa })
  }
  return out
}

export function hull(input: readonly Vec2[]): Vec2[] {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const x = (o: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: Vec2[] = []
  const up: Vec2[] = []
  for (const p of pts) {
    while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop()
    lo.push(p)
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop()
    up.push(p)
  }
  lo.pop()
  up.pop()
  return lo.concat(up)
}

export const ringAt = (P: Projector, ring: readonly Sample[], z: number): Vec2[] =>
  ring.map((q) => P(q.u, q.v, z))

export const facing = (C: Camera) => {
  const s = Math.sin(C.az)
  const c = Math.cos(C.az)
  return (q: Sample) => q.nu * s + q.nv * c >= -1e-6
}

export function run(ring: readonly Sample[], keep: (q: Sample) => boolean): Ring {
  const n = ring.length
  let s = -1
  for (let i = 0; i < n; i++)
    if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i
      break
    }
  if (s < 0) return keep(ring[0]) ? ring.slice() : []
  const out: Ring = []
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n])
  return out
}

export function prism(
  P: Projector,
  front: (q: Sample) => boolean,
  ring: readonly Sample[],
  inner: readonly Sample[] | null | undefined,
  z0: number,
  z1: number
): PrismPaths {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? open(ringAt(P, run(inner, front), z1)) : ''
  }
}

export const rings = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number,
  b: number
): [Ring, Ring] => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b))
]

export function fillet(pts: readonly Vec2[], rs: readonly number[], n = 4): Vec2[] {
  const m = pts.length
  const out: Vec2[] = []
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m]
    const p = pts[i]
    const b = pts[(i + 1) % m]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1])
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const t = Math.min(rs[i], la / 2, lb / 2)
    const p1: Vec2 = [p[0] + ((a[0] - p[0]) / la) * t, p[1] + ((a[1] - p[1]) / la) * t]
    const p2: Vec2 = [p[0] + ((b[0] - p[0]) / lb) * t, p[1] + ((b[1] - p[1]) / lb) * t]
    for (let k = 0; k <= n; k++) {
      const s = k / n
      const w = 1 - s
      out.push([
        w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0],
        w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]
      ])
    }
  }
  return out
}
