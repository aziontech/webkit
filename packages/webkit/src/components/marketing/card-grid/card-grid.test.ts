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
