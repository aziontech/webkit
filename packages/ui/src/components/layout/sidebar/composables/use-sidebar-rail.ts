import { curve, duration } from '@aziontech/theme/animations'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  type Ref,
  ref,
  shallowRef,
  toValue
} from 'vue'

import { type Direction, useDirection } from '../../../../composables/use-direction'

const COLLAPSE_SNAP = 56

export const SIDEBAR_NUDGE_STEP = 16

const TAP_SLOP = 3

const SIDEBAR_PREVIEW_WIDTH_TOKEN = '--size-10'

export const SIDEBAR_ICON_RAIL_TOKEN = '--size-14'
const SIDEBAR_ICON_RAIL_FALLBACK = 56
const SIDEBAR_PREVIEW_WIDTH_FALLBACK = 40

const RAIL_MIN_OPACITY = 0.2

export interface UseSidebarRailOptions {
  collapsed: Ref<boolean>
  width: Ref<number | null>
  minWidthToken: MaybeRefOrGetter<string>
  maxWidthToken: MaybeRefOrGetter<string>
  enabled: MaybeRefOrGetter<boolean>
  collapsedWidthToken?: MaybeRefOrGetter<string>
}

export interface UseSidebarRailReturn {
  railEl: Ref<globalThis.HTMLElement | null>
  resizing: Readonly<Ref<boolean>>
  previewing: Readonly<Ref<boolean>>
  startPreview: () => void
  endPreview: () => void
  valueNow: Readonly<Ref<number>>
  valueMin: Readonly<Ref<number>>
  valueMax: Readonly<Ref<number>>
  railStyle: ComputedRef<Record<string, string | undefined>>
  innerStyle: ComputedRef<Record<string, string | undefined>>
  startResize: (event: globalThis.PointerEvent) => void
  tapToExpand: () => void
  nudge: (delta: number) => void
  measure: () => void
  dir: Readonly<Ref<Direction>>
}

