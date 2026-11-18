import { useMutationObserver, useResizeObserver } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import type { NodeDiagramEdgeData, NodeDiagramSeverity } from '../types'

export interface NodeDiagramPath {
  /** SVG path data of the connector. */
  d: string
  /** Reduced opacity when either end is a disabled node. */
  faded: boolean
  /** Colour of the connector, when its edge sets one. */
  severity: NodeDiagramSeverity | null
}

export interface NodeDiagramLabel {
  /** Text of the label. */
  text: string
  /** Horizontal centre of the label, in container pixels. */
  x: number
  /** Vertical centre of the label, in container pixels. */
  y: number
  /** Colour of the label, when its edge sets one. */
  severity: NodeDiagramSeverity | null
  /** The label sits beside a vertical rail instead of on a line. */
  beside: boolean
}

export interface UseNodeDiagramConnectorsReturn {
  /** The connector paths between the measured nodes. */
  paths: ComputedRef<NodeDiagramPath[]>
  /** The edge labels and where they sit. */
  labels: ComputedRef<NodeDiagramLabel[]>
  /** The SVG viewBox matching the container. */
  viewBox: ComputedRef<string>
  /** Whether the steps are stacked top to bottom. */
  vertical: ComputedRef<boolean>
}

interface Point {
  x: number
  y: number
}

interface Endpoint extends Point {
  disabled: boolean
  el: HTMLElement
}

interface Origin {
  left: number
  top: number
  scale: number
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
  cy: number
}

const CORNER = 10
const RAIL_INSET = 16
const NODE = '[data-slot="node-diagram-node"]'
const GROUP = '[data-slot="node-diagram-group"]'
const ANCHOR = '[data-slot="node-diagram-anchor"]'

const elbow = (from: Point, to: Point, busX: number, sign: 1 | -1): string => {
  if (Math.abs(from.y - to.y) < 0.5) {
    return `M${from.x},${from.y} L${to.x},${to.y}`
  }
  const dir = to.y > from.y ? 1 : -1
  const radius = Math.max(
    0,
    Math.min(CORNER, Math.abs(to.y - from.y) / 2, Math.abs(busX - from.x), Math.abs(to.x - busX))
  )
  return [
    `M${from.x},${from.y}`,
    `H${busX - sign * radius}`,
    `Q${busX},${from.y} ${busX},${from.y + dir * radius}`,
    `V${to.y - dir * radius}`,
    `Q${busX},${to.y} ${busX + sign * radius},${to.y}`,
    `H${to.x}`
  ].join(' ')
}

const measureBox = (el: Element, base: Origin): Box => {
  const r = el.getBoundingClientRect()
  return {
    left: (r.left - base.left) / base.scale,
    right: (r.right - base.left) / base.scale,
    top: (r.top - base.top) / base.scale,
    bottom: (r.bottom - base.top) / base.scale,
    cy: ((r.top + r.bottom) / 2 - base.top) / base.scale
  }
}

const readNode = (nodeEl: HTMLElement, base: Origin, rtl: boolean) => {
  const disabled = nodeEl.hasAttribute('data-disabled')
  const terminal = nodeEl.hasAttribute('data-terminal')
  const endEl = nodeEl.querySelector(`${ANCHOR}:not([data-side="start"])`) ?? nodeEl
  const startEl = nodeEl.querySelector(`${ANCHOR}:not([data-side="end"])`) ?? nodeEl
  const endBox = measureBox(endEl, base)
  const startBox = measureBox(startEl, base)
  const entry: Endpoint = {
    x: rtl ? endBox.right : endBox.left,
    y: endBox.cy,
    disabled,
    el: nodeEl
  }
  const exit: Endpoint = {
    x: rtl ? startBox.left : startBox.right,
    y: startBox.cy,
    disabled,
    el: nodeEl
  }
  return { entry, exit, terminal, box: measureBox(nodeEl, base) }
}

const pair = <T>(exits: T[], entries: T[]): Array<[T, T]> => {
  if (exits.length === 1) return entries.map((entry): [T, T] => [exits[0], entry])
  if (entries.length === 1) return exits.map((exit): [T, T] => [exit, entries[0]])
  const count = Math.min(exits.length, entries.length)
  return Array.from({ length: count }, (_, i): [T, T] => [exits[i], entries[i]])
}

