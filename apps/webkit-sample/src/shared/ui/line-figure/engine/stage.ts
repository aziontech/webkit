import { type Camera, type PrismPaths, r2, type Vec2 } from './iso'
import { EASE_LIFT, reducedMotion, setReducedMotion } from './motion'

export type Attrs = Record<string, string | number>

const NS = 'http://www.w3.org/2000/svg'

export function mk<K extends keyof globalThis.SVGElementTagNameMap>(
  tag: K,
  attrs?: Attrs | null,
  parent?: Element | null
): globalThis.SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag)
  if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]))
  if (parent) parent.appendChild(e)
  return e
}

export type Solid = { g: SVGGElement; sil: SVGPathElement; cr: SVGPathElement }

export function solid(parent: Element): Solid {
  const g = mk('g', {}, parent)
  return { g, sil: mk('path', { class: 'sil' }, g), cr: mk('path', { class: 'nf lo' }, g) }
}

export const put = (el: Solid, s: PrismPaths) => {
  el.sil.setAttribute('d', s.sil)
  el.cr.setAttribute('d', s.crease)
}

export const flatDot = (parent: Element, C: Camera, r: number, cls: string) =>
  mk('ellipse', { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent)

export const place = (el: SVGElement, q: Vec2) => {
  el.setAttribute('cx', String(r2(q[0])))
  el.setAttribute('cy', String(r2(q[1])))
}

export type Tick = (dt: number, now: number) => boolean | void
export type Loop = { wake(): void; unregister(): void }

type Board = { stage: Element; tick: Tick; vis: boolean; awake: boolean }

let boards: Board[] = []
const byStage = new Map<Element, Set<Board>>()
let raf = 0
let last = 0
let io: IntersectionObserver | null = null
let rm: MediaQueryList | null = null

function frame(now: number) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
  last = now
  let any = false
  for (const b of boards.slice())
    if (b.vis && b.awake) {
      try {
        b.awake = !!b.tick(dt, now)
      } catch (err) {
        b.awake = false
        setTimeout(() => {
          throw err
        })
      }
      any = any || b.awake
    }
  raf = any ? requestAnimationFrame(frame) : 0
}

function wakeBoard(b: Board) {
  b.awake = true
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
}

const onMotion = () => {
  setReducedMotion(!!rm?.matches)
  boards.forEach(wakeBoard)
}

function start() {
  if (io) return
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const set = byStage.get(e.target)
        if (!set) continue
        for (const b of set) {
          b.vis = e.isIntersecting
          if (b.vis) wakeBoard(b)
        }
      }
    },
    { rootMargin: '80px' }
  )
  rm = matchMedia('(prefers-reduced-motion: reduce)')
  setReducedMotion(rm.matches)
  rm.addEventListener('change', onMotion)
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  io?.disconnect()
  io = null
  rm?.removeEventListener('change', onMotion)
  rm = null
}

export function register(stage: Element, tick: Tick): Loop {
  start()
  const b: Board = { stage, tick, vis: false, awake: true }
  boards.push(b)
  const peers = byStage.get(stage)
  if (peers) {
    for (const p of peers) b.vis = p.vis
    peers.add(b)
    if (b.vis) wakeBoard(b)
  } else {
    byStage.set(stage, new Set([b]))
    io?.observe(stage)
  }
  tick(0, performance.now())
  let gone = false
  return {
    wake: () => {
      if (!gone) wakeBoard(b)
    },
    unregister: () => {
      if (gone) return
      gone = true
      boards = boards.filter((x) => x !== b)
      const set = byStage.get(stage)
      if (set) {
        set.delete(b)
        if (!set.size) {
          byStage.delete(stage)
          io?.unobserve(stage)
        }
      }
      if (!boards.length) stop()
    }
  }
}

export type PointerHandlers = {
  move(p: Vec2, e: PointerEvent): void
  down?(p: Vec2, e: PointerEvent): void
  leave(e: PointerEvent): void
}

const handlers = new WeakMap<Element, PointerHandlers>()
const touring = new WeakMap<Element, { hold(): void; release(): void }>()

