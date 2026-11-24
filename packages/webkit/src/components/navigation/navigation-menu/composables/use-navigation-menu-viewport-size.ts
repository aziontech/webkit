import { nextTick, onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

import { getCssDimensions } from '../lib/css-dimensions'
import { POPUP_HEIGHT, POPUP_WIDTH, VIEWPORT_WIDTH } from '../lib/css-vars'

export interface NavigationMenuPopoverSize {
  width: number
  height: number
}

export interface UseNavigationMenuViewportSizeOptions {
  activeValue: Readonly<Ref<string | number | null>>
  popupEl: Readonly<Ref<HTMLElement | null>>
  currentContentEl: Readonly<Ref<HTMLElement | null>>
  viewportTargetEl: Readonly<Ref<HTMLElement | null>>
  popupMounted: Readonly<Ref<boolean>>
}

export interface UseNavigationMenuViewportSizeReturn {
  popupSize: Readonly<Ref<NavigationMenuPopoverSize | null>>
  syncCurrentSize: () => Promise<void>
}

function restoreProperty(style: CSSStyleDeclaration | undefined, name: string, previous: string) {
  if (previous) style?.setProperty(name, previous)
  else style?.removeProperty(name)
}

function measureUnconstrained(popup: HTMLElement, target: HTMLElement | null) {
  const previousScale = popup.style.scale
  const previousMaxWidth = popup.style.maxWidth
  const previousMaxHeight = popup.style.maxHeight
  popup.style.scale = '1'
  popup.style.maxWidth = 'none'
  popup.style.maxHeight = 'none'
  popup.style.setProperty(POPUP_WIDTH, 'fit-content')
  popup.style.setProperty(POPUP_HEIGHT, 'auto')
  target?.style.setProperty(VIEWPORT_WIDTH, 'max-content')
  const { width } = getCssDimensions(popup)
  target?.style.setProperty(VIEWPORT_WIDTH, `${width}px`)
  const { height } = getCssDimensions(popup)
  popup.style.scale = previousScale
  popup.style.maxWidth = previousMaxWidth
  popup.style.maxHeight = previousMaxHeight
  return { width, height }
}

function measureNaturalSize(
  popup: HTMLElement,
  target: HTMLElement | null
): NavigationMenuPopoverSize | null {
  const previousWidth = popup.style.getPropertyValue(POPUP_WIDTH)
  const previousHeight = popup.style.getPropertyValue(POPUP_HEIGHT)
  const previousViewportWidth = target?.style.getPropertyValue(VIEWPORT_WIDTH) ?? ''
  const previousTransition = popup.style.transition
  const morphing = Boolean(previousWidth && previousHeight)
  if (morphing) popup.style.transition = 'none'
  const { width, height } = measureUnconstrained(popup, target)
  restoreProperty(target?.style, VIEWPORT_WIDTH, previousViewportWidth)
  restoreProperty(popup.style, POPUP_WIDTH, previousWidth)
  restoreProperty(popup.style, POPUP_HEIGHT, previousHeight)
  if (morphing) {
    popup.style.transition = previousTransition
    void popup.offsetWidth
  }
  if (width === 0 || height === 0) return null
  return { width, height }
}

function isMorphing(popup: HTMLElement | null) {
  if (!popup || typeof popup.getAnimations !== 'function') return false
  return popup
    .getAnimations()
    .some(
      (animation) =>
        'transitionProperty' in animation &&
        (animation.transitionProperty === 'width' || animation.transitionProperty === 'height')
    )
}

function observeContentMutations(
  currentContentEl: Readonly<Ref<HTMLElement | null>>,
  popupMounted: Readonly<Ref<boolean>>,
  onMutation: () => void
) {
  let mutationObserver: globalThis.MutationObserver | undefined

  watch(
    [currentContentEl, popupMounted],
    ([contentEl, mounted]) => {
      mutationObserver?.disconnect()
      mutationObserver = undefined
      if (!contentEl || !mounted || typeof globalThis.MutationObserver === 'undefined') return
      mutationObserver = new globalThis.MutationObserver(onMutation)
      mutationObserver.observe(contentEl, { childList: true, subtree: true, characterData: true })
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    mutationObserver?.disconnect()
  })
}

export function useNavigationMenuViewportSize({
  activeValue,
  popupEl,
  currentContentEl,
  viewportTargetEl,
  popupMounted
}: UseNavigationMenuViewportSizeOptions): UseNavigationMenuViewportSizeReturn {
  const popupSize = ref<NavigationMenuPopoverSize | null>(null)

  const clearFixedSize = () => {
    popupEl.value?.style.removeProperty(POPUP_WIDTH)
    popupEl.value?.style.removeProperty(POPUP_HEIGHT)
    viewportTargetEl.value?.style.removeProperty(VIEWPORT_WIDTH)
    popupSize.value = null
  }

  const applySize = ({ width, height }: NavigationMenuPopoverSize) => {
    const popup = popupEl.value
    if (!popup) return
    viewportTargetEl.value?.style.setProperty(VIEWPORT_WIDTH, `${width}px`)
    popup.style.setProperty(POPUP_WIDTH, `${width}px`)
    popup.style.setProperty(POPUP_HEIGHT, `${height}px`)
    popupSize.value = { width, height }
  }

  let queued = false

  const syncCurrentSize = async () => {
    if (!popupMounted.value || queued) return
    queued = true
    await nextTick()
    queued = false
    if (!popupMounted.value || !popupEl.value) return
    const next = measureNaturalSize(popupEl.value, viewportTargetEl.value)
    if (next) applySize(next)
  }

  watch([() => activeValue.value, () => currentContentEl.value], ([nextValue]) => {
    if (nextValue != null) void syncCurrentSize()
  })

  watch(
    () => popupMounted.value,
    (mounted) => {
      if (!mounted) clearFixedSize()
    }
  )

  observeContentMutations(currentContentEl, popupMounted, () => {
    if (!isMorphing(popupEl.value)) void syncCurrentSize()
  })

  return {
    popupSize: readonly(popupSize) as Readonly<Ref<NavigationMenuPopoverSize | null>>,
    syncCurrentSize
  }
}
