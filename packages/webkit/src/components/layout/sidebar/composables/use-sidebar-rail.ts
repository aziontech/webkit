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

const COLLAPSE_SNAP = 56

export const SIDEBAR_NUDGE_STEP = 16

const TAP_SLOP = 3

// Opacity the rail's content fades to as the drag pulls it below the minimum width.
const RAIL_MIN_OPACITY = 0.2

export const SIDEBAR_PREVIEW_WIDTH_TOKEN = '--size-10'
const SIDEBAR_PREVIEW_WIDTH_FALLBACK = 40

export interface UseSidebarRailOptions {
  collapsed: Ref<boolean>
  width: Ref<number | null>
  minWidthToken: MaybeRefOrGetter<string>
  maxWidthToken: MaybeRefOrGetter<string>
  enabled: MaybeRefOrGetter<boolean>
  side?: MaybeRefOrGetter<'start' | 'end'>
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

/** The steady-state enter/leave animation runs in CSS off the hidden checkbox's `:checked`
 *  state (see sidebar.vue). Only the drag-driven preview sliver still needs a JS-computed
 *  transition, because its width comes from a pointer gesture, not from that boolean. */
const previewTransition = (): string => {
  if (prefersReducedMotion()) return 'none'
  return `width ${duration['moderate-02']} ${curve['expressive-entrance']}`
}

export function useSidebarRail(options: UseSidebarRailOptions): UseSidebarRailReturn {
  const { collapsed, width } = options

  const direction = () => (toValue(options.side ?? 'start') === 'end' ? -1 : 1)

  const railEl = shallowRef<globalThis.HTMLElement | null>(null)
  const resizing = ref(false)

  const railMin = ref(256)
  const railMax = ref(408)

  const clamp = (value: number) => Math.min(Math.max(value, railMin.value), railMax.value)

  const peekWidth = ref(0)
  const pullProgress = ref(1)
  const peeking = computed(() => resizing.value && collapsed.value)

  const previewHover = ref(false)
  const previewWidth = ref(SIDEBAR_PREVIEW_WIDTH_FALLBACK)

  const previewing = computed(
    () => previewHover.value && collapsed.value && !resizing.value && toValue(options.enabled)
  )

  const startPreview = () => {
    previewHover.value = true
  }

  const endPreview = () => {
    previewHover.value = false
  }

  let startX = 0
  let startWidth = 0
  let restoreWidth = 0
  let dragMoved = false
  let capturedBy: globalThis.HTMLElement | null = null
  let capturedId = -1

  const measure = () => {
    if (width.value == null && railEl.value?.offsetWidth) {
      width.value = clamp(railEl.value.offsetWidth)
    }
  }

  const onPointerMove = (event: globalThis.PointerEvent) => {
    const next = startWidth + (event.clientX - startX) * direction()

    if (Math.abs(event.clientX - startX) > TAP_SLOP) dragMoved = true

    peekWidth.value = Math.max(0, Math.min(next, railMin.value))
    pullProgress.value = Math.max(0, Math.min(1, next / railMin.value))

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

    // Below the minimum the rail keeps tracking the pointer, so its edge and its content
    // move as one. The minimum is restored on release.
    width.value = Math.max(0, Math.min(next, railMax.value))
  }

  const endResize = () => {
    if (!resizing.value) return
    resizing.value = false
    if (!collapsed.value) width.value = clamp(width.value ?? railMin.value)
    peekWidth.value = 0
    pullProgress.value = 1
    if (capturedBy?.hasPointerCapture(capturedId)) capturedBy.releasePointerCapture(capturedId)
    capturedBy = null
    capturedId = -1
    globalThis.document.body.style.removeProperty('user-select')
    globalThis.document.body.style.removeProperty('cursor')
    globalThis.removeEventListener('pointermove', onPointerMove)
    globalThis.removeEventListener('pointerup', endResize)
    globalThis.removeEventListener('pointercancel', endResize)
    globalThis.removeEventListener('blur', endResize)
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
    startWidth = fromCollapsed ? 0 : (width.value ?? railMin.value)
    restoreWidth = width.value ?? railMin.value
    peekWidth.value = 0
    pullProgress.value = fromCollapsed ? 0 : 1
    const target = event.currentTarget as globalThis.HTMLElement | null
    try {
      target?.setPointerCapture(event.pointerId)
      capturedBy = target
      capturedId = event.pointerId
    } catch {
      capturedBy = null
      capturedId = -1
    }
    globalThis.document.body.style.userSelect = 'none'
    globalThis.document.body.style.cursor = 'col-resize'
    globalThis.addEventListener('pointermove', onPointerMove)
    globalThis.addEventListener('pointerup', endResize)
    globalThis.addEventListener('pointercancel', endResize)
    globalThis.addEventListener('blur', endResize)
    event.preventDefault()
  }

  const nudge = (delta: number) => {
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

  onMounted(() => {
    railMin.value = readTokenPx(toValue(options.minWidthToken), railMin.value)
    railMax.value = readTokenPx(toValue(options.maxWidthToken), railMax.value)
    previewWidth.value = readTokenPx(SIDEBAR_PREVIEW_WIDTH_TOKEN, previewWidth.value)
    if (width.value != null) width.value = clamp(width.value)
    measure()
    railEl.value?.style.removeProperty('width')
  })

  onScopeDispose(endResize)

  const railStyle = computed(() => {
    if (!toValue(options.enabled)) return {}
    if (peeking.value) return { width: `${peekWidth.value}px`, transition: 'none' }
    if (previewing.value) {
      return { width: `${previewWidth.value}px`, transition: previewTransition() }
    }
    return {}
  })

  const underMin = computed(() => resizing.value && pullProgress.value < 1)

  // Above the minimum the panel is the rail, at the rail's width. Below it the panel holds
  // the minimum — reflowing it further would truncate labels the minimum exists to fit —
  // and is carried by the closing edge, so its trailing edge stays flush with the rail's
  // instead of the rail sweeping across content that stands still.
  const innerStyle = computed(() => {
    if (!toValue(options.enabled) || !resizing.value) return {}
    if (!underMin.value) return { translate: '0%', opacity: '1', transition: 'none' }
    return {
      width: `${railMin.value}px`,
      translate: direction() === 1 ? `${peekWidth.value - railMin.value}px` : '0%',
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
    nudge,
    measure
  }
}
