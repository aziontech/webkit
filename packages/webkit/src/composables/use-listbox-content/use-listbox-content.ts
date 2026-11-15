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

export type ListboxFocusIntent = '' | 'first' | 'last' | `type:${string}`

export interface UseListboxContentOptions {
  /** The floating panel element. */
  root: Ref<globalThis.HTMLElement | null>
  /** The lazy option renderer, revealed before keyboard moves that need every option. */
  lazy: Ref<{ revealAll: () => void; hasHidden: () => boolean } | null>
  open: MaybeRefOrGetter<boolean>
  setOpen: (value: boolean) => void
  triggerRef: Ref<globalThis.HTMLElement | null>
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

const OPTION_SELECTOR = '[role="option"]:not([data-disabled])'

export function useListboxContent(options: UseListboxContentOptions): UseListboxContentReturn {
  const { root, lazy, setOpen, triggerRef, pendingFocus } = options
  const isOpen = () => toValue(options.open)
  const focusBack = () => (options.focusTarget?.value ?? triggerRef.value)?.focus()

  useOverlayLayer(() => isOpen(), { element: root })

  const enabledOptions = (): globalThis.HTMLElement[] =>
    Array.from(root.value?.querySelectorAll<globalThis.HTMLElement>(OPTION_SELECTOR) ?? []).filter(
      (option) => option.style.display !== 'none'
    )

  const activeElement = (): globalThis.HTMLElement | null =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null

  const moveFocus = (key: string) => {
    const list = enabledOptions()
    if (list.length === 0) return
    const active = activeElement()
    const currentIndex = active ? list.indexOf(active) : -1
    let nextIndex = currentIndex
    if (key === 'ArrowDown') nextIndex = currentIndex < list.length - 1 ? currentIndex + 1 : 0
    else if (key === 'ArrowUp') nextIndex = currentIndex > 0 ? currentIndex - 1 : list.length - 1
    else if (key === 'Home') nextIndex = 0
    else if (key === 'End') nextIndex = list.length - 1
    list[nextIndex]?.focus()
  }

  let typed = ''
  let typedAt = 0

  const typeahead = (key: string): boolean => {
    const el = root.value
    if (!el) return false
    if (
      el.contains(document.activeElement) &&
      document.activeElement?.matches(options.textFieldSelector)
    )
      return false
    lazy.value?.revealAll()
    const now = Date.now()
    typed = now - typedAt > 500 ? key : typed + key
    typedAt = now
    const list = enabledOptions()
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
    if (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      if (typeahead(event.key)) event.preventDefault()
      return
    }
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    )
      return
    event.preventDefault()
    navigate(event.key)
  }

  function navigate(key: string) {
    if (lazy.value?.hasHidden()) {
      lazy.value.revealAll()
      void nextTick(() => moveFocus(key))
      return
    }
    moveFocus(key)
  }

  const onDocumentPointerdown = (event: globalThis.PointerEvent) => {
    if (!isOpen()) return
    const el = root.value
    const target = event.target as globalThis.Node | null
    if (!el || !target) return
    if (el.contains(target)) return
    if (triggerRef.value?.contains(target)) return
    setOpen(false)
  }

  const focusInitial = async () => {
    const el = root.value
    if (!el) return
    const intent = pendingFocus.value
    pendingFocus.value = ''
    if (toValue(options.keepFocusOnOpen) && intent !== 'first' && intent !== 'last') return
    const search = el.querySelector<globalThis.HTMLElement>(
      'input:not([type="checkbox"]):not([type="radio"]):not([disabled])'
    )
    if (search) {
      search.focus()
      return
    }
    if (intent === 'first' || intent === 'last') {
      if (intent === 'last' && lazy.value?.hasHidden()) {
        lazy.value.revealAll()
        await nextTick()
      }
      moveFocus(intent === 'first' ? 'Home' : 'End')
      return
    }
    if (intent.startsWith('type:') && typeahead(intent.slice(5))) return
    const target =
      el.querySelector<globalThis.HTMLElement>(
        `[role="option"][aria-selected="true"]:not([data-disabled])`
      ) ?? el.querySelector<globalThis.HTMLElement>(OPTION_SELECTOR)
    target?.focus()
  }

  watch(
    () => isOpen(),
    async (next) => {
      if (next) {
        await nextTick()
        await focusInitial()
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
