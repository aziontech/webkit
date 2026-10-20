import {
  Cam,
  clamp,
  facing,
  fit,
  hull,
  open,
  poly,
  prism,
  proj,
  type Projector,
  ringAt,
  rings,
  run,
  unproj,
  type Vec3
} from '../engine/iso'
import { shift } from '../engine/mark'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const CODES = [403, 404, 500, 503]
const REST_CARD = 1
const PITCH = 26
const CW = 10
const CD = 2.5
const CH = 40
const W = 52
const D = 18
const BASE_H = 5
const LIFT = 5
const FWD = 9
const LEAN = 4
const SCALE_MAX = 1.6
const BAR_HALF = 6
const BAR_LOW = CH - 14
const BAR_HIGH = CH - 9

type Card = {
  u: number
  code: number
  el: Solid
  bar: Solid
  lift: Spring
  lean: Spring
  drawn: string
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.4)
  const ext: Vec3[] = []
  for (const x of [-W, W])
    for (const y of [-D, D]) ext.push([x, y, -BASE_H], [x, y, CH + LIFT * SCALE_MAX])
  fit(C, ext, 200, 166)
  const P: Projector = proj(C)
  const front = facing(C)
  let scale = value

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 6, 2)
  put(solid(g), prism(P, front, pr, pi, -BASE_H, 0))

  const cards: Card[] = CODES.map((code, i) => ({
    u: (i - (CODES.length - 1) / 2) * PITCH,
    code,
    el: solid(g),
    bar: solid(g),
    lift: spring(0, { eps: 0.002 }),
    lean: spring(0, { eps: 0.002 }),
    drawn: ''
  }))

  let picked = -1
  let lit = REST_CARD

  function paint() {
    cards.forEach((c, i) => c.el.sil.classList.toggle('hi', i === lit))
  }

  function retarget() {
    cards.forEach((c, i) => {
      c.lift.t = i === picked ? 1 : 0
      const gap = i - picked
      c.lean.t = picked < 0 || gap === 0 ? 0 : Math.sign(gap) * (Math.abs(gap) === 1 ? 1 : 0.6)
    })
  }

  function draw(c: Card) {
    const key = `${c.lift.x}|${c.lean.x}`
    if (key === c.drawn) return
    c.drawn = key
    const z0 = c.lift.x * LIFT * scale
    const du = c.lean.x * LEAN
    const dv = c.lift.x * FWD * scale
    const [o, i] = rings(c.u - CW, -CD, c.u + CW, CD, 1.6, 1)
    const top = ringAt(P, shift(o, du, dv), z0 + CH)
    const sil = poly(hull(top.concat(ringAt(P, o, z0))))
    const crease = open(ringAt(P, run(shift(i, du, dv), front), z0 + CH))
    put(c.el, { sil, crease })
    const f = BAR_LOW / CH
    const [bo] = rings(c.u - BAR_HALF, CD, c.u + BAR_HALF, CD + 1.4, 0.5, 0.4)
    put(c.bar, prism(P, front, shift(bo, du * f, dv * f), null, z0 + BAR_LOW, z0 + BAR_HIGH))
  }

  const loop = register(stage, (dt) => {
    let live = false
    for (const c of cards) {
      const a = stepS(c.lift, dt)
      const b = stepS(c.lean, dt)
      live = a || b || live
      draw(c)
    }
    return live
  })
  bag.add(loop.unregister)
  paint()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], CH / 2)
        if (Math.abs(wy) > D * 1.6) return
        const idx = clamp(Math.round(wx / PITCH + (CODES.length - 1) / 2), 0, CODES.length - 1)
        if (idx === picked) return
        picked = idx
        lit = idx
        read.textContent = `page ${CODES[idx]} · custom`
        retarget()
        paint()
        loop.wake()
      },
      leave: () => {
        picked = -1
        lit = REST_CARD
        read.textContent = 'default'
        retarget()
        paint()
        loop.wake()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      scale = v
      cards.forEach((c) => (c.drawn = ''))
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const customPagesStatus: FigureDefinition = {
  id: 'custom-pages-status',
  label:
    'Four upright error pages in a row; the pointer picks one, which tilts forward and lights up while its neighbours lean away.',
  rest: 'default',
  range: [0.6, 1, SCALE_MAX],
  tour: [[134, 136], [178, 158], [266, 202], null],
  mount
}
