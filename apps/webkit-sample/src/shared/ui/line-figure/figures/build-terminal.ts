import {
  Cam,
  clamp,
  facing,
  fit,
  prism,
  proj,
  type Ring,
  rings,
  unproj,
  type Vec3
} from '../engine/iso'
import { tdone, tset, tval, tween } from '../engine/motion'
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

const W = 46
const D = 40
const H = 4
const R = 5
const B = 1.6
const ROW = 9.5
const X0 = -W + 10
const V0 = -D + 16
const IND = 8
const BAR_D = 2.4
const BAR_H = 2.4
const BAR_R = 1.3
const LINES: Array<[number, number]> = [
  [0, 34],
  [1, 52],
  [2, 26],
  [2, 44],
  [1, 20],
  [0, 14],
  [0, 8]
]
const PROMPT = LINES.length - 1
const CARET = 5
const STEP = 40
const LIFT_MAX = 14
const falloff = (d: number) => 1 / (1 + d * d)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.4)
  const ext: Vec3[] = []
  for (const x of [-W, W])
    for (const y of [-D, D]) for (const z of [-H, LIFT_MAX + BAR_H]) ext.push([x, y, z])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, R, B)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  for (let k = 0; k < 3; k++) place(flatDot(g, C, 1.3, 'dot off'), P(-W + 7 + k * 5, -D + 6, 0))

  const geo: Array<[Ring, Ring]> = []
  const bars: Solid[] = []
  const rowV = (i: number) => V0 + i * ROW
  LINES.forEach(([ind, len], i) => {
    const x0 = X0 + ind * IND
    geo.push(rings(x0, rowV(i) - BAR_D, x0 + len, rowV(i) + BAR_D, BAR_R, 0.8))
    bars.push(solid(g))
  })
  const cx = X0 + LINES[PROMPT][1] + 6
  const caretGeo = rings(cx, rowV(PROMPT) - CARET / 2, cx + CARET, rowV(PROMPT) + CARET / 2, 1, 0.8)
  const caret = solid(g)
  caret.sil.classList.add('hi')

  let lift = value
  const tw = LINES.map(() => tween(0))
  const drawn = LINES.map(() => -1)

  function draw(now: number) {
    let moving = false
    for (let i = 0; i < LINES.length; i++) {
      const v = tval(tw[i], now)
      moving = moving || !tdone(tw[i], now)
      if (v === drawn[i]) continue
      drawn[i] = v
      const z = v * lift
      put(bars[i], prism(P, front, geo[i][0], geo[i][1], z, z + BAR_H))
      if (i === PROMPT) put(caret, prism(P, front, caretGeo[0], caretGeo[1], z, z + BAR_H))
    }
    return moving
  }

  const loop = register(stage, (_dt, now) => draw(now))
  bag.add(loop.unregister)

  let picked: number | null = null
  let last = PROMPT

  function retarget() {
    const now = performance.now()
    const from = picked ?? last
    for (let i = 0; i < LINES.length; i++) {
      const d = Math.abs(i - from)
      tset(tw[i], picked === null ? 0 : falloff(d), now, d * STEP)
      bars[i].sil.classList.toggle('hi', i === picked)
    }
    caret.sil.classList.toggle('hi', picked === null)
    if (picked !== null) last = picked
    read.textContent =
      picked === null ? 'rest' : picked === PROMPT ? 'prompt' : `line ${picked + 1}`
    loop.wake()
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        const inside = Math.abs(wx) <= W && Math.abs(wy) <= D
        const next = inside ? clamp(Math.round((wy - V0) / ROW), 0, PROMPT) : null
        if (next === picked) return
        picked = next
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
      drawn.fill(-1)
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const buildTerminal: FigureDefinition = {
  id: 'build-terminal',
  label:
    'A terminal with six lines of code and a prompt; the line under the pointer lifts off the slab.',
  rest: 'rest',
  range: [4, 8, LIFT_MAX],
  tour: [[150, 118], [210, 158], [190, 200], null],
  mount
}
