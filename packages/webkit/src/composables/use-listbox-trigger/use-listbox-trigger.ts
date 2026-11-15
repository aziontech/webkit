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

export function useListboxTrigger(options: UseListboxTriggerOptions): UseListboxTriggerReturn {
  const openWith = (event: globalThis.KeyboardEvent, intent: ListboxFocusIntent) => {
    event.preventDefault()
    options.pendingFocus.value = intent
    options.setOpen(true)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (toValue(options.locked)) return
    const key = event.key
    if (key === 'Escape') {
      if (!toValue(options.open)) return
      event.preventDefault()
      options.setOpen(false)
      return
    }
    if (toValue(options.open)) return
    if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
      openWith(event, '')
    } else if (key === 'Home') {
      openWith(event, 'first')
    } else if (key === 'End') {
      openWith(event, 'last')
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      openWith(event, `type:${key}`)
    }
  }

  return { onKeydown }
}
