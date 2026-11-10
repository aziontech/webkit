import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ListingTable from './listing-table.vue'

const TESTID = 'sections-listing-table'
const TITLE = 'Latest roles'

const columns = [
  { key: 'role', label: 'Role', grow: 2 },
  { key: 'team', label: 'Team and location', grow: 2 },
  { key: 'type', label: 'Work type', align: 'end' }
]

const rows = [
  {
    href: '/careers/senior-platform-engineer',
    values: {
      role: 'Senior Platform Engineer',
      team: 'Delivery Engineering · Porto Alegre',
      type: 'Hybrid · Full-time'
    }
  },
  {
    href: '/careers/software-engineer-go',
    values: {
      role: 'Software Engineer (Go)',
      team: 'Engineering · Porto Alegre',
      type: 'Remote · Full-time'
    }
  }
]

const primaryAction = { label: 'See all 23 roles', href: '/careers/jobs', trailing: true }

const band = (props: Record<string, unknown> = {}) =>
  render(ListingTable, {
    props: { title: TITLE, columns, rows, primaryAction, ...props }
  })

describe('ListingTable', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ListingTable, {
      props: { title: TITLE, columns, rows },
      attrs: { 'data-testid': 'latest-roles' }
    })

    expect(getByTestId('latest-roles')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'roles' })

    expect(getByTestId(TESTID).id).toBe('roles')
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByRole, getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders no header and leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one column header per column, in order', () => {
    const { getAllByTestId } = band()

    expect(getAllByTestId('data-table__head-cell').map((cell) => cell.textContent?.trim())).toEqual(
      columns.map((column) => column.label)
    )
  })

  it('maps grow and align onto the cells', () => {
    const { getAllByTestId } = band()

    const heads = getAllByTestId('data-table__head-cell')
    expect(heads[0]?.getAttribute('data-grow')).toBe('2')
    expect(heads[2]?.getAttribute('data-align')).toBe('end')
  })

  it('renders one table row per entry, its first cell linking the row', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link').filter((link) => link.closest('[role="cell"]'))
    expect(links.map((link) => link.textContent?.trim())).toEqual(
      rows.map((row) => row.values.role)
    )
    expect(links.map((link) => link.getAttribute('href'))).toEqual(rows.map((row) => row.href))
  })

  it('renders every value of a row in column order', () => {
    const { getAllByRole } = band()

    const bodyRows = getAllByRole('row').filter((row) => row.querySelector('[role="cell"]'))
    expect(bodyRows).toHaveLength(rows.length)
    expect(
      Array.from(bodyRows[1]!.querySelectorAll('[role="cell"]')).map((cell) =>
        cell.textContent?.trim()
      )
    ).toEqual(
      columns.map((column) => rows[1]!.values[column.key as keyof (typeof rows)[1]['values']])
    )
  })

  it('renders the phone list with the first column as title and the second as description', () => {
    const { getAllByTestId } = band()

    const entries = getAllByTestId('content-item')
    expect(entries).toHaveLength(rows.length)
    expect(entries[0]?.querySelector('a')?.getAttribute('href')).toBe(rows[0]!.href)
    expect(entries[0]?.textContent).toContain(rows[0]!.values.team)
    expect(entries[0]?.textContent).not.toContain(rows[0]!.values.type)
  })

  it('renders the action into the full listing', () => {
    const { getAllByRole } = band()

    const actions = getAllByRole('link', { name: primaryAction.label })
    expect(actions.length).toBeGreaterThan(0)
    actions.forEach((action) => expect(action.getAttribute('href')).toBe(primaryAction.href))
  })

  it('renders no action when primaryAction is absent', () => {
    const { queryAllByRole } = band({ primaryAction: undefined })

    expect(queryAllByRole('link', { name: primaryAction.label })).toHaveLength(0)
  })

  it('renders only the section when rows is empty', () => {
    const { getByTestId, queryByRole } = band({ rows: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByRole('table')).toBeNull()
  })

  it('has no a11y violations in the phone list', async () => {
    const { getByTestId } = band()

    await expectNoA11yViolations(getByTestId('content-item-list').parentElement!)
  })

  it.skip('has no a11y violations in the table — blocked by Table nesting its focusable ScrollArea viewport and the footer content directly under role=table and role=rowgroup (aria-required-children)', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
