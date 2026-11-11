import {
  Cam,
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
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 4
const ROWS = 3
const PITCH = 26
const HALF = 7
const W = 60
const D = 47
const H = 5
const BLK = 4.2
const BH = 4
const ARC_MAX = 16
const LOADS = [
  [4, 7, 5, 3],
  [6, 4, 8, 5],
  [3, 6, 4, 7]
]
const HOME: Vec2 = [1, 1]

const center = (r: number, c: number): Vec2 => [
  (c - (COLS - 1) / 2) * PITCH,
  (r - (ROWS - 1) / 2) * PITCH
]

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 8 + BH + ARC_MAX])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const links: string[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const [u, v] = center(r, c)
      if (c < COLS - 1) links.push(seg(P(u, v, 0), P(...center(r, c + 1), 0)))
      if (r < ROWS - 1) links.push(seg(P(u, v, 0), P(...center(r + 1, c), 0)))
    }
  mk('path', { class: 'nf dash', d: links.join('') }, g)

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const [u, v] = center(r, c)
      const [o, i] = rings(u - HALF, v - HALF, u + HALF, v + HALF, 2.4, 1.2)
      put(solid(g), prism(P, front, o, i, 0, LOADS[r][c]))
    }

  const [bo, bi] = rings(-BLK, -BLK, BLK, BLK, 1.2, 0.8)
  const block = solid(g)
  block.sil.classList.add('hi')
  const [hu, hv] = center(...HOME)
  const sx = spring(hu, { eps: 0.02 })
  const sy = spring(hv, { eps: 0.02 })
  const sz = spring(LOADS[HOME[0]][HOME[1]], { eps: 0.02 })
  const lift = spring(0, { eps: 0.02 })
  let arc = value
  let dest: Vec2 = HOME
  let over = false

  function draw() {
    const z = sz.x + lift.x
    put(block, prism(P, front, shift(bo, sx.x, sy.x), shift(bi, sx.x, sy.x), z, z + BH))
  }

  const loop = register(stage, (dt) => {
    lift.t = Math.hypot(sx.t - sx.x, sy.t - sy.x) > 1.5 ? arc : 0
    const moving = [sx, sy, sz, lift].map((s) => stepS(s, dt)).some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    const [r, c] = dest
    const [u, v] = center(r, c)
    sx.t = u
    sy.t = v
    sz.t = LOADS[r][c]
    read.textContent = over ? `node ${r + 1}·${c + 1} · load ${LOADS[r][c]}` : 'rest'
    loop.wake()
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 5)
        let best: Vec2 | null = null
        let bd = PITCH * 0.7
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++) {
            const [u, v] = center(r, c)
            const d = Math.hypot(wx - u, wy - v)
            if (d < bd) {
              bd = d
              best = [r, c]
            }
          }
        if (!best || (over && best[0] === dest[0] && best[1] === dest[1])) return
        over = true
        dest = best
        retarget()
      },
      leave: () => {
        if (!over) return
        over = false
        dest = HOME
        retarget()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      arc = clamp(v, 0, ARC_MAX)
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const infraWorkloads: FigureDefinition = {
  id: 'infra-workloads',
  label:
    'A cluster of nodes, each as tall as its load; a workload hops to the node under the pointer and lands.',
  rest: 'rest',
  range: [6, 11, ARC_MAX],
  tour: [[130, 150], [270, 170], [200, 215], null],
  mount
}
