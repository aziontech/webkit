import { fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ListingBrowser from './listing-browser.vue'

const TESTID = 'sections-listing-browser'
const TITLE = 'Open positions'

const columns = [
  { key: 'role', label: 'Role', grow: 2 },
  { key: 'team', label: 'Team and location', grow: 2 },
  { key: 'type', label: 'Work type', align: 'end' }
]

const rows = [
  {
    href: '/careers/software-engineer-go',
    group: 'Engineering',
    values: {
      role: 'Software Engineer (Go)',
      team: 'Engineering · Porto Alegre',
      type: 'Hybrid · Full-time'
    },
    facets: { area: ['Engineering'], location: ['Porto Alegre'] }
  },
  {
    href: '/careers/frontend-engineer',
    group: 'Engineering',
    values: {
      role: 'Frontend Engineer',
      team: 'UX Engineering · São Paulo',
      type: 'Remote · Full-time'
    },
    facets: { area: ['Engineering'], location: ['São Paulo'] }
  },
  {
    href: '/careers/grc-analyst',
    group: 'Security',
    values: {
      role: 'GRC Analyst',
      team: 'Compliance · Porto Alegre',
      type: 'Hybrid · Full-time'
    },
    facets: { area: ['Security'], location: ['Porto Alegre'] }
  }
]

const facets = [
  {
    key: 'area',
    label: 'Department',
    allLabel: 'All departments',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Security', label: 'Security' },
      { value: 'Marketing', label: 'Marketing' }
    ]
  }
]

const sorts = [
  { value: 'newest', label: 'Newest posted', by: '' },
  { value: 'title', label: 'Title (A–Z)', by: 'role' }
]

const search = {
  placeholder: 'Search by title, team, or location',
  shortPlaceholder: 'Search positions',
  label: 'Search positions'
}

const empty = {
  title: 'Nothing here yet',
  description: 'No open positions match your search.',
  clearLabel: 'View all open positions'
}

const band = (props: Record<string, unknown> = {}) =>
  render(ListingBrowser, {
    props: {
      anchor: 'positions',
      title: TITLE,
      columns,
      rows,
      groups: ['Engineering', 'Security'],
      facets,
      sorts,
      sortAriaLabel: 'Sort positions',
      search,
      empty,
      ...props
    }
  })

const tableOf = (getByTestId: (id: string) => HTMLElement) =>
  within(getByTestId(`${TESTID}__table`))

const tableRoles = (getByTestId: (id: string) => HTMLElement) =>
  tableOf(getByTestId)
    .queryAllByRole('link')
    .map((link) => link.textContent?.trim())

const pick = async (trigger: HTMLElement, label: string) => {
  await fireEvent.click(trigger)
  const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(
    (node) => node.textContent?.trim() === label
  ) as HTMLElement
  await fireEvent.click(option)
}

afterEach(() => {
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
  globalThis.history.replaceState(null, '', globalThis.location.pathname)
})

