import { type ComputedRef, type Ref, ref } from 'vue'

import type { CommandItemValue, CommandRegisteredItem } from '../injection-key'

export interface UseCommandActiveReturn {
  activeValue: Ref<CommandItemValue | null>
  setActive: (value: CommandItemValue | null) => void
  isActive: (value: CommandItemValue) => boolean
  resetActive: () => void
  onInputKeydown: (event: globalThis.KeyboardEvent) => void
}

function nextIndex(key: string, current: number, length: number): number {
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  const next = current + (key === 'ArrowDown' ? 1 : -1)
  if (next < 0) return length - 1
  return next >= length ? 0 : next
}

export function useCommandActive(
  navigableItems: ComputedRef<CommandRegisteredItem[]>,
  query: Ref<string>,
  popPage: () => boolean
): UseCommandActiveReturn {
  const activeValue = ref<CommandItemValue | null>(null)

  const move = (key: string) => {
    const list = navigableItems.value
    if (list.length) {
      const current = list.findIndex((item) => item.value === activeValue.value)
      activeValue.value = list[nextIndex(key, current, list.length)].value
    } else if (key === 'ArrowDown' || key === 'ArrowUp') activeValue.value = null
  }

  const onInputKeydown = (event: globalThis.KeyboardEvent) => {
    const { key } = event
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
      event.preventDefault()
      move(key)
    } else if (key === 'Backspace' || key === 'Escape') {
      if ((key === 'Escape' || query.value === '') && popPage()) event.preventDefault()
    } else if (key === 'Enter') {
      event.preventDefault()
      navigableItems.value.find((item) => item.value === activeValue.value)?.activate(event)
    }
  }

  return {
    activeValue,
    setActive: (value) => {
      activeValue.value = value
    },
    isActive: (value) => activeValue.value === value,
    resetActive: () => {
      activeValue.value = navigableItems.value[0]?.value ?? null
    },
    onInputKeydown
  }
}
