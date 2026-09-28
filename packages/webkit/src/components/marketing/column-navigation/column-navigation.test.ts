import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ColumnNavigationColumn from './column-navigation-column/column-navigation-column.vue'
import ColumnNavigationItem from './column-navigation-item/column-navigation-item.vue'
import ColumnNavigation from './index'

const TESTID = 'marketing-column-navigation'
const COLUMN_TESTID = 'marketing-column-navigation-column'
const COLUMN_TITLE_TESTID = `${COLUMN_TESTID}__title`
const ITEM_TESTID = 'marketing-column-navigation-item'
const ROW_TESTID = `${ITEM_TESTID}__row`
const ITEM_TITLE_TESTID = `${ITEM_TESTID}__title`
const ITEM_DESCRIPTION_TESTID = `${ITEM_TESTID}__description`

const groups = [
  {
    label: 'Build',
    items: [
      {
        icon: 'ai ai-workloads',
        title: 'Workloads',
        description: 'Put an application on a hostname, everywhere',
        href: '/workloads'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run serverless code at the edge',
        href: '/functions'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'A distributed SQL database',
        href: '/sql-database'
      }
    ]
  }
]

const host = (props: Record<string, unknown> = {}, onClick?: (...args: unknown[]) => void) =>
  defineComponent({
    components: { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem },
    setup: () => ({ props, groups, onClick: onClick ?? (() => {}) }),
    template: `
      <ColumnNavigation v-bind="props">
        <ColumnNavigationColumn
          v-for="group in groups"
          :key="group.label"
          :title="group.label"
        >
          <ColumnNavigationItem
            v-for="item in group.items"
            :key="item.title"
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :href="item.href"
            @click="onClick"
          />
        </ColumnNavigationColumn>
      </ColumnNavigation>
    `
  })

