import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { Component } from 'vue'
import { nextTick } from 'vue'

export const modules = {
  ...import.meta.glob<{ default: Component }>([
    '../../blocks/**/*.vue',
    '!../../blocks/**/parts/**'
  ]),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

export const SCROLLS_BY_DESIGN: Record<string, string> = {}

export const CASES = [
  { name: '320px box', width: 320, rootFontSize: '' },
  { name: '768px box', width: 768, rootFontSize: '' },
  { name: '1280px box', width: 1280, rootFontSize: '' },
  { name: '1920px box', width: 1920, rootFontSize: '' },
  { name: '2560px box', width: 2560, rootFontSize: '' },
  { name: '640px box at 200% zoom (root font size doubled)', width: 640, rootFontSize: '200%' }
] as const

export function describeOverflow(root: HTMLElement): string {
  const limit = root.getBoundingClientRect().right + 1
  const offenders: string[] = []
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.right <= limit) continue
    let clipped = false
    for (let parent = el.parentElement; parent && parent !== root; parent = parent.parentElement) {
      if (
        getComputedStyle(parent).overflowX !== 'visible' &&
        parent.getBoundingClientRect().right <= limit
      ) {
        clipped = true
        break
      }
    }
    if (clipped) continue
    const id = el.dataset['testid'] ? `[${el.dataset['testid']}]` : ''
    offenders.push(`${el.tagName.toLowerCase()}${id} +${Math.round(rect.right - limit)}px`)
  }
  return offenders.slice(0, 6).join(', ')
}

export async function mountInBox(component: Component, width: number): Promise<HTMLElement> {
  await page.viewport(width, 900)
  // WebKit applies the new frame size after the command resolves and re-evaluates
  // media queries later still; `max-lg:` folding must see the width before measuring.
  await vi.waitFor(() => {
    expect(window.innerWidth).toBe(width)
    expect(window.matchMedia(`(width: ${width}px)`).matches).toBe(true)
  })
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  render(component, { container: host })
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  return host
}

export function defineReflowSuites(widths: readonly number[]): void {
  for (const { name, width, rootFontSize } of CASES.filter((c) => widths.includes(c.width))) {
    describe(`blocks and examples reflow in a ${name}`, () => {
      beforeEach(() => {
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        document.documentElement.style.fontSize = rootFontSize
      })
      afterEach(() => {
        document.documentElement.style.fontSize = ''
        vi.restoreAllMocks()
      })

      it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))(
        '%s',
        async (file) => {
          const mod = await modules[`../../${file}`]()
          const host = await mountInBox(mod.default, width)
          const overflow = host.scrollWidth - host.clientWidth
          if (overflow > 1 && !(file in SCROLLS_BY_DESIGN)) {
            expect.fail(`${file} overflows its ${name} by ${overflow}px: ${describeOverflow(host)}`)
          }
        }
      )
    })
  }
}
