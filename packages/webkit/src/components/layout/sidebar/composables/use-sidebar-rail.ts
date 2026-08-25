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

import { getSidebarRailTransition } from '../presets/transitions'

const COLLAPSE_SNAP = 56

export const SIDEBAR_NUDGE_STEP = 16

const TAP_SLOP = 3

export const SIDEBAR_PREVIEW_WIDTH_TOKEN = '--size-10'
const SIDEBAR_PREVIEW_WIDTH_FALLBACK = 40

const RAIL_MIN_OPACITY = 0.2

export interface UseSidebarRailOptions {
  collapsed: Ref<boolean>
  width: Ref<number | null>
  minWidthToken: MaybeRefOrGetter<string>
  maxWidthToken: MaybeRefOrGetter<string>
  enabled: MaybeRefOrGetter<boolean>
  /**
   * Which edge of the layout the rail is anchored to. `end` mirrors the gesture:
   * the rail grows when the pointer moves LEFT, and it leaves towards the right.
   * Everything else about the rail is identical, which is the point — a trailing
   * panel is the same component, not a second implementation of it.
   */
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
  railTransition: ComputedRef<string | undefined>
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

export function useSidebarRail(options: UseSidebarRailOptions): UseSidebarRailReturn {
  const { collapsed, width } = options

  const direction = () => (toValue(options.side ?? 'start') === 'end' ? -1 : 1)

  const railEl = shallowRef<globalThis.HTMLElement | null>(null)
  const resizing = ref(false)

  const railMin = ref(256)
  const railMax = ref(408)

  const clamp = (value: number) => Math.min(Math.max(value, railMin.value), railMax.value)

  const pullProgress = ref(1)
  const peekWidth = ref(0)
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

  const measure = () => {
    if (width.value == null && railEl.value?.offsetWidth) {
      width.value = clamp(railEl.value.offsetWidth)
    }
  }

  const onPointerMove = (event: globalThis.PointerEvent) => {
    const next = startWidth + (event.clientX - startX) * direction()

    if (Math.abs(event.clientX - startX) > TAP_SLOP) dragMoved = true

    pullProgress.value = Math.max(0, Math.min(1, next / railMin.value))
    peekWidth.value = Math.max(0, Math.min(next, railMin.value))

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

    width.value = clamp(next)
  }

  const endResize = () => {
    if (!resizing.value) return
    resizing.value = false
    peekWidth.value = 0
    pullProgress.value = 1
    globalThis.document.body.style.removeProperty('user-select')
    globalThis.document.body.style.removeProperty('cursor')
    globalThis.removeEventListener('pointermove', onPointerMove)
    globalThis.removeEventListener('pointerup', endResize)
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
    pullProgress.value = fromCollapsed ? 0 : 1
    peekWidth.value = 0
    globalThis.document.body.style.userSelect = 'none'
    globalThis.document.body.style.cursor = 'col-resize'
    globalThis.addEventListener('pointermove', onPointerMove)
    globalThis.addEventListener('pointerup', endResize)
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
  })

  onScopeDispose(endResize)

  const transition = computed(() =>
    getSidebarRailTransition({
      phase: collapsed.value && !previewing.value ? 'leave' : 'enter',
      animated: !resizing.value && !prefersReducedMotion()
    })
  )

  const railStyle = computed(() => {
    if (!toValue(options.enabled)) return {}
    if (peeking.value) return { width: `${peekWidth.value}px`, transition: 'none' }
    if (previewing.value) {
      return { width: `${previewWidth.value}px`, transition: transition.value }
    }
    return {
      width: width.value == null ? undefined : collapsed.value ? '0px' : `${width.value}px`,
      transition: transition.value
    }
  })

  const presence = computed(() => {
    if (resizing.value) return pullProgress.value
    return collapsed.value ? 0 : 1
  })

  const innerStyle = computed(() => {
    if (!toValue(options.enabled)) return {}
    const innerWidth = peeking.value ? railMin.value : width.value
    return {
      width: innerWidth == null ? undefined : `${innerWidth}px`,
      transform: collapsed.value
        ? `translateX(${(presence.value - 1) * 100 * direction()}%)`
        : undefined,
      opacity: String(RAIL_MIN_OPACITY + (1 - RAIL_MIN_OPACITY) * presence.value),
      transition: transition.value
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
    railTransition: transition,
    innerStyle,
    startResize,
    tapToExpand,
    nudge,
    measure
  }
}
