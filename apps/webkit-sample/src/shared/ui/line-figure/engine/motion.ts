import { clamp } from './iso'

let reduced = false
export const setReducedMotion = (on: boolean) => {
  reduced = on
}
export const reducedMotion = () => reduced

export type Spring = {
  x: number
  v: number
  t: number
  k: number
  c: number
  m: number
  eps: number
}
export type SpringOptions = { k?: number; c?: number; m?: number; eps?: number }

export function spring(x: number, o: SpringOptions = {}): Spring {
  return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 }
}

export function stepS(sp: Spring, dt: number): boolean {
  if (reduced) {
    sp.x = sp.t
    sp.v = 0
    return false
  }
  const n = Math.max(1, Math.ceil(dt * 240))
  const h = dt / n
  for (let i = 0; i < n; i++) {
    const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m
    sp.v += a * h
    sp.x += sp.v * h
  }
  if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
    sp.x = sp.t
    sp.v = 0
    return false
  }
  return true
}

export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const X = (u: number) => ((ax * u + bx) * u + cx) * u
  const Y = (u: number) => ((ay * u + by) * u + cy) * u
  const dX = (u: number) => (3 * ax * u + 2 * bx) * u + cx
  return (t) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let u = t
    for (let i = 0; i < 8; i++) {
      const e = X(u) - t
      if (Math.abs(e) < 1e-5) break
      const d = dX(u)
      if (Math.abs(d) < 1e-6) break
      u -= e / d
    }
    if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
      let lo = 0
      let hi = 1
      u = t
      for (let i = 0; i < 24; i++) {
        if (X(u) < t) lo = u
        else hi = u
        u = (lo + hi) / 2
      }
    }
    return Y(u)
  }
}

export const EASE_LIFT = bezier(0.32, 0.72, 0, 1)

export type Tween = { from: number; to: number; t0: number; dur: number }
export const tween = (v: number, dur = 700): Tween => ({ from: v, to: v, t0: -1e9, dur })
export const tval = (tw: Tween, now: number) => {
  const p = clamp((now - tw.t0) / tw.dur, 0, 1)
  return tw.from + (tw.to - tw.from) * (reduced ? 1 : EASE_LIFT(p))
}
export const tset = (tw: Tween, to: number, now: number, delay: number) => {
  if (tw.to === to) return
  tw.from = tval(tw, now)
  tw.to = to
  tw.t0 = now + delay
}
export const tdone = (tw: Tween, now: number) => reduced || now >= tw.t0 + tw.dur
