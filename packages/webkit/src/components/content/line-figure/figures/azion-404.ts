import {
  Cam,
  clamp,
  facing,
  fillet,
  fit,
  poly,
  prism,
  proj,
  rad,
  type Ring,
  ringAt,
  rings,
  rrect,
  seg,
  type Vec2,
  type Vec3
} from '../engine/iso'
import { extrusion, inset } from '../engine/mark'
import { spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const GLYPH: Vec2[] = [
  [18.2868, 0],
  [0.4909, 14.9821],
  [0, 17.561],
  [2.5639, 17.561],
  [16.349, 5.9614],
  [14.1271, 17.561],
  [17.4898, 17.561],
  [20.8537, 0]
]
const UNIT = 4
const GW = 20.8537
const GH = 17.561
const L = GW * UNIT
const HT = GH * UNIT
const IC = HT / 2
const T = 8
const H0 = 28
const GAP = 7
const LEAN = 5
const B = 1.8
const TH = -30
const SEAT = 0.4
const PL = L / 2 + 24
const PN = 30
const PB = 6
const FOOT_MARGIN = 3

const D: Vec2 = [Math.cos(rad(TH)), Math.sin(rad(TH))]
const N: Vec2 = [-D[1], D[0]]

const toPlane = ([x, y]: Vec2): Vec2 => [(x - GW / 2) * UNIT, (GH - y) * UNIT]
const OUT = fillet(GLYPH.map(toPlane), [2.6, 1.6, 0.8, 0.8, 1.4, 0.8, 0.8, 2.6], 4)
const IN = inset(OUT, B)
const FEET: Array<[number, number]> = [
  [toPlane(GLYPH[2])[0], toPlane(GLYPH[3])[0]],
  [toPlane(GLYPH[5])[0], toPlane(GLYPH[6])[0]]
]

const turn = (ring: Ring): Ring =>
  ring.map((q) => ({
    u: q.u * D[0] + q.v * N[0],
    v: q.u * D[1] + q.v * N[1],
    nu: q.nu * D[0] + q.nv * N[0],
    nv: q.nu * D[1] + q.nv * N[1]
  }))

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 1.75)
  const zf = Math.sqrt(1 - C.k * C.k)
  const V: Vec3 = [Math.sin(C.az) * zf, Math.cos(C.az) * zf, C.k]
  const side = N[0] * V[0] + N[1] * V[1] > 0 ? 1 : -1

  const at = (a: number, b: number, t: number, h: number, s: number, c: number): Vec3 => {
    const a2 = a * c - (b - IC) * s
    const b2 = IC + a * s + (b - IC) * c
    return [a2 * D[0] + t * N[0], a2 * D[1] + t * N[1], h + b2]
  }
  const corner = (u: number, v: number, z: number): Vec3 => [
    u * D[0] + v * N[0],
    u * D[1] + v * N[1],
    z
  ]

  const ext: Vec3[] = [
    corner(-PL, -PN, -PB),
    corner(PL, -PN, -PB),
    corner(-PL, PN, -PB),
    corner(PL, PN, -PB)
  ]
  for (const a of [-L / 2, L / 2])
    for (const b of [0, HT]) for (const t of [-T / 2, T / 2]) ext.push(at(a, b, t, H0, 0, 1))
  fit(C, ext, 200, 166)
  const P = proj(C)
  const W = (p: Vec3) => P(p[0], p[1], p[2])
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-PL, -PN, PL, PN, 12, 2.4)
  put(solid(g), prism(P, front, turn(pr), turn(pi), -PB, 0))
  for (const [a0, a1] of FEET) {
    const slot = turn(
      rrect(a0 - FOOT_MARGIN, -T / 2 - FOOT_MARGIN, a1 + FOOT_MARGIN, T / 2 + FOOT_MARGIN, 2, 4)
    )
    mk('path', { d: poly(ringAt(P, slot, 0)), class: 'nf lo' }, g)
  }

  const drops = mk('path', { class: 'nf dash' }, g)
  const body = mk('g', {}, g)
  const halo = mk('path', { class: 'halo hi' }, body)
  const fill = mk('path', { class: 'fo' }, body)
  const crease = mk('path', { class: 'nf lo' }, body)

  const sp = spring(H0, { eps: 0.02 })
  let drawn = Number.NaN

  function draw() {
    const h = sp.x
    if (h === drawn) return
    drawn = h
    const th = rad(LEAN) * clamp(h / H0, 0, 1.2)
    const s = Math.sin(th)
    const c = Math.cos(th)
    const near = OUT.map(([a, b]) => W(at(a, b, (side * T) / 2, h, s, c)))
    const far = OUT.map(([a, b]) => W(at(a, b, (-side * T) / 2, h, s, c)))
    const d = extrusion(near, far)
    halo.setAttribute('d', d)
    fill.setAttribute('d', d)
    crease.setAttribute('d', poly(IN.map(([a, b]) => W(at(a, b, (side * T) / 2, h, s, c)))))
    drops.setAttribute(
      'd',
      FEET.map(([a0, a1]) => {
        const p = at((a0 + a1) / 2, 0, 0, h, s, c)
        return seg(W(p), P(p[0], p[1], 0))
      }).join('')
    )
  }

  const loop = register(stage, (dt) => {
    const moving = stepS(sp, dt)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  const anchor = P(0, 0, IC)
  let reach = value
  let over: Vec2 | null = null

  function retarget() {
    if (!over) {
      sp.t = H0
      read.textContent = 'rest'
    } else {
      const u = Math.hypot(over[0] - anchor[0], over[1] - anchor[1]) / reach
      sp.t = GAP + (H0 - GAP) * clamp((u - SEAT) / (1 - SEAT), 0, 1)
      read.textContent = `404 · gap ${Math.round(sp.t)}`
    }
    loop.wake()
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        over = p
        retarget()
      },
      leave: () => {
        over = null
        retarget()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      reach = v
      if (over) retarget()
    },
    destroy: bag.dispose
  }
}

export const azion404: FigureDefinition = {
  id: 'azion-404',
  label: 'Page not found: the Azion mark hovers over its empty slot and never lands.',
  rest: 'rest',
  range: [70, 110, 160],
  tour: [[80, 120], [200, 120], [200, 160], null],
  mount
}
