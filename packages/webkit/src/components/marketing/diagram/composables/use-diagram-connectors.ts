import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

import type { DiagramEdge } from '../types'

export interface DiagramPath {
  key: string
  d: string
  active: boolean
}

export type DiagramSide = 'left' | 'right' | 'top' | 'bottom'

export interface DiagramMarker {
  key: string
  x: number
  y: number
  active: boolean
  label: string
}

export interface DiagramPort extends DiagramMarker {
  side: DiagramSide
}

export interface UseDiagramConnectorsReturn {
  width: Readonly<Ref<number>>
  height: Readonly<Ref<number>>
  paths: Readonly<Ref<readonly DiagramPath[]>>
  labels: Readonly<Ref<readonly DiagramMarker[]>>
  ports: Readonly<Ref<readonly DiagramPort[]>>
  ready: Readonly<Ref<boolean>>
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
  middle: number
  centre: number
  tree: boolean
}

interface End {
  x: number
  y: number
  side: DiagramSide
}

interface Route {
  d: string
  label: { x: number; y: number }
  ends: [End, End]
}

const toPx = (value: string, rootSize: number): number => {
  const amount = globalThis.parseFloat(value)
  if (Number.isNaN(amount)) return 0
  return value.trim().endsWith('rem') ? amount * rootSize : amount
}

const curve = (s: Box, t: Box): Route => {
  const mid = (s.right + t.left) / 2
  return {
    d: `M${s.right} ${s.middle} C${mid} ${s.middle} ${mid} ${t.middle} ${t.left} ${t.middle}`,
    label: { x: mid, y: (s.middle + t.middle) / 2 },
    ends: [
      { x: s.right, y: s.middle, side: 'right' },
      { x: t.left, y: t.middle, side: 'left' }
    ]
  }
}

const elbow = (s: Box, t: Box, inset: number, radius: number): Route => {
  const x = s.left + inset
  const r = Math.min(radius, t.middle - s.bottom, t.left - x)
  return {
    d: `M${x} ${s.bottom} V${t.middle - r} Q${x} ${t.middle} ${x + r} ${t.middle} H${t.left}`,
    label: { x, y: t.middle - r - inset },
    ends: [
      { x, y: s.bottom, side: 'bottom' },
      { x: t.left, y: t.middle, side: 'left' }
    ]
  }
}

const drop = (s: Box, t: Box, inset: number): Route => {
  const x = Math.max(s.left, t.left) + inset
  return {
    d: `M${x} ${s.bottom} V${t.top}`,
    label: { x, y: (s.bottom + t.top) / 2 },
    ends: [
      { x, y: s.bottom, side: 'bottom' },
      { x, y: t.top, side: 'top' }
    ]
  }
}

const stack = (s: Box, t: Box, radius: number): Route => {
  const from = s.centre
  const to = t.centre
  const mid = (s.bottom + t.top) / 2
  const ends: [End, End] = [
    { x: from, y: s.bottom, side: 'bottom' },
    { x: to, y: t.top, side: 'top' }
  ]
  if (Math.abs(from - to) < 1) {
    return { d: `M${from} ${s.bottom} V${t.top}`, label: { x: from, y: mid }, ends }
  }
  const way = to > from ? 1 : -1
  const r = Math.max(0, Math.min(radius, Math.abs(to - from) / 2, (t.top - s.bottom) / 2))
  return {
    d: `M${from} ${s.bottom} V${mid - r} Q${from} ${mid} ${from + way * r} ${mid} H${to - way * r} Q${to} ${mid} ${to} ${mid + r} V${t.top}`,
    label: { x: (from + to) / 2, y: mid },
    ends
  }
}

const MIRRORED_SIDE: Record<DiagramSide, DiagramSide> = {
  left: 'right',
  right: 'left',
  top: 'top',
  bottom: 'bottom'
}

const mirrorPath = (d: string, width: number): string =>
  d
    .replace(/([MVHQC])([^MVHQC]*)/g, (_, command: string, args: string) => {
      if (command === 'V') return `${command}${args}`
      const values = args.trim().split(/\s+/).map(Number)
      const flipped = values.map((value, index) =>
        command === 'H' || index % 2 === 0 ? width - value : value
      )
      return `${command}${flipped.join(' ')} `
    })
    .trim()

const mirrorRoute = (routed: Route, width: number): Route => ({
  d: mirrorPath(routed.d, width),
  label: { x: width - routed.label.x, y: routed.label.y },
  ends: routed.ends.map((end) => ({
    x: width - end.x,
    y: end.y,
    side: MIRRORED_SIDE[end.side]
  })) as [End, End]
})

