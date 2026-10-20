import { Cam, facing, fit, prism, proj, rings, type Vec3 } from '../engine/iso'
import { shift } from '../engine/mark'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const N = 5
const W = 34
const D = 24
const T = 3
const PITCH = 10
const BLOCK_H = 2.5
const SIDE = 10
const CLEAR = 5
const LIFT_MAX = 20
const REST_MATCH = 2
const STAGGER = 0.1

type Slab = {
  slab: Solid
  criteria: Solid
  behaviour: Solid
  up: Spring
  side: Spring
  drawn: string
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 1.9)
  const ext: Vec3[] = []
  const top = (N - 1) * PITCH + T + BLOCK_H + LIFT_MAX + CLEAR
  for (const x of [-W - SIDE, W + SIDE]) for (const y of [-D, D]) ext.push([x, y, 0], [x, y, top])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [so, si] = rings(-W, -D, W, D, 4, 1.2)
  const [co, ci] = rings(-17, -5, -8, 5, 1.5, 0.6)
  const [bo, bi] = rings(6, -3, 22, 3, 1.5, 0.6)
  const slabs: Slab[] = Array.from({ length: N }, () => {
    const sg = mk('g', {}, g)
    return {
      slab: solid(sg),
      criteria: solid(sg),
      behaviour: solid(sg),
      up: spring(0, { eps: 0.02 }),
      side: spring(0, { eps: 0.02 }),
      drawn: ''
    }
  })

  let lift = value
  let picked: number | null = null

  function draw() {
    slabs.forEach((s, n) => {
      const key = `${s.up.x}|${s.side.x}`
      if (key === s.drawn) return
      s.drawn = key
      const z = n * PITCH + s.up.x
      const du = s.side.x
      put(s.slab, prism(P, front, shift(so, du, 0), shift(si, du, 0), z, z + T))
      put(s.criteria, prism(P, front, shift(co, du, 0), shift(ci, du, 0), z + T, z + T + BLOCK_H))
      put(s.behaviour, prism(P, front, shift(bo, du, 0), shift(bi, du, 0), z + T, z + T + BLOCK_H))
    })
  }

  const loop = register(stage, (dt) => {
    const moving = slabs
      .flatMap((s) => [s.up, s.side])
      .map((s) => stepS(s, dt))
      .some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    slabs.forEach((s, n) => {
      const above = picked !== null && n > picked
      const gap = above ? n - picked! : 0
      s.up.t = n === picked ? lift : above ? lift + T + CLEAR : 0
      s.side.t = above ? (gap % 2 ? SIDE : -SIDE) : 0
      s.up.k = 100 * (1 - STAGGER * gap)
      s.side.k = 100 * (1 - STAGGER * gap)
      s.slab.sil.classList.toggle('hi', n === (picked ?? REST_MATCH))
    })
    read.textContent = picked === null ? 'idle' : `rule ${picked + 1} · match`
    loop.wake()
  }
  retarget()

  const rest = slabs.map((_, n) => P(0, 0, n * PITCH + T / 2))
  const reach = (W + D) * 0.707 * 1.9

  bag.add(
    pointer(stage, {
      move: (p) => {
        if (Math.abs(p[0] - rest[0][0]) > reach) return
        let best = 0
        for (let n = 1; n < N; n++)
          if (Math.abs(p[1] - rest[n][1]) < Math.abs(p[1] - rest[best][1])) best = n
        if (Math.abs(p[1] - rest[best][1]) > PITCH * 2.4 || best === picked) return
        picked = best
        retarget()
      },
      leave: () => {
        if (picked === null) return
        picked = null
        retarget()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      lift = v
      if (picked !== null) retarget()
    },
    destroy: bag.dispose
  }
}

export const applicationsRules: FigureDefinition = {
  id: 'applications-rules',
  label:
    'A stack of five rule slabs, each with a criteria block and a behaviour block; the slab under the pointer lifts as the match and the rules above it step aside.',
  rest: 'idle',
  range: [6, 12, LIFT_MAX],
  tour: [[200, 156], [200, 189], [200, 222], null],
  mount
}
