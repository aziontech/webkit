import { type ComputedRef, onBeforeUnmount, onMounted, onScopeDispose } from 'vue'

import type { ToastRegion } from '../lib/toast-layout'
import type { ToastPosition, ToastStore } from './use-toast-store'

export interface UseToastRegionsReturn {
  setRegionEl: (position: ToastPosition, el: unknown) => void
}

const listenToRegion = (
  el: HTMLElement,
  onMouseenter: () => void,
  onLeave: () => void,
  onFocusin: () => void,
  onFocusout: (event: FocusEvent) => void,
  onKeydown: (event: KeyboardEvent) => void
) => {
  el.addEventListener('mouseenter', onMouseenter)
  el.addEventListener('mouseleave', onLeave)
  el.addEventListener('focusin', onFocusin)
  el.addEventListener('focusout', onFocusout)
  el.addEventListener('keydown', onKeydown)
  return () => {
    el.removeEventListener('mouseenter', onMouseenter)
    el.removeEventListener('mouseleave', onLeave)
    el.removeEventListener('focusin', onFocusin)
    el.removeEventListener('focusout', onFocusout)
    el.removeEventListener('keydown', onKeydown)
  }
}

const escapedToastId = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.defaultPrevented) return undefined
  const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-toast-id]')
  const id = card?.dataset['toastId']
  if (!id) return undefined
  event.preventDefault()
  event.stopPropagation()
  return id
}

const focusFront = (regionEl: HTMLElement | undefined) => {
  const front = regionEl?.querySelector<HTMLElement>('[data-front]')
  if (!front) return false
  const control = front.querySelector<HTMLElement>(
    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )
  ;(control ?? front).focus()
  return true
}

export function useToastRegions(
  store: ToastStore,
  regions: ComputedRef<ToastRegion[]>,
  isActive: ComputedRef<boolean>,
  onEnter: (position: ToastPosition) => void,
  onLeave: () => void,
  onFocusin: (position: ToastPosition) => void,
  onFocusout: (event: FocusEvent) => void
): UseToastRegionsReturn {
  const regionEls = new Map<ToastPosition, HTMLElement>()
  const regionCleanups = new Map<ToastPosition, () => void>()

  const setRegionEl = (position: ToastPosition, el: unknown) => {
    if (el instanceof HTMLElement && regionEls.get(position) === el) return
    regionCleanups.get(position)?.()
    regionCleanups.delete(position)
    if (el instanceof HTMLElement) {
      regionEls.set(position, el)
      regionCleanups.set(
        position,
        listenToRegion(
          el,
          () => onEnter(position),
          onLeave,
          () => onFocusin(position),
          onFocusout,
          onRegionKeydown
        )
      )
    } else regionEls.delete(position)
  }

  onScopeDispose(() => {
    regionCleanups.forEach((cleanup) => cleanup())
    regionCleanups.clear()
  })

  let returnFocus: HTMLElement | null = null

  const onHotkey = (event: KeyboardEvent) => {
    if (!event.altKey || event.code !== 'KeyT' || !isActive.value) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const region = regions.value.find((r) => r.live.length > 0)
    if (region && focusFront(regionEls.get(region.position))) {
      event.preventDefault()
      if (previous && !previous.closest('[data-toast-region]')) returnFocus = previous
    }
  }

  const onRegionKeydown = (event: KeyboardEvent) => {
    const id = escapedToastId(event)
    if (!id) return
    store.dismiss(id)
    const target = returnFocus
    returnFocus = null
    if (target?.isConnected) target.focus()
  }

  onMounted(() => document.addEventListener('keydown', onHotkey))
  onBeforeUnmount(() => document.removeEventListener('keydown', onHotkey))

  return { setRegionEl }
}
