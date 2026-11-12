import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import CardGridCell from './card-grid-cell/card-grid-cell.vue'
import CardGrid from './index'

const TESTID = 'marketing-card-grid'
const CELL_TESTID = 'marketing-card-grid-cell'

const framed = (gridProps: Record<string, unknown> = {}, cellProps: Record<string, unknown> = {}) =>
  defineComponent({
    components: { CardGrid, CardGridCell },
    setup: () => ({ gridProps, cellProps }),
    template: `
      <CardGrid kind="frame" v-bind="gridProps">
        <CardGridCell v-bind="cellProps"><h2>One</h2></CardGridCell>
        <CardGridCell><h2>Two</h2></CardGridCell>
      </CardGrid>
    `
  })

describe('CardGrid', () => {
  it('renders with the default testid and the default register', () => {
    const { getByTestId } = render(CardGrid)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-kind', 'gap')
    expect(root).toHaveAttribute('data-columns', '3')
    expect(root).toHaveAttribute('data-mobile-columns', '1')
    expect(root).toHaveAttribute('data-divider-color', 'default')
    expect(root).toHaveAttribute('data-flush', 'false')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(CardGrid, { attrs: { 'data-testid': 'custom-grid' } })
    expect(getByTestId('custom-grid')).toBeInTheDocument()
  })

  it.each(['gap', 'divider', 'frame'] as const)('carries the %s register on data-kind', (kind) => {
    const { getByTestId } = render(CardGrid, { props: { kind } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
  })

  it.each([2, 3, 4] as const)('carries %i columns on data-columns', (columns) => {
    const { getByTestId } = render(CardGrid, { props: { columns } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-columns', String(columns))
  })

  it.each([1, 2] as const)('carries %i mobile columns on data-mobile-columns', (mobileColumns) => {
    const { getByTestId } = render(CardGrid, { props: { mobileColumns } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-mobile-columns', String(mobileColumns))
  })

  it('carries the muted hairline weight on data-divider-color', () => {
    const { getByTestId } = render(CardGrid, {
      props: { kind: 'divider', dividerColor: 'muted' }
    })
    expect(getByTestId(TESTID)).toHaveAttribute('data-divider-color', 'muted')
  })

  it('renders its cells in reading order', () => {
    const { getByTestId } = render(CardGrid, {
      slots: { default: '<div>one</div><div>two</div>' }
    })
    expect(getByTestId(TESTID).textContent).toBe('onetwo')
  })

  it('draws no rules while it holds no cell', () => {
    const { getByTestId } = render(CardGrid, { props: { kind: 'frame' } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-filled')
  })

  it('marks itself filled once a cell renders', () => {
    const { getByTestId } = render(framed())
    expect(getByTestId(TESTID)).toHaveAttribute('data-filled', 'true')
  })

  it('ignores a comment-only slot when deciding it is filled', () => {
    const { getByTestId } = render(CardGrid, {
      props: { kind: 'frame' },
      slots: { default: '<!-- nothing here -->' }
    })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-filled')
  })

  it('carries flush on data-flush so a surrounding frame keeps one rule per edge', () => {
    const { getByTestId } = render(framed({ flush: true }))
    expect(getByTestId(TESTID)).toHaveAttribute('data-flush', 'true')
  })

  const cells = (count: number) =>
    Array.from({ length: count }, (_, i) => `<div>c${i}</div>`).join('')

  it('balances its rows by default and fixes them on request', () => {
    const { getByTestId, unmount } = render(framed())
    expect(getByTestId(TESTID)).toHaveAttribute('data-layout', 'balanced')
    unmount()

    const fixed = render(framed({ layout: 'fixed' }))
    expect(fixed.getByTestId(TESTID)).toHaveAttribute('data-layout', 'fixed')
    expect(fixed.getByTestId(TESTID).style.getPropertyValue('--card-grid-cols-lg')).toBe('3')
  })

  it('keeps the declared track counts in the fixed layout whatever the count', () => {
    const { getByTestId } = render(CardGrid, {
      props: { columns: 4, mobileColumns: 2, layout: 'fixed' },
      slots: { default: cells(5) }
    })
    const root = getByTestId(TESTID)
    expect(root.style.getPropertyValue('--card-grid-cols-base')).toBe('2')
    expect(root.style.getPropertyValue('--card-grid-cols-sm')).toBe('2')
    expect(root.style.getPropertyValue('--card-grid-cols-lg')).toBe('4')
    expect(root).not.toHaveAttribute('data-fill-trailing')
  })

  it('fans five cells out to five columns', () => {
    const { getByTestId } = render(CardGrid, {
      props: { columns: 5 },
      slots: { default: cells(5) }
    })
    expect(getByTestId(TESTID).style.getPropertyValue('--card-grid-cols-lg')).toBe('5')
  })

  it('fills the trailing tracks of a short last row in a balanced divider grid', () => {
    const { getByTestId } = render(CardGrid, {
      props: { kind: 'divider', columns: 3 },
      slots: { default: cells(5) }
    })
    const root = getByTestId(TESTID)
    expect(root).toHaveAttribute('data-fill-trailing')
    expect(root.style.getPropertyValue('--card-grid-rest-lg')).toBe('1')
    expect(root.style.getPropertyValue('--card-grid-fill-lg')).toBe('block')
    expect(root.style.getPropertyValue('--card-grid-rest-sm')).toBe('1')
    expect(root.style.getPropertyValue('--card-grid-fill-sm')).toBe('block')
    expect(root.style.getPropertyValue('--card-grid-fill-base')).toBe('none')
  })

  it('draws no trailing fill when the rows are full or the grid is not divided', () => {
    const full = render(CardGrid, {
      props: { kind: 'divider', columns: 3 },
      slots: { default: cells(6) }
    })
    expect(full.getByTestId(TESTID).style.getPropertyValue('--card-grid-fill-lg')).toBe('none')
    full.unmount()

    const framed = render(CardGrid, {
      props: { kind: 'frame', columns: 3 },
      slots: { default: cells(5) }
    })
    expect(framed.getByTestId(TESTID)).not.toHaveAttribute('data-fill-trailing')
  })

  it.each([
    [1, 3, 1, '1', '1', '1'],
    [2, 3, 1, '1', '2', '2'],
    [3, 3, 1, '1', '2', '3'],
    [4, 3, 1, '1', '2', '2'],
    [5, 3, 1, '1', '2', '3'],
    [6, 3, 1, '1', '2', '3'],
    [7, 3, 1, '1', '2', '3'],
    [4, 4, 2, '2', '2', '4'],
    [5, 4, 2, '2', '2', '3'],
    [6, 4, 2, '2', '2', '3'],
    [7, 4, 2, '2', '2', '4'],
    [3, 2, 2, '2', '2', '2']
  ] as const)(
    '%i cells under %i columns (%i on a phone) fill rows of %s / %s / %s',
    (count, columns, mobileColumns, base, sm, lg) => {
      const { getByTestId } = render(CardGrid, {
        props: { columns, mobileColumns },
        slots: { default: cells(count) }
      })
      const root = getByTestId(TESTID)
      expect(root).toHaveAttribute('data-count', String(count))
      expect(root.style.getPropertyValue('--card-grid-cols-base')).toBe(base)
      expect(root.style.getPropertyValue('--card-grid-cols-sm')).toBe(sm)
      expect(root.style.getPropertyValue('--card-grid-cols-lg')).toBe(lg)
    }
  )

  it('counts the cells a v-for renders, skipping comments', () => {
    const { getByTestId } = render({
      components: { CardGrid },
      setup: () => ({ items: ['a', 'b', 'c', 'd'] }),
      template: `<CardGrid :columns="3"><!-- x --><div v-for="item in items" :key="item">{{ item }}</div></CardGrid>`
    })
    expect(getByTestId(TESTID)).toHaveAttribute('data-count', '4')
    expect(getByTestId(TESTID).style.getPropertyValue('--card-grid-cols-lg')).toBe('2')
  })

  it('resolves the Cell through the compound root', () => {
    expect(CardGrid.Cell).toBe(CardGridCell)
  })
})

describe('CardGridCell', () => {
  it('renders under its own testid, inside a frame box', () => {
    const { getAllByTestId } = render(framed())
    const cells = getAllByTestId(CELL_TESTID)

    expect(cells).toHaveLength(2)
    expect(cells[0].querySelector('[data-testid="layout-frame-box"]')).not.toBeNull()
  })

  it('draws only its right and bottom rules, leaving the top and left to the grid', () => {
    const { getAllByTestId } = render(framed())
    const frame = getAllByTestId(CELL_TESTID)[0].querySelector('[data-testid="layout-frame-box"]')

    expect(frame).toHaveAttribute('data-borders', 'right bottom')
    expect(frame).toHaveAttribute('data-flush', 'top left')
  })

  it('fills with the surface token and pads its content by default', () => {
    const { getAllByTestId } = render(framed())
    const content = getAllByTestId(CELL_TESTID)[0].querySelector('[data-kind]')

    expect(content).toHaveAttribute('data-kind', 'surface')
    expect(content).toHaveAttribute('data-padded', 'true')
  })

  it.each(['surface', 'canvas', 'none'] as const)('carries the %s fill on data-kind', (kind) => {
    const { getAllByTestId } = render(framed({}, { kind }))
    expect(getAllByTestId(CELL_TESTID)[0].querySelector('[data-kind]')).toHaveAttribute(
      'data-kind',
      kind
    )
  })

  it('drops its padding when padded is false', () => {
    const { getAllByTestId } = render(framed({}, { padded: false }))
    expect(getAllByTestId(CELL_TESTID)[0].querySelector('[data-kind]')).not.toHaveAttribute(
      'data-padded'
    )
  })

  it('renders its composed content', () => {
    const { getByText } = render(framed())
    expect(getByText('One')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(framed())
    await expectNoA11yViolations(container)
  })
})
