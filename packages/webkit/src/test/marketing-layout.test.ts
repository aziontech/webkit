import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, page } from 'vitest/browser'
import type { Component } from 'vue'

import MarqueeDefault from '../../examples/marquee/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function mountAt(component: Component, width: number) {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.matchMedia(`(width: ${width}px)`).matches).toBe(true))
  const view = render(component)
  await frame()
  await frame()
  return view.container as HTMLElement
}

const box = (el: Element) => el.getBoundingClientRect()

const visible = (el: Element) => {
  const rect = box(el)
  return rect.width > 0 && rect.height > 0
}

afterEach(async () => {
  await commands.emulateMedia({ reducedMotion: null })
  await page.viewport(414, 896)
})

describe('marketing element layouts (styled)', () => {
  it.each([320, 390])(
    'Marquee under reduced motion shows each mark once, inside the screen, at %ipx',
    async (width) => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      const root = await mountAt(MarqueeDefault, width)
      const marks = await vi.waitFor(() => {
        const found = Array.from(root.querySelectorAll('svg[data-mark]')).filter(visible)
        expect(found.length).toBeGreaterThan(0)
        return found
      })
      const names = marks.map((mark) => mark.getAttribute('data-mark'))
      expect(new Set(names).size).toBe(names.length)
      for (const mark of marks) {
        expect(box(mark).left).toBeGreaterThanOrEqual(0)
        expect(box(mark).right).toBeLessThanOrEqual(width)
      }
    }
  )
})
