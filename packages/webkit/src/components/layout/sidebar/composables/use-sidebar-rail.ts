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

/**
 * Dragging further left than this many px past the minimum drops the rail out of the layout
 * instead of pinning it at the minimum — the pull IS the collapse gesture. It is deliberately
 * larger than nothing: the rail must not flicker in and out around a single pixel.
 */
const COLLAPSE_SNAP = 56

/** One arrow-key press, the keyboard equivalent of the drag. */
export const SIDEBAR_NUDGE_STEP = 16

/**
 * How far the pointer may travel and still count as a click rather than a drag. A press on a
 * splitter is never perfectly still — without a little slop, the smallest tremor between
 * `pointerdown` and `pointerup` would turn a click into a one-pixel resize.
 */
const TAP_SLOP = 3

/**
 * How wide the collapsed rail comes back in while the pointer rests in its edge zone. A size
 * token, not a container token: this is a sliver the rail shows OF itself, not a width anyone
 * works in — the container scale starts at `--container-3xs` (256 px), an order of magnitude
 * past what a preview should take from the page.
 */
export const SIDEBAR_PREVIEW_WIDTH_TOKEN = '--size-10'
const SIDEBAR_PREVIEW_WIDTH_FALLBACK = 40

/**
 * How faint the rail gets at zero presence. Not 0: a rail being pulled in or dropped out
 * should stay legible enough to read as the same object moving, and the width and translate
 * already carry the "gone".
 */
const RAIL_MIN_OPACITY = 0.2

export interface UseSidebarRailOptions {
  /** Whether the rail is out of the layout. Owned by the component's `collapsed` model. */
  collapsed: Ref<boolean>
  /** Sized width in px, `null` until the rail measures itself. The component's `width` model. */
  width: Ref<number | null>
  /** Theme container token the width is clamped up to. */
  minWidthToken: MaybeRefOrGetter<string>
  /** Theme container token the width is clamped down to. */
  maxWidthToken: MaybeRefOrGetter<string>
  /** Whether the gesture is offered at all; with it off nothing inline is applied. */
  enabled: MaybeRefOrGetter<boolean>
}

