import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 5
const ROWS = 3
const PITCH = 17
const HALF = 6
const V0 = -10
const FLAT = 0.8
const DENY_MAX = 10
const W = 50
const V_NEAR = 38
const V_FAR = -46
const BASE_H = 5
const GATE_V = -32
const GATE_HALF_V = 4
const GATE_HALF_U = 44
const GATE_H = 6
const DENIED_AT_REST = new Set(['0:1', '1:3', '2:0'])
const REST_LIT = '1:2'

type Tile = {
  r: number
  c: number
  u: number
  v: number
  key: string
  denied: boolean
  el: Solid
  sp: Spring
  drawn: number
}

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-W, W])
    for (const y of [V_FAR, V_NEAR]) ext.push([x, y, -BASE_H], [x, y, DENY_MAX])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)
  let deny = value

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, V_FAR, W, V_NEAR, 8, 2)
  put(solid(g), prism(P, front, pr, pi, -BASE_H, 0))
  const [go, gi] = rings(
    -GATE_HALF_U,
    GATE_V - GATE_HALF_V,
    GATE_HALF_U,
    GATE_V + GATE_HALF_V,
    2,
    1
  )
  put(solid(g), prism(P, front, go, gi, 0, GATE_H))

  const tiles: Tile[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const key = `${r}:${c}`
      const denied = DENIED_AT_REST.has(key)
      tiles.push({
        r,
        c,
        u: (c - (COLS - 1) / 2) * PITCH,
        v: V0 + r * PITCH,
        key,
        denied,
        el: solid(g),
        sp: spring(denied ? deny : FLAT, { eps: 0.02 }),
        drawn: -1
      })
    }

  let lit = REST_LIT
  let current: Tile | null = null

  function paint() {
    tiles.forEach((t) => t.el.sil.classList.toggle('hi', t.key === lit))
  }

  function draw(t: Tile) {
    if (t.sp.x === t.drawn) return
    t.drawn = t.sp.x
    const [o, i] = rings(t.u - HALF, t.v - HALF, t.u + HALF, t.v + HALF, 1.6, 1)
    put(t.el, prism(P, front, o, i, 0, t.sp.x))
  }

  const loop = register(stage, (dt) => {
    let live = false
    for (const t of tiles) {
      live = stepS(t.sp, dt) || live
      draw(t)
    }
    return live
  })
  bag.add(loop.unregister)
  paint()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: Tile | null = null
        let bd = PITCH * 0.6
        for (const t of tiles) {
          const d = Math.hypot(wx - t.u, wy - t.v)
          if (d < bd) {
            bd = d
            best = t
          }
        }
        if (!best || best === current) return
        current = best
        best.denied = !best.denied
        best.sp.t = best.denied ? deny : FLAT
        lit = best.key
        read.textContent = `ip ${best.r + 1}·${best.c + 1} · ${best.denied ? 'deny' : 'allow'}`
        paint()
        loop.wake()
      },
      leave: () => {
        current = null
        lit = REST_LIT
        read.textContent = 'idle'
        paint()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      deny = v
      tiles.forEach((t) => {
        if (t.denied) t.sp.t = deny
      })
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const networkListsGate: FigureDefinition = {
  id: 'network-lists-gate',
  label:
    'A field of address tiles in front of a gate bar; sweeping the pointer across a tile flips it between allowed and denied, and it stays that way.',
  rest: 'idle',
  range: [3, 6, DENY_MAX],
  tour: [[160, 142], [184, 178], [208, 214], [233, 178], null],
  mount
}
