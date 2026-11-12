import {
  Cam,
  circ,
  facing,
  fit,
  prism,
  proj,
  type Ring,
  rings,
  seg,
  unproj,
  type Vec3
} from '../engine/iso'
import { shift } from '../engine/mark'
import { tdone, tset, tval, tween } from '../engine/motion'
import { disposer, mk, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const N = 7
const PITCH = 18
const W = 66
const D = 15
const H = 4
const LIFT = 9
const BODY = 8
const IS_BOT = [false, true, false, false, true, false, true]
const REST_LIT = 4
const FALL = [1, 0.35, 0.12]

const falloff = (d: number) => FALL[d] ?? 0

const human: [Ring, Ring] = [circ(4.2, 20), circ(3.2, 20)]
const bot: [Ring, Ring] = rings(-4, -4, 4, 4, 1.2, 0.8)
const humanHead = circ(2.8, 16)
const botHead = rings(-3.2, -2.4, 3.2, 2.4, 0.6, 0.5)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.3)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, BODY + LIFT + 16])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 6, 1.6)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const u = (i: number) => (i - (N - 1) / 2) * PITCH
  const pawns = IS_BOT.map(() => ({
    body: solid(g),
    head: solid(g),
    antenna: mk('path', { class: 'nf sil' }, g)
  }))
  const tw = pawns.map(() => tween(0))
  const drawn = pawns.map(() => -1)

  let step = value
  let picked: number | null = null

  function draw(now: number) {
    let moving = false
    pawns.forEach((p, i) => {
      const v = tval(tw[i], now)
      moving = moving || !tdone(tw[i], now)
      if (v === drawn[i]) return
      drawn[i] = v
      const z = v * LIFT
      const isBot = IS_BOT[i]
      const [bo, bi] = isBot ? bot : human
      const head = isBot ? botHead : [humanHead, circ(1.8, 16)]
      put(p.body, prism(P, front, shift(bo, u(i), 0), shift(bi, u(i), 0), z, z + BODY))
      put(
        p.head,
        prism(
          P,
          front,
          shift(head[0], u(i), 0),
          shift(head[1], u(i), 0),
          z + BODY + 0.6,
          z + BODY + (isBot ? 3.2 : 3.6)
        )
      )
      p.antenna.setAttribute(
        'd',
        isBot ? seg(P(u(i), 0, z + BODY + 3.2), P(u(i), 0, z + BODY + 8)) : ''
      )
    })
    return moving
  }

  const loop = register(stage, (_dt, now) => draw(now))
  bag.add(loop.unregister)

  function paint() {
    const lit = picked ?? REST_LIT
    pawns.forEach((p, i) => {
      p.body.sil.classList.toggle('hi', i === lit)
      p.head.sil.classList.toggle('hi', i === lit)
    })
  }

  function retarget() {
    const now = performance.now()
    pawns.forEach((_, i) => {
      const d = picked === null ? 0 : Math.abs(i - picked)
      tset(tw[i], picked === null ? 0 : falloff(d), now, d * step)
    })
    paint()
    read.textContent =
      picked === null ? 'rest' : `visitor ${picked + 1} · ${IS_BOT[picked] ? 'bot' : 'human'}`
    loop.wake()
  }
  paint()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        if (Math.abs(wy) > D + 4) return
        const i = Math.min(N - 1, Math.max(0, Math.round(wx / PITCH + (N - 1) / 2)))
        if (i === picked) return
        picked = i
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

export const botLineup: FigureDefinition = {
  id: 'bot-lineup',
  label:
    'A lineup of visitors, round-headed humans and square-headed bots; the one under the pointer steps forward and says which it is.',
  rest: 'rest',
  range: [0, 40, 90],
  tour: [[95, 150], [200, 190], [300, 235], null],
  mount
}
