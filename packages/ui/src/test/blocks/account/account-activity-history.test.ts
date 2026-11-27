import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import AccountActivityHistory from '../../../../blocks/account/account-activity-history/account-activity-history.vue'
import Empty from '../../../../blocks/account/account-activity-history/variants/empty.vue'

describe('account/account-activity-history', () => {
  it('repeats who did it in the event cell for a phone', () => {
    const view = render(AccountActivityHistory)
    const summary = view.container.querySelector<HTMLElement>('[data-slot="narrow-summary"]')
    expect(summary?.textContent).toMatch(/@example\.com/)
  })

  it('draws the category as a Tag, not a status', () => {
    const view = render(AccountActivityHistory)
    const table = view.getByRole('table', { name: 'Activity history' })
    expect(table.querySelector('[data-testid="tag"]')).not.toBeNull()
    expect(table.querySelector('[data-testid$="cell-status"]')).toBeNull()
    const tags = [...table.querySelectorAll<HTMLElement>('[data-testid="tag"]')]
    expect(new Set(tags.map((tag) => tag.getAttribute('data-severity')))).toEqual(
      new Set(['neutral'])
    )
    expect(tags.every((tag) => tag.querySelector('[data-testid="tag__icon"]'))).toBe(true)
  })

  it('offers the next longer period from an empty range', async () => {
    const view = render(Empty)
    expect(view.getByText('No activity in this period')).toBeTruthy()
    expect(view.container.textContent).toContain('Select a longer period')
    await fireEvent.click(view.getByRole('button', { name: 'Show the last hour' }))
    await waitFor(() =>
      expect(view.queryByRole('button', { name: 'Show the last hour' })).toBeNull()
    )
  })

  it('renders the events it is given instead of the sample', () => {
    const now = new Date(Date.UTC(2026, 10, 1, 9))
    const view = render(AccountActivityHistory, {
      props: {
        now,
        events: [
          {
            id: 'evt-1',
            event: 'Created the domain store.example.com',
            category: 'Deploy',
            user: 'jane.doe@example.com',
            ip: '192.0.2.10',
            at: new Date(now.getTime() - 60_000)
          }
        ]
      }
    })
    expect(view.container.textContent).toContain('Created the domain store.example.com')
    expect(view.container.textContent).not.toContain('grace.hall@example.com')
  })

  it('shows the error message and emits retry and refresh instead of faking them', async () => {
    const view = render(AccountActivityHistory, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('grace.hall@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('retry')).toHaveLength(1)
    expect(view.emitted('refresh')).toHaveLength(1)
  })
})
