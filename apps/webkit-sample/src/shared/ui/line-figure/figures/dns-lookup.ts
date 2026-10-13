import {
  Cam,
  circ,
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
import { tdone, tset, tval, tween } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const W = 60
const D = 46
const H = 5
const LIFT = 5
const REACH = 12
const ROOT: Vec2 = [0, -34]
const MIDS: Vec2[] = [
  [-34, -10],
  [0, -10],
  [34, -10]
]
const LEAVES: Vec2[] = [-45, -27, -9, 9, 27, 45].map((u): Vec2 => [u, 14])
const NODES: Array<{ at: Vec2; r: number; h: number }> = [
  { at: ROOT, r: 6, h: 9 },
  ...MIDS.map((at) => ({ at, r: 5, h: 6 })),
  ...LEAVES.map((at) => ({ at, r: 4, h: 4 }))
]
const rootIdx = 0
const midIdx = (leaf: number) => 1 + Math.floor(leaf / 2)
const leafIdx = (leaf: number) => 4 + leaf

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 9 + LIFT + 2])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  const links = [
    ...MIDS.map((m) => seg(P(ROOT[0], ROOT[1], 0), P(m[0], m[1], 0))),
    ...LEAVES.map((l, i) =>
      seg(P(MIDS[Math.floor(i / 2)][0], MIDS[Math.floor(i / 2)][1], 0), P(l[0], l[1], 0))
    )
  ]
  mk('path', { class: 'nf dash', d: links.join('') }, g)

  const solids = NODES.map(() => solid(g))
  const tw = NODES.map(() => tween(0))
  const drawn = NODES.map(() => -1)
  const geo = NODES.map((n) => [circ(n.r, 24), circ(n.r - 1.1, 24)])

  function draw(now: number) {
    let moving = false
    NODES.forEach((n, k) => {
      const v = tval(tw[k], now)
      moving = moving || !tdone(tw[k], now)
      if (v === drawn[k]) return
      drawn[k] = v
      const z = v * LIFT
      put(
        solids[k],
        prism(
          P,
          front,
          shift(geo[k][0], n.at[0], n.at[1]),
          shift(geo[k][1], n.at[0], n.at[1]),
          z,
          z + n.h
        )
      )
    })
    return moving
  }

  const loop = register(stage, (_dt, now) => draw(now))
  bag.add(loop.unregister)

  let step = value
  let picked: number | null = null

  function retarget() {
    const now = performance.now()
    const path = picked === null ? [] : [rootIdx, midIdx(picked), leafIdx(picked)]
    NODES.forEach((_, k) => {
      const depth = path.indexOf(k)
      tset(tw[k], depth >= 0 ? 1 : 0, now, depth >= 0 ? depth * step : 0)
      solids[k].sil.classList.toggle('hi', picked === null ? k === rootIdx : depth >= 0)
    })
    read.textContent = picked === null ? 'rest' : `leaf ${picked + 1} · 3 hops`
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        let bd = REACH
        LEAVES.forEach((l, i) => {
          const d = Math.hypot(wx - l[0], wy - l[1])
          if (d < bd) {
            bd = d
            best = i
          }
        })
        if (best === null || best === picked) return
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
      step = v
    },
    destroy: bag.dispose
  }
}

export const dnsLookup: FigureDefinition = {
  id: 'dns-lookup',
  label:
    'A name server tree; pointing at a leaf lifts the lookup path from the root down through its zone, one hop after another.',
  rest: 'rest',
  range: [40, 110, 220],
  tour: [[117, 150], [193, 188], [244, 214], null],
  mount
}
