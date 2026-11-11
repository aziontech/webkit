import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COUNT = 5
const LIVE = COUNT - 1
const PITCH = 19
const HALF_U = 22
const HALF_V = 7
const STRIP_U = 30
const STRIP_V = 50
const H = 5
const BASE = 5
const LIFT = 9
const REACH = PITCH * 0.6

type Slab = { v: number; el: Solid; lift: Spring; drawn: number }

const mount: FigureMount = ({ stage, svg, read }) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-STRIP_U, STRIP_U])
    for (const y of [-STRIP_V, STRIP_V]) ext.push([x, y, -BASE], [x, y, H + LIFT])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-STRIP_U, -STRIP_V, STRIP_U, STRIP_V, 6, 2)
  put(solid(g), prism(P, front, pr, pi, -BASE, 0))

  const slabs: Slab[] = Array.from({ length: COUNT }, (_, i) => ({
    v: (i - (COUNT - 1) / 2) * PITCH,
    el: solid(g),
    lift: spring(0, { k: 160, c: 17, eps: 0.02 }),
    drawn: -1
  }))
  const mark = spring(LIVE, { k: 90, c: 15, eps: 0.01 })
  let picked: number | null = null

  function paint() {
    const lit = Math.round(mark.x)
    slabs.forEach((s, i) => s.el.sil.classList.toggle('hi', i === lit))
  }

  function draw(s: Slab) {
    if (s.lift.x === s.drawn) return
    s.drawn = s.lift.x
    const [o, i] = rings(-HALF_U, s.v - HALF_V, HALF_U, s.v + HALF_V, 2, 1)
    put(s.el, prism(P, front, o, i, s.lift.x, s.lift.x + H))
  }

  const loop = register(stage, (dt) => {
    let live = stepS(mark, dt)
    for (const s of slabs) {
      live = stepS(s.lift, dt) || live
      draw(s)
    }
    paint()
    return live
  })
  bag.add(loop.unregister)

  function pick(next: number | null) {
    picked = next
    slabs.forEach((s, i) => {
      s.lift.t = i === next ? LIFT : 0
    })
    mark.t = next ?? LIVE
    read.textContent = next === null ? 'v5 · live' : `v${next + 1} · live`
    loop.wake()
  }
  pick(null)

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        let bd = REACH
        slabs.forEach((s, i) => {
          const d = Math.abs(wy - s.v)
          if (d < bd && Math.abs(wx) < STRIP_U) {
            bd = d
            best = i
          }
        })
        if (best === null || best === picked) return
        pick(best)
      },
      leave: () => {
        if (picked !== null) pick(null)
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return { set: () => {}, destroy: bag.dispose }
}

export const deploymentsRelease: FigureDefinition = {
  id: 'deployments-release',
  label:
    'Five release slabs along a timeline; the pointer lifts one and the live mark travels to it, promoting or rolling back.',
  rest: 'v5 · live',
  range: [0, 1, 1],
  tour: [[254, 138], [200, 165], [146, 192], null],
  mount
}
