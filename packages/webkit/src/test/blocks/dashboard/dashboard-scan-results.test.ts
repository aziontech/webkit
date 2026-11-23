import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ScanResults, {
  type ScanResultsSubmission
} from '../../../../blocks/dashboard/dashboard-scan-results/dashboard-scan-results.vue'

afterEach(() => cleanup())

const submission: ScanResultsSubmission = {
  id: 'submission-acme',
  name: 'acme-contract.pdf',
  verdict: 'clean',
  category: 'Document',
  score: 2,
  type: 'PDF',
  size: 120000,
  source: 'upload',
  submitter: 'jane.doe',
  lastSeen: '2026-11-10 14:00'
}

describe('dashboard/dashboard-scan-results', () => {
  it('renders the sample when no data is passed', () => {
    const view = render(ScanResults)
    expect(view.getByRole('heading', { level: 1, name: 'Scan results' })).toBeTruthy()
    expect(view.container.textContent).toContain('quarterly-report.pdf')
  })

  it('renders the submissions it is given instead of the sample', () => {
    const view = render(ScanResults, { props: { submissions: [submission] } })
    expect(view.container.textContent).toContain('acme-contract.pdf')
    expect(view.container.textContent).not.toContain('quarterly-report.pdf')
  })

  it('shows one empty state when there are no submissions', () => {
    const view = render(ScanResults, { props: { submissions: [] } })
    expect(view.container.textContent).toContain('No items yet')
    expect(view.queryByRole('textbox', { name: 'Search by name or submitter' })).toBeNull()
  })

  it('emits refresh from the page heading', async () => {
    const view = render(ScanResults)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')).toHaveLength(1)
  })

  it('names what failed in each card and emits retry', async () => {
    const view = render(ScanResults, { props: { error: 'Check your connection and retry.' } })
    expect(view.container.textContent).toContain(
      "Couldn't load the scan results. Check your connection and retry."
    )
    expect(view.container.textContent).not.toContain('quarterly-report.pdf')
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