export const useNodeDiagramConnectors = (
  containerEl: Ref<HTMLElement | null>,
  edges: MaybeRefOrGetter<NodeDiagramEdgeData[]>
): UseNodeDiagramConnectorsReturn => {
  const paths = ref<NodeDiagramPath[]>([])
  const labels = ref<NodeDiagramLabel[]>([])
  const viewBox = ref<string>('0 0 0 0')
  const vertical = ref<boolean>(false)

  const measure = () => {
    const container = containerEl.value
    if (!container) return

    const rect = container.getBoundingClientRect()
    const base: Origin = {
      left: rect.left,
      top: rect.top,
      scale: container.offsetWidth > 0 ? rect.width / container.offsetWidth : 1
    }
    const style = getComputedStyle(container)
    const rtl = style.direction === 'rtl'
    const sign = rtl ? -1 : 1
    const stacked = style.flexDirection === 'column'
    vertical.value = stacked

    const children = Array.from(
      container.querySelectorAll<HTMLElement>(`:scope > ${NODE}, :scope > ${GROUP}`)
    )

    const list = toValue(edges)
    const out: NodeDiagramPath[] = []
    const marks: NodeDiagramLabel[] = []
    const gap = Number.parseFloat(style.columnGap) || 0
    const entered = new Set<HTMLElement>()
    const left = new Set<HTMLElement>()

    if (stacked) {
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(NODE))
      for (let i = 0; i < nodes.length - 1; i += 1) {
        const from = nodes[i]
        const to = nodes[i + 1]
        if (from.hasAttribute('data-terminal') && !list.length) continue
        const a = measureBox(from, base)
        const b = measureBox(to, base)
        const x = rtl ? a.right - RAIL_INSET : a.left + RAIL_INSET
        const edge = list.find(
          (e) => e.from === from.dataset['nodeKey'] && e.to === to.dataset['nodeKey']
        )
        left.add(from)
        entered.add(to)
        out.push({
          d: `M${x},${a.bottom} L${x},${b.top}`,
          faded: from.hasAttribute('data-disabled') || to.hasAttribute('data-disabled'),
          severity: edge?.severity ?? null
        })
        if (edge?.label) {
          marks.push({
            text: edge.label,
            x: x + (sign * RAIL_INSET) / 2,
            y: (a.bottom + b.top) / 2,
            severity: edge.severity ?? null,
            beside: true
          })
        }
      }
    } else if (list.length) {
      const byKey = new Map<string, HTMLElement>()
      container.querySelectorAll<HTMLElement>(`${NODE}[data-node-key]`).forEach((el) => {
        byKey.set(el.dataset['nodeKey'] ?? '', el)
      })
      for (const edge of list) {
        const fromEl = byKey.get(edge.from)
        const toEl = byKey.get(edge.to)
        if (!fromEl || !toEl) continue
        const from = readNode(fromEl, base, rtl)
        const to = readNode(toEl, base, rtl)
        const columnEl = fromEl.closest(GROUP) ?? fromEl
        const columnBox = measureBox(columnEl, base)
        const columnEdge = rtl ? columnBox.left : columnBox.right
        const busX = columnEdge + (sign * gap) / 2
        left.add(fromEl)
        entered.add(toEl)
        out.push({
          d: elbow(from.exit, to.entry, busX, sign),
          faded: from.exit.disabled || to.entry.disabled,
          severity: edge.severity ?? null
        })
        if (edge.label) {
          const fanIn = list.filter((other) => other.to === edge.to).length > 1
          marks.push({
            text: edge.label,
            x: busX,
            y: fanIn ? from.exit.y : to.entry.y,
            severity: edge.severity ?? null,
            beside: false
          })
        }
      }
    } else {
      const read = children.map((el) => {
        if (el.dataset['slot'] === 'node-diagram-group') {
          const branches = Array.from(el.querySelectorAll<HTMLElement>(NODE)).map((node) =>
            readNode(node, base, rtl)
          )
          return {
            exits: branches.filter((b) => !b.terminal).map((b) => b.exit),
            entries: branches.map((b) => b.entry)
          }
        }
        const node = readNode(el, base, rtl)
        return { exits: node.terminal ? [] : [node.exit], entries: [node.entry] }
      })
      for (let i = 0; i < read.length - 1; i += 1) {
        const from = read[i]
        const to = read[i + 1]
        if (!from.exits.length || !to.entries.length) continue
        const fromEdge = sign * Math.max(...from.exits.map((e) => sign * e.x))
        const toEdge = sign * Math.min(...to.entries.map((e) => sign * e.x))
        const busX = fromEdge + (toEdge - fromEdge) / 2
        for (const [exit, entry] of pair(from.exits, to.entries)) {
          left.add(exit.el)
          entered.add(entry.el)
          out.push({
            d: elbow(exit, entry, busX, sign),
            faded: exit.disabled || entry.disabled,
            severity: null
          })
        }
      }
    }

    container.querySelectorAll<HTMLElement>(NODE).forEach((el) => {
      el.toggleAttribute('data-entry', entered.has(el))
      el.toggleAttribute('data-exit', left.has(el))
    })

    viewBox.value = `0 0 ${container.clientWidth} ${container.clientHeight}`
    paths.value = out
    labels.value = marks
  }

  let frame = 0
  const schedule = () => {
    globalThis.cancelAnimationFrame(frame)
    frame = globalThis.requestAnimationFrame(measure)
  }
  onMounted(schedule)
  onScopeDispose(() => globalThis.cancelAnimationFrame(frame))
  watch(() => toValue(edges), schedule, { deep: true })

  useResizeObserver(() => containerEl.value, measure)
  useMutationObserver(
    () => containerEl.value,
    () => measure(),
    {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-disabled', 'data-state']
    }
  )

  return {
    paths: computed(() => paths.value),
    labels: computed(() => labels.value),
    viewBox: computed(() => viewBox.value),
    vertical: computed(() => vertical.value)
  }
}
