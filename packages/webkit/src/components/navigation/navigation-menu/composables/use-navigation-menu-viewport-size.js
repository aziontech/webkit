import { nextTick, onScopeDispose, ref, watch } from 'vue'

import { waitForElementAnimations } from '../presets/animations.js'
import { getCssDimensions } from './get-css-dimensions.js'
import {
  POPUP_HEIGHT,
  POPUP_WIDTH,
  POSITIONER_HEIGHT,
  POSITIONER_WIDTH
} from './navigation-menu-css-vars.js'

const DEFAULT_SIZE = { width: 0, height: 0 }

/**
 * Base UI–style popup / positioner size morphing when switching items.
 * @param {import('vue').ComputedRef<boolean>} isActiveItem
 * @param {import('vue').Ref<HTMLElement | null>} popupEl
 * @param {import('vue').Ref<HTMLElement | null>} positionerEl
 * @param {import('vue').Ref<HTMLElement | null>} currentContentEl
 * @param {import('vue').ComputedRef<string | number | null>} activeValue
 * @param {import('vue').MaybeRefOrGetter<string | number>} itemValue
 */
export function useNavigationMenuViewportSize(
  isActiveItem,
  popupEl,
  positionerEl,
  currentContentEl,
  activeValue,
  itemValue
) {
  const readItemValue = () =>
    typeof itemValue === 'object' && itemValue !== null && 'value' in itemValue
      ? itemValue.value
      : typeof itemValue === 'function'
        ? itemValue()
        : itemValue
  const prevSizeRef = ref({ ...DEFAULT_SIZE })
  let sizeFrame = 0
  const mutationFrame = 0
  /** @type {AbortController | null} */
  let autoSizeResetController = null

  const clearFixedSizes = () => {
    const popup = popupEl.value
    const positioner = positionerEl.value

    if (!popup || !positioner) {
      return
    }

    popup.style.removeProperty(POPUP_WIDTH)
    popup.style.removeProperty(POPUP_HEIGHT)
    positioner.style.removeProperty(POSITIONER_WIDTH)
    positioner.style.removeProperty(POSITIONER_HEIGHT)
  }

  const setAutoSizes = () => {
    const popup = popupEl.value

    if (!popup) {
      return
    }

    popup.style.setProperty(POPUP_WIDTH, 'auto')
    popup.style.setProperty(POPUP_HEIGHT, 'auto')
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  const setSharedFixedSizes = (width, height) => {
    const popup = popupEl.value
    const positioner = positionerEl.value

    if (!popup || !positioner || width === 0 || height === 0) {
      return
    }

    popup.style.setProperty(POPUP_WIDTH, `${width}px`)
    popup.style.setProperty(POPUP_HEIGHT, `${height}px`)
    positioner.style.setProperty(POSITIONER_WIDTH, `${width}px`)
    positioner.style.setProperty(POSITIONER_HEIGHT, `${height}px`)
  }

  const scheduleAutoSizeReset = async () => {
    autoSizeResetController?.abort()
    const controller = new globalThis.AbortController()
    autoSizeResetController = controller

    const popup = popupEl.value

    if (!popup) {
      return
    }

    await waitForElementAnimations(popup)

    if (controller.signal.aborted || !isActiveItem.value) {
      return
    }

    autoSizeResetController = null
    setAutoSizes()
  }

  /**
   * @param {number} currentWidth
   * @param {number} currentHeight
   * @param {{ syncPositioner?: boolean }} [options]
   */
  const handleValueChange = (currentWidth, currentHeight, options = {}) => {
    const popup = popupEl.value
    const positioner = positionerEl.value

    if (!popup || !positioner) {
      return
    }

    autoSizeResetController?.abort()
    const { syncPositioner = false } = options

    clearFixedSizes()

    const { width, height } = getCssDimensions(popup)
    const measuredWidth = width || prevSizeRef.value.width
    const measuredHeight = height || prevSizeRef.value.height

    if (currentHeight === 0 || currentWidth === 0) {
      currentWidth = measuredWidth
      currentHeight = measuredHeight
    }

    popup.style.setProperty(POPUP_WIDTH, `${currentWidth}px`)
    popup.style.setProperty(POPUP_HEIGHT, `${currentHeight}px`)
    positioner.style.setProperty(
      POSITIONER_WIDTH,
      `${syncPositioner ? currentWidth : measuredWidth}px`
    )
    positioner.style.setProperty(
      POSITIONER_HEIGHT,
      `${syncPositioner ? currentHeight : measuredHeight}px`
    )

    globalThis.cancelAnimationFrame(sizeFrame)
    sizeFrame = globalThis.requestAnimationFrame(() => {
      if (!isActiveItem.value) {
        return
      }

      popup.style.setProperty(POPUP_WIDTH, `${measuredWidth}px`)
      popup.style.setProperty(POPUP_HEIGHT, `${measuredHeight}px`)

      if (syncPositioner) {
        positioner.style.setProperty(POSITIONER_WIDTH, `${measuredWidth}px`)
        positioner.style.setProperty(POSITIONER_HEIGHT, `${measuredHeight}px`)
      }

      prevSizeRef.value = { width: measuredWidth, height: measuredHeight }
      void scheduleAutoSizeReset()
    })
  }

  const syncCurrentSize = () => {
    const popup = popupEl.value
    const positioner = positionerEl.value

    if (!popup || !positioner) {
      return
    }

    globalThis.cancelAnimationFrame(sizeFrame)
    autoSizeResetController?.abort()
    clearFixedSizes()

    const { width, height } = getCssDimensions(popup)

    if (width === 0 || height === 0) {
      return
    }

    prevSizeRef.value = { width, height }
    setAutoSizes()
    positioner.style.setProperty(POSITIONER_WIDTH, `${width}px`)
    positioner.style.setProperty(POSITIONER_HEIGHT, `${height}px`)
  }

  watch(
    () => activeValue.value,
    (next, prev) => {
      if (next === readItemValue() && prev != null && next !== prev) {
        const popup = popupEl.value

        if (popup) {
          const { width, height } = getCssDimensions(popup)
          handleValueChange(width, height)
        }
      }
    }
  )

  watch(
    () => isActiveItem.value && currentContentEl.value,
    async (active) => {
      if (!active) {
        return
      }

      await nextTick()

      const popup = popupEl.value

      if (!popup) {
        return
      }

      const { width, height } = getCssDimensions(popup)
      handleValueChange(width, height)
    }
  )

  /** @type {MutationObserver | undefined} */
  let mutationObserver

  watch(
    [currentContentEl, () => isActiveItem.value, popupEl],
    ([contentEl, active, popup]) => {
      mutationObserver?.disconnect()
      mutationObserver = undefined

      if (!contentEl || !active || !popup || typeof globalThis.MutationObserver === 'undefined') {
        return
      }

      mutationObserver = new globalThis.MutationObserver(() => {
        const { width, height } = getCssDimensions(popup)
        handleValueChange(width || prevSizeRef.value.width, height || prevSizeRef.value.height)
      })

      mutationObserver.observe(contentEl, {
        childList: true,
        subtree: true,
        characterData: true
      })
    },
    { immediate: true }
  )

  watch(
    () => activeValue.value == null,
    (closed) => {
      if (!closed) {
        return
      }

      const popup = popupEl.value
      const positioner = positionerEl.value

      if (popup && positioner) {
        const { width, height } = getCssDimensions(popup)

        if (width > 0 && height > 0) {
          setSharedFixedSizes(width, height)
        }
      }
    }
  )

  onScopeDispose(() => {
    globalThis.cancelAnimationFrame(sizeFrame)
    globalThis.cancelAnimationFrame(mutationFrame)
    autoSizeResetController?.abort()
    mutationObserver?.disconnect()
  })

  return {
    handleValueChange,
    syncCurrentSize,
    setSharedFixedSizes
  }
}
