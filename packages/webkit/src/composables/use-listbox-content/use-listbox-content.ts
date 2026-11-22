import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  type Ref,
  toValue,
  watch
} from 'vue'

import { useOverlayLayer } from '../use-overlay-layer'
import {
  activeElement,
  createTypeahead,
  enabledOptions,
  focusOnOpen,
  isTypeaheadKey,
  type ListboxLazy,
  outsidePress,
  stepIndex
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

function listboxKeydown(
  event: globalThis.KeyboardEvent,
  close: (refocus: boolean) => void,
  holdTab: boolean | undefined,
  typeahead: (key: string) => boolean,
  navigate: (key: string) => void
): void {
  const key = event.key
  if (key === 'Escape' || key === 'Tab') {
    if (key === 'Escape' || event.shiftKey || holdTab) event.preventDefault()
    return close(key === 'Tab')
  }
  if (isTypeaheadKey(event)) {
    if (typeahead(key)) event.preventDefault()
    return
  }
  if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return
  event.preventDefault()
  navigate(key)
}

export function useListboxContent(options: UseListboxContentOptions): UseListboxContentReturn {
  const { root, lazy, setOpen, triggerEl, pendingFocus } = options
  const isOpen = () => toValue(options.open)
  const focusBack = () => (options.focusTarget?.value ?? triggerEl.value)?.focus()

  useOverlayLayer(() => isOpen(), { element: root })

  const moveFocus = (key: string) => {
    const list = enabledOptions(root.value)
    if (list.length === 0) return
    const active = activeElement()
    list[stepIndex(key, active ? list.indexOf(active) : -1, list.length)]?.focus()
  }

  const typeahead = createTypeahead(root, lazy, options.textFieldSelector)

  const navigate = (key: string) => {
    if (lazy.value?.hasHidden()) {
      lazy.value.revealAll()
      void nextTick(() => moveFocus(key))
      return
    }
    moveFocus(key)
  }

  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) focusBack()
  }

  const onKeydown = (event: globalThis.KeyboardEvent) =>
    listboxKeydown(event, close, toValue(options.holdTab), typeahead, navigate)

  const onDocumentPointerdown = outsidePress(root, triggerEl, isOpen, setOpen)

  watch(
    () => isOpen(),
    async (next) => {
      if (next) {
        await nextTick()
        await focusOnOpen(
          root.value,
          pendingFocus,
          toValue(options.keepFocusOnOpen),
          lazy.value,
          moveFocus,
          typeahead
        )
        document.addEventListener('pointerdown', onDocumentPointerdown, true)
      } else {
        const hadFocus = !!root.value?.contains(document.activeElement)
        document.removeEventListener('pointerdown', onDocumentPointerdown, true)
        if (hadFocus) {
          await nextTick()
          focusBack()
        }
      }
    }
  )

  onMounted(() => {
    if (isOpen()) document.addEventListener('pointerdown', onDocumentPointerdown, true)
  })

  onScopeDispose(() => {
    document.removeEventListener('pointerdown', onDocumentPointerdown, true)
  })

  return { onKeydown, navigate }
}
