import { Cam, circ, clamp, facing, fit, prism, proj, rad, rings, type Vec3 } from '../engine/iso'
import { rotate } from '../engine/mark'
import { spring, stepS } from '../engine/motion'
import { disposer, flatDot, mk, place, pointer, put, register, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const R_BASE = 40
const R_PLATE = 34
const R_TICK = 26
const TICKS = 21
const H = 5
const TOP = 4
const REST_VALUE = 0.35
const SWEEP_FROM = 155
const SWEEP = 220

const [NO, NI] = rings(-4, -2.2, 24, 2.2, 1.4, 0.8)
const BASE = circ(R_BASE, 56)
const BASE_IN = circ(R_BASE - 2, 56)
const PLATE = circ(R_PLATE, 56)
const PLATE_IN = circ(R_PLATE - 1.4, 56)
const HUB = circ(4.2, 20)
const HUB_IN = circ(3.2, 20)
const angleOf = (t: number) => rad(SWEEP_FROM - SWEEP * t)

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 3)
  const ext: Vec3[] = []
  for (const x of [-R_BASE, R_BASE])
    for (const y of [-R_BASE, R_BASE]) ext.push([x, y, -H], [x, y, 9])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)

  const g = mk('g', {}, svg)
  put(solid(g), prism(P, front, BASE, BASE_IN, -H, 0))
  put(solid(g), prism(P, front, PLATE, PLATE_IN, 0, TOP))
  const ticks = Array.from({ length: TICKS }, (_, k) => {
    const a = angleOf(k / (TICKS - 1))
    const dot = flatDot(g, C, 1.2, 'dot off')
    place(dot, P(R_TICK * Math.cos(a), R_TICK * Math.sin(a), TOP))
    return dot
  })
  const needle = solid(g)
  needle.sil.classList.add('hi')
  put(solid(g), prism(P, front, HUB, HUB_IN, TOP, TOP + 4))

  const sp = spring(REST_VALUE, { eps: 0.001 })
  let drawn = Number.NaN

  function draw() {
    if (sp.x === drawn) return
    drawn = sp.x
    const a = angleOf(sp.x)
    put(needle, prism(P, front, rotate(NO, a), rotate(NI, a), TOP, TOP + 3))
    ticks.forEach((d, k) => d.setAttribute('class', k / (TICKS - 1) <= sp.x ? 'dot m' : 'dot off'))
  }

  const loop = register(stage, (dt) => {
    const moving = stepS(sp, dt)
    draw()
    return moving
  })
  bag.add(loop.unregister)

  bag.add(
    pointer(stage, {
      move: (p) => {
        sp.t = clamp((p[0] - 80) / 240, 0, 1)
        read.textContent = `p95 ${Math.round(40 + sp.t * 210)} ms`
        loop.wake()
      },
      leave: () => {
        sp.t = REST_VALUE
        read.textContent = 'rest'
        loop.wake()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  const weigh = (k: number) => {
    sp.k = k
    sp.c = 1.8 * Math.sqrt(k)
  }
  weigh(value)

  return {
    set: (v) => {
      weigh(v)
      loop.wake()
    },
    destroy: bag.dispose
  }
}

export const metricsGauge: FigureDefinition = {
  id: 'metrics-gauge',
  label:
    'A gauge whose needle follows the pointer across its scale, lighting the ticks it has passed.',
  rest: 'rest',
  range: [40, 100, 220],
  tour: [[110, 200], [200, 150], [290, 190], null],
  mount
}
