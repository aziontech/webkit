import {
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import type { DiagramEdge } from '../types'

export interface DiagramPath {
  key: string
  d: string
  active: boolean
}

export interface DiagramMarker {
  key: string
  x: number
  y: number
  active: boolean
  label: string
}

export interface UseDiagramConnectorsReturn {
  width: Readonly<Ref<number>>
  height: Readonly<Ref<number>>
  paths: Readonly<Ref<readonly DiagramPath[]>>
  labels: Readonly<Ref<readonly DiagramMarker[]>>
  ports: Readonly<Ref<readonly DiagramMarker[]>>
  ready: Readonly<Ref<boolean>>
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
  middle: number
}

interface Route {
  d: string
  label: { x: number; y: number }
  ends: [{ x: number; y: number }, { x: number; y: number }]
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
      { x: s.right, y: s.middle },
      { x: t.left, y: t.middle }
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
      { x, y: s.bottom },
      { x: t.left, y: t.middle }
    ]
  }
}

const drop = (s: Box, t: Box, inset: number): Route => {
  const x = Math.max(s.left, t.left) + inset
  return {
    d: `M${x} ${s.bottom} V${t.top}`,
    label: { x, y: (s.bottom + t.top) / 2 },
    ends: [
      { x, y: s.bottom },
      { x, y: t.top }
    ]
  }
}

const route = (s: Box, t: Box, inset: number, radius: number): Route => {
  if (t.left >= s.right - 0.5) return curve(s, t)
  if (t.top >= s.bottom - 0.5 && t.left - (s.left + inset) >= 2 * radius) {
    return elbow(s, t, inset, radius)
  }
  return drop(s, t, inset)
}

export function useDiagramConnectors(
  canvas: Ref<globalThis.HTMLElement | null>,
  edges: MaybeRefOrGetter<DiagramEdge[]>
): UseDiagramConnectorsReturn {
  const width = ref(0)
  const height = ref(0)
  const paths = ref<DiagramPath[]>([])
  const labels = ref<DiagramMarker[]>([])
  const ports = ref<DiagramMarker[]>([])
  const ready = ref(false)

  let observer: globalThis.ResizeObserver | null = null
  let frame = 0

  const measure = () => {
    frame = 0
    const element = canvas.value
    if (!element) return
    const frameBox = element.getBoundingClientRect()
    const style = globalThis.getComputedStyle(element)
    const rootSize =
      globalThis.parseFloat(globalThis.getComputedStyle(globalThis.document.documentElement).fontSize) || 16
    const inset = toPx(style.getPropertyValue('--spacing-md'), rootSize)
    const radius = toPx(style.getPropertyValue('--shape-card'), rootSize)

    const box = (key: string): Box | null => {
      const node = element.querySelector(`[data-diagram-node="${key}"]`)
      if (!node) return null
      const r = node.getBoundingClientRect()
      return {
        left: r.left - frameBox.left,
        right: r.right - frameBox.left,
        top: r.top - frameBox.top,
        bottom: r.bottom - frameBox.top,
        middle: (r.top + r.bottom) / 2 - frameBox.top
      }
    }

    const nextPaths: DiagramPath[] = []
    const nextLabels: DiagramMarker[] = []
    const nextPorts = new Map<string, DiagramMarker>()

    for (const edge of toValue(edges)) {
      const source = box(edge.from)
      const target = box(edge.to)
      if (!source || !target) continue
      const key = `${edge.from}-${edge.to}`
      const active = Boolean(edge.active)
      const routed = route(source, target, inset, radius)
      nextPaths.push({ key, d: routed.d, active })
      if (edge.label) nextLabels.push({ key, ...routed.label, active, label: edge.label })
      for (const end of routed.ends) {
        const portKey = `${Math.round(end.x)}:${Math.round(end.y)}`
        const known = nextPorts.get(portKey)
        nextPorts.set(portKey, { key: portKey, ...end, label: '', active: active || Boolean(known?.active) })
      }
    }

    nextPaths.sort((a, b) => Number(a.active) - Number(b.active))
    width.value = frameBox.width
    height.value = frameBox.height
    paths.value = nextPaths
    labels.value = nextLabels
    ports.value = [...nextPorts.values()]
    ready.value = true
  }

  const schedule = () => {
    if (frame) return
    frame = globalThis.requestAnimationFrame(measure)
  }

  watch(
    canvas,
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
    observer?.disconnect()
    if (frame) globalThis.cancelAnimationFrame(frame)
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