const readTokenPx = (token: string, fallback: number): number => {
  if (typeof globalThis.document === 'undefined') return fallback
  const value = Number.parseFloat(
    globalThis.getComputedStyle(globalThis.document.documentElement).getPropertyValue(token)
  )
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const prefersReducedMotion = (): boolean => {
  if (typeof globalThis.matchMedia === 'undefined') return false
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const previewTransition = (): string => {
  if (prefersReducedMotion()) return 'none'
  return `width ${duration['moderate-02']} ${curve['expressive-entrance']}`
}

interface RailContext {
  collapsed: Ref<boolean>
  width: Ref<number | null>
  railMin: Ref<number>
  railMax: Ref<number>
  collapsedWidth: ComputedRef<number>
  dir: Readonly<Ref<Direction>>
  clamp: (value: number) => number
}

const measureRail = (
  el: globalThis.HTMLElement | null,
  width: Ref<number | null>,
  clamp: (value: number) => number
) => {
  if (width.value == null && el?.offsetWidth) width.value = clamp(el.offsetWidth)
}

const grabPointer = (event: globalThis.PointerEvent): (() => void) => {
  const target = event.currentTarget as globalThis.HTMLElement | null
  let captured: globalThis.HTMLElement | null = null
  try {
    target?.setPointerCapture(event.pointerId)
    captured = target
  } catch {
    captured = null
  }
  globalThis.document.body.style.userSelect = 'none'
  globalThis.document.body.style.cursor = 'col-resize'
  return () => {
    if (captured?.hasPointerCapture(event.pointerId))
      captured.releasePointerCapture(event.pointerId)
    globalThis.document.body.style.removeProperty('user-select')
    globalThis.document.body.style.removeProperty('cursor')
  }
}

const listenWindow = (
  onMove: (event: globalThis.PointerEvent) => void,
  onEnd: () => void
): (() => void) => {
  globalThis.addEventListener('pointermove', onMove)
  globalThis.addEventListener('pointerup', onEnd)
  globalThis.addEventListener('pointercancel', onEnd)
  globalThis.addEventListener('blur', onEnd)
  return () => {
    globalThis.removeEventListener('pointermove', onMove)
    globalThis.removeEventListener('pointerup', onEnd)
    globalThis.removeEventListener('pointercancel', onEnd)
    globalThis.removeEventListener('blur', onEnd)
  }
}

const dragWidth = (
  { collapsed, width, railMin, railMax, clamp }: RailContext,
  next: number,
  restoreWidth: number
) => {
  if (collapsed.value) {
    if (next >= railMin.value) {
      collapsed.value = false
      width.value = clamp(next)
    }
    return
  }
  if (next < railMin.value - COLLAPSE_SNAP) {
    width.value = clamp(restoreWidth)
    collapsed.value = true
    return
  }
  width.value = Math.max(0, Math.min(next, railMax.value))
}

const nudgeWidth = ({ collapsed, width, railMin, clamp }: RailContext, delta: number) => {
  if (collapsed.value) {
    if (delta > 0) collapsed.value = false
    return
  }
  const next = (width.value ?? railMin.value) + delta
  if (next < railMin.value - COLLAPSE_SNAP) {
    collapsed.value = true
    return
  }
  width.value = clamp(next)
}

function useRailDrag(context: RailContext) {
  const { collapsed, width, railMin, collapsedWidth, dir, clamp } = context
  const resizing = ref(false)
  const pullProgress = ref(1)
  const peekWidth = ref(0)
  let startX = 0
  let startWidth = 0
  let restoreWidth = 0
  let dragMoved = false
  let stop: (() => void) | null = null

  const onPointermove = (event: globalThis.PointerEvent) => {
    const travel = (event.clientX - startX) * (dir.value === 'rtl' ? -1 : 1)
    const next = startWidth + travel
    if (Math.abs(travel) > TAP_SLOP) dragMoved = true
    pullProgress.value = Math.max(0, Math.min(1, next / railMin.value))
    peekWidth.value = Math.max(collapsedWidth.value, Math.min(next, railMin.value))
    dragWidth(context, next, restoreWidth)
  }

  const endResize = () => {
    if (!resizing.value) return
    resizing.value = false
    if (!collapsed.value) width.value = clamp(width.value ?? railMin.value)
    peekWidth.value = 0
    pullProgress.value = 1
    stop?.()
    stop = null
  }

  const tapToExpand = () => {
    if (dragMoved) return
    if (collapsed.value) collapsed.value = false
  }

  const startResize = (event: globalThis.PointerEvent) => {
    const fromCollapsed = collapsed.value
    resizing.value = true
    dragMoved = false
    startX = event.clientX
    startWidth = fromCollapsed ? collapsedWidth.value : (width.value ?? railMin.value)
    restoreWidth = width.value ?? railMin.value
    pullProgress.value = fromCollapsed ? 0 : 1
    peekWidth.value = fromCollapsed ? collapsedWidth.value : 0
    const release = grabPointer(event)
    const unlisten = listenWindow(onPointermove, endResize)
    stop = () => {
      release()
      unlisten()
    }
    event.preventDefault()
  }

  onScopeDispose(endResize)

  return { resizing, pullProgress, peekWidth, startResize, tapToExpand }
}

function useRailPreview(
  collapsed: Ref<boolean>,
  resizing: Ref<boolean>,
  peekWidth: Ref<number>,
  enabled: MaybeRefOrGetter<boolean>
) {
  const previewHover = ref(false)
  const previewWidth = ref(SIDEBAR_PREVIEW_WIDTH_FALLBACK)
  onMounted(() => {
    previewWidth.value = readTokenPx(SIDEBAR_PREVIEW_WIDTH_TOKEN, previewWidth.value)
  })
  const previewing = computed(
    () => previewHover.value && collapsed.value && !resizing.value && toValue(enabled)
  )
  const startPreview = () => {
    previewHover.value = true
  }
  const endPreview = () => {
    previewHover.value = false
  }
  const peeking = computed(() => resizing.value && collapsed.value)
  const railStyle = computed(() => {
    if (!toValue(enabled)) return {}
    if (peeking.value) return { width: `${peekWidth.value}px`, transition: 'none' }
    if (previewing.value) {
      return { width: `${previewWidth.value}px`, transition: previewTransition() }
    }
    return {}
  })
  return { previewing, startPreview, endPreview, railStyle }
}

export function useSidebarRail(options: UseSidebarRailOptions): UseSidebarRailReturn {
  const { collapsed, width } = options

  const railEl = shallowRef<globalThis.HTMLElement | null>(null)
  const dir = useDirection(railEl)

  const railMin = ref(256)
  const railMax = ref(408)

  const clamp = (value: number) => Math.min(Math.max(value, railMin.value), railMax.value)

  const iconRailWidth = ref(SIDEBAR_ICON_RAIL_FALLBACK)
  const collapsedWidth = computed(() =>
    toValue(options.collapsedWidthToken) ? iconRailWidth.value : 0
  )

  const context: RailContext = { collapsed, width, railMin, railMax, collapsedWidth, dir, clamp }
  const { resizing, pullProgress, peekWidth, startResize, tapToExpand } = useRailDrag(context)
  const { previewing, startPreview, endPreview, railStyle } = useRailPreview(
    collapsed,
    resizing,
    peekWidth,
    options.enabled
  )

  const measure = () => measureRail(railEl.value, width, clamp)

  onMounted(() => {
    railMin.value = readTokenPx(toValue(options.minWidthToken), railMin.value)
    railMax.value = readTokenPx(toValue(options.maxWidthToken), railMax.value)
    iconRailWidth.value = readTokenPx(SIDEBAR_ICON_RAIL_TOKEN, iconRailWidth.value)
    if (width.value != null) width.value = clamp(width.value)
    measure()
    railEl.value?.style.removeProperty('width')
  })

  const underMin = computed(() => resizing.value && pullProgress.value < 1)

  const innerStyle = computed(() => {
    if (!toValue(options.enabled) || !resizing.value) return {}
    if (!underMin.value || collapsedWidth.value > 0) {
      return { translate: '0%', opacity: '1', transition: 'none' }
    }
    return {
      width: `${railMin.value}px`,
      translate: `${(peekWidth.value - railMin.value) * (dir.value === 'rtl' ? -1 : 1)}px`,
      opacity: String(RAIL_MIN_OPACITY + (1 - RAIL_MIN_OPACITY) * pullProgress.value),
      transition: 'none'
    }
  })

  return {
    railEl,
    resizing: computed(() => resizing.value),
    previewing,
    startPreview,
    endPreview,
    valueNow: computed(() => (collapsed.value ? 0 : (width.value ?? railMin.value))),
    valueMin: computed(() => 0),
    valueMax: computed(() => railMax.value),
    railStyle,
    innerStyle,
    startResize,
    tapToExpand,
    nudge: (delta: number) => nudgeWidth(context, delta),
    measure,
    dir
  }
}
