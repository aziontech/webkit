import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import EmbedPageEntry from '../../examples/embed/page-entry.vue'
import ConsoleShowcaseSection from '../components/section/console-showcase-section/console-showcase-section.vue'

const WIDE = 1280

const wide = async () => {
  await page.viewport(WIDE, 900)
  await vi.waitFor(() => expect(window.matchMedia('(min-width: 48rem)').matches).toBe(true))
}

const gapUnder = (frame: HTMLElement, scene: Element) =>
  frame.getBoundingClientRect().bottom - scene.getBoundingClientRect().bottom

const spacingXl = () => {
  const probe = document.createElement('div')
  probe.style.height = 'var(--spacing-xl)'
  document.body.append(probe)
  const value = probe.getBoundingClientRect().height
  probe.remove()
  return value
}

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('ConsoleShowcaseSection keeps its scene off the band edge', () => {
  it('pads the bottom of a diagram scene on wide screens', async () => {
    await wide()
    const { getByTestId } = render(ConsoleShowcaseSection, {
      props: { variant: 'diagram', title: 'Requests' },
      slots: { scene: () => h('div', { 'data-testid': 'tall-scene', style: 'height: 40rem' }) }
    })
    const frame = getByTestId('console-showcase-section__frame')
    const gap = gapUnder(frame, getByTestId('tall-scene'))
    expect(spacingXl()).toBeGreaterThan(0)
    expect(gap).toBeGreaterThanOrEqual(spacingXl() - 1)
  })

  it('pads the bottom of the Embed page JSON scene on wide screens', async () => {
    await wide()
    const { container } = render(EmbedPageEntry)
    await vi.waitFor(() => expect(container.querySelector('iframe')).not.toBeNull())
    const frame = container.querySelector<HTMLElement>(
      '[data-testid="console-showcase-section__frame"]'
    )!
    const scene = container.querySelector('[data-plain-ground]')!
    expect(gapUnder(frame, scene)).toBeGreaterThanOrEqual(spacingXl() - 1)
  })

  it('lets the console mock-up run into the bottom edge, as its crop needs', async () => {
    await wide()
    const { getByTestId } = render(ConsoleShowcaseSection, {
      props: { title: 'Console' },
      slots: { scene: () => h('div', { 'data-testid': 'console-scene', class: 'h-full' }) }
    })
    expect(
      gapUnder(getByTestId('console-showcase-section__frame'), getByTestId('console-scene'))
    ).toBeLessThan(1)
  })
})
