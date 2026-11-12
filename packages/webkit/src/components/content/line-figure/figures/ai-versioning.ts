import { Cam, facing, fit, prism, proj, rings, type Vec3 } from '../engine/iso'
import { shift } from '../engine/mark'
import { type Spring, spring, stepS } from '../engine/motion'
import {
  disposer,
  flatDot,
  mk,
  place,
  pointer,
  put,
  register,
  type Solid,
  solid
} from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const N = 5
const W = 36
const D = 28
const T = 3
const PITCH = 10
const EXTRA = 12
const SLIDE_MAX = 36
const DOT_U = [-15, 0, 15]
const DOT_V = [-11, 0, 11]
const PATTERNS = [
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 0, 0, 1, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1]
]
const REST: Array<[number, number]> = [
  [0, 0],
  [3, -1],
  [-3, 1],
  [2, -2],
  [0, 0]
]
const LIVE = N - 1

type Slab = { el: Solid; dots: SVGElement[]; sl: Spring; up: Spring; drawn: string }

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 1.9)
  const ext: Vec3[] = []
  for (const x of [-W, W])
    for (const y of [-D, D]) ext.push([x, y, 0], [x, y, LIVE * PITCH + EXTRA + T])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [o, i] = rings(-W, -D, W, D, 4, 1.2)
  const slabs: Slab[] = []
  for (let n = 0; n < N; n++) {
    const sg = mk('g', {}, g)
    const el = solid(sg)
    const dots = PATTERNS[n].map(() => flatDot(sg, C, 1.4, 'dot off'))
    slabs.push({ el, dots, sl: spring(0, { eps: 0.02 }), up: spring(0, { eps: 0.02 }), drawn: '' })
  }

  let slide = value
  let picked: number | null = null

  function paint(n: number, bright: boolean) {
    slabs[n].el.sil.classList.toggle('hi', bright)
    slabs[n].dots.forEach((d, k) =>
      d.setAttribute('class', PATTERNS[n][k] ? (bright ? 'dot' : 'dot m') : 'dot off')
    )
  }

  function draw() {
    slabs.forEach((s, n) => {
      const key = `${s.sl.x}|${s.up.x}`
      if (key === s.drawn) return
      s.drawn = key
      const z = n * PITCH + s.up.x
      const du = REST[n][0]
      const dv = REST[n][1] - s.sl.x
      put(s.el, prism(P, front, shift(o, du, dv), shift(i, du, dv), z, z + T))
      s.dots.forEach((d, k) => place(d, P(du + DOT_U[k % 3], dv + DOT_V[Math.floor(k / 3)], z + T)))
    })
  }

  const loop = register(stage, (dt) => {
    const moving = slabs
      .flatMap((s) => [s.sl, s.up])
      .map((s) => stepS(s, dt))
      .some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    slabs.forEach((s, n) => {
      s.sl.t = n === picked ? slide : 0
      s.up.t = picked !== null && n > picked ? EXTRA : 0
      paint(n, n === (picked ?? LIVE))
    })
    read.textContent =
      picked === null ? 'rest' : `v${picked + 1} · ${picked === LIVE ? 'live' : 'rollback'}`
    loop.wake()
  }
  retarget()

  const rest = slabs.map((_, n) => P(REST[n][0], REST[n][1], n * PITCH + T / 2))
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
      slide = v
      if (picked !== null) retarget()
    },
    destroy: bag.dispose
  }
}

export const aiVersioning: FigureDefinition = {
  id: 'ai-versioning',
  label:
    'Five model versions stacked; the newest is live, and the one under the pointer slides out to be rolled back to.',
  rest: 'rest',
  range: [10, 22, SLIDE_MAX],
  tour: [[200, 120], [200, 190], [200, 235], null],
  mount
}
