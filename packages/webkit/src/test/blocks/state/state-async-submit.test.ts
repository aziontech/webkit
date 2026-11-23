import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

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