export interface UseSidebarRailReturn {
  /** Bind to the rail root — the element whose natural width seeds the model. */
  railEl: Ref<globalThis.HTMLElement | null>
  /** True while a pointer drag is in flight. */
  resizing: Readonly<Ref<boolean>>
  /**
   * True while the collapsed rail is showing its preview sliver — the pointer (or focus) is
   * resting in the edge zone. Drives the zone's own width, so the zone never slips out from
   * under the pointer as the sliver it opened arrives beneath it.
   */
  previewing: Readonly<Ref<boolean>>
  /** Pointer entered / focus landed in the collapsed rail's edge zone. */
  startPreview: () => void
  /** Pointer left / focus left the edge zone — the sliver animates back out. */
  endPreview: () => void
  /**
   * The separator's reported position, in px. A focusable `role="separator"` is a window
   * splitter, so it is required to say where it sits between its bounds — without these a
   * screen reader announces a separator that carries no information at all.
   */
  valueNow: Readonly<Ref<number>>
  /**
   * Lower bound of the reported range: `0`, not `minWidthToken`. Collapsed is a real position
   * of this splitter, and the rail never rests between 1 px and the minimum — reporting the
   * token bound instead would put the collapsed position outside the range it announces.
   */
  valueMin: Readonly<Ref<number>>
  /** Upper bound, resolved from `maxWidthToken`. */
  valueMax: Readonly<Ref<number>>
  /** Inline style for the rail root: the width the page beside it morphs against. */
  railStyle: ComputedRef<Record<string, string | undefined>>
  /**
   * The rail's current `transition` shorthand, phase-aware and already reduced-motion-aware
   * (`'none'`). Exposed so anything that has to move WITH the rail — the collapsed affordance
   * riding in on the preview sliver — shares one timing instead of re-deriving it. The motion
   * tokens are JS-side (`presets/transitions.ts`), so there is no `duration-*` utility to reach
   * for; this is the only honest way to keep the two locked together.
   */
  railTransition: ComputedRef<string | undefined>
  /** Inline style for the inner panel: fixed width, slide and fade. */
  innerStyle: ComputedRef<Record<string, string | undefined>>
  /** Pointer-down on either separator — the handle, or the collapsed one. */
  startResize: (event: globalThis.PointerEvent) => void
  /**
   * Click on the collapsed splitter: brings the rail back. Ignores the `click` the browser
   * fires at the end of a real drag, so an aborted pull is not answered by expanding.
   */
  tapToExpand: () => void
  /** Keyboard equivalent of the drag. */
  nudge: (delta: number) => void
  /** Re-read the rail's natural width; exposed so a host that reveals it late can call it. */
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

/**
 * The rail gesture: a pointer drag on the sidebar's trailing edge that sizes it, crosses the
 * collapse boundary continuously, and hands the rail back to a transition on release.
 *
 * The rail stays MOUNTED while collapsed and animates its width to 0, rather than unmounting:
 * an element that was never rendered has nothing to tween from, and a `flex-1` sibling morphs
 * to fill the freed space on the same frames only if the width is a real animated length at
 * both ends.
 */
export function useSidebarRail(options: UseSidebarRailOptions): UseSidebarRailReturn {
  const { collapsed, width } = options

  const railEl = shallowRef<globalThis.HTMLElement | null>(null)
  const resizing = ref(false)

  const railMin = ref(256)
  const railMax = ref(408)

  const clamp = (value: number) => Math.min(Math.max(value, railMin.value), railMax.value)

  /**
   * How present the rail is while the pointer is down — 0 fully out of the layout, 1 fully in.
   * Width, slide and opacity all read from this one number, so a half-pulled rail is half in
   * AND half faded. That is what makes opening read as picking the rail up off the edge and
   * dragging it into the layout, rather than tripping a switch at an invisible line.
   */
  const pullProgress = ref(1)
  /** The sliver a pull has revealed while the rail is still formally collapsed. */
  const peekWidth = ref(0)
  const peeking = computed(() => resizing.value && collapsed.value)

  /** Raw pointer/focus presence in the collapsed rail's edge zone. */
  const previewHover = ref(false)
  const previewWidth = ref(SIDEBAR_PREVIEW_WIDTH_FALLBACK)

  /**
   * The preview is only ever a state of a COLLAPSED rail that is not being dragged: a drag
   * already owns the width frame by frame, and an expanded rail has nothing to preview. Gating
   * it here rather than at the call site means the pointer may stay in the zone across an
   * expand — the sliver simply stops applying.
   */
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
  /**
   * Whether the pointer travelled far enough for this to be a DRAG rather than a click. The
   * splitter is both: press and pull to size the rail, press and release to bring it back. The
   * browser fires `click` after `pointerup` either way, so the tap path needs a way to tell that
   * a drag already consumed the interaction — otherwise a drag the user aborted below the commit
   * threshold would be answered by expanding the rail anyway, the opposite of what they did.
   */
  let dragMoved = false

  const measure = () => {
    if (width.value == null && railEl.value?.offsetWidth) {
      width.value = clamp(railEl.value.offsetWidth)
    }
  }

  const onPointerMove = (event: globalThis.PointerEvent) => {
    const next = startWidth + (event.clientX - startX)

    if (Math.abs(event.clientX - startX) > TAP_SLOP) dragMoved = true

    // Appearance is ONE monotonic function of how far out the rail is, so the fade never
    // inverts as the gesture crosses a commit point.
    pullProgress.value = Math.max(0, Math.min(1, next / railMin.value))
    peekWidth.value = Math.max(0, Math.min(next, railMin.value))

    if (collapsed.value) {
      // Held out of the layout the panel rides the cursor, committing only once the pull has
      // earned a whole minimum-width rail — more than dragging in has to give up to collapse.
      if (next >= railMin.value) {
        collapsed.value = false
        width.value = clamp(next)
      }
      return
    }

    if (next < railMin.value - COLLAPSE_SNAP) {
      // The width the rail had when the drag began is restored on collapse, so re-expanding
      // returns the size the user chose rather than the minimum.
      width.value = clamp(restoreWidth)
      collapsed.value = true
      return
    }

    width.value = clamp(next)
  }

  const endResize = () => {
    if (!resizing.value) return
    resizing.value = false
    // Releasing hands the rail back to the transition: whatever fraction it was pulled to
    // animates to fully in or fully out on the motion tokens.
    peekWidth.value = 0
    pullProgress.value = 1
    globalThis.document.body.style.removeProperty('user-select')
    globalThis.document.body.style.removeProperty('cursor')
    globalThis.removeEventListener('pointermove', onPointerMove)
    globalThis.removeEventListener('pointerup', endResize)
  }

  /**
   * A click on the splitter — as opposed to a drag of it — brings a collapsed rail back. The
   * preview already showed the user what is behind that edge; asking them to travel to a button
   * to accept it is a second step the gesture does not need.
   */
  const tapToExpand = () => {
    if (dragMoved) return
    if (collapsed.value) collapsed.value = false
  }

  const startResize = (event: globalThis.PointerEvent) => {
    const fromCollapsed = collapsed.value
    resizing.value = true
    dragMoved = false
    startX = event.clientX
    // From collapsed the gesture starts at zero, so the rail's edge tracks the pointer's
    // distance from the viewport edge — pull, and the rail comes out from under the cursor.
    startWidth = fromCollapsed ? 0 : (width.value ?? railMin.value)
    restoreWidth = width.value ?? railMin.value
    pullProgress.value = fromCollapsed ? 0 : 1
    peekWidth.value = 0
    // The drag crosses the whole page — kill text selection, and hold the splitter cursor for
    // its duration. One cursor in both directions: whether the rail is being sized or brought
    // back out of the layout, the thing under the pointer is the same splitter.
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
      // A preview is the rail coming IN, so it eases on the entrance curve even though the rail
      // is formally collapsed. Letting go flips this back to `leave`, which is what carries the
      // sliver out on the exit curve — one computed, both directions.
      phase: collapsed.value && !previewing.value ? 'leave' : 'enter',
      animated: !resizing.value && !prefersReducedMotion()
    })
  )

  const railStyle = computed(() => {
    if (!toValue(options.enabled)) return {}
    // While a pull is in flight the width IS the pulled distance, so the page reflows under
    // the gesture in real time.
    if (peeking.value) return { width: `${peekWidth.value}px`, transition: 'none' }
    // The preview takes over the width of a collapsed rail — the sliver is a real animated
    // length, so the page beside it morphs on the same frames the sliver arrives on.
    if (previewing.value) {
      return { width: `${previewWidth.value}px`, transition: transition.value }
    }
    return {
      width: width.value == null ? undefined : collapsed.value ? '0px' : `${width.value}px`,
      transition: transition.value
    }
  })

  /**
   * How present the rail is, as one number the whole animation reads from.
   *
   * A preview deliberately does NOT bring the panel with it. The sliver is `--size-10` of a
   * panel laid out for its committed width, so any content it exposed would be cut mid-glyph
   * (row icons sit at 28–44 px) — a chopped column reads as a rendering fault, not as an
   * invitation. The panel therefore stays parked off the leading edge and the preview shows
   * the rail's own surface: its fill and its padding, with the affordance riding in on top.
   */
  const presence = computed(() => {
    if (resizing.value) return pullProgress.value
    return collapsed.value ? 0 : 1
  })

  const innerStyle = computed(() => {
    if (!toValue(options.enabled)) return {}
    // Sized to the width it will COMMIT to while peeking, so nothing resizes at the instant it
    // lands. The slide applies only while the rail is out of the layout, where the rail clips
    // it — translating a rail that is in the layout would open a gap beside the page.
    const innerWidth = peeking.value ? railMin.value : width.value
    return {
      width: innerWidth == null ? undefined : `${innerWidth}px`,
      transform: collapsed.value ? `translateX(${(presence.value - 1) * 100}%)` : undefined,
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
    // A collapsed rail sits at 0 — outside the bounds on purpose, because "out of the layout"
    // is a real position of this splitter and not the minimum width.
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
