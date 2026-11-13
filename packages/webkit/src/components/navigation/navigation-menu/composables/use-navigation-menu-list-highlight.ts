import {
  type ComponentPublicInstance,
  computed,
  type ComputedRef,
  type CSSProperties,
  type MaybeRefOrGetter,
  onScopeDispose,
  ref,
  shallowRef,
  toValue,
  watch
} from 'vue'

import { resolveHostElement } from './resolve-host-element'
import type { UseNavigationMenuRootReturn } from './use-navigation-menu-context'

export type NavigationMenuHighlightTarget = HTMLElement | ComponentPublicInstance | null

export interface UseNavigationMenuListHighlightReturn {
  selectorStyle: ComputedRef<CSSProperties>
  setTarget: (target: NavigationMenuHighlightTarget) => void
  handleTargetPointerLeave: (event: PointerEvent, target: NavigationMenuHighlightTarget) => void
  handleListPointerLeave: (event: PointerEvent) => void
  syncToActiveTrigger: () => void
  hide: () => void
}

type HighlightRoot = Pick<UseNavigationMenuRootReturn, 'activeTriggerEl' | 'menuOpen'>

export function useNavigationMenuListHighlight(
  container: MaybeRefOrGetter<NavigationMenuHighlightTarget>,
  root: HighlightRoot
): UseNavigationMenuListHighlightReturn {
  const activeTarget = shallowRef<HTMLElement | null>(null)
  const isVisible = ref(false)

  const metrics = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })

  const selectorStyle = computed<CSSProperties>(() => ({
    left: `${metrics.value.left}px`,
    top: `${metrics.value.top}px`,
    width: `${metrics.value.width}px`,
    height: `${metrics.value.height}px`,
    opacity: isVisible.value ? 1 : 0
  }))

  const resolveContainer = () => resolveHostElement(toValue(container))

  const measureTarget = (target: HTMLElement) => {
    const containerEl = resolveContainer()

    if (!containerEl) {
      return
    }

    const containerRect = containerEl.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    if (targetRect.width === 0 || targetRect.height === 0) {
      return
    }

    metrics.value = {
      left: targetRect.left - containerRect.left,
      top: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height
    }
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
    activeTarget.value = null
  }

  const setTarget = (target: NavigationMenuHighlightTarget) => {
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

  const leftTowardsList = (event: PointerEvent) => {
    const related = event.relatedTarget as Node | null
    return Boolean(related && resolveContainer()?.contains(related))
  }

  const handleTargetPointerLeave = (event: PointerEvent, target: NavigationMenuHighlightTarget) => {
    if (leftTowardsList(event)) {
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

  const handleListPointerLeave = (event: PointerEvent) => {
    if (leftTowardsList(event)) {
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

  let resizeObserver: ResizeObserver | undefined

  const disconnect = () => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
  }

  watch(
    resolveContainer,
    (element) => {
      disconnect()

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

  onScopeDispose(disconnect)

  return {
    selectorStyle,
    setTarget,
    handleTargetPointerLeave,
    handleListPointerLeave,
    syncToActiveTrigger,
    hide
  }
}
