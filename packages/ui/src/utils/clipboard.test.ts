import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { copyText } from './clipboard'

const original = Object.getOwnPropertyDescriptor(globalThis.navigator, 'clipboard')

const stubClipboard = (value: unknown): void => {
  Object.defineProperty(globalThis.navigator, 'clipboard', { value, configurable: true })
}

const captureCopies = (): string[] => {
  const copies: string[] = []
  document.addEventListener('copy', (event) => {
    const target = event.target as HTMLTextAreaElement
    copies.push(target.value.slice(target.selectionStart, target.selectionEnd))
  })
  return copies
}

const copyOnClick = async (text: string): Promise<boolean> => {
  const button = document.createElement('button')
  button.textContent = 'Copy'
  document.body.appendChild(button)
  let result: Promise<boolean> = Promise.resolve(false)
  button.addEventListener('click', () => {
    result = copyText(text)
  })
  await userEvent.click(button)
  const copied = await result
  button.remove()
  return copied
}

afterEach(() => {
  if (original) Object.defineProperty(globalThis.navigator, 'clipboard', original)
  else Reflect.deleteProperty(globalThis.navigator, 'clipboard')
})

describe('copyText', () => {
  it('writes through the async clipboard when it is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard({ writeText })
    expect(await copyOnClick('acme-store')).toBe(true)
    expect(writeText).toHaveBeenCalledWith('acme-store')
  })

  it('copies through a selected field when the async clipboard is missing, as on plain http', async () => {
    stubClipboard(undefined)
    const copies = captureCopies()
    expect(await copyOnClick('https://example.com/docs')).toBe(true)
    expect(copies).toContain('https://example.com/docs')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('falls back to the selected field when the async clipboard refuses the write', async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) })
    const copies = captureCopies()
    expect(await copyOnClick('line one\nline two')).toBe(true)
    expect(copies).toContain('line one\nline two')
  })

  it('returns focus to the element that had it', async () => {
    stubClipboard(undefined)
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    await copyText('staging')
    expect(document.activeElement).toBe(input)
    input.remove()
  })
})
