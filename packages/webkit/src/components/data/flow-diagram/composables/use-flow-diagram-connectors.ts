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

import {
  type AddLink,
  columnLinks,
  edgeLinks,
  markEnds,
  originOf,
  stackedLinks
} from '../lib/connector-links'
import type { FlowDiagramEdgeData, FlowDiagramSeverity } from '../types'

export interface FlowDiagramPath {
  /** SVG path data of the connector. */
  d: string
  /** Reduced opacity when either end is a disabled node. */
  faded: boolean
  /** Colour of the connector, when its edge sets one. */
  severity: FlowDiagramSeverity | null
}

export interface FlowDiagramLabel {
  /** Text of the label. */
  text: string
  /** Horizontal centre of the label, in container pixels. */
  x: number
  /** Vertical centre of the label, in container pixels. */
  y: number
  /** Colour of the label, when its edge sets one. */
  severity: FlowDiagramSeverity | null
  /** The label sits beside a vertical rail instead of on a line. */
  beside: boolean
}

export interface UseFlowDiagramConnectorsReturn {
  /** The connector paths between the measured nodes. */
  paths: ComputedRef<FlowDiagramPath[]>
  /** The edge labels and where they sit. */
  labels: ComputedRef<FlowDiagramLabel[]>
  /** The SVG viewBox matching the container. */
  viewBox: ComputedRef<string>
  /** Whether the steps are stacked top to bottom. */
  vertical: ComputedRef<boolean>
}

export const useFlowDiagramConnectors = (
  containerEl: Ref<HTMLElement | null>,
  edges: MaybeRefOrGetter<FlowDiagramEdgeData[]>
): UseFlowDiagramConnectorsReturn => {
  const paths = ref<FlowDiagramPath[]>([])
  const labels = ref<FlowDiagramLabel[]>([])
  const viewBox = ref<string>('0 0 0 0')
  const vertical = ref<boolean>(false)

  const measure = () => {
    const container = containerEl.value
    if (!container) return
    const style = getComputedStyle(container)
    const base = originOf(container)
    const rtl = style.direction === 'rtl'
    const stacked = style.flexDirection === 'column'
    vertical.value = stacked
    const list = toValue(edges)
    const out: FlowDiagramPath[] = []
    const marks: FlowDiagramLabel[] = []
    const entered = new Set<HTMLElement>()
    const left = new Set<HTMLElement>()
    const add: AddLink = (from, to, path, label) => {
      left.add(from)
      entered.add(to)
      out.push(path)
      if (label) marks.push(label)
    }
    if (stacked) stackedLinks(container, base, rtl, list, add)
    else if (list.length)
      edgeLinks(container, base, rtl, list, Number.parseFloat(style.columnGap) || 0, add)
    else columnLinks(container, base, rtl, add)
    markEnds(container, entered, left)
    viewBox.value = `0 0 ${container.clientWidth} ${container.clientHeight}`
    paths.value = out
    labels.value = marks
  }

  let pending = 0
  const schedule = () => {
    globalThis.cancelAnimationFrame(pending)
    pending = globalThis.requestAnimationFrame(measure)
  }
  onMounted(schedule)
  onScopeDispose(() => globalThis.cancelAnimationFrame(pending))
  watch(() => toValue(edges), schedule, { deep: true })

  useResizeObserver(() => containerEl.value, schedule)
  useMutationObserver(() => containerEl.value, schedule, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-disabled', 'data-state']
  })

  return {
    paths: computed(() => paths.value),
    labels: computed(() => labels.value),
    viewBox: computed(() => viewBox.value),
    vertical: computed(() => vertical.value)
  }
}
