import { afterEach, describe, expect, it } from 'vitest'
import { computed, effectScope, ref, shallowRef } from 'vue'

import type { NavigationMenuChangeEventDetails } from '../lib/change-event-details'
import {
  type NavigationMenuTriggerEntry,
  useNavigationMenuKeyboard
} from './use-navigation-menu-keyboard'

const setup = (dir: 'ltr' | 'rtl' = 'ltr', withLink = false) => {
  const buttons = ['a', 'b', 'c'].map((value) => {
    const el = document.createElement('button')
    el.textContent = value
    document.body.append(el)
    return { value, el }
  })
  const links: HTMLElement[] = []
  if (withLink) {
    const link = document.createElement('a')
    link.href = 'https://example.com/pricing/'
    link.textContent = 'Pricing'
    buttons[0]!.el.after(link)
    links.push(link)
  }
  const current = ref<string | number | null>(null)
  const calls: Array<[string | number | null, NavigationMenuChangeEventDetails]> = []
  const keyboard = effectScope().run(() =>
    useNavigationMenuKeyboard({
      value: computed(() => current.value),
      orientation: computed(() => 'horizontal'),
      isRtl: () => dir === 'rtl',
      triggers: shallowRef<NavigationMenuTriggerEntry[]>(buttons),
      links: shallowRef<HTMLElement[]>(links),
      popupEl: shallowRef(null),
      activeTriggerEl: shallowRef(null),
      setValue: (next, details) => {
        calls.push([next, details])
        current.value = next
      }
    })
  )!
  return { buttons, links, calls, keyboard }
}

const keydown = (key: string, target: HTMLElement) => {
  const event = new KeyboardEvent('keydown', { key, cancelable: true })
  Object.defineProperty(event, 'currentTarget', { value: target })
  return event
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useNavigationMenuKeyboard', () => {
  it('moves to the next trigger with the arrow that follows the text direction', () => {
    const ltr = setup()
    ltr.buttons[0].el.focus()
    ltr.keyboard.onTriggerKeydown(keydown('ArrowRight', ltr.buttons[0].el))
    expect(ltr.calls.at(-1)?.[0]).toBe('b')
    expect(ltr.calls.at(-1)?.[1].reason).toBe('list-navigation')
    expect(document.activeElement).toBe(ltr.buttons[1].el)

    document.body.innerHTML = ''
    const rtl = setup('rtl')
    rtl.buttons[0].el.focus()
    rtl.keyboard.onTriggerKeydown(keydown('ArrowLeft', rtl.buttons[0].el))
    expect(rtl.calls.at(-1)?.[0]).toBe('b')
  })

  it('toggles the own trigger with Enter and closes with Escape', () => {
    const { buttons, calls, keyboard } = setup()
    keyboard.onTriggerKeydown(keydown('Enter', buttons[2].el))
    expect(calls.at(-1)?.[0]).toBe('c')
    keyboard.onTriggerKeydown(keydown('Enter', buttons[2].el))
    expect(calls.at(-1)?.[0]).toBeNull()
    keyboard.onTriggerKeydown(keydown('Escape', buttons[2].el))
    expect(calls.at(-1)?.[1].reason).toBe('escape-key')
  })

  it('ignores keys that do not move or open', () => {
    const { buttons, calls, keyboard } = setup()
    keyboard.onTriggerKeydown(keydown('x', buttons[0].el))
    keyboard.onPopupKeydown(keydown('ArrowDown', buttons[0].el))
    expect(calls).toHaveLength(0)
  })

  it('stops on a plain link between triggers, in document order, and closes the open panel', () => {
    const { buttons, links, calls, keyboard } = setup('ltr', true)
    buttons[0]!.el.focus()
    keyboard.onTriggerKeydown(keydown('Enter', buttons[0]!.el))
    keyboard.onTriggerKeydown(keydown('ArrowRight', buttons[0]!.el))
    expect(document.activeElement).toBe(links[0])
    expect(calls.at(-1)?.[0]).toBeNull()
    keyboard.onLinkKeydown(keydown('ArrowRight', links[0]!))
    expect(document.activeElement).toBe(buttons[1]!.el)
    expect(calls.at(-1)?.[0]).toBe('b')
    keyboard.onTriggerKeydown(keydown('ArrowLeft', buttons[1]!.el))
    expect(document.activeElement).toBe(links[0])
  })
})
