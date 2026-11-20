import './reflow.css'
import '../../../icons/dist/azionicons.css'
import '../../../icons/dist/azionicons-color.css'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

const icon = (className: string) => {
  const node = document.createElement('i')
  node.className = className
  node.setAttribute('aria-hidden', 'true')
  document.body.append(node)
  return node
}

const display = (node: Element) => getComputedStyle(node).display

afterEach(async () => {
  document.body.replaceChildren()
  await page.viewport(414, 896)
})

describe('a display utility always wins over the icon base rule', () => {
  it('keeps an az icon inline-block by default, so the font still renders it', () => {
    expect(display(icon('az az-lock'))).toBe('inline-block')
    expect(display(icon('az-color az-github'))).toBe('inline-block')
  })

  it('hides an az icon with a plain hidden class', () => {
    expect(display(icon('az az-lock hidden'))).toBe('none')
    expect(display(icon('az az-lock-open hidden'))).toBe('none')
  })

  it('hides an az-color icon with a plain hidden class', () => {
    expect(display(icon('az-color az-github hidden'))).toBe('none')
  })

  it('applies another display utility over the icon rule', () => {
    expect(display(icon('az az-lock block'))).toBe('block')
  })

  it('shows a hidden icon again at the breakpoint of a responsive display utility', async () => {
    const node = icon('az az-lock hidden sm:block')
    expect(display(node)).toBe('none')
    await page.viewport(1280, 900)
    await vi.waitFor(() => expect(window.matchMedia('(min-width: 40rem)').matches).toBe(true))
    expect(display(node)).toBe('block')
  })
})
