import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import LiveScenes from '../../examples/feature-scroll-section/live-scenes.vue'

describe('a live console scene in a feature scroll pane stays legible', () => {
  it('draws the pinned scene at 85% of its size or more at 1280', async () => {
    await page.viewport(1280, 900)
    await vi.waitFor(() => expect(window.matchMedia('(min-width: 64rem)').matches).toBe(true))
    const { container } = render(LiveScenes)

    await vi.waitFor(
      () => {
        const shown = [...container.querySelectorAll<HTMLElement>('[style*="scale("]')].filter(
          (frame) => frame.getBoundingClientRect().width > 0
        )
        expect(shown.length).toBeGreaterThan(0)
        for (const frame of shown) {
          const scale = Number(/scale\(([\d.]+)\)/.exec(frame.style.transform)?.[1])
          expect(scale, frame.style.width).toBeGreaterThanOrEqual(0.85)
        }
      },
      { timeout: 10000 }
    )
  })
})
