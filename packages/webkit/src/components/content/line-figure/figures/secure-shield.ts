import {
  Cam,
  clamp,
  facing,
  fillet,
  fit,
  poly,
  prism,
  proj,
  type Ring,
  rings,
  unproj,
  type Vec2,
  type Vec3
} from '../engine/iso'
import { extrusion, inset } from '../engine/mark'
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

const W = 56
const D = 44
const H = 6
const COLS = 5
const ROWS = 3
const TILE = 7
const PITCH = 18
const TH = 2
const BH = 6
const V0 = -8
const U0 = (-(COLS - 1) / 2) * PITCH
const LIFT = 9
const BLOCKED = new Set(['0:1', '1:3', '2:0', '2:4', '1:1'])
const SHIELD_V = -31
const T = 5
const B = 1.8
const SHIELD: Vec2[] = [
  [-24, 54],
  [24, 54],
  [26, 42],
  [22, 20],
  [10, 6],
  [0, 0],
  [-10, 6],
  [-22, 20],
  [-26, 42]
]
const OUT = fillet(SHIELD, [3, 3, 4, 4, 3, 2.4, 3, 4, 4], 4)
const IN = inset(OUT, B)

type Tile = {
  r: number
  c: number
  u: number
  v: number
  blocked: boolean
  geo: [Ring, Ring]
  el: Solid
  dot: SVGElement
  sp: Spring
  drawn: number
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const zf = Math.sqrt(1 - C.k * C.k)
  const V: Vec3 = [Math.sin(C.az) * zf, Math.cos(C.az) * zf, C.k]
  const side = V[1] > 0 ? 1 : -1

  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, LIFT + BH])
  for (const [a, b] of SHIELD) ext.push([a, SHIELD_V, b + 2])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const W3 = (p: Vec3) => P(p[0], p[1], p[2])
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const at = (a: number, b: number, t: number): Vec3 => [a, SHIELD_V + t, b]
  const near = OUT.map(([a, b]) => W3(at(a, b, (side * T) / 2)))
  const far = OUT.map(([a, b]) => W3(at(a, b, (-side * T) / 2)))
  const body = mk('g', {}, g)
  const halo = mk('path', { class: 'halo sil hi', d: extrusion(near, far) }, body)
  mk('path', { class: 'fo', d: extrusion(near, far) }, body)
  mk('path', { class: 'nf lo', d: poly(IN.map(([a, b]) => W3(at(a, b, (side * T) / 2)))) }, body)

  const tiles: Tile[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const u = U0 + c * PITCH
      const v = V0 + r * PITCH
      const blocked = BLOCKED.has(`${r}:${c}`)
      const el = solid(g)
      tiles.push({
        r,
        c,
        u,
        v,
        blocked,
        geo: rings(u - TILE, v - TILE, u + TILE, v + TILE, 1.6, 1),
        el,
        dot: flatDot(g, C, 1.4, blocked ? 'dot off' : 'dot m'),
        sp: spring(0, { eps: 0.02 }),
        drawn: -1
      })
    }

  function draw() {
    for (const t of tiles) {
      if (t.sp.x === t.drawn) continue
      t.drawn = t.sp.x
      const top = t.sp.x + (t.blocked ? BH : TH)
      put(t.el, prism(P, front, t.geo[0], t.geo[1], t.sp.x, top))
      place(t.dot, P(t.u, t.v, top))
    }
  }

  const loop = register(stage, (dt) => {
    let moving = false
    for (const t of tiles) moving = stepS(t.sp, dt) || moving
    draw()
    return moving
  })
  bag.add(loop.unregister)

  let reach = value
  let over: Tile | null = null

  function retarget() {
    for (const t of tiles) {
      const d = over ? Math.hypot(t.c - over.c, t.r - over.r) : Infinity
      t.sp.t = LIFT * clamp(1 - d / reach, 0, 1)
      t.el.sil.classList.toggle('hi', t === over)
    }
    halo.classList.toggle('hi', !over)
    read.textContent = over
      ? `req ${over.r + 1}·${over.c + 1} · ${over.blocked ? 'blocked' : 'allowed'}`
      : 'rest'
    loop.wake()
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], TH)
        let best: Tile | null = null
        let bd = PITCH * 0.75
        for (const t of tiles) {
          const d = Math.hypot(wx - t.u, wy - t.v)
          if (d < bd) {
            bd = d
            best = t
          }
        }
        if (best === over) return
        over = best
        retarget()
      },
      leave: () => {
        if (!over) return
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

export const secureShield: FigureDefinition = {
  id: 'secure-shield',
  label:
    'A shield over a matrix of requests; blocked ones stand as blocks, allowed ones lie flat, and the one under the pointer says its verdict.',
  rest: 'rest',
  range: [1, 2, 3.5],
  tour: [[160, 190], [250, 170], [205, 215], null],
  mount
}