describe('ListingBrowser', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ListingBrowser, {
      props: { title: TITLE, columns, rows, groups: ['Engineering'] },
      attrs: { 'data-testid': 'careers-jobs' }
    })

    expect(getByTestId('careers-jobs')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2, names the band with it and sets anchor as its id', () => {
    const { getByRole, getByTestId } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByTestId(TESTID)).toHaveAttribute('aria-label', TITLE)
    expect(getByTestId(TESTID)).toHaveAttribute('id', 'positions')
  })

  it('renders one column header per column, in order', () => {
    const { getByTestId } = band()

    expect(
      tableOf(getByTestId)
        .getAllByRole('columnheader')
        .map((header) => header.textContent?.trim())
    ).toEqual(columns.map((column) => column.label))
  })

  it('renders every row as a link to its href, under its group heading in group order', () => {
    const { getByTestId } = band()

    const table = tableOf(getByTestId)
    expect(table.getAllByRole('heading', { level: 3 }).map((h) => h.textContent?.trim())).toEqual([
      'Engineering',
      'Security'
    ])
    expect(table.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
      rows.map((row) => row.href)
    )
    expect(table.getAllByText('Hybrid · Full-time')).toHaveLength(2)
  })

  it('renders the phone list with one item per row and its second column as description', () => {
    const { getByTestId } = band()

    const list = within(getByTestId(`${TESTID}__list`))
    expect(list.getAllByRole('listitem')).toHaveLength(rows.length)
    expect(list.getByText(rows[0].values.team)).toBeInTheDocument()
  })

  it('skips a group that has no row', () => {
    const { getByTestId } = band({ groups: ['Marketing', 'Security'] })

    expect(
      tableOf(getByTestId)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent?.trim())
    ).toEqual(['Security'])
  })

  it('narrows the rows by the search query, ignoring case', async () => {
    const { getByRole, getByTestId } = band()

    await fireEvent.update(getByRole('textbox', { name: search.label }), 'grc')

    expect(tableRoles(getByTestId)).toEqual(['GRC Analyst'])
  })

  it('narrows the rows by a facet select', async () => {
    const { getByRole, getByTestId } = band()

    await pick(getByRole('combobox', { name: 'Department' }), 'Security')

    expect(tableRoles(getByTestId)).toEqual(['GRC Analyst'])
  })

  it('reorders the rows by the order select', async () => {
    const { getByRole, getByTestId } = band()

    await pick(getByRole('combobox', { name: 'Sort positions' }), 'Title (A–Z)')

    expect(tableRoles(getByTestId)).toEqual([
      'Frontend Engineer',
      'Software Engineer (Go)',
      'GRC Analyst'
    ])
  })

  it('shows the empty state when nothing matches and clears every filter from it', async () => {
    const { getByRole, getByTestId, getByText, queryByTestId } = band()

    await pick(getByRole('combobox', { name: 'Department' }), 'Marketing')

    expect(queryByTestId(`${TESTID}__table`)).toBeNull()
    expect(getByText(empty.title)).toBeInTheDocument()
    expect(getByText(empty.description)).toBeInTheDocument()

    await fireEvent.click(getByRole('button', { name: empty.clearLabel }))

    expect(tableRoles(getByTestId)).toHaveLength(rows.length)
  })

  it('shows nothing in place of the rows when nothing matches and empty is omitted', async () => {
    const { getByRole, queryByTestId, queryByText } = band({ empty: undefined })

    await fireEvent.update(getByRole('textbox', { name: search.label }), 'nothing at all')

    expect(queryByTestId(`${TESTID}__table`)).toBeNull()
    expect(queryByText(empty.title)).toBeNull()
  })

  it('seeds a facet from the URL query when the value is one of its options', async () => {
    globalThis.history.replaceState(null, '', '?area=Security')
    const { getByTestId, findByText } = band()

    await findByText('Security', { selector: '[data-testid="select-trigger__value"]' })
    expect(tableRoles(getByTestId)).toEqual(['GRC Analyst'])
  })

  it('ignores a URL query value that is not an option', async () => {
    globalThis.history.replaceState(null, '', '?area=Unknown')
    const { getByTestId } = band()

    await Promise.resolve()
    expect(tableRoles(getByTestId)).toHaveLength(rows.length)
  })

  it('renders no toolbar without search, facets or sorts', () => {
    const { queryByRole } = band({ search: undefined, facets: [], sorts: [] })

    expect(queryByRole('search')).toBeNull()
  })

  it('renders only the section when rows is empty', () => {
    const { getByTestId, queryByRole } = band({ rows: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('search')).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('has no a11y violations in the toolbar and the phone list', async () => {
    const { getByRole, getByTestId } = band()

    await expectNoA11yViolations(getByRole('search'))
    await expectNoA11yViolations(getByTestId(`${TESTID}__list`))
  })

  it.skip('has no a11y violations in the table — blocked by Table nesting its focusable ScrollArea viewport directly under role=table (aria-required-children)', async () => {
    const { getByTestId } = band()

    await expectNoA11yViolations(getByTestId(`${TESTID}__table`))
  })

  it('has no a11y violations in the empty state', async () => {
    const { container, getByRole } = band()

    await fireEvent.update(getByRole('textbox', { name: search.label }), 'nothing at all')

    await expectNoA11yViolations(container)
  })
})
