import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Invocations from '../../../../blocks/detail/invocations/invocations.vue'
import Failed from '../../../../blocks/detail/invocations/variants/error.vue'
import Running from '../../../../blocks/detail/invocations/variants/running.vue'
import { useToastRegion } from '../../toast-region'

const selectedSpan = () =>
  document.querySelector<HTMLElement>('[data-testid="code-trace__row"][aria-selected="true"]')

useToastRegion()

afterEach(() => cleanup())
describe('invocations', () => {
  it('selects the span of a request path node and scrolls the trace into view', async () => {
    render(Invocations)
    expect(selectedSpan()).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Show origin-assets in the trace' }))
    await waitFor(() => expect(selectedSpan()?.dataset.spanId).toBe('origin'))
  })

  it('swaps the whole page to the run picked in Recent', async () => {
    render(Invocations)
    expect(screen.getByText('inv_8f2c1a9d')).toBeTruthy()
    await fireEvent.click(screen.getByText('Recent'))
    await fireEvent.click(await screen.findByRole('menuitem', { name: /inv_7d41be02/ }))
    await waitFor(() =>
      expect(screen.getByText('502, the origin did not answer within the 1 s budget.')).toBeTruthy()
    )
  })

  it('opens a failed run on its failing span', async () => {
    render(Failed)
    expect(selectedSpan()?.dataset.spanId).toBe('response')
    expect(screen.getAllByText('Timed out').length).toBeGreaterThan(0)
  })
})

describe('detail/invocations', () => {
  it('keeps the printed lines of a running invocation on screen while it streams', async () => {
    const view = render(Running)
    await waitFor(() =>
      expect(view.container.textContent).toContain('Cache miss, fetching assets.example.com')
    )
    expect(view.container.textContent).toContain('Streaming')
    expect(view.getByRole('heading', { name: 'Invocation' })).toBeTruthy()
  })

  it('opens Recent from a real button and links the function', () => {
    const view = render(Running)
    expect(view.getByRole('button', { name: /Recent/ })).toBeTruthy()
    expect(view.getByRole('link', { name: 'image-resizer' }).getAttribute('href')).toBe(
      '/functions/40122'
    )
  })
})
