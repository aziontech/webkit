import '../../reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import AsyncSubmitFailed from '../../../../blocks/state/state-async-submit/variants/error.vue'
import AsyncSubmitSucceeded from '../../../../blocks/state/state-async-submit/variants/success.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const setVisibility = (state: 'visible' | 'hidden' | null) => {
  if (state === null) {
    Reflect.deleteProperty(document, 'visibilityState')
    return
  }
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
}

const toastsSaying = (text: string) =>
  [...document.querySelectorAll('[data-toast-id]')].filter((el) => el.textContent?.includes(text))

afterEach(() => setVisibility(null))

describe('state/state-async-submit heading', () => {
  it('keeps the timing promise out of the heading lead, so a failed run does not repeat it', () => {
    const view = render(AsyncSubmitFailed)
    const lead = view.getByTestId('page-header__description')
    expect(lead?.textContent).toContain('Builds acme/web-app and publishes it to production.')
    expect(lead?.textContent).not.toContain('half a minute')
  })

  it('puts the run status beside the title, not among the header actions', () => {
    const view = render(AsyncSubmitFailed)
    const status = view.getByTestId('state-async-submit__status')
    expect(status.closest('[data-testid="page-header__meta"]')).not.toBeNull()
    expect(status.closest('[data-testid="page-header__actions"]')).toBeNull()
  })

  it('keeps the status Tag at its own width on a narrow phone', async () => {
    await page.viewport(320, 900)
    await vi.waitFor(() => expect(window.innerWidth).toBe(320))
    try {
      const view = render(AsyncSubmitFailed)
      const status = view.getByTestId('state-async-submit__status')
      expect(status.getBoundingClientRect().width).toBeLessThan(160)
    } finally {
      await page.viewport(1280, 900)
    }
  })
})

describe('state/state-async-submit outcome', () => {
  it('leaves the outcome to the on-page Alert while the page is on screen', async () => {
    setVisibility('visible')
    const failed = render(AsyncSubmitFailed)
    await waitFor(() => expect(failed.container.textContent).toContain('Edit'))
    expect(toastsSaying("wasn't deployed")).toEqual([])
    failed.unmount()
    render(AsyncSubmitSucceeded)
    await waitFor(() => expect(document.body.textContent).toContain('is live at'))
    expect(toastsSaying('is live.')).toEqual([])
  })

  it('reports the outcome as a toast when the page is out of view', async () => {
    setVisibility('hidden')
    render(AsyncSubmitFailed)
    await waitFor(() => expect(toastsSaying("wasn't deployed").length).toBe(1))
  })
})
