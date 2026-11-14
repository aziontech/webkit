import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
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
  document.body
    .querySelectorAll('[data-testid="input-select-content"]')
    .forEach((el) => el.remove())
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

  it('mounts the groups of a long listing as they near the viewport', () => {
    const groups = Array.from({ length: 10 }, (_, i) => `Group ${i}`)
    const many = Array.from({ length: 1000 }, (_, i) => ({
      href: `/careers/role-${i}`,
      group: groups[i % groups.length],
      values: { role: `Role ${i}`, team: 'Engineering', type: 'Remote' },
      facets: {}
    }))
    const { getByTestId } = band({ rows: many, groups, facets: [] })
    const mounted = tableRoles(getByTestId).length
    expect(mounted).toBeGreaterThan(0)
    expect(mounted).toBeLessThan(many.length)
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

    await findByText('Security', { selector: '[data-testid="input-select-trigger__value"] bdi' })
    expect(tableRoles(getByTestId)).toEqual(['GRC Analyst'])
  })

  it('ignores a URL query value that is not an option', async () => {
    globalThis.history.replaceState(null, '', '?area=Unknown')
    const { getByTestId } = band()

    await Promise.resolve()
    expect(tableRoles(getByTestId)).toHaveLength(rows.length)
  })

  it('toggles the folded filters from the filter button', async () => {
    const { getByTestId } = band()

    const button = getByTestId(`${TESTID}__filter-button`)
    const panel = getByTestId(`${TESTID}__filters`)
    expect(button.getAttribute('aria-controls')).toBe(panel.id)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(panel.hasAttribute('data-expanded')).toBe(false)

    await fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(panel.hasAttribute('data-expanded')).toBe(true)
  })

  it('lists each applied facet as a removable chip and counts it on the filter button', async () => {
    const { getByRole, getByTestId, queryByTestId } = band()

    expect(queryByTestId(`${TESTID}__applied`)).toBeNull()
    expect(getByTestId(`${TESTID}__filter-button`).textContent).toContain('Filters')

    await pick(getByRole('combobox', { name: 'Department' }), 'Security')

    const applied = getByTestId(`${TESTID}__applied`)
    await waitFor(() => expect(applied.textContent).toContain('Department: Security'))
    expect(getByTestId(`${TESTID}__filter-button`).textContent).toContain('Filters (1)')

    await fireEvent.click(within(applied).getByRole('button'))
    expect(queryByTestId(`${TESTID}__applied`)).toBeNull()
    expect(tableRoles(getByTestId)).toHaveLength(rows.length)
  })

  it('takes the filter button label from filterLabel', () => {
    const { getByTestId } = band({ filterLabel: 'Refine' })

    expect(getByTestId(`${TESTID}__filter-button`).textContent).toContain('Refine')
  })

  it('searches the options only of a select with more than seven', async () => {
    const long = {
      key: 'location',
      label: 'Location',
      allLabel: 'All locations',
      options: [
        'Austin',
        'Boston',
        'Chicago',
        'Denver',
        'Miami',
        'Porto Alegre',
        'São Paulo',
        'Seattle'
      ].map((value) => ({ value, label: value }))
    }
    const { getByRole } = band({ facets: [facets[0], long] })

    await fireEvent.click(getByRole('combobox', { name: 'Department' }))
    expect(document.body.querySelector('input[aria-label="Search department"]')).toBeNull()
    document.body
      .querySelectorAll('[data-testid="input-select-content"]')
      .forEach((el) => el.remove())

    await fireEvent.click(getByRole('combobox', { name: 'Location' }))
    expect(document.body.querySelector('input[aria-label="Search location"]')).not.toBeNull()
  })

  it('draws a row mark in the table and the phone list', () => {
    const { getAllByAltText } = band({
      rows: [{ ...rows[0], mark: { name: 'Acme', logo: '/logos/acme.svg' } }, rows[1], rows[2]]
    })

    const marks = getAllByAltText('Acme')
    expect(marks).toHaveLength(2)
    marks.forEach((mark) => expect(mark.getAttribute('src')).toBe('/logos/acme.svg'))
  })

  it('follows the row link when a table row is clicked outside it', async () => {
    const user = userEvent.setup()
    const { getByTestId } = band()

    const table = tableOf(getByTestId)
    const link = table.getByRole('link', { name: 'GRC Analyst' })
    const clicks: MouseEvent[] = []
    link.addEventListener('click', (event) => {
      event.preventDefault()
      clicks.push(event)
    })

    await user.click(table.getByTitle('Compliance · Porto Alegre'))
    expect(clicks).toHaveLength(1)
  })

  it('gives each metadata cell its full value as a tooltip', () => {
    const { getByTestId } = band()

    const cells = tableOf(getByTestId).getAllByTitle('Hybrid · Full-time')
    expect(cells).toHaveLength(2)
    cells.forEach((cell) => expect(cell.textContent).toBe('Hybrid · Full-time'))
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

  it('has no a11y violations in the table', async () => {
    const { getByTestId } = band()

    await expectNoA11yViolations(getByTestId(`${TESTID}__table`))
  })

  it('has no a11y violations in the empty state', async () => {
    const { container, getByRole } = band()

    await fireEvent.update(getByRole('textbox', { name: search.label }), 'nothing at all')

    await expectNoA11yViolations(container)
  })
})
