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
  watch
} from 'vue'

import {
  type Align,
  type CollisionPadding,
  computePlacement,
  getClippingBoundary,
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
  align: Align
  width: number
  height: number
  maxWidth: number | null
  maxHeight: number | null
}

const ALIGN_VALUES: ReadonlySet<string> = new Set<Align>(['start', 'center', 'end'])
const SIDE_VALUES: ReadonlySet<string> = new Set<Side>(['top', 'bottom', 'left', 'right'])
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

export function useNavigationMenuPositioner(
  anchor: MaybeRefOrGetter<HTMLElement | null>,
  floating: MaybeRefOrGetter<HTMLElement | null>,
  arrow: MaybeRefOrGetter<HTMLElement | null>,
  options: MaybeRefOrGetter<NavigationMenuPositionerOptions>,
  targetSize?: MaybeRefOrGetter<Size | null>
): UseNavigationMenuPositionerReturn {
  const state = ref<PlacementState>({
    x: 0,
    y: 0,
    side: 'bottom',
    align: 'center',
    width: 0,
    height: 0,
    maxWidth: null,
    maxHeight: null
  })
  const hasPlacement = ref(false)
  const placed = ref(false)
  const popupOrigin = ref('top left')

  const anchorEl = computed(() => toValue(anchor))
  const floatingEl = computed(() => toValue(floating))

  const opts = computed(() => {
    const raw = toValue(options) ?? {}
    return {
      side: isSide(raw.side) ? raw.side : 'bottom',
      align: isAlign(raw.align) ? raw.align : 'center',
      sideOffset: typeof raw.sideOffset === 'number' ? raw.sideOffset : 8,
      alignOffset: typeof raw.alignOffset === 'number' ? raw.alignOffset : 0,
      arrowPadding: typeof raw.arrowPadding === 'number' ? raw.arrowPadding : 8,
      collisionPadding: normalizeCollisionPadding(raw.collisionPadding)
    }
  })

  const readTargetSize = () => (targetSize ? toValue(targetSize) : null)

  const update = () => {
    const anchorElement = anchorEl.value
    const floatingElement = floatingEl.value
    const anchorRect = readRect(anchorElement)
    const naturalSize = readTargetSize() ?? readRect(floatingElement)
    if (!anchorElement || !anchorRect || !naturalSize) return
    const { side, align, sideOffset, alignOffset, collisionPadding } = opts.value
    const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }

    const result = computePlacement({
      triggerRect: anchorRect,
      panelSize: { width: naturalSize.width, height: naturalSize.height },
      boundary: getClippingBoundary(anchorElement, viewport),
      placement: align === 'center' ? side : `${side}-${align}`,
      flip: true,
      offset: sideOffset,
      alignOffset,
      collisionPadding
    })
    const [sidePart, alignPart] = result.placement.split('-')
    const resolvedSide: Side = isSide(sidePart) ? sidePart : side
    const resolvedAlign: Align = isAlign(alignPart) ? alignPart : 'center'

    const frame = getFixedFrame(floatingElement)
    state.value = {
      x: (result.left - frame.left) / frame.scaleX,
      y: (result.top - frame.top) / frame.scaleY,
      side: resolvedSide,
      align: resolvedAlign,
      width: result.width,
      height: result.height,
      maxWidth: result.maxWidth === null ? null : result.maxWidth / frame.scaleX,
      maxHeight: result.maxHeight === null ? null : result.maxHeight / frame.scaleY
    }

    const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0))
    popupOrigin.value =
      resolvedSide === 'top' || resolvedSide === 'bottom'
        ? `${clamp(anchorRect.left + anchorRect.width / 2 - result.left, result.width).toFixed(2)}px ${resolvedSide === 'bottom' ? 'top' : 'bottom'}`
        : `${resolvedSide === 'right' ? 'left' : 'right'} ${clamp(anchorRect.top + anchorRect.height / 2 - result.top, result.height).toFixed(2)}px`

    hasPlacement.value = true
  }

  const resetPlacement = () => {
    hasPlacement.value = false
    placed.value = false
  }

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
    [anchorEl, floatingEl, opts, readTargetSize],
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

  useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', scheduleUpdate, {
    passive: true,
    capture: true
  })
  useEventListener(typeof window !== 'undefined' ? window : null, 'resize', scheduleUpdate, {
    passive: true
  })

  if (!targetSize) {
    useResizeObserver(floatingEl, scheduleUpdate)
  }

  useResizeObserver(anchorEl, scheduleUpdate)

  onScopeDispose(() => {
    cancelUpdateFrame?.()
    cancelPlacedFrame?.()
  })

  const floatingStyles = computed<CSSProperties>(() => ({
    position: 'fixed',
    top: '0',
    left: '0',
    transform: `translate3d(${Math.round(state.value.x)}px, ${Math.round(state.value.y)}px, 0)`,
    display: 'flex',
    'min-width': 'max-content'
  }))

  const resolvedSide = computed(() => state.value.side)
  const resolvedAlign = computed(() => state.value.align)
  const availableWidth = computed(() => state.value.maxWidth)
  const availableHeight = computed(() => state.value.maxHeight)

  const arrowStyles = computed((): CSSProperties => {
    const anchorRect = readRect(anchorEl.value)
    const arrowEl = toValue(arrow)
    if (!anchorRect || !hasPlacement.value) return {}

    const arrowSize = arrowEl ? arrowEl.offsetWidth || 8 : 8
    const padding = opts.value.arrowPadding
    const { x, y, side, width, height } = state.value

    if (side === 'top' || side === 'bottom') {
      const offsetX = anchorRect.left + anchorRect.width / 2 - x - arrowSize / 2
      return { left: `${Math.min(Math.max(offsetX, padding), width - arrowSize - padding)}px` }
    }
    const offsetY = anchorRect.top + anchorRect.height / 2 - y - arrowSize / 2
    return { top: `${Math.min(Math.max(offsetY, padding), height - arrowSize - padding)}px` }
  })

  return {
    floatingStyles,
    resolvedSide,
    resolvedAlign,
    availableWidth,
    availableHeight,
    arrowStyles,
    placed: readonly(placed),
    popupOrigin: readonly(popupOrigin),
    resetPlacement
  }
}
