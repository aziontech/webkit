import type { Ref } from 'vue'

import { nextTabbableAfter } from '../../../utils/tabbable'
import {
  activeElement,
  focusMenuItem,
  isPrintableKey,
  type MenuFocusTarget
} from '../lib/menu-items'
import { useMenuTypeahead } from './use-menu-typeahead'

const NAVIGATION_KEYS = new Map<string, MenuFocusTarget>([
  ['ArrowDown', 'next'],
  ['ArrowUp', 'prev'],
  ['Home', 'first'],
  ['End', 'last']
])

export interface UseMenuKeyboardOptions {
  panelEl: Ref<globalThis.HTMLElement | null>
  setOpen: (value: boolean) => void
  focusTrigger: () => void
}

export interface UseMenuKeyboardReturn {
  onPanelKeydown: (event: globalThis.KeyboardEvent) => void
}

function isTextField(target: globalThis.EventTarget | null): boolean {
  return Boolean((target as globalThis.HTMLElement | null)?.matches?.('input, textarea'))
}

export function useMenuKeyboard({
  panelEl,
  setOpen,
  focusTrigger
}: UseMenuKeyboardOptions): UseMenuKeyboardReturn {
  const { typeahead } = useMenuTypeahead(panelEl)

  function close(): void {
    setOpen(false)
    focusTrigger()
  }

  function onTab(event: globalThis.KeyboardEvent): void {
    const panel = panelEl.value
    close()
    if (event.shiftKey) return
    const from = activeElement()
    if (!from || from === globalThis.document.body || panel?.contains(from)) return
    nextTabbableAfter(from, panel)?.focus()
  }

  function onPanelKeydown(event: globalThis.KeyboardEvent): void {
    const typing = isTextField(event.target)
    if (typing && (event.key === 'Home' || event.key === 'End')) return
    const target = NAVIGATION_KEYS.get(event.key)
    if (target || event.key === 'Escape' || event.key === 'Tab') event.preventDefault()
    if (target) focusMenuItem(panelEl.value, target)
    else if (event.key === 'Escape') close()
    else if (event.key === 'Tab') onTab(event)
    else if (!typing && isPrintableKey(event)) typeahead(event)
  }

  return { onPanelKeydown }
}