describe('ColumnNavigation (compound)', () => {
  it('renders the block under the default testid', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'platform-directory' }))

    expect(getByTestId('platform-directory')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('attaches Column and Item to the compound root for dot-notation', () => {
    expect(ColumnNavigation.Column).toBe(ColumnNavigationColumn)
    expect(ColumnNavigation.Item).toBe(ColumnNavigationItem)
  })

  it('renders a column and a row reached through the compound members', () => {
    const { getByTestId, getByRole } = render(
      defineComponent({
        components: {
          ColumnNavigation,
          CompoundColumn: ColumnNavigation.Column,
          CompoundItem: ColumnNavigation.Item
        },
        template: `
          <ColumnNavigation>
            <CompoundColumn title="Build">
              <CompoundItem title="Workloads" href="/workloads" />
            </CompoundColumn>
          </ColumnNavigation>
        `
      })
    )

    expect(getByTestId(COLUMN_TESTID)).toBeInTheDocument()
    expect(getByTestId(ITEM_TESTID)).toBeInTheDocument()
    expect(getByRole('link', { name: 'Workloads' })).toBeInTheDocument()
  })

  it('mirrors the track counts the block lays out at each breakpoint', () => {
    const { getByTestId } = render(host({ columns: 2, mobileColumns: 2 }))

    const block = getByTestId(TESTID)
    expect(block.getAttribute('data-columns')).toBe('2')
    expect(block.getAttribute('data-mobile-columns')).toBe('2')
  })

  it('defaults to four columns stacked to one below the small breakpoint', () => {
    const { getByTestId } = render(host())

    const block = getByTestId(TESTID)
    expect(block.getAttribute('data-columns')).toBe('4')
    expect(block.getAttribute('data-mobile-columns')).toBe('1')
  })

  it('is a navigation landmark named by ariaLabel', () => {
    const { getByRole } = render(host({ ariaLabel: 'Platform' }))

    expect(getByRole('navigation', { name: 'Platform' })).toBeInTheDocument()
  })

  it('leaves the landmark unnamed when ariaLabel is unset', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one column per group, in DOM order, each headed by its title', () => {
    const { getAllByTestId } = render(host())

    const columns = getAllByTestId(COLUMN_TESTID)
    expect(columns).toHaveLength(groups.length)
    expect(
      columns.map(
        (column) => column.querySelector(`[data-testid="${COLUMN_TITLE_TESTID}"]`)?.textContent
      )
    ).toEqual(groups.map((group) => group.label))
  })

  it("names each column's list with that column's heading", () => {
    const { getAllByRole } = render(host())

    expect(getAllByRole('list', { name: 'Build' })).toHaveLength(1)
    expect(getAllByRole('list', { name: 'Store' })).toHaveLength(1)
  })

  it('leaves an untitled column without a heading and its list unnamed', () => {
    const { getByTestId, getByRole } = render(
      defineComponent({
        components: { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem },
        template: `
          <ColumnNavigation>
            <ColumnNavigationColumn>
              <ColumnNavigationItem title="Workloads" href="/workloads" />
            </ColumnNavigationColumn>
          </ColumnNavigation>
        `
      })
    )

    expect(
      getByTestId(COLUMN_TESTID).querySelector(`[data-testid="${COLUMN_TITLE_TESTID}"]`)
    ).toBeNull()
    expect(getByRole('list').hasAttribute('aria-labelledby')).toBe(false)
  })

  it('renders every row with its title and its description', () => {
    const { getAllByTestId } = render(host())

    const rows = getAllByTestId(ITEM_TESTID)
    const items = groups.flatMap((group) => group.items)
    expect(rows).toHaveLength(items.length)
    expect(
      rows.map((row) => row.querySelector(`[data-testid="${ITEM_TITLE_TESTID}"]`)?.textContent)
    ).toEqual(items.map((item) => item.title))
    expect(
      rows.map(
        (row) => row.querySelector(`[data-testid="${ITEM_DESCRIPTION_TESTID}"]`)?.textContent
      )
    ).toEqual(items.map((item) => item.description))
  })

  it('omits the second line for a row with no description', () => {
    const { getByTestId } = render(
      defineComponent({
        components: { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem },
        template: `
          <ColumnNavigation>
            <ColumnNavigationColumn title="Build">
              <ColumnNavigationItem title="Workloads" href="/workloads" />
            </ColumnNavigationColumn>
          </ColumnNavigation>
        `
      })
    )

    expect(
      getByTestId(ITEM_TESTID).querySelector(`[data-testid="${ITEM_DESCRIPTION_TESTID}"]`)
    ).toBeNull()
  })

  it('renders a row with an href as a link and marks it linked', () => {
    const { getAllByTestId } = render(host())

    const row = getAllByTestId(ROW_TESTID)[0]
    expect(row.tagName).toBe('A')
    expect(row.getAttribute('href')).toBe('/workloads')
    expect(row.hasAttribute('data-linked')).toBe(true)
  })

  it('renders a row with nowhere to go as a plain, unfocusable row', () => {
    const { getByTestId } = render(
      defineComponent({
        components: { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem },
        template: `
          <ColumnNavigation>
            <ColumnNavigationColumn title="Build">
              <ColumnNavigationItem title="AI Inference" />
            </ColumnNavigationColumn>
          </ColumnNavigation>
        `
      })
    )

    const row = getByTestId(ROW_TESTID)
    expect(row.tagName).toBe('DIV')
    expect(row.hasAttribute('href')).toBe(false)
    expect(row.hasAttribute('data-linked')).toBe(false)
  })

  it('emits click with the DOM event first and the destination second', async () => {
    const calls: unknown[][] = []
    const { getAllByTestId } = render(host({}, (...args: unknown[]) => calls.push(args)))

    await fireEvent.click(getAllByTestId(ROW_TESTID)[0])

    expect(calls).toHaveLength(1)
    const [event, item] = calls[0]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(item).toEqual({ title: 'Workloads', href: '/workloads' })
  })

  it('does not emit click from a row with nowhere to go', async () => {
    const calls: unknown[][] = []
    const { getByTestId } = render(
      defineComponent({
        components: { ColumnNavigation, ColumnNavigationColumn, ColumnNavigationItem },
        setup: () => ({ onClick: (...args: unknown[]) => calls.push(args) }),
        template: `
          <ColumnNavigation>
            <ColumnNavigationColumn title="Build">
              <ColumnNavigationItem
                title="AI Inference"
                @click="onClick"
              />
            </ColumnNavigationColumn>
          </ColumnNavigation>
        `
      })
    )

    await fireEvent.click(getByTestId(ROW_TESTID))

    expect(calls).toHaveLength(0)
  })

  it('hides the glyph from the accessibility tree so a row is named by its own two lines', () => {
    const { getAllByRole, getAllByTestId } = render(host())

    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()
    expect(getAllByRole('link').map((link) => normalize(link.textContent ?? ''))).toEqual(
      groups.flatMap((group) => group.items).map((item) => `${item.title}${item.description}`)
    )
    for (const row of getAllByTestId(ROW_TESTID)) {
      expect(row.querySelector('[aria-hidden="true"]')).not.toBeNull()
    }
  })

  it('renders no columns and no rules for an empty block', () => {
    const { getByTestId, queryAllByTestId } = render(ColumnNavigation)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByTestId(COLUMN_TESTID)).toHaveLength(0)
  })

  it('has no a11y violations with a full directory', async () => {
    const { container } = render(host({ ariaLabel: 'Platform', columns: 2, mobileColumns: 2 }))

    await expectNoA11yViolations(container)
  })
})
