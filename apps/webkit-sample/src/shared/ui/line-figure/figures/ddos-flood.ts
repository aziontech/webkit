import { Cam, clamp, facing, fit, poly, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 6
const ROWS = 4
const PITCH = 14
const HALF = 5
const W = 50
const D = 38
const H = 5
const LIFT = 26
const CAP = 11
const REST_LIT = '1:3'

type Pillar = {
  r: number
  c: number
  u: number
  v: number
  key: string
  base: number
  el: Solid
  over: SVGPathElement
  sp: Spring
  drawn: number
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.1)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, CAP + 14])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const pillars: Pillar[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const base = 3 + ((r * 7 + c * 3) % 4)
      const el = solid(g)
      const over = mk('path', { class: 'nf dash' }, g)
      pillars.push({
        r,
        c,
        u: (c - (COLS - 1) / 2) * PITCH,
        v: (r - (ROWS - 1) / 2) * PITCH,
        key: `${r}:${c}`,
        base,
        el,
        over,
        sp: spring(base, { eps: 0.02 }),
        drawn: -1
      })
    }
  const cx = (COLS / 2) * PITCH
  const cy = (ROWS / 2) * PITCH
  mk(
    'path',
    {
      class: 'nf dash lo',
      d: poly([P(-cx, -cy, CAP), P(cx, -cy, CAP), P(cx, cy, CAP), P(-cx, cy, CAP)])
    },
    g
  )

  let reach = value * PITCH
  let aim: [number, number] | null = null
  let lit = REST_LIT

  const rise = (p: Pillar) => {
    if (!aim) return p.base
    const k = clamp(1 - Math.hypot(aim[0] - p.u, aim[1] - p.v) / reach, 0, 1)
    return p.base + LIFT * k * k
  }

  function draw(p: Pillar) {
    if (p.sp.x === p.drawn) return
    p.drawn = p.sp.x
    const [o, i] = rings(p.u - HALF, p.v - HALF, p.u + HALF, p.v + HALF, 1.6, 0.9)
    put(p.el, prism(P, front, o, i, 0, Math.min(p.sp.x, CAP)))
    p.over.setAttribute('d', p.sp.x > CAP + 0.5 ? prism(P, front, o, i, CAP, p.sp.x).sil : '')
  }

  const loop = register(stage, (dt) => {
    const moving = pillars.map((p) => stepS(p.sp, dt)).some(Boolean)
    pillars.forEach(draw)
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    pillars.forEach((p) => {
      p.sp.t = rise(p)
      p.el.sil.classList.toggle('hi', p.key === lit)
    })
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (pt) => {
        const [wx, wy] = unproj(C, pt[0], pt[1], 0)
        aim = [wx, wy]
        let best: Pillar | null = null
        let bd = PITCH * 0.7
        for (const p of pillars) {
          const d = Math.hypot(wx - p.u, wy - p.v)
          if (d < bd) {
            bd = d
            best = p
          }
        }
        if (best) {
          lit = best.key
          const h = Math.round(rise(best))
          read.textContent = h > CAP ? `load ${h} · ${h - CAP} absorbed` : `load ${h}`
        }
        retarget()
      },
      leave: () => {
        aim = null
        lit = REST_LIT
        read.textContent = 'rest'
        retarget()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      reach = v * PITCH
      retarget()
    },
    destroy: bag.dispose
  }
}

export const ddosFlood: FigureDefinition = {
  id: 'ddos-flood',
  label:
    'Traffic piles up under the pointer, but every column is capped; what rises above the line is absorbed.',
  rest: 'rest',
  range: [1.5, 2.2, 3.2],
  tour: [[130, 190], [215, 170], [270, 215], null],
  mount
}
