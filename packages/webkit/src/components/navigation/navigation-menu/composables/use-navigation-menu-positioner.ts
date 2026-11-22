import { useEventListener, useResizeObserver } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  type CSSProperties,
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch,
  type WatchSource
} from 'vue'

import type { Direction } from '../../../../composables/use-direction'
import {
  type Align,
  type CollisionPadding,
  computePlacement,
  getClippingBoundary,
  type PhysicalSide,
  type Side,
  type Size
} from '../../../../composables/use-placement'
import { getFixedFrame } from '../../../../utils/containing-block'

export interface NavigationMenuPositionerOptions {
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
  arrowPadding?: number
  collisionPadding?: CollisionPadding
  dir?: Direction
}

export interface UseNavigationMenuPositionerReturn {
  floatingStyles: ComputedRef<CSSProperties>
  resolvedSide: ComputedRef<Side>
  resolvedAlign: ComputedRef<Align>
  availableWidth: ComputedRef<number | null>
  availableHeight: ComputedRef<number | null>
  arrowStyles: ComputedRef<CSSProperties>
  placed: Readonly<Ref<boolean>>
  popupOrigin: Readonly<Ref<string>>
  resetPlacement: () => void
}

interface PlacementState {
  x: number
  y: number
  side: Side
  physicalSide: PhysicalSide
  align: Align
  width: number
  height: number
  maxWidth: number | null
  maxHeight: number | null
}

const ALIGN_VALUES: ReadonlySet<string> = new Set<Align>(['start', 'center', 'end'])
const SIDE_VALUES: ReadonlySet<string> = new Set<Side>(['top', 'bottom', 'start', 'end'])
const DEFAULT_COLLISION_PADDING = 8

function normalizeCollisionPadding(raw: CollisionPadding | undefined): CollisionPadding {
  if (typeof raw === 'number') return raw
  if (raw && typeof raw === 'object') {
    return {
      x: typeof raw.x === 'number' ? raw.x : DEFAULT_COLLISION_PADDING,
      y: typeof raw.y === 'number' ? raw.y : DEFAULT_COLLISION_PADDING
    }
  }
  return DEFAULT_COLLISION_PADDING
}

function readRect(el: HTMLElement | null | undefined): DOMRect | null {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null
  return el.getBoundingClientRect()
}

function isSide(value: unknown): value is Side {
  return typeof value === 'string' && SIDE_VALUES.has(value)
}

function isAlign(value: unknown): value is Align {
  return typeof value === 'string' && ALIGN_VALUES.has(value)
}

function requestFrame(callback: () => void): () => void {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    const id = globalThis.requestAnimationFrame(callback)
    return () => globalThis.cancelAnimationFrame(id)
  }
  const id = setTimeout(callback, 16)
  return () => clearTimeout(id)
}

type ResolvedOptions = ReturnType<typeof resolveOptions>
type PlacementResult = ReturnType<typeof computePlacement>
type FixedFrame = ReturnType<typeof getFixedFrame>

function resolveOptions(raw: NavigationMenuPositionerOptions) {
  return {
    side: isSide(raw.side) ? raw.side : 'bottom',
    align: isAlign(raw.align) ? raw.align : 'center',
    sideOffset: typeof raw.sideOffset === 'number' ? raw.sideOffset : 8,
    alignOffset: typeof raw.alignOffset === 'number' ? raw.alignOffset : 0,
    arrowPadding: typeof raw.arrowPadding === 'number' ? raw.arrowPadding : 8,
    collisionPadding: normalizeCollisionPadding(raw.collisionPadding),
    dir: raw.dir === 'rtl' ? ('rtl' as const) : ('ltr' as const)
  }
}

function toPlacementState(result: PlacementResult, frame: FixedFrame): PlacementState {
  return {
    x: (result.left - frame.left) / frame.scaleX,
    y: (result.top - frame.top) / frame.scaleY,
    side: result.side,
    physicalSide: result.physicalSide,
    align: result.align,
    width: result.width,
    height: result.height,
    maxWidth: result.maxWidth === null ? null : result.maxWidth / frame.scaleX,
    maxHeight: result.maxHeight === null ? null : result.maxHeight / frame.scaleY
  }
}

function computePopupOrigin(anchorRect: DOMRect, result: PlacementResult): string {
  const physicalSide = result.physicalSide
  const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0))
  return physicalSide === 'top' || physicalSide === 'bottom'
    ? `${clamp(anchorRect.left + anchorRect.width / 2 - result.left, result.width).toFixed(2)}px ${physicalSide === 'bottom' ? 'top' : 'bottom'}`
    : `${physicalSide === 'right' ? 'left' : 'right'} ${clamp(anchorRect.top + anchorRect.height / 2 - result.top, result.height).toFixed(2)}px`
}

function computeArrowStyles(
  anchorRect: DOMRect,
  arrowEl: HTMLElement | null,
  padding: number,
  placement: PlacementState
): CSSProperties {
  const arrowSize = arrowEl ? arrowEl.offsetWidth || 8 : 8
  const { x, y, physicalSide, width, height } = placement
  if (physicalSide === 'top' || physicalSide === 'bottom') {
    const offsetX = anchorRect.left + anchorRect.width / 2 - x - arrowSize / 2
    return { left: `${Math.min(Math.max(offsetX, padding), width - arrowSize - padding)}px` }
  }
  const offsetY = anchorRect.top + anchorRect.height / 2 - y - arrowSize / 2
  return { top: `${Math.min(Math.max(offsetY, padding), height - arrowSize - padding)}px` }
}

