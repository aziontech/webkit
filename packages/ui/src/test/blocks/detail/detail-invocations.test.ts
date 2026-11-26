import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailInvocations from '../../../../blocks/detail/detail-invocations/detail-invocations.vue'
import Failed from '../../../../blocks/detail/detail-invocations/variants/error.vue'
import Running from '../../../../blocks/detail/detail-invocations/variants/running.vue'
import { useToastRegion } from '../../toast-region'

const selectedSpan = () =>
  document.querySelector<HTMLElement>('[data-testid="trace__row"][aria-selected="true"]')

useToastRegion()

afterEach(() => cleanup())
describe('invocations', () => {
  it('selects the span of a request path node and scrolls the trace into view', async () => {
    render(DetailInvocations)
    expect(selectedSpan()).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Show origin-assets in the trace' }))
    await waitFor(() => expect(selectedSpan()?.dataset.spanId).toBe('origin'))
  })

  it('swaps the whole page to the run picked in Recent', async () => {
    render(DetailInvocations)
    expect(screen.getByText('inv_8f2c1a9d')).toBeTruthy()
    await fireEvent.click(screen.getByText('Recent'))
    await fireEvent.click(await screen.findByRole('menuitem', { name: /inv_7d41be02/ }))
    await waitFor(() =>
      expect(screen.getByText('502, the origin did not answer within the 1 s budget.')).toBeTruthy()
    )
  })

  it('prints the log level once, in its column, not again in the message', () => {
    render(DetailInvocations)
    const messages = [...document.querySelectorAll('[data-testid$="__line-message"]')]
    expect(messages.length).toBeGreaterThan(2)
    for (const message of messages) {
      expect(message.textContent?.trim()).not.toMatch(/^(INFO|DEBUG|WARN|ERROR)\b/)
    }
  })

  it('opens a failed run on its failing span', async () => {
    render(Failed)
    expect(selectedSpan()?.dataset.spanId).toBe('response')
    expect(screen.getAllByText('Timed out').length).toBeGreaterThan(0)
  })
})

describe('detail/detail-invocations', () => {
  it('keeps the printed lines of a running invocation on screen while it streams', async () => {
    const view = render(Running)
    await waitFor(() =>
      expect(view.container.textContent).toContain('Cache miss, fetching assets.example.com')
    )
    expect(view.container.textContent).toContain('Streaming')
    expect(view.getByRole('heading', { name: 'Invocation' })).toBeTruthy()
  })

  it('renders the function and runs it is given and emits replay instead of faking it', async () => {
    const view = render(DetailInvocations, {
      props: {
        edgeFunction: {
          id: '9001',
          name: 'acme-auth',
          runtime: 'JavaScript',
          service: 'acme-prod',
          serviceAddress: 'app.example.com',
          resource: 'acme-app',
          rule: 'Check session',
          phase: 'Request',
          origin: 'acme-origin',
          originHost: 'origin.example.com'
        },
        invocations: [
          {
            id: 'inv_0000abcd',
            status: 'Completed',
            startedAt: new Date(Date.UTC(2026, 10, 3, 9, 15, 0)),
            completedAt: new Date(Date.UTC(2026, 10, 3, 9, 15, 1)),
            duration: 88,
            location: 'Chicago, US',
            trigger: 'GET https://app.example.com/session',
            outcome: '200 OK, the session is valid.',
            logs: [{ at: 0, level: 'info', message: 'Session checked' }],
            spans: [
              {
                id: 'root',
                name: 'acme-auth',
                service: 'Function',
                icon: 'az az-functions',
                start: 0,
                duration: 88
              }
            ]
          }
        ]
      }
    })
    expect(view.getByRole('link', { name: 'acme-auth' }).getAttribute('href')).toBe(
      '/functions/9001'
    )
    expect(view.container.textContent).toContain('inv_0000abcd')
    expect(view.container.textContent).toContain('Nov 3, 09:15:00 UTC')
    expect(view.container.textContent).toContain('200 OK, the session is valid.')
    expect(view.container.textContent).not.toContain('image-resizer')
    await fireEvent.click(view.getByRole('button', { name: 'Replay' }))
    const replay = view.emitted('replay') as [MouseEvent, { id: string }][]
    expect(replay).toHaveLength(1)
    expect(replay[0][0]).toBeInstanceOf(MouseEvent)
    expect(replay[0][1].id).toBe('inv_0000abcd')
    expect(document.body.textContent).not.toContain('Replaying')
  })

  it('opens Recent from a real button and links the function', () => {
    const view = render(Running)
    expect(view.getByRole('button', { name: /Recent/ })).toBeTruthy()
    expect(view.getByRole('link', { name: 'image-resizer' }).getAttribute('href')).toBe(
      '/functions/40122'
    )
  })
})
