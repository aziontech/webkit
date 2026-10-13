import {
  Cam,
  circ,
  facing,
  fit,
  prism,
  proj,
  rad,
  rings,
  seg,
  unproj,
  type Vec3
} from '../engine/iso'
import { rotate } from '../engine/mark'
import { spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const W = 52
const D = 52
const H = 5
const R_DISC = 15
const R_OUT = 34
const HALF = 6
const OUTLETS = [0, 90, 180, 270].map(rad)
const REST_IDX = 1
const LIFT = 3

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const [AO, AI] = rings(-4, -3, 25, 3, 1.8, 0.9)
const DISC = circ(R_DISC, 40)
const DISC_IN = circ(R_DISC - 1.4, 40)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.2)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 10])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  const spokes = OUTLETS.map((a) =>
    seg(
      P(R_DISC * Math.cos(a), R_DISC * Math.sin(a), 0),
      P((R_OUT - HALF) * Math.cos(a), (R_OUT - HALF) * Math.sin(a), 0)
    )
  )
  mk('path', { class: 'nf dash', d: spokes.join('') }, g)
  put(solid(g), prism(P, front, DISC, DISC_IN, 0, 4))
  const outlets = OUTLETS.map(() => solid(g))
  const arm = solid(g)
  const lifts = OUTLETS.map(() => spring(0, { eps: 0.02 }))
  const angle = spring(OUTLETS[REST_IDX], { eps: 0.001 })

  let pull = rad(value)
  let hover = false

  function draw() {
    OUTLETS.forEach((a, i) => {
      const u = R_OUT * Math.cos(a)
      const v = R_OUT * Math.sin(a)
      const [o, n] = rings(u - HALF, v - HALF, u + HALF, v + HALF, 1.6, 0.9)
      put(outlets[i], prism(P, front, o, n, 0, 3 + lifts[i].x))
    })
    put(arm, prism(P, front, rotate(AO, angle.x), rotate(AI, angle.x), 4, 7))
  }

  const loop = register(stage, (dt) => {
    const moving = [angle, ...lifts].map((s) => stepS(s, dt)).some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function aim(raw: number) {
    let best = 0
    let bd = Infinity
    OUTLETS.forEach((a, i) => {
      const d = Math.abs(wrap(raw - a))
      if (d < bd) {
        bd = d
        best = i
      }
    })
    angle.t = angle.x + wrap((bd < pull ? OUTLETS[best] : raw) - angle.x)
    lifts.forEach((s, i) => (s.t = hover && i === best ? LIFT : 0))
    outlets.forEach((s, i) => s.sil.classList.toggle('hi', i === best))
    read.textContent = hover ? `backend ${best + 1}` : 'rest'
    loop.wake()
  }
  aim(OUTLETS[REST_IDX])

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        if (Math.hypot(wx, wy) < 6) return
        hover = true
        aim(Math.atan2(wy, wx))
      },
      leave: () => {
        hover = false
        aim(OUTLETS[REST_IDX])
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      pull = rad(v)
      if (hover) aim(angle.t)
    },
    destroy: bag.dispose
  }
}

export const lbRotor: FigureDefinition = {
  id: 'lb-rotor',
  label:
    'A rotor with four backend outlets; the arm follows the pointer and snaps onto the nearest outlet.',
  rest: 'rest',
  range: [10, 25, 45],
  tour: [[150, 170], [250, 170], [250, 235], null],
  mount
}
