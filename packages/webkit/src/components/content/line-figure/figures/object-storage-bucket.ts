import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { shift } from '../engine/mark'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const W = 52
const D = 20
const TRAY_H = 5
const BASE = -1.5
const GAP = 3
const SPREAD = 4
const LIFT_MAX = 22
const REST_PICK = 2
const WIDTHS = [11, 16, 10, 14, 12, 15]
const DEPTHS = [10, 12, 9, 14, 10, 11]
const HEIGHTS = [6, 4, 9, 5, 8, 3]
const SIZES = ['0.8 MB', '5.6 MB', '12 MB', '2.1 MB', '48 KB', '340 KB']

type Item = { u: number; w: number; el: Solid; up: Spring; side: Spring; drawn: string }

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.2)
  const ext: Vec3[] = []
  const top = Math.max(...HEIGHTS) + BASE + LIFT_MAX
  for (const x of [-W, W]) for (const y of [-D, D]) ext.push([x, y, -TRAY_H], [x, y, top])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [to, ti] = rings(-W, -D, W, D, 6, 1.5)
  put(solid(g), prism(P, front, to, ti, -TRAY_H, 0))

  const span = WIDTHS.reduce((a, b) => a + b, 0) + GAP * (WIDTHS.length - 1)
  let cursor = -span / 2
  const items: Item[] = WIDTHS.map((w) => {
    const u = cursor + w / 2
    cursor += w + GAP
    return {
      u,
      w,
      el: solid(g),
      up: spring(0, { eps: 0.02 }),
      side: spring(0, { eps: 0.02 }),
      drawn: ''
    }
  })

  let lift = value
  let picked: number | null = null

  function draw() {
    items.forEach((it, n) => {
      const key = `${it.up.x}|${it.side.x}`
      if (key === it.drawn) return
      it.drawn = key
      const [o, i] = rings(
        it.u - it.w / 2,
        -DEPTHS[n] / 2,
        it.u + it.w / 2,
        DEPTHS[n] / 2,
        1.5,
        0.8
      )
      const z = BASE + it.up.x
      put(it.el, prism(P, front, shift(o, it.side.x, 0), shift(i, it.side.x, 0), z, z + HEIGHTS[n]))
    })
  }

  const loop = register(stage, (dt) => {
    const moving = items
      .flatMap((it) => [it.up, it.side])
      .map((s) => stepS(s, dt))
      .some(Boolean)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  function retarget() {
    items.forEach((it, n) => {
      const dist = picked === null ? 0 : n - picked
      it.up.t = n === picked ? lift : 0
      it.side.t = dist === 0 ? 0 : Math.sign(dist) * (SPREAD / Math.abs(dist))
      it.el.sil.classList.toggle('hi', n === (picked ?? REST_PICK))
    })
    read.textContent = picked === null ? 'idle' : `obj ${picked + 1} · ${SIZES[picked]}`
    loop.wake()
  }
  retarget()

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        if (Math.abs(wy) > D) return
        let best = 0
        items.forEach((it, n) => {
          if (Math.abs(wx - it.u) < Math.abs(wx - items[best].u)) best = n
        })
        if (Math.abs(wx - items[best].u) > items[best].w / 2 + GAP / 2 || best === picked) return
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
      if (picked !== null) retarget()
    },
    destroy: bag.dispose
  }
}

export const objectStorageBucket: FigureDefinition = {
  id: 'object-storage-bucket',
  label:
    'An open bucket tray holding six objects of different sizes; the one under the pointer lifts out and its neighbours settle apart.',
  rest: 'idle',
  range: [8, 14, LIFT_MAX],
  tour: [[162, 170], [210, 194], [261, 220], null],
  mount
}
