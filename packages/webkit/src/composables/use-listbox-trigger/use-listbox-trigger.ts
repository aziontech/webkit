import { type MaybeRefOrGetter, type Ref, toValue } from 'vue'

import type { ListboxFocusIntent } from '../use-listbox-content'

export interface UseListboxTriggerOptions {
  open: MaybeRefOrGetter<boolean>
  setOpen: (value: boolean) => void
  /** Blocks every key while disabled or read-only. */
  locked: MaybeRefOrGetter<boolean>
  pendingFocus: Ref<ListboxFocusIntent>
}

export interface UseListboxTriggerReturn {
  onKeydown: (event: globalThis.KeyboardEvent) => void
}

const OPEN_KEYS = new Set(['Enter', ' ', 'ArrowDown', 'ArrowUp'])

function openIntent(event: globalThis.KeyboardEvent): ListboxFocusIntent | null {
  const key = event.key
  if (OPEN_KEYS.has(key)) return ''
  if (key === 'Home') return 'first'
  if (key === 'End') return 'last'
  if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) return `type:${key}`
  return null
}

export function useListboxTrigger(options: UseListboxTriggerOptions): UseListboxTriggerReturn {
  const openWith = (event: globalThis.KeyboardEvent, intent: ListboxFocusIntent) => {
    event.preventDefault()
    options.pendingFocus.value = intent
    options.setOpen(true)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (toValue(options.locked)) return
    if (event.key === 'Escape') {
      if (!toValue(options.open)) return
      event.preventDefault()
      options.setOpen(false)
      return
    }
    if (toValue(options.open)) return
    const intent = openIntent(event)
    if (intent !== null) openWith(event, intent)
  }

  return { onKeydown }
}
