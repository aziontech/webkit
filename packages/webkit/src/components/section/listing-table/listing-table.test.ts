import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ListingTable from './listing-table.vue'

const TESTID = 'listing-table'
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
    props: { title: TITLE, columns, data: rows, primaryAction, ...props }
  })

describe('ListingTable', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ListingTable, {
      props: { title: TITLE, columns, data: rows },
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

    expect(getAllByTestId('table-head-cell').map((cell) => cell.textContent?.trim())).toEqual(
      columns.map((column) => column.label)
    )
  })

  it('maps grow and align onto the cells', () => {
    const { getAllByTestId } = band()

    const heads = getAllByTestId('table-head-cell')
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

  it('mounts a long listing in chunks in both the table and the phone list', () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({
      href: `/careers/role-${i}`,
      values: { role: `Role ${i}`, team: 'Engineering', type: 'Remote' }
    }))
    const { getAllByRole } = band({ data: many })
    const links = getAllByRole('link')
    const cellLinks = links.filter((link) => link.closest('[role="cell"]'))
    const itemLinks = links.filter((link) => link.closest('[role="listitem"]'))
    expect(cellLinks.length).toBeGreaterThan(0)
    expect(cellLinks.length).toBeLessThan(many.length)
    expect(itemLinks.length).toBeGreaterThan(0)
    expect(itemLinks.length).toBeLessThan(many.length)
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

  it('follows the row link when the row is clicked outside it, keeping modifier keys', async () => {
    const user = userEvent.setup()
    const { getAllByRole, getByTitle } = band()

    const link = getAllByRole('link').find(
      (candidate) =>
        candidate.closest('[role="cell"]') && candidate.textContent?.trim() === rows[1]!.values.role
    )!
    const clicks: MouseEvent[] = []
    link.addEventListener('click', (event) => {
      event.preventDefault()
      clicks.push(event)
    })

    await user.click(getByTitle(rows[1]!.values.type))
    expect(clicks).toHaveLength(1)

    await user.keyboard('{Control>}')
    await user.click(getByTitle(rows[1]!.values.team))
    await user.keyboard('{/Control}')
    expect(clicks).toHaveLength(2)
    expect(clicks[1]!.ctrlKey).toBe(true)
  })

  it('does not forward a click on the link itself', async () => {
    const { getAllByRole } = band()

    const link = getAllByRole('link').find(
      (candidate) =>
        candidate.closest('[role="cell"]') && candidate.textContent?.trim() === rows[0]!.values.role
    )!
    let count = 0
    link.addEventListener('click', (event) => {
      event.preventDefault()
      count += 1
    })

    await userEvent.click(link)
    expect(count).toBe(1)
  })

  it('gives each metadata cell its full value as a tooltip', () => {
    const { getByTitle } = band()

    expect(getByTitle(rows[0]!.values.team).textContent).toBe(rows[0]!.values.team)
    expect(getByTitle(rows[0]!.values.type).textContent).toBe(rows[0]!.values.type)
  })

  it('renders the phone list with the first column as title and the second as description', () => {
    const { getAllByTestId } = band()

    const entries = getAllByTestId('item')
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
    const { getByTestId, queryByRole } = band({ data: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByRole('table')).toBeNull()
  })

  it('has no a11y violations in the phone list', async () => {
    const { getByTestId } = band()

    await expectNoA11yViolations(getByTestId('item-list').parentElement!)
  })

  it('has no a11y violations in the table and its footer action', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
