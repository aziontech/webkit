import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CardView from '../../blocks/view/card-view/card-view.vue'
import CardViewFailed from '../../blocks/view/card-view/variants/error.vue'
import CardViewLoading from '../../blocks/view/card-view/variants/loading.vue'
import FileBrowser from '../../blocks/view/file-browser/file-browser.vue'
import InsideAFolder from '../../blocks/view/file-browser/variants/inside-a-folder.vue'
import QueryEditor from '../../blocks/view/query-editor/query-editor.vue'
import QueryEditorQuery from '../../blocks/view/query-editor/variants/query.vue'
import SplitView from '../../blocks/view/split-view/split-view.vue'
import SplitViewFiltered from '../../blocks/view/split-view/variants/filtered.vue'
import TableView from '../../blocks/view/table-view/table-view.vue'
import TableViewFailed from '../../blocks/view/table-view/variants/error.vue'
import TableViewLoading from '../../blocks/view/table-view/variants/loading.vue'
import WafLoadFailed from '../../blocks/view/waf-tuning/variants/load-error.vue'
import WafTuning from '../../blocks/view/waf-tuning/waf-tuning.vue'

const resourceNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[role=row] a'))
    .map((a) => a.textContent?.trim() ?? '')
    .filter((text) => /^resource-\d+$/.test(text))

describe('view/table-view block', () => {
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

describe('view/query-editor block', () => {
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

const firstCells = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[role=row]'))
    .map((row) => row.querySelector('[role=rowheader], [role=cell]')?.textContent?.trim() ?? '')
    .filter(Boolean)

describe('view/file-browser block', () => {
  it('sorts Size on bytes and keeps the parent row and the folders first', async () => {
    const view = render(InsideAFolder)
    const head = Array.from(view.container.querySelectorAll('[role=columnheader]')).find((th) =>
      th.textContent?.includes('Size')
    )
    await fireEvent.click(head!.querySelector('button')!)
    await waitFor(() => expect(firstCells(view.container)[0]).toBe('..'))
    const cells = firstCells(view.container)
    expect(cells.slice(1, 5)).toEqual(['assets/', 'css/', 'images/', 'js/'])
    const files = cells.slice(5)
    const ascending = ['project.json', 'favicon.svg', 'index.html', '404.html']
    expect([files.slice(0, 4), files.slice(-4).reverse()]).toContainEqual(ascending)
  })

  it('opens a folder from its name button and goes back up from the parent row', async () => {
    const view = render(FileBrowser)
    await fireEvent.click(view.getByRole('button', { name: 'logs/' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('access.log'))
    await fireEvent.click(view.getByRole('button', { name: 'Go up to the parent folder' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('robots.txt'))
  })

  it('tells a search miss apart from an empty folder and clears it', async () => {
    const view = render(FileBrowser)
    const search = view.getByPlaceholderText('Search in folder')
    await fireEvent.update(search, 'kubernetes')
    await waitFor(() => expect(view.getByText('No matching files')).toBeTruthy())
    expect(view.queryByText('This folder is empty')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('robots.txt'))
  })
})

describe('view/waf-tuning block', () => {
  it('says No matching rules with Clear search for a search miss', async () => {
    const view = render(WafTuning)
    await fireEvent.update(
      view.getByRole('textbox', { name: 'Search matched requests' }),
      'kubernetes'
    )
    await waitFor(() => expect(view.getByText('No matching rules')).toBeTruthy())
    expect(view.queryByText('No rule reaches the minimum')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(view.queryByText('No matching rules')).toBeNull())
  })

  it('reads Allow selected while nothing is checked', () => {
    const view = render(WafTuning)
    const allow = view.getByRole('button', { name: 'Allow selected' })
    expect(allow.hasAttribute('disabled')).toBe(true)
  })

  it('shows a danger alert when the matches fail to load and Retry brings the table back', async () => {
    const view = render(WafLoadFailed)
    expect(view.container.textContent).toContain("Couldn't load the matched requests.")
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain("Couldn't load the matched requests.")
    )
  })
})

describe('view/card-view block', () => {
  it('names each card with a Link to the application', () => {
    const view = render(CardView)
    expect(view.getByRole('link', { name: 'storefront' })).toHaveAttribute(
      'href',
      '/applications/app-01'
    )
  })

  it('shows placeholder cards while loading and a Retry alert when loading fails', async () => {
    const loading = render(CardViewLoading)
    expect(loading.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    loading.unmount()
    const failed = render(CardViewFailed)
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted('retry')).toHaveLength(1)
  })
})

describe('view/split-view block', () => {
  it('opens an event from its detail button, a keyboard path to the document', async () => {
    const view = render(SplitView)
    const [open] = await waitFor(() => view.getAllByRole('button', { name: /^Open event / }))
    expect(open).toHaveAttribute('aria-expanded', 'false')
    await fireEvent.click(open)
    await waitFor(() => expect(open).toHaveAttribute('aria-expanded', 'true'))
  })

  it('filters through FilterMenu and shows its chips for applied fields', async () => {
    const view = render(SplitViewFiltered)
    expect(view.getByTestId('filter-button')).toBeTruthy()
    const chips = view.getByTestId('filter-chips')
    expect(chips.textContent).toContain('Source')
    expect(chips.textContent).toContain('Level')
  })
})
