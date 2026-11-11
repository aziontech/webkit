import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, flatDot, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const LANES = 5
const PITCH = 14
const HALF = 5
const W = 44
const D = 40
const PAD = 4
const BLOCK_X = 34
const BLOCK_BACK = -34
const BLOCK_FRONT = -12
const BLOCK_H = 12
const LIFT = 6
const TILE_H = 2.5
const REST_V = 22
const SLIDE_V = -4
const LANE_START = 33
const REST_LANE = 2

type Tile = { u: number; el: Solid; sp: Spring; drawn: number }

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.3)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -PAD], [x, y, BLOCK_H + LIFT])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [po, pi] = rings(-W, -D, W, D, 6, 1.5)
  put(solid(g), prism(P, front, po, pi, -PAD, 0))

  const lanes = Array.from({ length: LANES }, (_, n) => (n - (LANES - 1) / 2) * PITCH)
  lanes.forEach((u) => {
    const dot = flatDot(g, C, 1.2, 'dot off')
    const q = P(u, LANE_START, 0)
    dot.setAttribute('cx', String(q[0]))
    dot.setAttribute('cy', String(q[1]))
  })

  const block = solid(g)
  const [bo, bi] = rings(-BLOCK_X, BLOCK_BACK, BLOCK_X, BLOCK_FRONT, 3, 1)
  const lift = spring(0, { eps: 0.02 })
  let lastLift = -1

  const tiles: Tile[] = lanes.map((u) => ({
    u,
    el: solid(g),
    sp: spring(REST_V, { eps: 0.02 }),
    drawn: NaN
  }))

  let stiffness = value
  let picked: number | null = null

  const damping = () => 2 * Math.sqrt(stiffness) * 0.85

  function tune() {
    ;[lift, ...tiles.map((t) => t.sp)].forEach((s) => {
      s.k = stiffness
      s.c = damping()
    })
  }

  function paint() {
    block.sil.classList.toggle('hi', picked !== null)
    tiles.forEach((t, n) => t.el.sil.classList.toggle('hi', picked === null && n === REST_LANE))
  }

  function draw() {
    if (lift.x !== lastLift) {
      lastLift = lift.x
      put(block, prism(P, front, bo, bi, lift.x, lift.x + BLOCK_H))
    }
    tiles.forEach((t) => {
      if (t.sp.x === t.drawn) return
      t.drawn = t.sp.x
      const [o, i] = rings(t.u - HALF, t.sp.x - HALF, t.u + HALF, t.sp.x + HALF, 1.5, 0.8)
      put(t.el, prism(P, front, o, i, 0, TILE_H))
    })
  }

  const loop = register(stage, (dt) => {
    const moving = [lift, ...tiles.map((t) => t.sp)].map((s) => stepS(s, dt)).some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    lift.t = picked === null ? 0 : LIFT
    tiles.forEach((t, n) => {
      t.sp.t = n === picked ? SLIDE_V : REST_V
    })
    read.textContent = picked === null ? 'idle' : `req ${picked + 1} · invoked`
    tune()
    paint()
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        if (wy < BLOCK_FRONT || wy > D || Math.abs(wx) > W) return
        let best = 0
        lanes.forEach((u, n) => {
          if (Math.abs(wx - u) < Math.abs(wx - lanes[best])) best = n
        })
        if (Math.abs(wx - lanes[best]) > PITCH / 2 || best === picked) return
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
      stiffness = v
      tune()
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const functionsInvoke: FigureDefinition = {
  id: 'functions-invoke',
  label:
    'A function block at the back of a pad with five request lanes in front; the lane under the pointer sends its request in and the block lifts to run it.',
  rest: 'idle',
  range: [40, 110, 260],
  tour: [[119, 175], [164, 198], [210, 221], null],
  mount
}
