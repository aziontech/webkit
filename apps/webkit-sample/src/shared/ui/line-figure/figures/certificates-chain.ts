import { Cam, facing, fit, prism, proj, rings, type Vec3 } from '../engine/iso'
import { reducedMotion, type Spring, spring, stepS } from '../engine/motion'
import { disposer, mk, pointer, put, register, type Solid, solid } from '../engine/stage'
import type { FigureDefinition, FigureMount } from '../engine/types'

const NAMES = ['leaf', 'intermediate', 'root']
const HALF_U = [22, 34, 46]
const HALF_V = [16, 24, 32]
const THICK = 5
const GAP = 11
const LIFT = 4.5
const POST = 2.2
const POST_U = 8
const STAGGER_MAX = 0.18
const REST_SLAB = 0

type Slab = {
  el: Solid
  base: number
  lift: Spring
  wait: number
  pending: number | null
  drawn: number
}

type Post = { el: Solid; low: number; side: number; drawn: string }

const mount: FigureMount = ({ stage, svg, read }, value) => {
  const bag = disposer()
  const C = Cam(45, 0.5, 2.4)
  const levels = NAMES.length
  const baseOf = (i: number) => (levels - 1 - i) * (THICK + GAP)
  const ext: Vec3[] = []
  for (const x of [-HALF_U[2], HALF_U[2]])
    for (const y of [-HALF_V[2], HALF_V[2]]) ext.push([x, y, 0], [x, y, baseOf(0) + THICK + LIFT])
  fit(C, ext, 200, 166)
  const P = proj(C)
  const front = facing(C)
  let stagger = value

  const g = mk('g', {}, svg)
  const slabs: Slab[] = []
  const posts: Post[] = []
  for (let i = levels - 1; i >= 0; i--) {
    slabs[i] = {
      el: solid(g),
      base: baseOf(i),
      lift: spring(0, { eps: 0.002 }),
      wait: 0,
      pending: null,
      drawn: -1
    }
    if (i > 0)
      for (const side of [-1, 1]) {
        posts.push({ el: solid(g), low: i, side, drawn: '' })
      }
  }

  const slabRings = (i: number) => rings(-HALF_U[i], -HALF_V[i], HALF_U[i], HALF_V[i], 5, 1.6)
  const postRing = (side: number) =>
    rings(side * POST_U - POST, -POST, side * POST_U + POST, POST, 0.8, 0.5)

  let sel = REST_SLAB
  let active = false

  function paint() {
    slabs.forEach((s, i) => s.el.sil.classList.toggle('hi', i === sel))
  }

  function drawSlab(i: number) {
    const s = slabs[i]
    if (s.lift.x === s.drawn) return
    s.drawn = s.lift.x
    const [o, inner] = slabRings(i)
    const z = s.base + s.lift.x
    put(s.el, prism(P, front, o, inner, z, z + THICK))
  }

  function drawPosts() {
    posts.forEach((p) => {
      const lower = slabs[p.low]
      const upper = slabs[p.low - 1]
      const z0 = lower.base + THICK + lower.lift.x
      const z1 = upper.base + upper.lift.x
      const key = `${z0}|${z1}`
      if (key === p.drawn) return
      p.drawn = key
      const [o] = postRing(p.side)
      put(p.el, prism(P, front, o, null, Math.min(z0, z1), Math.max(z0, z1)))
    })
  }

  function aim(i: number, target: number, delay: number) {
    const s = slabs[i]
    const wanted = s.pending ?? s.lift.t
    if (wanted === target) return
    if (reducedMotion() || delay <= 0) {
      s.lift.t = target
      s.pending = null
      return
    }
    s.pending = target
    s.wait = delay
  }

  function retarget(rising: boolean) {
    slabs.forEach((_, i) => {
      const raised = active && i <= sel ? LIFT : 0
      aim(i, raised, (rising ? i : levels - 1 - i) * stagger)
    })
  }

  const loop = register(stage, (dt) => {
    let live = false
    slabs.forEach((s, i) => {
      if (s.pending !== null) {
        s.wait -= dt
        if (s.wait <= 0) {
          s.lift.t = s.pending
          s.pending = null
        }
        live = true
      }
      live = stepS(s.lift, dt) || live
      drawSlab(i)
    })
    drawPosts()
    return live
  })
  bag.add(loop.unregister)
  paint()

  const centreY = (i: number) => P(0, 0, baseOf(i) + THICK / 2)[1]

  bag.add(
    pointer(stage, {
      move: (p) => {
        let best = 0
        let bd = Infinity
        for (let i = 0; i < levels; i++) {
          const d = Math.abs(p[1] - centreY(i))
          if (d < bd) {
            bd = d
            best = i
          }
        }
        if (active && best === sel) return
        const rising = best >= sel
        active = true
        sel = best
        read.textContent = `${NAMES[sel]} · trusted`
        retarget(rising)
        paint()
        loop.wake()
      },
      leave: () => {
        active = false
        sel = REST_SLAB
        read.textContent = 'leaf · trusted'
        retarget(false)
        paint()
        loop.wake()
      }
    })
  )
  bag.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      stagger = v
    },
    destroy: bag.dispose
  }
}

export const certificatesChain: FigureDefinition = {
  id: 'certificates-chain',
  label:
    'A root, an intermediate and a leaf certificate stacked on thin posts; the pointer walks the verification mark along the chain and the slabs it passes lift in turn.',
  rest: 'leaf · trusted',
  range: [0.02, 0.08, STAGGER_MAX],
  tour: [[200, 137], [200, 171], [200, 204], [200, 171], null],
  mount
}
