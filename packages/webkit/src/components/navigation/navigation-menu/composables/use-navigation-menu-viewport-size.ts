import { nextTick, onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

import { getCssDimensions } from './get-css-dimensions.js'
import { POPUP_HEIGHT, POPUP_WIDTH, VIEWPORT_WIDTH } from './navigation-menu-css-vars.js'

export interface NavigationMenuPopupSize {
  width: number
  height: number
}

export interface UseNavigationMenuViewportSizeOptions {
  /** Value of the item whose panel is open, or `null` when closed. */
  activeValue: Ref<string | number | null>
  /** The popup element whose box morphs between panels. */
  popupEl: Ref<HTMLElement | null>
  /** The panel currently in flow inside the viewport. */
  currentContentEl: Ref<HTMLElement | null>
  /** The element panels are teleported into; pinned to the panel's own width. */
  viewportTargetEl: Ref<HTMLElement | null>
  /** Whether the popup is mounted (stays true through the exit transition). */
  popupMounted: Ref<boolean>
}

export interface UseNavigationMenuViewportSizeReturn {
  /** Size the popup is morphing to, for the positioner to place against. */
  popupSize: Readonly<Ref<NavigationMenuPopupSize | null>>
  /** Re-measure the panel in flow and morph the popup to it. */
  syncCurrentSize: () => Promise<void>
}

/**
 * Owns the popup's morph between panels — a SINGLE instance per menu, created by
 * the root state (never one per trigger: N writers on one element restart each
 * other's transition mid-flight and read half-applied sizes).
 *
 * The popup keeps an explicit pixel size for its whole open lifetime, so a panel
 * switch is one write of the new size and the browser interpolates from the
 * current one. Nothing here paints at `auto` — the natural size is read by
 * releasing the constraint and restoring it within the same task, before layout
 * reaches the screen — and nothing resets to `auto` while open, because a length
 * does not interpolate to `auto` and the box would snap at the end of the morph.
 *
 * The measured size is published as `popupSize` so the positioner can place the
 * panel against the size it is morphing TO. Placing it against the live rect makes
 * the positioner's own ResizeObserver fire on every frame of the morph and
 * re-place the panel from a half-animated width — the jitter this replaces.
 */
export function useNavigationMenuViewportSize({
  activeValue,
  popupEl,
  currentContentEl,
  viewportTargetEl,
  popupMounted
}: UseNavigationMenuViewportSizeOptions): UseNavigationMenuViewportSizeReturn {
  const popupSize = ref<NavigationMenuPopupSize | null>(null)

  const clearFixedSize = () => {
    const popup = popupEl.value

    if (popup) {
      popup.style.removeProperty(POPUP_WIDTH)
      popup.style.removeProperty(POPUP_HEIGHT)
    }

    viewportTargetEl.value?.style.removeProperty(VIEWPORT_WIDTH)
    popupSize.value = null
  }

  /**
   * Natural size of the popup with the current panel in flow.
   *
   * Measuring means releasing the size constraint and forcing a layout, which the
   * browser also treats as a style change worth transitioning. Left alone that
   * starts a transition towards the natural size and then a second one back to
   * the pixel size, so by the time the real size lands the morph has already
   * consumed itself and the box snaps in one frame. Transitions are therefore
   * frozen for the duration of the measurement and released before the caller
   * applies the new size — the browser then sees exactly one change to animate,
   * from the previous pixel size to the new one.
   */
  const measureNatural = (): NavigationMenuPopupSize | null => {
    const popup = popupEl.value

    if (!popup) {
      return null
    }

    const target = viewportTargetEl.value
    const previousWidth = popup.style.getPropertyValue(POPUP_WIDTH)
    const previousHeight = popup.style.getPropertyValue(POPUP_HEIGHT)
    const previousViewportWidth = target?.style.getPropertyValue(VIEWPORT_WIDTH) ?? ''
    const previousTransition = popup.style.transition

    // On a fresh open there is no previous size, so there is no morph to protect
    // — and freezing here would instead swallow the popup's OWN enter transition
    // (the scale out of the trigger), which is armed in these same frames.
    const morphing = Boolean(previousWidth && previousHeight)

    if (morphing) {
      popup.style.transition = 'none'
    }

    // The enter animation scales the popup to 95%, and `getBoundingClientRect`
    // reports the SCALED box — measuring through it pinned every freshly opened
    // panel to 95% of its real width. Neutralised for the measurement only; on a
    // fresh open the popup is still in `data-starting-style`, whose
    // `transition-none` means writing and clearing this cannot disturb anything.
    const previousScale = popup.style.scale
    popup.style.scale = '1'

    popup.style.setProperty(POPUP_WIDTH, 'auto')
    popup.style.setProperty(POPUP_HEIGHT, 'auto')
    // The pin has to come off too, or the panel would be measured at the width
    // the PREVIOUS panel was pinned to instead of its own. `max-content`, not the
    // `100%` fallback: a percentage width inside a shrink-to-fit popup is circular,
    // and the browser resolves it from whatever the box happened to be, so the same
    // panel measured 583px fresh and 614px when switched into. `max-content` makes
    // the panel's intrinsic width the single input.
    target?.style.setProperty(VIEWPORT_WIDTH, 'max-content')

    // Forces layout at the natural size. The unconstrained box never paints:
    // it is restored below, within this same task.
    const { width, height } = getCssDimensions(popup)

    popup.style.scale = previousScale

    if (previousViewportWidth) {
      target?.style.setProperty(VIEWPORT_WIDTH, previousViewportWidth)
    } else {
      target?.style.removeProperty(VIEWPORT_WIDTH)
    }

    if (previousWidth) {
      popup.style.setProperty(POPUP_WIDTH, previousWidth)
    } else {
      popup.style.removeProperty(POPUP_WIDTH)
    }

    if (previousHeight) {
      popup.style.setProperty(POPUP_HEIGHT, previousHeight)
    } else {
      popup.style.removeProperty(POPUP_HEIGHT)
    }

    if (morphing) {
      // Hand back the class-driven transition FIRST, then flush. Re-arming the
      // transition and changing the size in one style change is the classic case
      // Chrome refuses to animate — it reads the transition off the pre-change
      // style. Flushing here records "previous size, transition armed", so the
      // caller's `applySize` is a lone size change the browser will interpolate.
      popup.style.transition = previousTransition
      void popup.offsetWidth
    }

    if (width === 0 || height === 0) {
      return null
    }

    return { width, height }
  }

  const applySize = ({ width, height }: NavigationMenuPopupSize) => {
    const popup = popupEl.value

    if (!popup) {
      return
    }

    // The panel snaps to its own width immediately (no transition on the target)
    // while the popup box animates around it. The box therefore reveals or crops
    // a panel that is already laid out — the panel itself never re-wraps mid-morph.
    viewportTargetEl.value?.style.setProperty(VIEWPORT_WIDTH, `${width}px`)

    popup.style.setProperty(POPUP_WIDTH, `${width}px`)
    popup.style.setProperty(POPUP_HEIGHT, `${height}px`)
    popupSize.value = { width, height }
  }

  /** True while the popup is mid-morph, so a re-measure would abort it. */
  const isMorphing = () => {
    const popup = popupEl.value

    if (!popup || typeof popup.getAnimations !== 'function') {
      return false
    }

    return popup
      .getAnimations()
      .some(
        (animation) =>
          'transitionProperty' in animation &&
          (animation.transitionProperty === 'width' || animation.transitionProperty === 'height')
      )
  }

  let queued = false

  /**
   * Coalesced to ONE measurement per tick. A panel switch moves both the active
   * value and the current content element, so the two watchers below fire
   * together; letting each measure meant the second one's forced layout landed
   * before the browser had committed the first one's size change, cancelling the
   * morph before it started and snapping the box in a single frame.
   */
  const syncCurrentSize = async () => {
    if (!popupMounted.value || queued) {
      return
    }

    queued = true
    await nextTick()
    queued = false

    if (!popupMounted.value) {
      return
    }

    const next = measureNatural()

    if (next) {
      applySize(next)
    }
  }

  // Panel switch. `flush: 'post'` plus the nextTick inside puts the measurement
  // after the outgoing panel has left the flow (NavigationMenuContent absolutely
  // positions it while exiting) and the incoming one is laid out.
  watch([() => activeValue.value, () => currentContentEl.value], ([nextValue]) => {
    if (nextValue == null) {
      return
    }

    void syncCurrentSize()
  })

  // Hold the last size through the exit transition, then release it so the next
  // open measures a fresh panel instead of inheriting the previous one's box.
  watch(
    () => popupMounted.value,
    (mounted) => {
      if (!mounted) {
        clearFixedSize()
      }
    }
  )

  let mutationObserver: globalThis.MutationObserver | undefined

  watch(
    [currentContentEl, popupMounted],
    ([contentEl, mounted]) => {
      mutationObserver?.disconnect()
      mutationObserver = undefined

      if (!contentEl || !mounted || typeof globalThis.MutationObserver === 'undefined') {
        return
      }

      // Content that changes size while open (async data, expanding rows).
      // Skipped mid-morph: measuring releases the constraint, which would abort
      // the transition already heading for the right size.
      mutationObserver = new globalThis.MutationObserver(() => {
        if (isMorphing()) {
          return
        }

        void syncCurrentSize()
      })

      mutationObserver.observe(contentEl, {
        childList: true,
        subtree: true,
        characterData: true
      })
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    mutationObserver?.disconnect()
  })

  return {
    popupSize: readonly(popupSize) as Readonly<Ref<NavigationMenuPopupSize | null>>,
    syncCurrentSize
  }
}
