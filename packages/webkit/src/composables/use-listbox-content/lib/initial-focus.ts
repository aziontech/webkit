import { nextTick } from 'vue'

import type { ListboxFocusIntent } from '../use-listbox-content'
import { type ListboxLazy, OPTION_SELECTOR, type OptionFocus } from './option-focus'

const SEARCH_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]):not([disabled])'
const SELECTED_SELECTOR = '[role="option"][aria-selected="true"]:not([data-disabled])'

const isEdge = (intent: ListboxFocusIntent): intent is 'first' | 'last' =>
  intent === 'first' || intent === 'last'

async function focusEdge(
  intent: 'first' | 'last',
  lazy: ListboxLazy | null,
  focus: OptionFocus
): Promise<void> {
  if (intent === 'last' && lazy?.hasHidden()) {
    lazy.revealAll()
    await nextTick()
  }
  focus.moveFocus(intent === 'first' ? 'Home' : 'End')
}

export async function focusOnOpen(
  el: globalThis.HTMLElement,
  intent: ListboxFocusIntent,
  keepFocus: boolean,
  lazy: ListboxLazy | null,
  focus: OptionFocus
): Promise<void> {
  if (keepFocus && !isEdge(intent)) return
  const search = el.querySelector<globalThis.HTMLElement>(SEARCH_SELECTOR)
  if (search) {
    search.focus()
    return
  }
  if (isEdge(intent)) {
    await focusEdge(intent, lazy, focus)
    return
  }
  if (intent.startsWith('type:') && focus.typeahead(intent.slice(5))) return
  const target =
    el.querySelector<globalThis.HTMLElement>(SELECTED_SELECTOR) ??
    el.querySelector<globalThis.HTMLElement>(OPTION_SELECTOR)
  target?.focus()
}
