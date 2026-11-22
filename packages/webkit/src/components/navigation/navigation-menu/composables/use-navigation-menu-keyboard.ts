import { type ComputedRef, nextTick, onScopeDispose, type Ref } from 'vue'

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

type Scope = { alive: boolean }

async function focusPanel(popupEl: Readonly<Ref<HTMLElement | null>>, scope: Scope) {
  for (let attempt = 0; attempt < 5 && scope.alive; attempt += 1) {
    await nextTick()
    const items = panelFocusables(popupEl.value)
    if (items.length) {
      items[0].focus()
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

function onPopupKeydown(
  { activeTriggerEl, popupEl, setValue }: NavigationMenuKeyboardRoot,
  event: KeyboardEvent
) {
  const trigger = activeTriggerEl.value
  const items = panelFocusables(popupEl.value)
  const index = items.indexOf(document.activeElement as HTMLElement)
  if (event.key === 'Escape') {
    event.preventDefault()
    setValue(null, createChangeEventDetails('escape-key', event, trigger ?? undefined))
    trigger?.focus()
    return
  }
  if (movePanelFocus(event, items, index) || event.key !== 'Tab' || !trigger) return
  if (event.shiftKey && index <= 0) {
    event.preventDefault()
    trigger.focus()
    return
  }
  if (!event.shiftKey && index === items.length - 1) {
    setValue(null, createChangeEventDetails('focus-out', event, trigger))
    trigger.focus()
  }
}

function enterPanel(
  { value, popupEl, orientation, isRtl, setValue }: NavigationMenuKeyboardRoot,
  event: KeyboardEvent,
  ownTrigger: HTMLElement,
  ownValue: string | number | undefined,
  scope: Scope
): boolean {
  const ownOpen = ownValue != null && value.value === ownValue
  const enterKey =
    orientation.value === 'horizontal' ? 'ArrowDown' : isRtl() ? 'ArrowLeft' : 'ArrowRight'
  const tabIn = event.key === 'Tab' && !event.shiftKey && ownOpen
  if (tabIn ? !panelFocusables(popupEl.value).length : event.key !== enterKey || ownValue == null)
    return false
  event.preventDefault()
  if (!tabIn && !ownOpen && ownValue != null)
    setValue(ownValue, createChangeEventDetails('trigger-press', event, ownTrigger))
  void focusPanel(popupEl, scope)
  return true
}

function moveBetweenTriggers(
  { triggers, orientation, isRtl, setValue }: NavigationMenuKeyboardRoot,
  event: KeyboardEvent,
  baseIndex: number
) {
  const isHorizontal = orientation.value === 'horizontal'
  const flipped = isHorizontal && isRtl()
  const nextKey = isHorizontal ? (flipped ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
  const prevKey = isHorizontal ? (flipped ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'
  const count = triggers.value.length
  if (event.key !== nextKey && event.key !== prevKey) return
  event.preventDefault()
  if (!count) return
  const entry = triggers.value[(baseIndex + (event.key === nextKey ? 1 : -1) + count) % count]
  entry.el.focus()
  setValue(entry.value, createChangeEventDetails('list-navigation', event, entry.el))
}

function onTriggerKeydown(root: NavigationMenuKeyboardRoot, event: KeyboardEvent, scope: Scope) {
  const { triggers, value, setValue } = root
  const focusedIndex = triggers.value.findIndex((entry) => entry.el === document.activeElement)
  const baseIndex =
    focusedIndex !== -1
      ? focusedIndex
      : triggers.value.findIndex((entry) => entry.value === value.value)
  const ownTrigger = event.currentTarget as HTMLElement
  const ownValue = triggers.value.find((entry) => entry.el === ownTrigger)?.value
  const toggle = event.key === 'Enter' || event.key === ' '
  if (event.key === 'Escape' || toggle) {
    event.preventDefault()
    if (!toggle) setValue(null, createChangeEventDetails('escape-key', event, ownTrigger))
    else if (ownValue != null)
      setValue(
        value.value === ownValue ? null : ownValue,
        createChangeEventDetails('trigger-press', event, ownTrigger)
      )
    return
  }
  if (!enterPanel(root, event, ownTrigger, ownValue, scope))
    moveBetweenTriggers(root, event, baseIndex)
}

export function useNavigationMenuKeyboard(
  root: NavigationMenuKeyboardRoot
): UseNavigationMenuKeyboardReturn {
  const scope: Scope = { alive: true }
  onScopeDispose(() => {
    scope.alive = false
  })
  return {
    onTriggerKeydown: (event) => onTriggerKeydown(root, event, scope),
    onPopupKeydown: (event) => onPopupKeydown(root, event)
  }
}
