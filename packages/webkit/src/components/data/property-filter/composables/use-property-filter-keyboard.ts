import { type MaybeRefOrGetter, type Ref, toValue } from 'vue'

import type { Suggestion } from '../lib/suggestion'

export interface UsePropertyFilterKeyboardOptions {
  suggestions: MaybeRefOrGetter<Suggestion[]>
  expanded: MaybeRefOrGetter<boolean>
  query: MaybeRefOrGetter<boolean>
  open: Ref<boolean>
  active: Ref<number>
  draft: Ref<string>
  text: Ref<string>
  submit: (event: KeyboardEvent) => void
  commitTyped: () => void
  removeLast: () => void
  resetQuery: () => void
}

export interface UsePropertyFilterKeyboardReturn {
  onKeydown: (event: KeyboardEvent) => void
}

const moveActive = (options: UsePropertyFilterKeyboardOptions, event: KeyboardEvent): void => {
  const { open, active } = options
  event.preventDefault()
  open.value = true
  const count = toValue(options.suggestions).length
  if (!count) return
  const step = event.key === 'ArrowDown' ? 1 : -1
  active.value = active.value < 0 && step < 0 ? count - 1 : (active.value + step + count) % count
}

const pick = (options: UsePropertyFilterKeyboardOptions, event: KeyboardEvent): void => {
  event.preventDefault()
  const index = options.active.value
  const picked =
    toValue(options.expanded) && index >= 0 ? toValue(options.suggestions)[index] : undefined
  if (picked) picked.apply()
  else if (toValue(options.query)) options.submit(event)
  else options.commitTyped()
}

const escape = (options: UsePropertyFilterKeyboardOptions, event: KeyboardEvent): void => {
  const query = toValue(options.query)
  if (toValue(options.expanded)) {
    event.preventDefault()
    options.open.value = false
    options.active.value = -1
  } else if (query && options.text.value) {
    event.preventDefault()
    options.resetQuery()
  } else if (!query && options.draft.value) {
    event.preventDefault()
    options.draft.value = ''
  }
}

export function usePropertyFilterKeyboard(
  options: UsePropertyFilterKeyboardOptions
): UsePropertyFilterKeyboardReturn {
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') moveActive(options, event)
    else if (event.key === 'Enter') pick(options, event)
    else if (event.key === 'Escape') escape(options, event)
    else if (!toValue(options.query) && event.key === 'Backspace' && !options.draft.value)
      options.removeLast()
  }
  return { onKeydown }
}
