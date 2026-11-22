import { type ComputedRef, nextTick, type Ref } from 'vue'

import {
  createChangeEventDetails,
  type NavigationMenuChangeEventDetails
} from '../lib/change-event-details'

export interface NavigationMenuTriggerEntry {
  value: string | number
  el: HTMLElement
}

export interface NavigationMenuKeyboardRoot {
  value: ComputedRef<string | number | null>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  isRtl: () => boolean
  triggers: Readonly<Ref<NavigationMenuTriggerEntry[]>>
  popupEl: Readonly<Ref<HTMLElement | null>>
  activeTriggerEl: Readonly<Ref<HTMLElement | null>>
  setValue: (next: string | number | null, details: NavigationMenuChangeEventDetails) => void
}

export interface UseNavigationMenuKeyboardReturn {
  onTriggerKeydown: (event: KeyboardEvent) => void
  onPopupKeydown: (event: KeyboardEvent) => void
}

const PANEL_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function panelFocusables(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return []
  return Array.from(panel.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE))
}

async function focusPanel(popupEl: Readonly<Ref<HTMLElement | null>>, edge: 'first' | 'last') {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await nextTick()
    const items = panelFocusables(popupEl.value)
    if (items.length) {
      ;(edge === 'last' ? items[items.length - 1] : items[0]).focus()
      return
    }
    await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve(null)))
  }
}

function movePanelFocus(event: KeyboardEvent, items: HTMLElement[], index: number): boolean {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!items.length) return true
    event.preventDefault()
    const step = event.key === 'ArrowDown' ? 1 : -1
    items[(index + step + items.length) % items.length].focus()
    return true
  }
  if (event.key === 'Home' || event.key === 'End') {
    if (!items.length) return true
    event.preventDefault()
    items[event.key === 'Home' ? 0 : items.length - 1].focus()
    return true
  }
  return false
}

function createPopupKeydown(root: NavigationMenuKeyboardRoot) {
  return (event: KeyboardEvent) => {
    const trigger = root.activeTriggerEl.value
    const items = panelFocusables(root.popupEl.value)
    const index = items.indexOf(document.activeElement as HTMLElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      root.setValue(null, createChangeEventDetails('escape-key', event, trigger ?? undefined))
      trigger?.focus()
      return
    }
    if (movePanelFocus(event, items, index)) return
    if (event.key !== 'Tab' || !trigger) return
    if (event.shiftKey && index <= 0) {
      event.preventDefault()
      trigger.focus()
      return
    }
    if (!event.shiftKey && index === items.length - 1) {
      root.setValue(null, createChangeEventDetails('focus-out', event, trigger))
      trigger.focus()
    }
  }
}

function enterPanel(
  root: NavigationMenuKeyboardRoot,
  event: KeyboardEvent,
  ownTrigger: HTMLElement,
  ownValue: string | number | undefined
): boolean {
  const ownOpen = ownValue != null && root.value.value === ownValue
  if (
    event.key === 'Tab' &&
    !event.shiftKey &&
    ownOpen &&
    panelFocusables(root.popupEl.value).length
  ) {
    event.preventDefault()
    void focusPanel(root.popupEl, 'first')
    return true
  }
  const isHorizontal = root.orientation.value === 'horizontal'
  const enterKey = isHorizontal ? 'ArrowDown' : root.isRtl() ? 'ArrowLeft' : 'ArrowRight'
  if (event.key !== enterKey || ownValue == null) return false
  event.preventDefault()
  if (!ownOpen)
    root.setValue(ownValue, createChangeEventDetails('trigger-press', event, ownTrigger))
  void focusPanel(root.popupEl, 'first')
  return true
}

function moveBetweenTriggers(
  root: NavigationMenuKeyboardRoot,
  event: KeyboardEvent,
  currentIndex: number,
  focusedIndex: number
) {
  const triggers = root.triggers.value
  const isHorizontal = root.orientation.value === 'horizontal'
  const flipped = isHorizontal && root.isRtl()
  const nextKey = isHorizontal ? (flipped ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
  const prevKey = isHorizontal ? (flipped ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'
  if (event.key !== nextKey && event.key !== prevKey) return
  event.preventDefault()
  if (!triggers.length) return
  const baseIndex = focusedIndex !== -1 ? focusedIndex : currentIndex
  const direction = event.key === nextKey ? 1 : -1
  const entry = triggers[(baseIndex + direction + triggers.length) % triggers.length]
  entry.el.focus()
  root.setValue(entry.value, createChangeEventDetails('list-navigation', event, entry.el))
}

function createTriggerKeydown(root: NavigationMenuKeyboardRoot) {
  return (event: KeyboardEvent) => {
    const triggers = root.triggers.value
    const currentIndex = triggers.findIndex((entry) => entry.value === root.value.value)
    const focusedIndex = triggers.findIndex((entry) => entry.el === document.activeElement)
    const ownTrigger = event.currentTarget as HTMLElement
    if (event.key === 'Escape') {
      event.preventDefault()
      root.setValue(null, createChangeEventDetails('escape-key', event, ownTrigger))
      return
    }
    const ownValue = triggers.find((entry) => entry.el === ownTrigger)?.value
    if (enterPanel(root, event, ownTrigger, ownValue)) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (ownValue == null) return
      const nextValue = root.value.value === ownValue ? null : ownValue
      root.setValue(nextValue, createChangeEventDetails('trigger-press', event, ownTrigger))
      return
    }
    moveBetweenTriggers(root, event, currentIndex, focusedIndex)
  }
}

export function useNavigationMenuKeyboard(
  root: NavigationMenuKeyboardRoot
): UseNavigationMenuKeyboardReturn {
  return {
    onTriggerKeydown: createTriggerKeydown(root),
    onPopupKeydown: createPopupKeydown(root)
  }
}
