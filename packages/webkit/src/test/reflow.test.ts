import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { Component } from 'vue'
import { nextTick } from 'vue'

const modules = {
  ...import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

const SCROLLS_BY_DESIGN: Record<string, string> = {}

const WIDTHS = [320, 1280] as const

function describeOverflow(root: HTMLElement): string {
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

async function mountInBox(component: Component, width: number): Promise<HTMLElement> {
  await page.viewport(width, 900)
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  render(component, { container: host })
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  return host
}

describe('reflow harness', () => {
  it('compiles the theme and the container variants', async () => {
    const host = await mountInBox(
      {
        template:
          '<div class="@container/probe flex"><span class="hidden @3xs/probe:block">wide</span></div>'
      },
      320
    )
    const box = host.firstElementChild as HTMLElement
    expect(getComputedStyle(box).display).toBe('flex')
    expect(getComputedStyle(box).containerType).toBe('inline-size')
    expect(getComputedStyle(box.firstElementChild as HTMLElement).display).toBe('block')
  })

  it('keeps the allowlist short and pointed at real files', () => {
    const files = Object.keys(modules).map((file) => file.replace('../../', ''))
    for (const file of Object.keys(SCROLLS_BY_DESIGN)) expect(files).toContain(file)
    expect(Object.keys(SCROLLS_BY_DESIGN).length).toBeLessThanOrEqual(5)
  })
})

for (const width of WIDTHS) {
  describe(`blocks and examples reflow in a ${width}px box`, () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => vi.restoreAllMocks())

    it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))(
      '%s',
      async (file) => {
        const mod = await modules[`../../${file}`]()
        const host = await mountInBox(mod.default, width)
        const overflow = host.scrollWidth - host.clientWidth
        if (overflow > 1 && !(file in SCROLLS_BY_DESIGN)) {
          expect.fail(
            `${file} overflows its ${width}px box by ${overflow}px: ${describeOverflow(host)}`
          )
        }
      }
    )
  })
}
