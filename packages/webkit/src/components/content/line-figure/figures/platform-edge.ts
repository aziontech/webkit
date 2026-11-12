import {
  Cam,
  circ,
  clamp,
  facing,
  fit,
  prism,
  proj,
  rings,
  seg,
  unproj,
  type Vec2,
  type Vec3
} from '../engine/iso'
import { shift } from '../engine/mark'
import { spring, stepS } from '../engine/motion'
import { disposer, flatDot, mk, place, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const W = 70
const D = 50
const H = 5
const EDGES: Vec2[] = [
  [-46, -16],
  [-14, -32],
  [16, -6],
  [-30, 24],
  [42, 24]
]
const ORIGIN: Vec2 = [40, -26]
const OH = 12
const REST: Vec2 = [-8, 30]
const EH = 5
const USER_H = 9
const LIFT_MAX = 10
const EO = circ(5.2, 24)
const EI = circ(4.2, 24)
const UO = circ(2.4, 16)
const UI = circ(1.4, 16)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 1.8)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 18])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  const spokes = EDGES.map(([u, v]) => seg(P(u, v, 0), P(ORIGIN[0], ORIGIN[1], 0)))
  mk('path', { class: 'nf dash lo', d: spokes.join('') }, g)
  const [oo, oi] = rings(ORIGIN[0] - 11, ORIGIN[1] - 9, ORIGIN[0] + 11, ORIGIN[1] + 9, 2.5, 1.2)
  put(solid(g), prism(P, front, oo, oi, 0, OH))
  const trace = mk('path', { class: 'nf dash' }, g)
  const edges = EDGES.map(() => solid(g))
  const ug = mk('g', {}, g)
  const post = solid(ug)
  const halo = flatDot(ug, C, 5, 'nf lo')

  const ux = spring(REST[0], { eps: 0.02 })
  const uy = spring(REST[1], { eps: 0.02 })
  const lifts = EDGES.map(() => spring(0, { eps: 0.02 }))
  const sorted = EDGES.map((_, i) => i).sort(
    (a, b) => EDGES[a][0] + EDGES[a][1] - EDGES[b][0] - EDGES[b][1]
  )
  let rank = -1
  let near = 0
  let lift = value
  let hover = false

  function order() {
    const depth = ux.x + uy.x
    const r = sorted.filter((i) => EDGES[i][0] + EDGES[i][1] < depth).length
    if (r === rank) return
    rank = r
    const els: Element[] = sorted.map((i) => edges[i].g)
    els.splice(r, 0, ug)
    g.append(...els)
  }

  function draw() {
    edges.forEach((s, i) => {
      const [u, v] = EDGES[i]
      const z = lifts[i].x
      put(s, prism(P, front, shift(EO, u, v), shift(EI, u, v), z, z + EH))
    })
    put(post, prism(P, front, shift(UO, ux.x, uy.x), shift(UI, ux.x, uy.x), 0, USER_H))
    place(halo, P(ux.x, uy.x, 0))
    trace.setAttribute('d', seg(P(ux.x, uy.x, 0), P(EDGES[near][0], EDGES[near][1], 0)))
  }

  const loop = register(stage, (dt) => {
    const moving = [ux, uy, ...lifts].map((s) => stepS(s, dt)).some(Boolean)
    order()
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    near = 0
    EDGES.forEach((e, i) => {
      if (
        Math.hypot(e[0] - ux.t, e[1] - uy.t) <
        Math.hypot(EDGES[near][0] - ux.t, EDGES[near][1] - uy.t)
      )
        near = i
    })
    lifts.forEach((s, i) => (s.t = i === near ? lift : 0))
    edges.forEach((s, i) => s.sil.classList.toggle('hi', i === near))
    const d = Math.hypot(EDGES[near][0] - ux.t, EDGES[near][1] - uy.t)
    read.textContent = hover ? `edge ${near + 1} · ${Math.round(2 + d * 0.35)} ms` : 'rest'
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        hover = true
        ux.t = clamp(wx, -W + 8, W - 8)
        uy.t = clamp(wy, -D + 8, D - 8)
        retarget()
      },
      leave: () => {
        hover = false
        ux.t = REST[0]
        uy.t = REST[1]
        retarget()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      lift = v
      retarget()
    },
    destroy: bag.dispose
  }
}

export const platformEdge: FigureDefinition = {
  id: 'platform-edge',
  label:
    'A user on the ground, five edge nodes and a distant origin; the edge nearest the pointer lifts and serves the request.',
  rest: 'rest',
  range: [3, 6, LIFT_MAX],
  tour: [[110, 175], [215, 150], [300, 205], null],
  mount
}