function createPlacement(
  anchorEl: ComputedRef<HTMLElement | null>,
  floatingEl: ComputedRef<HTMLElement | null>,
  opts: ComputedRef<ResolvedOptions>,
  readTargetSize: () => Size | null
) {
  const state = ref<PlacementState>({
    x: 0,
    y: 0,
    side: 'bottom',
    physicalSide: 'bottom',
    align: 'center',
    width: 0,
    height: 0,
    maxWidth: null,
    maxHeight: null
  })
  const hasPlacement = ref(false)
  const popupOrigin = ref('top left')

  const update = () => {
    const anchorElement = anchorEl.value
    const floatingElement = floatingEl.value
    const anchorRect = readRect(anchorElement)
    const naturalSize = readTargetSize() ?? readRect(floatingElement)
    if (!anchorElement || !anchorRect || !naturalSize) return
    const { side, align, sideOffset, alignOffset, collisionPadding, dir } = opts.value
    const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }
    const result = computePlacement({
      triggerRect: anchorRect,
      panelSize: { width: naturalSize.width, height: naturalSize.height },
      boundary: getClippingBoundary(anchorElement, viewport),
      side,
      align,
      dir,
      flip: true,
      sideOffset,
      alignOffset,
      collisionPadding
    })
    state.value = toPlacementState(result, getFixedFrame(floatingElement))
    popupOrigin.value = computePopupOrigin(anchorRect, result)
    hasPlacement.value = true
  }

  return { state, hasPlacement, popupOrigin, update }
}

function trackPlacementUpdates(
  sources: [ComputedRef<HTMLElement | null>, ComputedRef<HTMLElement | null>],
  watched: WatchSource<unknown>[],
  hasPlacement: Ref<boolean>,
  placed: Ref<boolean>,
  update: () => void,
  observeFloating: boolean
) {
  const [anchorEl, floatingEl] = sources
  let cancelUpdateFrame: (() => void) | null = null
  let cancelPlacedFrame: (() => void) | null = null

  const scheduleUpdate = () => {
    if (cancelUpdateFrame) return
    cancelUpdateFrame = requestFrame(() => {
      cancelUpdateFrame = null
      update()
    })
  }

  watch(
    watched,
    () => {
      if (!hasPlacement.value) {
        update()
        return
      }
      scheduleUpdate()
    },
    { flush: 'post', immediate: true }
  )

  watch(hasPlacement, (value) => {
    if (!value) return
    cancelPlacedFrame?.()
    cancelPlacedFrame = requestFrame(() => {
      cancelPlacedFrame = null
      if (hasPlacement.value) placed.value = true
    })
  })

  const win = typeof window !== 'undefined' ? window : null
  useEventListener(win, 'scroll', scheduleUpdate, { passive: true, capture: true })
  useEventListener(win, 'resize', scheduleUpdate, { passive: true })
  if (observeFloating) useResizeObserver(floatingEl, scheduleUpdate)
  useResizeObserver(anchorEl, scheduleUpdate)

  onScopeDispose(() => {
    cancelUpdateFrame?.()
    cancelPlacedFrame?.()
  })
}

export function useNavigationMenuPositioner(
  anchor: MaybeRefOrGetter<HTMLElement | null>,
  floating: MaybeRefOrGetter<HTMLElement | null>,
  arrow: MaybeRefOrGetter<HTMLElement | null>,
  options: MaybeRefOrGetter<NavigationMenuPositionerOptions>,
  targetSize?: MaybeRefOrGetter<Size | null>
): UseNavigationMenuPositionerReturn {
  const placed = ref(false)
  const anchorEl = computed(() => toValue(anchor))
  const floatingEl = computed(() => toValue(floating))
  const opts = computed(() => resolveOptions(toValue(options) ?? {}))
  const readTargetSize = () => (targetSize ? toValue(targetSize) : null)
  const { state, hasPlacement, popupOrigin, update } = createPlacement(
    anchorEl,
    floatingEl,
    opts,
    readTargetSize
  )

  const resetPlacement = () => {
    hasPlacement.value = false
    placed.value = false
  }

  trackPlacementUpdates(
    [anchorEl, floatingEl],
    [anchorEl, floatingEl, opts, readTargetSize],
    hasPlacement,
    placed,
    update,
    !targetSize
  )

  const floatingStyles = computed<CSSProperties>(() => ({
    position: 'fixed',
    top: '0',
    left: '0',
    transform: `translate3d(${Math.round(state.value.x)}px, ${Math.round(state.value.y)}px, 0)`,
    display: 'flex',
    'min-width': 'max-content'
  }))

  const arrowStyles = computed((): CSSProperties => {
    const anchorRect = readRect(anchorEl.value)
    if (!anchorRect || !hasPlacement.value) return {}
    return computeArrowStyles(anchorRect, toValue(arrow), opts.value.arrowPadding, state.value)
  })

  return {
    floatingStyles,
    resolvedSide: computed(() => state.value.side),
    resolvedAlign: computed(() => state.value.align),
    availableWidth: computed(() => state.value.maxWidth),
    availableHeight: computed(() => state.value.maxHeight),
    arrowStyles,
    placed: readonly(placed),
    popupOrigin: readonly(popupOrigin),
    resetPlacement
  }
}
