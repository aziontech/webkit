import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'

import type { CommandRegisteredItem } from '../injection-key'
import { useCommandActive } from './use-command-active'

const item = (value: string, activated: string[]): CommandRegisteredItem => ({
  value,
  id: `item-${value}`,
  groupId: null,
  disabled: ref(false),
  isVisible: ref(true),
  el: ref(null),
  order: ref(0),
  activate: () => activated.push(value)
})

const setup = (values: string[], query = '') => {
  const activated: string[] = []
  const list = ref(values.map((value) => item(value, activated)))
  let popped = 0
  const active = useCommandActive(
    computed(() => list.value),
    ref(query),
    () => {
      popped += 1
      return true
    }
  )
  const press = (key: string) => {
    const event = new KeyboardEvent('keydown', { key, cancelable: true })
    active.onInputKeydown(event)
    return event.defaultPrevented
  }
  return { active, activated, press, popped: () => popped }
}

describe('useCommandActive', () => {
  it('roves with the arrows, wrapping at both ends, and jumps with Home and End', () => {
    const { active, press } = setup(['a', 'b', 'c'])
    expect(press('ArrowDown')).toBe(true)
    expect(active.activeValue.value).toBe('a')
    press('ArrowUp')
    expect(active.activeValue.value).toBe('c')
    press('ArrowDown')
    expect(active.activeValue.value).toBe('a')
    press('End')
    expect(active.activeValue.value).toBe('c')
    press('Home')
    expect(active.activeValue.value).toBe('a')
  })

  it('activates the active item on Enter and resets to the first item', () => {
    const { active, activated, press } = setup(['a', 'b'])
    active.setActive('b')
    expect(active.isActive('b')).toBe(true)
    press('Enter')
    expect(activated).toEqual(['b'])
    active.resetActive()
    expect(active.activeValue.value).toBe('a')
  })

  it('goes back a page on Escape, and on Backspace only with an empty query', () => {
    const empty = setup(['a'])
    expect(empty.press('Backspace')).toBe(true)
    expect(empty.press('Escape')).toBe(true)
    expect(empty.popped()).toBe(2)
    const typed = setup(['a'], 'dns')
    expect(typed.press('Backspace')).toBe(false)
    expect(typed.popped()).toBe(0)
  })

  it('clears the active item when an arrow finds nothing to rove', () => {
    const { active, press } = setup([])
    active.setActive('gone')
    press('ArrowDown')
    expect(active.activeValue.value).toBeNull()
  })
})
