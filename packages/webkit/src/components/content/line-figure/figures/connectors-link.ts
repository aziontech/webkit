import {
  Cam,
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
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const EDGE: Vec2 = [-44, 0]
const ORIGINS: Vec2[] = [
  [36, -30],
  [36, 0],
  [36, 30]
]
const EDGE_HALF = 11
const EDGE_H = 9
const ORIGIN_HALF = 8
const ORIGIN_H = 6
const PACKET_HALF = 3
const PACKET_H = 4
const PLATE_U = 62
const PLATE_V = 48
const PLATE_H = 5
const REACH = 15

const mount: FigureMount = ({ stage, svg, read }) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-PLATE_U, PLATE_U])
    for (const y of [-PLATE_V, PLATE_V]) ext.push([x, y, -PLATE_H], [x, y, EDGE_H + 1])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-PLATE_U, -PLATE_V, PLATE_U, PLATE_V, 8, 2)
  put(solid(g), prism(P, front, pr, pi, -PLATE_H, 0))

  const links = ORIGINS.map((at) =>
    mk('path', { class: 'nf dash', d: seg(P(EDGE[0], EDGE[1], 0), P(at[0], at[1], 0)) }, g)
  )
  const edge = solid(g)
  const [eo, ei] = rings(
    EDGE[0] - EDGE_HALF,
    EDGE[1] - EDGE_HALF,
    EDGE[0] + EDGE_HALF,
    EDGE[1] + EDGE_HALF,
    2,
    1
  )
  put(edge, prism(P, front, eo, ei, 0, EDGE_H))
  edge.sil.classList.add('hi')

  const origins = ORIGINS.map((at) => {
    const el = solid(g)
    const [o, i] = rings(
      at[0] - ORIGIN_HALF,
      at[1] - ORIGIN_HALF,
      at[0] + ORIGIN_HALF,
      at[1] + ORIGIN_HALF,
      2,
      1
    )
    put(el, prism(P, front, o, i, 0, ORIGIN_H))
    return el
  })

  const packet = solid(g)
  const px: Spring = spring(EDGE[0], { k: 70, c: 14, eps: 0.05 })
  const py: Spring = spring(EDGE[1], { k: 70, c: 14, eps: 0.05 })
  let picked: number | null = null

  function drawPacket() {
    if (picked === null && Math.hypot(px.x - EDGE[0], py.x - EDGE[1]) < 1) {
      put(packet, { sil: '', crease: '' })
      return
    }
    const [o, i] = rings(
      px.x - PACKET_HALF,
      py.x - PACKET_HALF,
      px.x + PACKET_HALF,
      py.x + PACKET_HALF,
      1,
      0.6
    )
    put(packet, prism(P, front, o, i, 0, PACKET_H))
  }

  const loop = register(stage, (dt) => {
    const live = stepS(px, dt) || stepS(py, dt)
    drawPacket()
    return live
  })
  bag.add(loop.unregister)

  function pick(next: number | null) {
    picked = next
    const to = next === null ? EDGE : ORIGINS[next]
    px.t = to[0]
    py.t = to[1]
    links.forEach((l, i) => l.setAttribute('class', i === next ? 'nf hi' : 'nf dash'))
    origins.forEach((o, i) => o.sil.classList.toggle('hi', i === next))
    read.textContent = next === null ? 'idle' : `origin ${next + 1} · connected`
    loop.wake()
  }
  pick(null)

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        let bd = REACH
        ORIGINS.forEach((at, i) => {
          const d = Math.hypot(wx - at[0], wy - at[1])
          if (d < bd) {
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

export const connectorsLink: FigureDefinition = {
  id: 'connectors-link',
  label:
    'An edge block linked to three origins by dashed lines; the origin under the pointer connects and a packet travels to it.',
  rest: 'idle',
  range: [0, 1, 1],
  tour: [[293, 169], [251, 191], [208, 212], null],
  mount
}
