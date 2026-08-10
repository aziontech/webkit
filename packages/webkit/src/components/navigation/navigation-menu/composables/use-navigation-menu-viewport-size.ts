import { nextTick, onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

import { getCssDimensions } from './get-css-dimensions.js'
import { POPUP_HEIGHT, POPUP_WIDTH, VIEWPORT_WIDTH } from './navigation-menu-css-vars.js'

export interface NavigationMenuPopupSize {
  width: number
  height: number
}

export interface UseNavigationMenuViewportSizeOptions {
  activeValue: Ref<string | number | null>
  popupEl: Ref<HTMLElement | null>
  currentContentEl: Ref<HTMLElement | null>
  viewportTargetEl: Ref<HTMLElement | null>
  popupMounted: Ref<boolean>
}

export interface UseNavigationMenuViewportSizeReturn {
  popupSize: Readonly<Ref<NavigationMenuPopupSize | null>>
  syncCurrentSize: () => Promise<void>
}

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

    const morphing = Boolean(previousWidth && previousHeight)

    if (morphing) {
      popup.style.transition = 'none'
    }

    const previousScale = popup.style.scale
    popup.style.scale = '1'

    popup.style.setProperty(POPUP_WIDTH, 'auto')
    popup.style.setProperty(POPUP_HEIGHT, 'auto')
    target?.style.setProperty(VIEWPORT_WIDTH, 'max-content')

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

    viewportTargetEl.value?.style.setProperty(VIEWPORT_WIDTH, `${width}px`)

    popup.style.setProperty(POPUP_WIDTH, `${width}px`)
    popup.style.setProperty(POPUP_HEIGHT, `${height}px`)
    popupSize.value = { width, height }
  }

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

  watch([() => activeValue.value, () => currentContentEl.value], ([nextValue]) => {
    if (nextValue == null) {
      return
    }

    void syncCurrentSize()
  })

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
