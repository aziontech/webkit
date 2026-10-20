import { poly, type Ring, type Vec2 } from './iso'

const area = (pts: readonly Vec2[]) => {
  let s = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}

const wound = (pts: readonly Vec2[]): Vec2[] =>
  area(pts) < 0 ? pts.slice().reverse() : pts.slice()

export function inset(pts: readonly Vec2[], d: number, limit = 3): Vec2[] {
  const p = wound(pts)
  const n = p.length
  const normal = (a: Vec2, b: Vec2): Vec2 => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    return [-dy / l, dx / l]
  }
  return p.map((q, i) => {
    const n1 = normal(p[(i + n - 1) % n], q)
    const n2 = normal(q, p[(i + 1) % n])
    const k = Math.min(limit, 1 / Math.max(0.2, 1 + n1[0] * n2[0] + n1[1] * n2[1]))
    return [q[0] + d * k * (n1[0] + n2[0]), q[1] + d * k * (n1[1] + n2[1])]
  })
}

export function extrusion(near: readonly Vec2[], far: readonly Vec2[]): string {
  const n = near.length
  const parts = [poly(wound(far)), poly(wound(near))]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    parts.push(poly(wound([far[i], far[j], near[j], near[i]])))
  }
  return parts.join('')
}

export const shift = (ring: Ring, du: number, dv: number): Ring =>
  ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }))

export const rotate = (ring: Ring, a: number): Ring => {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return ring.map((q) => ({
    u: q.u * c - q.v * s,
    v: q.u * s + q.v * c,
    nu: q.nu * c - q.nv * s,
    nv: q.nu * s + q.nv * c
  }))
}