const route = (s: Box, t: Box, inset: number, radius: number): Route => {
  if (t.left >= s.right - 0.5) return curve(s, t)
  const below = t.top >= s.bottom - 0.5
  if (below && !(s.tree && t.tree)) return stack(s, t, radius)
  if (below && t.left - (s.left + inset) >= 2 * radius) {
    return elbow(s, t, inset, radius)
  }
  return drop(s, t, inset)
}

function nodeBox(
  element: globalThis.HTMLElement,
  frameBox: DOMRect,
  rtl: boolean,
  key: string
): Box | null {
  const node = element.querySelector(`[data-diagram-node="${key}"]`)
  if (!node) return null
  const inline = (x: number) => (rtl ? frameBox.width - x : x)
  const r = node.getBoundingClientRect()
  const start = inline(rtl ? r.right - frameBox.left : r.left - frameBox.left)
  const end = inline(rtl ? r.left - frameBox.left : r.right - frameBox.left)
  return {
    left: start,
    right: end,
    top: r.top - frameBox.top,
    bottom: r.bottom - frameBox.top,
    middle: (r.top + r.bottom) / 2 - frameBox.top,
    centre: (start + end) / 2,
    tree: node.parentElement?.closest('[data-stack]')?.getAttribute('data-stack') === 'tree'
  }
}

function layoutConnectors(element: globalThis.HTMLElement, edges: DiagramEdge[]) {
  const frameBox = element.getBoundingClientRect()
  const style = globalThis.getComputedStyle(element)
  const rootSize =
    globalThis.parseFloat(
      globalThis.getComputedStyle(globalThis.document.documentElement).fontSize
    ) || 16
  const inset = toPx(style.getPropertyValue('--spacing-md'), rootSize)
  const radius = toPx(style.getPropertyValue('--shape-card'), rootSize)
  const rtl = style.direction === 'rtl'
  const paths: DiagramPath[] = []
  const labels: DiagramMarker[] = []
  const ports = new Map<string, DiagramPort>()

  for (const edge of edges) {
    const source = nodeBox(element, frameBox, rtl, edge.from)
    const target = nodeBox(element, frameBox, rtl, edge.to)
    if (!source || !target) continue
    const key = `${edge.from}-${edge.to}`
    const active = Boolean(edge.active)
    const logical = route(source, target, inset, radius)
    const routed = rtl ? mirrorRoute(logical, frameBox.width) : logical
    paths.push({ key, d: routed.d, active })
    if (edge.label) labels.push({ key, ...routed.label, active, label: edge.label })
    for (const end of routed.ends) {
      const portKey = `${Math.round(end.x)}:${Math.round(end.y)}`
      const known = ports.get(portKey)
      ports.set(portKey, {
        key: portKey,
        ...end,
        label: '',
        active: active || Boolean(known?.active)
      })
    }
  }

  paths.sort((a, b) => Number(a.active) - Number(b.active))
  return { frameBox, paths, labels, ports: [...ports.values()] }
}

export function useDiagramConnectors(
  canvas: MaybeRefOrGetter<globalThis.HTMLElement | null>,
  edges: MaybeRefOrGetter<DiagramEdge[]>
): UseDiagramConnectorsReturn {
  const width = ref(0)
  const height = ref(0)
  const paths = ref<DiagramPath[]>([])
  const labels = ref<DiagramMarker[]>([])
  const ports = ref<DiagramPort[]>([])
  const ready = ref(false)

  let observer: globalThis.ResizeObserver | null = null
  let frame = 0
  let disposed = false

  const measure = () => {
    frame = 0
    const element = toValue(canvas)
    if (!element) return
    const layout = layoutConnectors(element, toValue(edges))
    width.value = layout.frameBox.width
    height.value = layout.frameBox.height
    paths.value = layout.paths
    labels.value = layout.labels
    ports.value = layout.ports
    ready.value = true
  }

  const schedule = () => {
    if (frame || disposed) return
    frame = globalThis.requestAnimationFrame(measure)
  }

  watch(
    () => toValue(canvas),
    (element) => {
      observer?.disconnect()
      if (!element) return
      observer = new globalThis.ResizeObserver(schedule)
      observer.observe(element)
      element.querySelectorAll('[data-diagram-node]').forEach((node) => observer?.observe(node))
      globalThis.document.fonts?.ready.then(schedule)
      schedule()
    },
    { flush: 'post', immediate: true }
  )

  watch(() => toValue(edges), schedule, { deep: true })

  onScopeDispose(() => {
    disposed = true
    observer?.disconnect()
    if (frame) globalThis.cancelAnimationFrame(frame)
    frame = 0
  })

  return {
    width: readonly(width),
    height: readonly(height),
    paths: readonly(paths),
    labels: readonly(labels),
    ports: readonly(ports),
    ready: readonly(ready)
  }
}
