import { Cam, clamp, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { tdone, tset, tval, tween } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 4
const ROWS = 2
const TOTAL = COLS * ROWS
const PX = 24
const PZ = 22
const HU = 8
const HV = 7
const NODE_H = 8
const W = 54
const D = 34
const H = 4
const REST_COUNT = 3

const place = (i: number) => ({
  u: (Math.floor(i / ROWS) - (COLS - 1) / 2) * PX,
  v: ((i % ROWS) - (ROWS - 1) / 2) * PZ
})

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.3)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, NODE_H + 2])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 8, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const nodes = Array.from({ length: TOTAL }, () => solid(g))
  const tw = nodes.map((_, i) => tween(i < REST_COUNT ? 1 : 0))
  const drawn = nodes.map(() => -1)

  function draw(now: number) {
    let moving = false
    nodes.forEach((n, i) => {
      const v = tval(tw[i], now)
      moving = moving || !tdone(tw[i], now)
      if (v === drawn[i]) return
      drawn[i] = v
      const { u, v: pv } = place(i)
      const [o, r] = rings(u - HU, pv - HV, u + HU, pv + HV, 2, 1)
      put(n, prism(P, front, o, r, 0, v * NODE_H))
    })
    return moving
  }

  const loop = register(stage, (_dt, now) => draw(now))
  bag.add(loop.unregister)

  let step = value
  let count = REST_COUNT

  function setCount(next: number, hovering: boolean) {
    if (next === count && hovering === (read.textContent !== 'rest')) return
    const now = performance.now()
    nodes.forEach((n, i) => {
      const on = i < next
      const wasOn = i < count
      if (on !== wasOn) tset(tw[i], on ? 1 : 0, now, (on ? i - count : count - 1 - i) * step)
      n.sil.classList.toggle('hi', next > 0 && i === next - 1)
    })
    count = next
    read.textContent = hovering ? `nodes ${next}/${TOTAL}` : 'rest'
    loop.wake()
  }
  nodes[REST_COUNT - 1].sil.classList.add('hi')

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx] = unproj(C, p[0], p[1], 0)
        setCount(Math.round(clamp((wx + 44) / 88, 0, 1) * TOTAL), true)
      },
      leave: () => setCount(REST_COUNT, false)
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

export const orchestratorScale: FigureDefinition = {
  id: 'orchestrator-scale',
  label:
    'Eight node slots on a pad; moving the pointer along it sets how many nodes are provisioned, and they rise in order.',
  rest: 'rest',
  range: [20, 60, 120],
  tour: [[110, 190], [220, 175], [300, 205], null],
  mount
}
