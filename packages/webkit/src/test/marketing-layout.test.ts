import './reflow.css'

import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, page } from 'vitest/browser'
import type { Component } from 'vue'

import ApplicationSceneBand from '../../examples/assets-console-application-scene/band.vue'
import ApplicationSceneDefault from '../../examples/assets-console-application-scene/default.vue'
import TraceSceneDefault from '../../examples/assets-console-trace-scene/default.vue'
import ConsoleShowcaseDefault from '../../examples/console-showcase-section/default.vue'
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

  it.each([
    ['three views', ConsoleShowcaseDefault, 1],
    ['four views', ApplicationSceneDefault, 2]
  ] as const)(
    'ConsoleShowcaseSection lays %s out in even rows on a phone',
    async (_name, example, rows) => {
      for (const width of [320, 390]) {
        const root = await mountAt(example, width)
        const options = Array.from(root.querySelectorAll('[role="radiogroup"] [role="radio"]')).map(
          box
        )
        expect(new Set(options.map((option) => Math.round(option.top))).size).toBe(rows)
        const widths = options.map((option) => option.width)
        expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1)
        cleanup()
      }
    }
  )

  it('console scenes fade their page out at the crop on a phone instead of cutting a row', async () => {
    const root = await mountAt(TraceSceneDefault, 390)
    const page = await vi.waitFor(() => {
      const found = root.querySelector('[data-testid="console-trace-scene__page"]')
      expect(found).not.toBeNull()
      return found!
    })
    expect(getComputedStyle(page).maskImage).toContain('linear-gradient')
  })

  it('the application scene keeps its save bar off the rows on a phone', async () => {
    const root = await mountAt(ApplicationSceneBand, 390)
    await vi.waitFor(() =>
      expect(root.querySelector('[data-testid="console-application-scene__page"]')).not.toBeNull()
    )
    for (const bar of root.querySelectorAll(
      '[data-testid="console-application-scene__save-bar"]'
    )) {
      expect(visible(bar)).toBe(false)
    }
  })
})
