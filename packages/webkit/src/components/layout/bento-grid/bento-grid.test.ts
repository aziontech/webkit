import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import Mosaic from '../../../../examples/bento-grid/mosaic.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import BentoGridCell from './bento-grid-cell/bento-grid-cell.vue'
import BentoGrid from './index'

const TESTID = 'bento-grid'
const CELL_TESTID = 'bento-grid-cell'

const cells = [
  {
    title: 'Everything runs at the edge',
    body: 'Your code executes close to users.',
    span: '2',
    rows: '2'
  },
  { title: 'Deploy in seconds', body: 'Ship without a build queue.', span: 'full' },
  { title: 'Scale without capacity planning', body: 'Capacity follows demand.', span: undefined }
]

const host = (props: Record<string, unknown> = {}, items = cells) =>
  defineComponent({
    components: { BentoGrid, BentoGridCell },
    setup: () => ({ props, items }),
    template: `
      <BentoGrid v-bind="props">
        <BentoGridCell
          v-for="item in items"
          :key="item.title"
          :span="item.span"
          :rows="item.rows"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </BentoGridCell>
      </BentoGrid>
    `
  })

describe('BentoGrid', () => {
  describe('compound', () => {
    it('renders the grid under the default testid', () => {
      const { getByTestId } = render(host())

      expect(getByTestId(TESTID)).toBeInTheDocument()
    })

    it('lets a consumer data-testid win over the fallback', () => {
      const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'platform-bento' }))

      expect(getByTestId('platform-bento')).toBeInTheDocument()
      expect(queryByTestId(TESTID)).toBeNull()
    })

    it('attaches Cell to the compound root for dot-notation', () => {
      expect(BentoGrid.Cell).toBe(BentoGridCell)
    })

    it('renders a cell reached through the compound member', () => {
      const { getByTestId, getByRole } = render(
        defineComponent({
          components: { BentoGrid, CompoundCell: BentoGrid.Cell },
          template: `
          <BentoGrid>
            <CompoundCell span="full"><h3>Reached through the compound</h3></CompoundCell>
          </BentoGrid>
        `
        })
      )

      expect(getByTestId(CELL_TESTID)).toBeInTheDocument()
      expect(getByRole('heading', { name: 'Reached through the compound' })).toBeInTheDocument()
    })

    it('mirrors each cell span onto data-span and defaults to one column', () => {
      const { getAllByTestId } = render(host())

      expect(getAllByTestId(CELL_TESTID).map((cell) => cell.getAttribute('data-span'))).toEqual([
        '2',
        'full',
        '1'
      ])
    })

    it('mirrors each cell row claim onto data-rows and defaults to one row', () => {
      const { getAllByTestId } = render(host())

      expect(getAllByTestId(CELL_TESTID).map((cell) => cell.getAttribute('data-rows'))).toEqual([
        '2',
        '1',
        '1'
      ])
    })

    it('mirrors the track counts the grid lays out at each breakpoint', () => {
      const { getByTestId } = render(host({ columns: 4, mobileColumns: 2 }))

      const grid = getByTestId(TESTID)
      expect(grid.getAttribute('data-columns')).toBe('4')
      expect(grid.getAttribute('data-mobile-columns')).toBe('2')
    })

    it('defaults to a two-column grid stacked to one on mobile', () => {
      const { getByTestId } = render(host())

      const grid = getByTestId(TESTID)
      expect(grid.getAttribute('data-columns')).toBe('2')
      expect(grid.getAttribute('data-mobile-columns')).toBe('1')
    })

    it('withholds its own outer rules when the surrounding frame draws them', () => {
      const { getByTestId } = render(host({ flush: true }))

      expect(getByTestId(TESTID).getAttribute('data-flush')).toBe('true')
    })

    it('draws its own outer rules by default', () => {
      const { getByTestId } = render(host())

      expect(getByTestId(TESTID).getAttribute('data-flush')).toBe('false')
    })

    it('fills a cell with the raised surface by default, padded away from its rules', () => {
      const { getByTestId } = render(
        defineComponent({
          components: { BentoGrid, BentoGridCell },
          template: `<BentoGrid><BentoGridCell><h3>Filled</h3></BentoGridCell></BentoGrid>`
        })
      )

      const content = getByTestId(CELL_TESTID).querySelector('[data-variant]')
      expect(content?.getAttribute('data-variant')).toBe('surface')
      expect(content?.getAttribute('data-padded')).toBe('true')
    })

    it('leaves the fill and the padding to the content of a bare cell', () => {
      const { getByTestId } = render(
        defineComponent({
          components: { BentoGrid, BentoGridCell },
          template: `
          <BentoGrid>
            <BentoGridCell variant="none" :padded="false">
              <a href="#platform">A tile that paints itself</a>
            </BentoGridCell>
          </BentoGrid>
        `
        })
      )

      const content = getByTestId(CELL_TESTID).querySelector('[data-variant]')
      expect(content?.getAttribute('data-variant')).toBe('none')
      expect(content?.hasAttribute('data-padded')).toBe(false)
    })

    it('renders one cell per child, with its slotted content in DOM order', () => {
      const { getAllByTestId } = render(host())

      const rendered = getAllByTestId(CELL_TESTID)
      expect(rendered).toHaveLength(cells.length)
      expect(rendered.map((cell) => cell.querySelector('h3')?.textContent)).toEqual(
        cells.map((cell) => cell.title)
      )
      expect(rendered.map((cell) => cell.querySelector('p')?.textContent)).toEqual(
        cells.map((cell) => cell.body)
      )
    })

    it('names the grid when ariaLabel is set', () => {
      const { getByRole } = render(host({ ariaLabel: 'Platform capabilities' }))

      expect(getByRole('region', { name: 'Platform capabilities' })).toBeInTheDocument()
    })

    it('leaves the grid unnamed when ariaLabel is unset', () => {
      const { getByTestId, queryByRole } = render(host())

      expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
      expect(queryByRole('region')).toBeNull()
    })

    it('renders no cells and no rules for an empty grid', () => {
      const { getByTestId, queryAllByTestId } = render(BentoGrid)

      expect(queryAllByTestId(CELL_TESTID)).toHaveLength(0)
      expect(getByTestId(TESTID).hasAttribute('data-filled')).toBe(false)
    })

    it('draws no rules when every cell is withheld by a v-if', () => {
      const withheld = defineComponent({
        components: { BentoGrid, BentoGridCell },
        template: `
        <BentoGrid>
          <BentoGridCell v-if="false">never rendered</BentoGridCell>
        </BentoGrid>
      `
      })
      const { getByTestId, queryAllByTestId } = render(withheld)

      expect(queryAllByTestId(CELL_TESTID)).toHaveLength(0)
      expect(getByTestId(TESTID).hasAttribute('data-filled')).toBe(false)
    })

    it('marks a filled grid so it draws its rules', () => {
      const { getByTestId } = render(host())

      expect(getByTestId(TESTID).getAttribute('data-filled')).toBe('true')
    })

    it('has no a11y violations with a full mosaic', async () => {
      const { container } = render(host({ ariaLabel: 'Platform capabilities', columns: 4 }))

      await expectNoA11yViolations(container)
    })
  })

  describe('Cell href — the whole tile is one link', () => {
    it('renders the cell surface as an anchor, keeping the plain cells as boxes', async () => {
      const { container, getByRole, getAllByRole } = render(Mosaic)
      const link = getByRole('link', { name: /^Pay for what you use/ })
      expect(link.getAttribute('href')).toBe('#pricing')
      expect(link.getAttribute('data-testid')).toBe('bento-grid-cell__link')
      expect(link.hasAttribute('data-link')).toBe(true)
      expect(getAllByRole('link')).toHaveLength(1)
      await expectNoA11yViolations(container)
    })

    it('renders no anchor for an unsafe href', () => {
      const { queryByRole } = render(BentoGridCell, {
        props: { href: 'javascript:alert(1)' },
        slots: { default: 'Tile' }
      })
      expect(queryByRole('link')).toBeNull()
    })
  })
})