export function pointer(stage: HTMLElement, on: PointerHandlers): () => void {
  handlers.set(stage, on)
  let tm = 0
  const pt = (e: PointerEvent): Vec2 => {
    const r = stage.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 320]
  }
  const move = (e: PointerEvent) => {
    clearTimeout(tm)
    touring.get(stage)?.hold()
    on.move(pt(e), e)
  }
  const down = (e: PointerEvent) => {
    clearTimeout(tm)
    touring.get(stage)?.hold()
    if (e.pointerType !== 'mouse') stage.releasePointerCapture?.(e.pointerId)
    if (on.down) on.down(pt(e), e)
    else on.move(pt(e), e)
  }
  const leave = (e: PointerEvent) => {
    clearTimeout(tm)
    tm = window.setTimeout(
      () => {
        on.leave(e)
        touring.get(stage)?.release()
      },
      e.pointerType === 'mouse' ? 0 : 1400
    )
  }
  stage.addEventListener('pointermove', move)
  stage.addEventListener('pointerdown', down)
  stage.addEventListener('pointerleave', leave)
  return () => {
    clearTimeout(tm)
    if (handlers.get(stage) === on) handlers.delete(stage)
    stage.removeEventListener('pointermove', move)
    stage.removeEventListener('pointerdown', down)
    stage.removeEventListener('pointerleave', leave)
  }
}

export type Tour = ReadonlyArray<Vec2 | null>
export type TourHandle = { stop(): void }

export const LAP: Tour = [[128, 150], [200, 118], [272, 150], [200, 206], null]

const TRAVEL = 900
const DWELL = 1200
const REST = 1800
const RESUME = 1200
const STAGGER = 450
const GHOST = { pointerType: 'ghost' } as PointerEvent
let started = 0

function entry([x, y]: Vec2): Vec2 {
  const dx = x - 200
  const dy = y - 160
  if (!dx && !dy) return [200, 320]
  const k = Math.min(
    dx ? (dx > 0 ? 200 : -200) / dx : Infinity,
    dy ? (dy > 0 ? 160 : -160) / dy : Infinity
  )
  return [200 + dx * k, 160 + dy * k]
}

export function tour(stage: HTMLElement, stops: Tour): TourHandle {
  let i = 0
  let wait = RESUME + STAGGER * (started++ % 4)
  let t = -1
  let at: Vec2 | null = null
  let origin: Vec2 = [200, 320]
  let hand = false
  let keys = stage.contains(stage.ownerDocument.activeElement)
  let gone = false

  const leave = () => {
    at = null
    t = -1
    handlers.get(stage)?.leave(GHOST)
  }

  const tick: Tick = (dt) => {
    if (hand || keys || !stops.length) return false
    if (reducedMotion()) {
      if (at) leave()
      return false
    }
    if (wait > 0) {
      wait -= dt * 1000
      return true
    }
    const next = stops[i]
    if (next === null) {
      if (at) leave()
      i = (i + 1) % stops.length
      wait = REST
      return true
    }
    const h = handlers.get(stage)
    if (!h) return true
    if (t < 0) {
      origin = at ?? entry(next)
      t = 0
    }
    t = Math.min(TRAVEL, t + dt * 1000)
    const k = EASE_LIFT(t / TRAVEL)
    at = [origin[0] + (next[0] - origin[0]) * k, origin[1] + (next[1] - origin[1]) * k]
    h.move(at, GHOST)
    if (t < TRAVEL) return true
    i = (i + 1) % stops.length
    t = -1
    wait = DWELL
    return true
  }

  const take = () => {
    at = null
    t = -1
  }
  const give = () => {
    if (hand || keys) return
    i = 0
    t = -1
    wait = RESUME
    board.wake()
  }
  const me = {
    hold: () => {
      hand = true
      take()
    },
    release: () => {
      if (!hand) return
      hand = false
      give()
    }
  }
  const focusIn = () => {
    keys = true
    take()
  }
  const focusOut = (e: FocusEvent) => {
    if (keys && !stage.contains(e.relatedTarget as Node | null)) {
      keys = false
      give()
    }
  }
  stage.addEventListener('focusin', focusIn)
  stage.addEventListener('focusout', focusOut)
  touring.set(stage, me)
  const board = register(stage, tick)

  return {
    stop: () => {
      if (gone) return
      gone = true
      board.unregister()
      stage.removeEventListener('focusin', focusIn)
      stage.removeEventListener('focusout', focusOut)
      if (touring.get(stage) === me) touring.delete(stage)
      if (at) leave()
    }
  }
}

export type Disposer = { add(fn: () => void): void; dispose(): void }

export function disposer(): Disposer {
  let fns: Array<() => void> = []
  return {
    add: (fn) => {
      fns.push(fn)
    },
    dispose: () => {
      const runAll = fns
      fns = []
      for (let i = runAll.length - 1; i >= 0; i--) runAll[i]()
    }
  }
}
