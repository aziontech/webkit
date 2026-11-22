import { type MaybeRefOrGetter, type Ref, toValue } from 'vue'

import { useOverlayLayer } from '../use-overlay-layer'
import { useListboxDismiss } from './composables/use-listbox-dismiss'
import { focusOnOpen } from './lib/initial-focus'
import {
  createOptionFocus,
  isNavigationKey,
  isTypeaheadKey,
  type ListboxLazy
} from './lib/option-focus'

export type ListboxFocusIntent = '' | 'first' | 'last' | `type:${string}`

export interface UseListboxContentOptions {
  /** The floating panel element. */
  root: Ref<globalThis.HTMLElement | null>
  /** The lazy option renderer, revealed before keyboard moves that need every option. */
  lazy: Ref<ListboxLazy | null>
  open: MaybeRefOrGetter<boolean>
  setOpen: (value: boolean) => void
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** Where focus lands when the list opens; the trigger writes it, the content clears it. */
  pendingFocus: Ref<ListboxFocusIntent>
  /** Fields inside the panel whose keystrokes are text, not typeahead. */
  textFieldSelector: string
  /** Element that takes focus back on close and on Tab; defaults to the trigger. */
  focusTarget?: Readonly<Ref<globalThis.HTMLElement | null>>
  /** Keeps focus in the focus target on Tab instead of moving on, for a typed field. */
  holdTab?: MaybeRefOrGetter<boolean>
  /** Leaves focus where it is on open unless a first or last intent asks for an option. */
  keepFocusOnOpen?: MaybeRefOrGetter<boolean>
}

export interface UseListboxContentReturn {
  onKeydown: (event: globalThis.KeyboardEvent) => void
  /** Moves focus among the visible options: ArrowDown, ArrowUp, Home or End. */
  navigate: (key: string) => void
}

export function useListboxContent(options: UseListboxContentOptions): UseListboxContentReturn {
  const { root, lazy, setOpen, triggerEl, pendingFocus } = options
  const isOpen = () => toValue(options.open)
  const focusBack = () => (options.focusTarget?.value ?? triggerEl.value)?.focus()
  const focus = createOptionFocus(root, lazy, options.textFieldSelector)

  useOverlayLayer(() => isOpen(), { element: root })

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key === 'Tab') {
      if (event.shiftKey || toValue(options.holdTab)) event.preventDefault()
      setOpen(false)
      focusBack()
      return
    }
    if (isTypeaheadKey(event)) {
      if (focus.typeahead(event.key)) event.preventDefault()
      return
    }
    if (!isNavigationKey(event.key)) return
    event.preventDefault()
    focus.navigate(event.key)
  }

  const focusInitial = async () => {
    const el = root.value
    if (!el) return
    const intent = pendingFocus.value
    pendingFocus.value = ''
    await focusOnOpen(el, intent, Boolean(toValue(options.keepFocusOnOpen)), lazy.value, focus)
  }

  useListboxDismiss({
    open: options.open,
    setOpen,
    root,
    triggerEl,
    onOpened: focusInitial,
    focusBack
  })

  return { onKeydown, navigate: focus.navigate }
}
