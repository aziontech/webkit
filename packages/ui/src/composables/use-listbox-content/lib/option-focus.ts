import { nextTick, type Ref } from 'vue'

import type { ListboxFocusIntent } from '../use-listbox-content'

export interface ListboxLazy {
  revealAll: () => void
  hasHidden: () => boolean
}

const OPTION_SELECTOR = '[role="option"]:not([data-disabled])'

export const activeElement = (): globalThis.HTMLElement | null =>
  document.activeElement instanceof HTMLElement ? document.activeElement : null

export const enabledOptions = (root: globalThis.HTMLElement | null): globalThis.HTMLElement[] =>
  Array.from(root?.querySelectorAll<globalThis.HTMLElement>(OPTION_SELECTOR) ?? []).filter(
    (option) => option.style.display !== 'none'
  )

export function stepIndex(key: string, currentIndex: number, length: number): number {
  if (key === 'ArrowDown') return currentIndex < length - 1 ? currentIndex + 1 : 0
  if (key === 'ArrowUp') return currentIndex > 0 ? currentIndex - 1 : length - 1
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  return currentIndex
}

export function createTypeahead(
  root: Ref<globalThis.HTMLElement | null>,
  lazy: Ref<ListboxLazy | null>,
  textFieldSelector: string
): (key: string) => boolean {
  let typed = ''
  let typedAt = 0
  return (key) => {
    const el = root.value
    if (!el) return false
    if (el.contains(document.activeElement) && document.activeElement?.matches(textFieldSelector))
      return false
    lazy.value?.revealAll()
    const now = Date.now()
    typed = now - typedAt > 500 ? key : typed + key
    typedAt = now
    const list = enabledOptions(el)
    const query = typed.toLocaleLowerCase()
    const active = activeElement()
    const index = active ? list.indexOf(active) : -1
    const start = index === -1 ? 0 : index + (typed.length === 1 ? 1 : 0)
    const ordered = [...list.slice(start), ...list.slice(0, start)]
    const match = ordered.find((option) =>
      (option.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
    )
    match?.focus()
    return Boolean(match)
  }
}

async function focusEdge(
  intent: 'first' | 'last',
  lazy: ListboxLazy | null,
  moveFocus: (key: string) => void
): Promise<void> {
  if (intent === 'last' && lazy?.hasHidden()) {
    lazy.revealAll()
    await nextTick()
  }
  moveFocus(intent === 'first' ? 'Home' : 'End')
}

export const isTypeaheadKey = (event: globalThis.KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

export function outsidePress(
  root: Ref<globalThis.HTMLElement | null>,
  triggerEl: Ref<globalThis.HTMLElement | null>,
  isOpen: () => boolean,
  setOpen: (value: boolean) => void
): (event: globalThis.PointerEvent) => void {
  return (event) => {
    const el = root.value
    const target = event.target as globalThis.Node | null
    if (!isOpen() || !el || !target || el.contains(target)) return
    if (!triggerEl.value?.contains(target)) setOpen(false)
  }
}

export async function focusOnOpen(
  el: globalThis.HTMLElement | null,
  pendingFocus: Ref<ListboxFocusIntent>,
  keepFocus: boolean | undefined,
  lazy: ListboxLazy | null,
  moveFocus: (key: string) => void,
  typeahead: (key: string) => boolean
): Promise<void> {
  if (!el) return
  const intent = pendingFocus.value
  pendingFocus.value = ''
  if (keepFocus && intent !== 'first' && intent !== 'last') return
  const search = el.querySelector<globalThis.HTMLElement>(
    'input:not([type="checkbox"]):not([type="radio"]):not([disabled])'
  )
  if (search) {
    search.focus()
    return
  }
  if (intent === 'first' || intent === 'last') return focusEdge(intent, lazy, moveFocus)
  if (intent.startsWith('type:') && typeahead(intent.slice(5))) return
  const target =
    el.querySelector<globalThis.HTMLElement>(
      `[role="option"][aria-selected="true"]:not([data-disabled])`
    ) ?? el.querySelector<globalThis.HTMLElement>(OPTION_SELECTOR)
  target?.focus()
}
