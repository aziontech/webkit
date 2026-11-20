import '../../../test/reflow.css'

import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands, page } from 'vitest/browser'

import DefaultExample from '../../../../examples/site-header-section/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'

const OPEN_TIMEOUT = 3000

const shown = (el: Element) => el.getClientRects().length > 0

const body = () => within(document.body)

const header = () => {
  const view = render(DefaultExample)
  const bar = view.getByRole('banner', { name: 'Azion' })
  const trigger = within(bar).getByRole('button', { name: 'Search' })
  const keycap = within(trigger).getByTestId('search-trigger__shortcut')
  const label = within(trigger).getByTestId('search-trigger__label')
  return { ...view, bar, trigger, keycap, label }
}

const setPlatform = (platform: string | null) => {
  if (platform === null) {
    Reflect.deleteProperty(navigator, 'platform')
    return
  }
  Object.defineProperty(navigator, 'platform', { configurable: true, get: () => platform })
}

afterEach(async () => {
  await commands.emulateTouch(false)
  setPlatform(null)
  await page.viewport(414, 896)
})

describe('SiteHeaderSection', () => {
  describe('the search (styled)', () => {
    it('is the field with its keycap on a wide bar with a mouse', async () => {
      await page.viewport(1440, 900)
      const { trigger, keycap, label } = header()

      await waitFor(() => expect(shown(label)).toBe(true))
      expect(shown(keycap)).toBe(true)
      expect(trigger.getBoundingClientRect().width).toBeGreaterThan(100)
    })

    it('hides the keycap on a touch screen and keeps the field and its label', async () => {
      await commands.emulateTouch(true)
      await page.viewport(1440, 900)
      const { trigger, keycap, label } = header()

      await waitFor(() => expect(shown(label)).toBe(true))
      expect(shown(keycap)).toBe(false)
      expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K')
    })

    it('folds to a named magnifier button in the phone bar, before the call to action', async () => {
      await page.viewport(390, 844)
      const { bar, trigger, keycap, label } = header()

      await waitFor(() => expect(shown(label)).toBe(false))
      expect(shown(keycap)).toBe(false)
      expect(shown(trigger)).toBe(true)
      expect(trigger).toHaveAccessibleName('Search')
      const { width, height } = trigger.getBoundingClientRect()
      expect(width).toBe(height)

      const signUp = within(bar).getByRole('link', { name: 'Start for free' })
      expect(shown(signUp)).toBe(true)
      expect(
        trigger.compareDocumentPosition(signUp) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
      await expectNoA11yViolations(bar)
    })

    it('opens the same search dialog from the folded button and from Ctrl K', async () => {
      await page.viewport(390, 844)
      const { trigger } = header()

      await userEvent.click(trigger)
      await waitFor(() => expect(body().getByRole('dialog')).toBeInTheDocument(), {
        timeout: OPEN_TIMEOUT
      })
      const fromClick = body().getByRole('dialog')
      expect(within(fromClick).getByPlaceholderText('Search azion.com')).toBeInTheDocument()

      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(body().queryByRole('dialog')).toBeNull(), {
        timeout: OPEN_TIMEOUT
      })

      await userEvent.keyboard('{Control>}k{/Control}')
      await waitFor(
        () =>
          expect(
            within(body().getByRole('dialog')).getByPlaceholderText('Search azion.com')
          ).toBeInTheDocument(),
        { timeout: OPEN_TIMEOUT }
      )
    })

    it('labels the keycap Ctrl K off Apple platforms and ⌘K on a Mac', async () => {
      await page.viewport(1440, 900)
      setPlatform('Win32')
      const windows = header()
      await waitFor(() => expect(windows.keycap).toHaveTextContent(/^Ctrl\s*K$/))
      windows.unmount()

      setPlatform('MacIntel')
      const mac = header()
      await waitFor(() => expect(mac.keycap).toHaveTextContent(/^⌘\s*K$/))
    })
  })
})
