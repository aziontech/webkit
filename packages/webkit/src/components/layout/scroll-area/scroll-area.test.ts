import { fireEvent, render } from '@testing-library/vue'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ScrollArea from './scroll-area.vue'

/**
 * The unit env loads no Tailwind, so the component's overflow utilities do not
 * resolve. This fixture sheet re-declares exactly what those utilities mean,
 * keyed off the component's own data-orientation attribute, plus a fixed
 * 100×100 viewport and 500×500 content so overflow is real in the browser.
 * Scroll math (scrollTop/scrollLeft, clamping) is the browser's own.
 */
const FIXTURE_CSS = `
  .scroll-fixture { height: 100px; width: 100px; }
  .scroll-fixture[data-orientation='vertical'] { overflow-y: auto; overflow-x: hidden; }
  .scroll-fixture[data-orientation='horizontal'] { overflow-x: auto; overflow-y: hidden; }
  .scroll-fixture[data-orientation='both'] { overflow: auto; }
  .scroll-content { height: 500px; width: 500px; }
`

let fixtureSheet: globalThis.HTMLStyleElement

beforeAll(() => {
  fixtureSheet = document.createElement('style')
  fixtureSheet.textContent = FIXTURE_CSS
  document.head.appendChild(fixtureSheet)
})

afterAll(() => {
  fixtureSheet.remove()
})

const host = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { ScrollArea },
    setup() {
      return { props }
    },
    template: `
      <ScrollArea class="scroll-fixture" v-bind="props">
        <div class="scroll-content">Deployment log output</div>
      </ScrollArea>
    `
  })

const area = (view: ReturnType<typeof render>, testId = 'layout-scroll-area') =>
  view.getByTestId(testId)

describe('ScrollArea (layout viewport + keyboard scrolling)', () => {
  // ---- Anatomy ----------------------------------------------------------------
  it('renders a focusable viewport with the default testid and vertical orientation', () => {
    const view = render(host())

    const viewport = area(view)
    expect(viewport.getAttribute('tabindex')).toBe('0')
    expect(viewport.getAttribute('data-orientation')).toBe('vertical')
    expect(viewport.hasAttribute('aria-label')).toBe(false)
    expect(viewport.textContent).toContain('Deployment log output')
  })

  it('a consumer data-testid override wins over the fallback', () => {
    const view = render(host({ 'data-testid': 'build-log' }))
    expect(area(view, 'build-log')).toBeTruthy()
  })

  it.each(['vertical', 'horizontal', 'both'] as const)(
    'mirrors orientation=%s onto data-orientation',
    (orientation) => {
      const view = render(host({ orientation }))
      expect(area(view).getAttribute('data-orientation')).toBe(orientation)
    }
  )

  it('sets aria-label from the prop when provided', () => {
    const view = render(host({ ariaLabel: 'Deployment log' }))
    expect(area(view).getAttribute('aria-label')).toBe('Deployment log')
  })

  // ---- Keyboard scrolling: vertical ----------------------------------------------
  it('ArrowDown / ArrowUp scroll the viewport by the 40px step and prevent default', async () => {
    const view = render(host())
    const viewport = area(view)
    expect(viewport.scrollTop).toBe(0)

    const down = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    viewport.dispatchEvent(down)
    expect(viewport.scrollTop).toBe(40)
    // A handled key claims the event so the page does not double-scroll.
    expect(down.defaultPrevented).toBe(true)

    await fireEvent.keyDown(viewport, { key: 'ArrowDown' })
    expect(viewport.scrollTop).toBe(80)

    const up = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    viewport.dispatchEvent(up)
    expect(viewport.scrollTop).toBe(40)
    expect(up.defaultPrevented).toBe(true)
  })

  it('PageDown / PageUp scroll by one viewport height', async () => {
    const view = render(host())
    const viewport = area(view)
    const page = viewport.clientHeight
    expect(page).toBeGreaterThan(0)

    await fireEvent.keyDown(viewport, { key: 'PageDown' })
    expect(viewport.scrollTop).toBe(page)

    await fireEvent.keyDown(viewport, { key: 'PageUp' })
    expect(viewport.scrollTop).toBe(0)
  })

  it('End jumps to the maximum scroll offset and Home returns to the top', async () => {
    const view = render(host())
    const viewport = area(view)
    const maxScroll = viewport.scrollHeight - viewport.clientHeight
    expect(maxScroll).toBeGreaterThan(0)

    await fireEvent.keyDown(viewport, { key: 'End' })
    // The browser clamps scrollTop = scrollHeight to the real maximum.
    expect(viewport.scrollTop).toBe(maxScroll)

    await fireEvent.keyDown(viewport, { key: 'Home' })
    expect(viewport.scrollTop).toBe(0)
  })

  // ---- Orientation gating -----------------------------------------------------------
  it('vertical orientation ignores horizontal keys: no scroll, default not prevented', async () => {
    const view = render(host())
    const viewport = area(view)

    const right = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true
    })
    viewport.dispatchEvent(right)
    expect(viewport.scrollLeft).toBe(0)
    // The handler returned early: the event keeps its default for the page.
    expect(right.defaultPrevented).toBe(false)
  })

  it('horizontal orientation scrolls on ArrowRight / ArrowLeft and ignores vertical keys', async () => {
    const view = render(host({ orientation: 'horizontal' }))
    const viewport = area(view)

    await fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(viewport.scrollLeft).toBe(40)

    await fireEvent.keyDown(viewport, { key: 'ArrowLeft' })
    expect(viewport.scrollLeft).toBe(0)

    const downInHorizontal = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true
    })
    viewport.dispatchEvent(downInHorizontal)
    expect(viewport.scrollTop).toBe(0)
    expect(downInHorizontal.defaultPrevented).toBe(false)
  })

  it('both orientation scrolls on both axes', async () => {
    const view = render(host({ orientation: 'both' }))
    const viewport = area(view)

    await fireEvent.keyDown(viewport, { key: 'ArrowDown' })
    await fireEvent.keyDown(viewport, { key: 'ArrowRight' })
    expect(viewport.scrollTop).toBe(40)
    expect(viewport.scrollLeft).toBe(40)
  })

  // ---- Accessibility -------------------------------------------------------------------
  it('has no axe violations with an accessible name on the scroll region', async () => {
    const view = render(host({ ariaLabel: 'Deployment log' }))
    await expectNoA11yViolations(view.container)
  })
})
