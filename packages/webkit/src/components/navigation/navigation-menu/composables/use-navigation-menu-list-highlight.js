import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'

import { resolveHostElement } from './resolve-host-element.js'

/**
 * @typedef {object} NavigationMenuListHighlightContext
 * @property {(element: HTMLElement | null) => void} setTarget
 * @property {(event: PointerEvent, element: HTMLElement | null) => void} handleTargetPointerLeave
 */

/**
 * Sliding highlight that moves between nav triggers/links inside a list.
 * @param {import('vue').Ref<HTMLElement | import('vue').ComponentPublicInstance | null>} containerRef
 * @param {ReturnType<import('./use-navigation-menu-context.js').useNavigationMenuRoot>} root
 */
export function useNavigationMenuListHighlight(containerRef, root) {
  const activeTarget = shallowRef(/** @type {HTMLElement | null} */ (null))
  const isVisible = ref(false)

  const metrics = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })

  const selectorStyle = computed(() => ({
    left: `${metrics.value.left}px`,
    top: `${metrics.value.top}px`,
    width: `${metrics.value.width}px`,
    height: `${metrics.value.height}px`,
    opacity: isVisible.value ? 1 : 0
  }))

  const measureTarget = (target) => {
    const container = resolveHostElement(containerRef.value)
    const element = target ? resolveHostElement(target) : null

    if (!container || !element) {
      return false
    }

    const containerRect = container.getBoundingClientRect()
    const targetRect = element.getBoundingClientRect()

    if (targetRect.width === 0 || targetRect.height === 0) {
      return false
    }

    metrics.value = {
      left: targetRect.left - containerRect.left,
      top: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height
    }
    isVisible.value = true
    return true
  }

  const hide = () => {
    isVisible.value = false
    activeTarget.value = null
  }

  /** @param {HTMLElement | import('vue').ComponentPublicInstance | null} target */
  const setTarget = (target) => {
    const element = resolveHostElement(target)

    if (!element) {
      return
    }

    activeTarget.value = element
    measureTarget(element)
  }

  const syncToActiveTrigger = () => {
    if (root.activeTriggerEl.value) {
      setTarget(root.activeTriggerEl.value)
    }
  }

  /**
   * @param {PointerEvent} event
   * @param {HTMLElement | import('vue').ComponentPublicInstance | null} target
   */
  const handleTargetPointerLeave = (event, target) => {
    const container = resolveHostElement(containerRef.value)
    const related = /** @type {Node | null} */ (event.relatedTarget)

    if (related && container?.contains(related)) {
      return
    }

    if (root.menuOpen.value && root.activeTriggerEl.value) {
      setTarget(root.activeTriggerEl.value)
      return
    }

    if (resolveHostElement(target) === activeTarget.value) {
      hide()
    }
  }

  /** @param {PointerEvent} event */
  const handleListPointerLeave = (event) => {
    const container = resolveHostElement(containerRef.value)
    const related = /** @type {Node | null} */ (event.relatedTarget)

    if (related && container?.contains(related)) {
      return
    }

    if (root.menuOpen.value) {
      syncToActiveTrigger()
      return
    }

    hide()
  }

  const remeasure = () => {
    if (activeTarget.value) {
      measureTarget(activeTarget.value)
    }
  }

  let resizeObserver

  watch(
    containerRef,
    (container) => {
      resizeObserver?.disconnect()
      resizeObserver = undefined

      const element = resolveHostElement(container)

      if (!element || typeof globalThis.ResizeObserver === 'undefined') {
        return
      }

      resizeObserver = new globalThis.ResizeObserver(remeasure)
      resizeObserver.observe(element)
    },
    { immediate: true }
  )

  watch(
    () => root.activeTriggerEl.value,
    () => {
      if (root.menuOpen.value) {
        syncToActiveTrigger()
      }
    }
  )

  watch(
    () => root.menuOpen.value,
    (open) => {
      if (open) {
        syncToActiveTrigger()
      }
    }
  )

  onScopeDispose(() => {
    resizeObserver?.disconnect()
  })

  return {
    selectorStyle,
    setTarget,
    handleTargetPointerLeave,
    handleListPointerLeave,
    syncToActiveTrigger,
    hide
  }
}
