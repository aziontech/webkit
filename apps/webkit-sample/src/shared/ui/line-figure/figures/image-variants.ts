import { Cam, facing, fit, poly, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { tdone, tset, tval, tween } from '../engine/motion'
import { disposer, flatDot, mk, place, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const SIZES: Array<[number, number]> = [
  [52, 38],
  [42, 30],
  [32, 24],
  [22, 17]
]
const WIDTHS = [1280, 960, 640, 320]
const GAP = 8
const W = 92
const D = 30
const H = 4
const T = 2.5
const LIFT_MAX = 20
const FALL = [1, 0.3, 0.1]

const total = SIZES.reduce((s, [w]) => s + w, 0) + GAP * (SIZES.length - 1)
const centers = SIZES.map(
  ([w], i) => -total / 2 + SIZES.slice(0, i).reduce((s, [a]) => s + a + GAP, 0) + w / 2
)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 1.45)
  const ext: Vec3[] = []
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -H], [x, y, LIFT_MAX + T])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-W, -D, W, D, 8, 1.8)
  put(solid(g), prism(P, front, pr, pi, -H, 0))

  const frames = SIZES.map(() => ({
    el: solid(g),
    hill: mk('path', { class: 'nf lo' }, g),
    sun: flatDot(g, C, 1.3, 'dot m')
  }))
  const tw = SIZES.map(() => tween(0))
  const drawn = SIZES.map(() => -1)

  let lift = value
  let picked: number | null = null
  const lit = () => picked ?? 0

  function draw(now: number) {
    let moving = false
    frames.forEach((f, i) => {
      const v = tval(tw[i], now)
      moving = moving || !tdone(tw[i], now)
      if (v === drawn[i]) return
      drawn[i] = v
      const [w, d] = SIZES[i]
      const u = centers[i]
      const z = v * lift
      const [o, n] = rings(u - w / 2, -d / 2, u + w / 2, d / 2, 2, 1)
      put(f.el, prism(P, front, o, n, z, z + T))
      f.hill.setAttribute(
        'd',
        poly([
          P(u - 0.3 * w, 0.28 * d, z + T),
          P(u - 0.02 * w, -0.05 * d, z + T),
          P(u + 0.3 * w, 0.28 * d, z + T)
        ])
      )
      place(f.sun, P(u + 0.2 * w, -0.2 * d, z + T))
    })
    return moving
  }

  const loop = register(stage, (_dt, now) => draw(now))
  bag.add(loop.unregister)

  function retarget() {
    const now = performance.now()
    frames.forEach((f, i) => {
      const d = picked === null ? 0 : Math.abs(i - picked)
      tset(tw[i], picked === null ? 0 : (FALL[d] ?? 0), now, d * 50)
      f.el.sil.classList.toggle('hi', i === lit())
    })
    read.textContent = picked === null ? 'rest' : `${WIDTHS[picked]}w`
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        SIZES.forEach(([w, d], i) => {
          if (Math.abs(wx - centers[i]) < w / 2 + GAP / 2 && Math.abs(wy) < d / 2 + 4) best = i
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
      lift = v
      drawn.fill(-1)
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const imageVariants: FigureDefinition = {
  id: 'image-variants',
  label:
    'One photo at four sizes; the variant under the pointer lifts off the pad and says its width.',
  rest: 'rest',
  range: [6, 12, LIFT_MAX],
  tour: [[138, 145], [241, 197], [277, 214], null],
  mount
}
