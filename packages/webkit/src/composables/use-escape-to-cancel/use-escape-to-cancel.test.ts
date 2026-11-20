import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'

import { useEscapeToCancel, type UseEscapeToCancelOptions } from './index'

const scopes: ReturnType<typeof effectScope>[] = []
const nodes: HTMLElement[] = []
afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop())
  nodes.splice(0).forEach((node) => node.remove())
})

const setup = (options: UseEscapeToCancelOptions = {}) => {
  const scope = effectScope()
  scopes.push(scope)
  const onEscape = vi.fn()
  scope.run(() => useEscapeToCancel(onEscape, options))
  return { onEscape, scope }
}

const mount = (html: string) => {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)
  nodes.push(host)
  return host
}

const press = (target: EventTarget, init: ConstructorParameters<typeof KeyboardEvent>[1] = {}) => {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    bubbles: true,
    cancelable: true,
    ...init
  })
  target.dispatchEvent(event)
  return event
}

describe('useEscapeToCancel', () => {
  it('runs on Escape from the page or a plain field', () => {
    const { onEscape } = setup()
    const host = mount('<input aria-label="Name" />')
    press(document.body)
    press(host.querySelector('input')!)
    expect(onEscape).toHaveBeenCalledTimes(2)
    expect(onEscape.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('ignores other keys, modifiers and IME composition', () => {
    const { onEscape } = setup()
    press(document.body, { key: 'Enter' })
    press(document.body, { shiftKey: true })
    press(document.body, { isComposing: true })
    expect(onEscape).not.toHaveBeenCalled()
  })

  it('ignores a key another handler already used', () => {
    const { onEscape } = setup()
    const host = mount('<button type="button">Close</button>')
    const button = host.querySelector('button')!
    button.addEventListener('keydown', (event) => event.preventDefault())
    press(button)
    expect(onEscape).not.toHaveBeenCalled()
  })

  it('ignores Escape while an overlay is open, even when it closes on that key', () => {
    const { onEscape } = setup()
    const host = mount('<div role="dialog" aria-label="Pick"><button>Ok</button></div>')
    const dialog = host.querySelector('[role="dialog"]')!
    press(document.body)
    expect(onEscape).not.toHaveBeenCalled()
    host.querySelector('button')!.addEventListener('keydown', () => dialog.remove())
    press(host.querySelector('button')!)
    expect(onEscape).not.toHaveBeenCalled()
  })

  it('ignores Escape on an open combobox', () => {
    const { onEscape } = setup()
    const host = mount('<input role="combobox" aria-expanded="true" aria-label="Region" />')
    press(host.querySelector('input')!)
    expect(onEscape).not.toHaveBeenCalled()
  })

  it('still runs on a focused disclosure that is open', () => {
    const { onEscape } = setup()
    const host = mount('<button type="button" aria-expanded="true">Advanced</button>')
    press(host.querySelector('button')!)
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('stays off while disabled and stops listening when the scope ends', () => {
    const enabled = ref(false)
    const { onEscape, scope } = setup({ enabled })
    press(document.body)
    expect(onEscape).not.toHaveBeenCalled()
    enabled.value = true
    press(document.body)
    expect(onEscape).toHaveBeenCalledTimes(1)
    scope.stop()
    press(document.body)
    expect(onEscape).toHaveBeenCalledTimes(1)
  })
})
