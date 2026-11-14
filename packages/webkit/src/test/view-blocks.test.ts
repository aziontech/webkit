import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import QueryEditor from '../../blocks/platform/view/query-editor/query-editor.vue'
import QueryEditorQuery from '../../blocks/platform/view/query-editor/variants/query.vue'
import TableView from '../../blocks/platform/view/table-view/table-view.vue'
import TableViewFailed from '../../blocks/platform/view/table-view/variants/failed.vue'
import TableViewLoading from '../../blocks/platform/view/table-view/variants/loading.vue'

const resourceNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[role=row] a'))
    .map((a) => a.textContent?.trim() ?? '')
    .filter((text) => /^resource-\d+$/.test(text))

describe('platform/view/table-view block', () => {
  it('sorts Last modified on the timestamp, not on a relative string', async () => {
    const view = render(TableView)
    const head = Array.from(view.container.querySelectorAll('[role=columnheader]')).find((th) =>
      th.textContent?.includes('Last modified')
    )
    await fireEvent.click(head!.querySelector('button')!)
    await waitFor(() =>
      expect(['resource-01', 'resource-10']).toContain(resourceNames(view.container)[0])
    )
    const first = resourceNames(view.container)[0]
    const expected = Array.from(
      { length: 10 },
      (_, i) => `resource-${String(i + 1).padStart(2, '0')}`
    )
    expect(resourceNames(view.container)).toEqual(
      first === 'resource-01' ? expected : [...expected].reverse()
    )
  })

  it('shows the skeleton table with the filter disabled while loading', () => {
    const view = render(TableViewLoading)
    expect(view.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(view.getByRole('button', { name: 'Download CSV' }).hasAttribute('disabled')).toBe(true)
  })

  it('replaces the table with a danger alert whose Retry emits retry', async () => {
    const view = render(TableViewFailed)
    expect(view.container.textContent).toContain("Couldn't load the resources.")
    expect(view.container.querySelector('[role=table], [role=grid], table')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })
})

describe('platform/view/query-editor block', () => {
  it('marks the open table as pressed and NULL cells with data-null', () => {
    const view = render(QueryEditor)
    const options = Array.from(
      view.container.querySelectorAll<HTMLElement>('[data-slot="item"][aria-pressed]')
    ).map((item) => [item.textContent?.trim(), item.getAttribute('aria-pressed')])
    expect(options).toEqual([
      ['customers', 'true'],
      ['orders', 'false'],
      expect.arrayContaining(['false'])
    ])
    expect(view.container.querySelector('[data-null]')?.textContent?.trim()).toBe('NULL')
    expect(view.container.querySelector('[aria-label="Actions for customers"]')).not.toBeNull()
  })

  it('pages the result rows, announces them and drops the dead Insert from Results', async () => {
    const view = render(QueryEditorQuery)
    await waitFor(() =>
      expect(
        view.getAllByRole('status').some((el) => el.textContent?.trim() === '3 rows returned.')
      ).toBe(true)
    )
    expect(view.queryByRole('button', { name: 'Insert' })).toBeNull()
    expect(view.queryByRole('navigation', { name: 'Results pagination' })).toBeNull()
  })
})
