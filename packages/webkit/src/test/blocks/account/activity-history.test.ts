import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ActivityHistory from '../../../../blocks/account/activity-history/activity-history.vue'
import Empty from '../../../../blocks/account/activity-history/variants/empty.vue'

describe('account/activity-history', () => {
  it('draws the category as a Tag, not a status', () => {
    const view = render(ActivityHistory)
    const table = view.getByRole('table', { name: 'Activity history' })
    expect(table.querySelector('[data-testid="content-tag"]')).not.toBeNull()
    expect(table.querySelector('[data-testid$="cell-status"]')).toBeNull()
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
})
