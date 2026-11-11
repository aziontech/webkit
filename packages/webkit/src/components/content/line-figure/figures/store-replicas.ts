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
  type Vec2,
  type Vec3
} from '../engine/iso'
import { shift } from '../engine/mark'
import { tdone, tset, tval, type Tween, tween } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const W = 62
const D = 46
const H = 5
const DISCS = 3
const GAP = 1.8
const TH1 = 4.2
const TH2 = 3
const R1 = 13
const R2 = 7
const REACH = 16
const PRIMARY: Vec2 = [0, -15]
const REPLICAS: Vec2[] = [
  [-39, 22],
  [-13, 22],
  [13, 22],
  [39, 22]
]
const O1 = circ(R1, 40)
const I1 = circ(R1 - 1.4, 40)
const O2 = circ(R2, 28)
const I2 = circ(R2 - 1, 28)

type Stack = { discs: Solid[]; tw: Tween[]; drawn: string }

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, 20])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 9, 2)
  put(solid(g), prism(P, front, pr, pi, -H, 0))
  const links = REPLICAS.map((at) => seg(P(PRIMARY[0], PRIMARY[1], 0), P(at[0], at[1], 0)))
  mk('path', { class: 'nf dash', d: links.join('') }, g)

  const stack = (full: boolean): Stack => ({
    discs: Array.from({ length: DISCS }, () => solid(g)),
    tw: Array.from({ length: DISCS }, () => tween(full ? 1 : 0)),
    drawn: ''
  })
  const primary = stack(true)
  const reps = REPLICAS.map(() => stack(false))

  function drawStack(s: Stack, at: Vec2, o: Ring, i: Ring, th: number, now: number) {
    const vals = s.tw.map((t) => tval(t, now))
    const moving = s.tw.some((t) => !tdone(t, now))
    const key = vals.join('|')
    if (key === s.drawn) return moving
    s.drawn = key
    let z = 0
    vals.forEach((v, k) => {
      const h = v * th
      put(s.discs[k], prism(P, front, shift(o, at[0], at[1]), shift(i, at[0], at[1]), z, z + h))
      z += h + GAP * v
    })
    return moving
  }

  const loop = register(stage, (_dt, now) => {
    let moving = drawStack(primary, PRIMARY, O1, I1, TH1, now)
    REPLICAS.forEach((at, r) => {
      moving = drawStack(reps[r], at, O2, I2, TH2, now) || moving
    })
    return moving
  })
  bag.add(loop.unregister)

  let delay = value
  let picked: number | null = null

  function retarget() {
    const now = performance.now()
    reps.forEach((s, r) =>
      s.tw.forEach((t, k) =>
        tset(t, r === picked ? 1 : 0, now, (r === picked ? k : DISCS - 1 - k) * delay)
      )
    )
    primary.discs.forEach((d) => d.sil.classList.toggle('hi', picked === null))
    reps.forEach((s, r) => s.discs.forEach((d) => d.sil.classList.toggle('hi', r === picked)))
    read.textContent = picked === null ? 'rest' : `replica ${picked + 1} · synced`
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        let bd = REACH
        REPLICAS.forEach((at, r) => {
          const d = Math.hypot(wx - at[0], wy - at[1])
          if (d < bd) {
            bd = d
            best = r
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
      delay = v
    },
    destroy: bag.dispose
  }
}

export const storeReplicas: FigureDefinition = {
  id: 'store-replicas',
  label:
    'A primary database and four empty replica slots; the replica under the pointer fills disc by disc until it is in sync.',
  rest: 'rest',
  range: [40, 110, 220],
  tour: [[110, 215], [200, 225], [290, 215], null],
  mount
}
