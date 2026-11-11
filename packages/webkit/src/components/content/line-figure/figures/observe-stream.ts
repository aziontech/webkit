import { Cam, clamp, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { reducedMotion, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const N = 9
const PITCH = 14
const LEN = N * PITCH
const W = LEN / 2 + 8
const D = 15
const H = 4
const HU = 5
const HV = 6.2
const BH = 4
const EDGE = 14
const SPEED = 12

const isError = (id: number) => id % 5 === 2

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.4)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 12])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 6, 1.6)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  const tiles = Array.from({ length: N }, () => solid(g))

  const rate = spring(1, { eps: 0.002 })
  let slow = value
  let phase = 0
  let gate = 0
  let hover = false

  const slot = (i: number) => {
    const x = i * PITCH + phase
    const k = Math.floor(x / LEN)
    return { u: x - k * LEN - LEN / 2, id: 1000 + k * N + i }
  }

  function draw() {
    const spots = tiles.map((_, i) => slot(i))
    let best = 0
    spots.forEach((s, i) => {
      if (Math.abs(s.u - gate) < Math.abs(spots[best].u - gate)) best = i
    })
    spots.forEach((s, i) => {
      const e = clamp(Math.min(s.u + LEN / 2, LEN / 2 - s.u) / EDGE, 0, 1)
      if (e < 0.04) {
        put(tiles[i], { sil: '', crease: '' })
        return
      }
      const a = HU * e
      const b = HV * e
      const [o, n] = rings(s.u - a, -b, s.u + a, b, Math.min(1.4, a / 2), Math.min(0.8, a / 3))
      put(tiles[i], prism(P, front, o, n, 0, BH * e * (isError(s.id) ? 2 : 1)))
      tiles[i].sil.classList.toggle('hi', i === best)
    })
    const lit = spots[best]
    read.textContent = hover ? `evt ${lit.id} · ${isError(lit.id) ? 'error' : 'ok'}` : 'rest'
  }

  const loop = register(stage, (dt) => {
    const moving = stepS(rate, dt)
    if (!reducedMotion()) phase += rate.x * SPEED * dt
    draw()
    return !reducedMotion() || moving
  })
  bag.add(loop.unregister)

  function leave() {
    if (!hover) return
    hover = false
    gate = 0
    rate.t = 1
    loop.wake()
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], BH / 2)
        if (Math.abs(wy) > D + 6) return leave()
        hover = true
        gate = clamp(wx, -LEN / 2 + PITCH, LEN / 2 - PITCH)
        rate.t = slow
        loop.wake()
      },
      leave
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      slow = v
      if (hover) rate.t = v
    },
    destroy: bag.dispose
  }
}

export const observeStream: FigureDefinition = {
  id: 'observe-stream',
  label:
    'A stream of events on a rail, errors standing taller; hovering slows time and the event under the pointer says what it is.',
  rest: 'rest',
  range: [0.6, 0.2, 0.05],
  tour: [[140, 175], [215, 195], [270, 215], null],
  mount
}
