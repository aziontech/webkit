import { Cam, facing, fit, prism, proj, rings, unproj, type Vec3 } from '../engine/iso'
import { type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const COLS = 3
const ROWS = 2
const PITCH_U = 42
const PITCH_V = 30
const KEY_HALF = 6
const KEY_H = 6
const VALUE_AT = 10
const VALUE_HALF_U = 7
const VALUE_HALF_V = 4
const VALUE_H = 7
const PLATE_U = 58
const PLATE_V = 36
const PLATE_H = 5
const FLAT = 0.05
const REACH = 16
const REST_LIT = 0

type Cell = { u: number; v: number; key: Solid; value: Solid; rise: Spring; drawn: number }

const mount: FigureMount = ({ stage, svg, read }) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2)
  const ext: Vec3[] = []
  for (const x of [-PLATE_U, PLATE_U])
    for (const y of [-PLATE_V, PLATE_V]) ext.push([x, y, -PLATE_H], [x, y, VALUE_H + 1])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  const [pr, pi] = rings(-PLATE_U, -PLATE_V, PLATE_U, PLATE_V, 8, 2)
  put(solid(g), prism(P, front, pr, pi, -PLATE_H, 0))

  const cells: Cell[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      cells.push({
        u: (c - (COLS - 1) / 2) * PITCH_U,
        v: (r - (ROWS - 1) / 2) * PITCH_V,
        key: solid(g),
        value: solid(g),
        rise: spring(0, { k: 150, c: 16, eps: 0.02 }),
        drawn: -1
      })

  let lit = REST_LIT
  let picked: number | null = null

  function drawKey(s: Cell) {
    const [o, i] = rings(
      s.u - VALUE_AT - KEY_HALF,
      s.v - KEY_HALF,
      s.u - VALUE_AT + KEY_HALF,
      s.v + KEY_HALF,
      2,
      1
    )
    put(s.key, prism(P, front, o, i, 0, KEY_H))
  }

  function draw(s: Cell) {
    if (s.rise.x === s.drawn) return
    s.drawn = s.rise.x
    if (s.rise.x < FLAT) {
      put(s.value, { sil: '', crease: '' })
      return
    }
    const [o, i] = rings(
      s.u + VALUE_AT - VALUE_HALF_U,
      s.v - VALUE_HALF_V,
      s.u + VALUE_AT + VALUE_HALF_U,
      s.v + VALUE_HALF_V,
      1.5,
      1
    )
    put(s.value, prism(P, front, o, i, 0, s.rise.x))
  }

  cells.forEach(drawKey)

  const loop = register(stage, (dt) => {
    let live = false
    for (const s of cells) {
      live = stepS(s.rise, dt) || live
      draw(s)
    }
    return live
  })
  bag.add(loop.unregister)

  function paint() {
    cells.forEach((s, i) => s.key.sil.classList.toggle('hi', i === lit))
  }

  function pick(next: number | null) {
    picked = next
    lit = next ?? REST_LIT
    cells.forEach((s, i) => {
      s.rise.t = i === next ? VALUE_H : 0
    })
    read.textContent = next === null ? 'masked' : `key ${next + 1} · revealed`
    paint()
    loop.wake()
  }
  pick(null)

  bag.add(
    pointer(stage, {
      move: (p) => {
        const [wx, wy] = unproj(C, p[0], p[1], 0)
        let best: number | null = null
        let bd = REACH
        cells.forEach((s, i) => {
          const d = Math.hypot(wx - (s.u - VALUE_AT), wy - s.v)
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

export const variablesKeys: FigureDefinition = {
  id: 'variables-keys',
  label:
    'A grid of key blocks, each with a flat masked value beside it; the key under the pointer lights and raises its value.',
  rest: 'masked',
  range: [0, 1, 1],
  tour: [[148, 116], [207, 146], [266, 175], [224, 197], null],
  mount
}
