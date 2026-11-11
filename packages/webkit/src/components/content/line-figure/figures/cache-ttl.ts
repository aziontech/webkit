import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 5
const ROWS = 4
const PITCH = 19
const HALF = 7
const W = 56
const D = 46
const H = 5
const BASE = 1.5
const HOT = 9
const FLOOR = 0.6
const PINNED = new Set(['1:2', '2:0', '3:4'])
const REST_LIT = '1:2'

type Slot = {
  r: number
  c: number
  u: number
  v: number
  key: string
  el: Solid
  heat: number
  sp: Spring
  drawn: number
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, HOT + 1])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const slots: Slot[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const key = `${r}:${c}`
      const heat = PINNED.has(key) ? FLOOR : 0
      slots.push({
        r,
        c,
        u: (c - (COLS - 1) / 2) * PITCH,
        v: (r - (ROWS - 1) / 2) * PITCH,
        key,
        el: solid(g),
        heat,
        sp: spring(BASE + (HOT - BASE) * heat, { eps: 0.02 }),
        drawn: -1
      })
    }

  let ttl = value
  let lit = REST_LIT
  let current: Slot | null = null

  function paint() {
    slots.forEach((s) => s.el.sil.classList.toggle('hi', s.key === lit))
  }

  function draw(s: Slot) {
    if (s.sp.x === s.drawn) return
    s.drawn = s.sp.x
    const [o, i] = rings(s.u - HALF, s.v - HALF, s.u + HALF, s.v + HALF, 2, 1)
    put(s.el, prism(P, front, o, i, 0, s.sp.x))
  }

  const loop = register(stage, (dt) => {
    let live = false
    for (const s of slots) {
      const floor = PINNED.has(s.key) ? FLOOR : 0
      s.heat = Math.max(floor, s.heat - dt / ttl)
      s.sp.t = BASE + (HOT - BASE) * s.heat
      live = stepS(s.sp, dt) || s.heat > floor || live
      draw(s)
    }
    return live
  })
  bag.add(loop.unregister)
  paint()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: Slot | null = null
        let bd = PITCH * 0.6
        for (const s of slots) {
          const d = Math.hypot(wx - s.u, wy - s.v)
          if (d < bd) {
            bd = d
            best = s
          }
        }
        if (!best) return
        if (best === current) {
          best.heat = 1
          loop.wake()
          return
        }
        read.textContent = `slot ${best.r + 1}·${best.c + 1} · ${best.heat > 0.2 ? 'hit' : 'miss'}`
        best.heat = 1
        current = best
        lit = best.key
        paint()
        loop.wake()
      },
      leave: () => {
        current = null
        lit = REST_LIT
        read.textContent = 'rest'
        paint()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      ttl = v
    },
    destroy: bag.dispose
  }
}

export const cacheTtl: FigureDefinition = {
  id: 'cache-ttl',
  label:
    'A grid of cache slots; the pointer warms the ones it touches and each cools down again after its time to live.',
  rest: 'rest',
  range: [0.4, 1.4, 4],
  tour: [[120, 150], [200, 190], [270, 175], null],
  mount
}
