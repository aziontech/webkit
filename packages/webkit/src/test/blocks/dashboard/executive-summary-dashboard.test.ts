import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ExecutiveSummaryDashboard from '../../../../blocks/dashboard/executive-summary-dashboard/executive-summary-dashboard.vue'
import ExecutiveSummaryEmpty from '../../../../blocks/dashboard/executive-summary-dashboard/variants/empty.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

describe('dashboard/executive-summary-dashboard', () => {
  it('renders the records it is given instead of the sample', async () => {
    const view = render(ExecutiveSummaryDashboard, {
      props: {
        goals: [
          {
            id: 'signups',
            label: 'Acme sign-ups',
            current: 40,
            target: 50,
            format: 'score',
            status: { label: 'At risk', severity: 'warning' }
          }
        ],
        notes: [
          {
            id: 'n1',
            author: 'Jane Doe',
            initials: 'JD',
            role: 'Head of Sales',
            date: '2026-09-30',
            dateLabel: 'Sep 30, 2026',
            body: 'Sign-ups slowed in September.'
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Acme sign-ups'))
    expect(view.container.textContent).toContain('Sign-ups slowed in September.')
    expect(view.container.textContent).not.toContain('Enterprise deals closed')
    expect(view.container.textContent).not.toContain('Emma Wilson')
  })

  it('emits export and downloads the quarter', async () => {
    const view = render(ExecutiveSummaryDashboard)
    await fireEvent.click(view.getByRole('button', { name: 'Export' }))
    expect(view.emitted('export')).toHaveLength(1)
    await waitFor(() =>
      expect(document.body.textContent).toContain('executive-summary-q3-2026.csv')
    )
  })

  it('names the quarter when nothing was reported and disables Export', () => {
    const view = render(ExecutiveSummaryEmpty)
    expect(view.container.textContent).toContain('No goal results for Q3 2025')
    expect((view.getByRole('button', { name: 'Export' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('names each card in its error alert and emits retry', async () => {
    const view = render(ExecutiveSummaryDashboard, {
      props: { error: 'The API answered 503.', quarter: 'Q2 2026' }
    })
    expect(view.container.textContent).toContain(
      "Couldn't load Q2 2026 goals. The API answered 503."
    )
    expect(view.container.textContent).toContain("Couldn't load commentary. The API answered 503.")
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
