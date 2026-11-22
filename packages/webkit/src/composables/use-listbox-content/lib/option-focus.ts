import { nextTick, type Ref } from 'vue'

export interface ListboxLazy {
  revealAll: () => void
  hasHidden: () => boolean
}

export interface OptionFocus {
  moveFocus: (key: string) => void
  navigate: (key: string) => void
  typeahead: (key: string) => boolean
}

export const OPTION_SELECTOR = '[role="option"]:not([data-disabled])'

const NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End'])

const TYPEAHEAD_RESET_MS = 500

export const isNavigationKey = (key: string): boolean => NAVIGATION_KEYS.has(key)

export const isTypeaheadKey = (event: globalThis.KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

const activeElement = (): globalThis.HTMLElement | null =>
  document.activeElement instanceof HTMLElement ? document.activeElement : null

function enabledOptions(root: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
  return Array.from(root?.querySelectorAll<globalThis.HTMLElement>(OPTION_SELECTOR) ?? []).filter(
    (option) => option.style.display !== 'none'
  )
}

function stepIndex(key: string, current: number, length: number): number {
  if (key === 'ArrowDown') return current < length - 1 ? current + 1 : 0
  if (key === 'ArrowUp') return current > 0 ? current - 1 : length - 1
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  return current
}

function matchTypeahead(
  list: globalThis.HTMLElement[],
  typed: string
): globalThis.HTMLElement | undefined {
  const query = typed.toLocaleLowerCase()
  const active = activeElement()
  const index = active ? list.indexOf(active) : -1
  const start = index === -1 ? 0 : index + (typed.length === 1 ? 1 : 0)
  const ordered = [...list.slice(start), ...list.slice(0, start)]
  return ordered.find((option) =>
    (option.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
  )
}

function typingInField(el: globalThis.HTMLElement, textFieldSelector: string): boolean {
  return Boolean(
    el.contains(document.activeElement) && document.activeElement?.matches(textFieldSelector)
  )
}

export function createOptionFocus(
  root: Ref<globalThis.HTMLElement | null>,
  lazy: Ref<ListboxLazy | null>,
  textFieldSelector: string
): OptionFocus {
  let typed = ''
  let typedAt = 0

  const moveFocus = (key: string): void => {
    const list = enabledOptions(root.value)
    if (list.length === 0) return
    const active = activeElement()
    const currentIndex = active ? list.indexOf(active) : -1
    list[stepIndex(key, currentIndex, list.length)]?.focus()
  }

  const navigate = (key: string): void => {
    if (lazy.value?.hasHidden()) {
      lazy.value.revealAll()
      void nextTick(() => moveFocus(key))
      return
    }
    moveFocus(key)
  }

  const typeahead = (key: string): boolean => {
    const el = root.value
    if (!el || typingInField(el, textFieldSelector)) return false
    lazy.value?.revealAll()
    const now = Date.now()
    typed = now - typedAt > TYPEAHEAD_RESET_MS ? key : typed + key
    typedAt = now
    const match = matchTypeahead(enabledOptions(root.value), typed)
    match?.focus()
    return Boolean(match)
  }

  return { moveFocus, navigate, typeahead }
}
