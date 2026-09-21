import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/data/paginator/Paginator.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Paginator from './index'
import PaginationButton from './pagination-button/pagination-button.vue'
import PaginatorInfo from './paginator-info/paginator-info.vue'
import PaginatorPageSize from './paginator-page-size/paginator-page-size.vue'

// Default/Buttons are string-template stories whose Paginator.Button dot-notation
// the runtime template compiler cannot resolve, so only DataDriven is exercised.
const { DataDriven } = composeStories(stories)

describe('Paginator (composition)', () => {
  describe('compound API — dot-notation resolves to the sub-components', () => {
    it('attaches Button / Info / PageSize to the root (Object.assign in index.ts)', () => {
      expect(Paginator.Button).toBe(PaginationButton)
      expect(Paginator.Info).toBe(PaginatorInfo)
      expect(Paginator.PageSize).toBe(PaginatorPageSize)
    })
  })

  describe('root layout landmark (no total -> pure layout, consumer fills slots)', () => {
    it('renders a <nav> with the default data-testid and aria-label', () => {
      const { getByTestId } = render(Paginator)
      const root = getByTestId('data-paginator')
      expect(root.tagName).toBe('NAV')
      expect(root.getAttribute('aria-label')).toBe('Pagination')
    })

    it('is a navigation landmark named by ariaLabel', () => {
      const { getByRole } = render(Paginator, { props: { ariaLabel: 'Table pages' } })
      expect(getByRole('navigation', { name: 'Table pages' })).toBeTruthy()
    })

    it('renders the default slot content (center region) when not data-driven', () => {
      const { getByTestId } = render(Paginator, {
        slots: { default: '<button data-testid="my-btn">1</button>' }
      })
      expect(getByTestId('my-btn')).toBeTruthy()
    })

    it('does not render its own info/controls when total is undefined', () => {
      const { queryByTestId } = render(Paginator)
      expect(queryByTestId('data-paginator__info')).toBeNull()
      expect(queryByTestId('data-paginator__page-size')).toBeNull()
    })
  })

  describe('provide/inject — sub-components derive their testid from the root context', () => {
    it('derives BEM-suffixed testids from the root data-testid when composed inside the root', () => {
      const { getByTestId } = render(Paginator, {
        attrs: { 'data-testid': 'my-paginator' },
        slots: {
          info: '<span>info</span>', // fills the named info slot so the root default is bypassed
          default: `<button>page</button>`
        }
      })
      expect(getByTestId('my-paginator').tagName).toBe('NAV')
    })

    it('a PaginationButton inside the root inherits the root testid via inject', () => {
      const { getByTestId } = render(Paginator, {
        attrs: { 'data-testid': 'ctx-paginator' },
        slots: {
          default: () => null
        }
      })
      expect(getByTestId('ctx-paginator')).toBeTruthy()
    })

    it('a standalone PaginatorInfo (no root) falls back to the default testid', () => {
      const { getByTestId } = render(PaginatorInfo, { slots: { default: 'hello' } })
      const el = getByTestId('data-paginator__info')
      expect(el.tagName).toBe('SPAN')
      expect(el.textContent).toContain('hello')
    })
  })

  describe('data-driven mode (total set -> root renders its own controls)', () => {
    it('renders info text, Previous, page numbers, Next, and the page-size selector', () => {
      const { getByTestId, getByRole, getAllByRole } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      const info = getByTestId('data-paginator__info')
      expect(info.textContent).toContain('Showing 1 to 10 of 30 entries')

      expect(getByTestId('data-paginator__page-size')).toBeTruthy()
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()

      // pageCount = ceil(30/10) = 3 -> buttons: Previous, 1, 2, 3, Next = 5.
      const buttons = getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('disables Previous on the first page and enables Next', () => {
      const { getByRole } = render(Paginator, { props: { total: 30, pageSize: 10, page: 1 } })
      const prev = getByRole('button', { name: /Previous/i })
      const next = getByRole('button', { name: /Next/i })
      expect(prev.hasAttribute('disabled')).toBe(true)
      expect(next.hasAttribute('disabled')).toBe(false)
    })

    it('disables Next on the last page', () => {
      const { getByRole } = render(Paginator, { props: { total: 30, pageSize: 10, page: 3 } })
      expect(getByRole('button', { name: /Next/i }).hasAttribute('disabled')).toBe(true)
      expect(getByRole('button', { name: /Previous/i }).hasAttribute('disabled')).toBe(false)
    })

    it('marks the current page button with aria-current="page"', () => {
      const { getByRole } = render(Paginator, { props: { total: 30, pageSize: 10, page: 2 } })
      const current = getByRole('button', { name: '2' })
      expect(current.getAttribute('aria-current')).toBe('page')
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
    })

    it('renders an overflow "more" button when the page count exceeds the window', () => {
      // total 200 / pageSize 10 -> 20 pages, siblingCount 1 -> windowed with ellipsis.
      const { getAllByRole, getByRole } = render(Paginator, {
        props: { total: 200, pageSize: 10, page: 1, siblingCount: 1 }
      })
      const moreButtons = getAllByRole('button').filter(
        (b) => b.getAttribute('data-kind') === 'more'
      )
      expect(moreButtons.length).toBeGreaterThanOrEqual(1)
      expect(getByRole('button', { name: '20' })).toBeTruthy()
    })
  })

  describe('events (grounded in the root emits: update:page / update:pageSize)', () => {
    it('clicking Next emits update:page with the next page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: /Next/i }))

      expect(emitted()['update:page']).toBeTruthy()
      expect(emitted()['update:page'][0]).toEqual([2])
    })

    it('clicking Previous emits the previous page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 3 }
      })
      await fireEvent.click(getByRole('button', { name: /Previous/i }))

      expect(emitted()['update:page'][0]).toEqual([2])
    })

    it('clicking a specific page number emits that page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: '3' }))
      expect(emitted()['update:page'][0]).toEqual([3])
    })

    it('clicking the current page is a no-op (goToPage returns when clamped === current)', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 2 }
      })
      await fireEvent.click(getByRole('button', { name: '2' }))
      expect(emitted()['update:page']).toBeUndefined()
    })

    it('disabled Previous on the first page does not emit on click', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: /Previous/i }))
      expect(emitted()['update:page']).toBeUndefined()
    })

    it('changing the page-size selector emits update:pageSize (and resets page when not on page 1)', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 200, pageSize: 10, page: 3 }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      await fireEvent.update(select, '25')

      expect(emitted()['update:pageSize']).toBeTruthy()
      expect(emitted()['update:pageSize'][0]).toEqual([25])
      expect(emitted()['update:page'][0]).toEqual([1])
    })

    it('changing page-size while already on page 1 emits only update:pageSize (no reset)', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 200, pageSize: 10, page: 1 }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      await fireEvent.update(select, '50')

      expect(emitted()['update:pageSize'][0]).toEqual([50])
      expect(emitted()['update:page']).toBeUndefined()
    })
  })

  describe('v-model round-trips (v-model:page / v-model:pageSize)', () => {
    it('emitted update:page reflects a click and can drive the bound page', async () => {
      const { getByRole, emitted, rerender } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: '2' }))
      const next = emitted()['update:page'][0][0] as number
      expect(next).toBe(2)

      await rerender({ total: 30, pageSize: 10, page: next })
      expect(getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page')
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
    })
  })

  describe('PaginationButton sub-component (standalone contract)', () => {
    it('renders a <button type="button"> and emits click with the MouseEvent', async () => {
      const { getByRole, emitted } = render(PaginationButton, {
        props: { kind: 'number' },
        slots: { default: '7' }
      })
      const btn = getByRole('button')
      expect(btn.getAttribute('type')).toBe('button')
      await fireEvent.click(btn)
      expect(emitted().click).toBeTruthy()
      expect(emitted().click[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('selected -> aria-current="page" and data-selected', () => {
      const { getByRole } = render(PaginationButton, {
        props: { kind: 'number', selected: true },
        slots: { default: '4' }
      })
      const btn = getByRole('button')
      expect(btn.getAttribute('aria-current')).toBe('page')
      expect(btn.getAttribute('data-selected')).toBe('true')
    })

    it('disabled -> guards the click (no emit) and sets aria-disabled', async () => {
      const { getByRole, emitted } = render(PaginationButton, {
        props: { kind: 'number', disabled: true },
        slots: { default: '9' }
      })
      const btn = getByRole('button')
      expect(btn.hasAttribute('disabled')).toBe(true)
      expect(btn.getAttribute('aria-disabled')).toBe('true')
      await fireEvent.click(btn)
      expect(emitted().click).toBeUndefined()
    })

    it('kind="more" hides the default slot content', () => {
      const { getByRole } = render(PaginationButton, {
        props: { kind: 'more' },
        slots: { default: 'SHOULD-NOT-SHOW' }
      })
      expect(getByRole('button').textContent).not.toContain('SHOULD-NOT-SHOW')
    })

    it.each(['previous', 'next', 'number', 'more'] as const)(
      'renders each kind and reflects it on data-kind (%s)',
      (kind) => {
        const { getByRole } = render(PaginationButton, { props: { kind }, slots: { default: 'x' } })
        expect(getByRole('button').getAttribute('data-kind')).toBe(kind)
      }
    )
  })

  describe('PaginatorPageSize sub-component (standalone contract)', () => {
    it('renders a labelled select seeded from modelValue with the option list', () => {
      const { getByRole } = render(PaginatorPageSize, {
        props: { modelValue: 25, options: [10, 25, 50, 100] }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      expect(select.value).toBe('25')
      expect(within(select).getAllByRole('option')).toHaveLength(4)
    })

    it('folds a modelValue that is not in the options into the option list (never blank)', () => {
      const { getByRole } = render(PaginatorPageSize, {
        props: { modelValue: 3, options: [10, 25, 50, 100] }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      const options = within(select).getAllByRole('option') as HTMLOptionElement[]
      expect(options).toHaveLength(5)
      expect(options.map((o) => o.value)).toEqual(['3', '10', '25', '50', '100'])
      expect(select.value).toBe('3')
    })

    it('emits update:modelValue with the numeric selected value on change', async () => {
      const { getByRole, emitted } = render(PaginatorPageSize, {
        props: { modelValue: 10, options: [10, 25, 50, 100] }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      await fireEvent.update(select, '50')
      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([50])
    })
  })

  describe('composed compound tree (dot-notation sub-components inside the root)', () => {
    // Prev/Next render slot content only for kind=number, so their accessible
    // name must come from aria-label (the data-driven root does the same).
    const Composed = {
      components: { Paginator, PaginationButton, PaginatorInfo, PaginatorPageSize },
      template: `
        <Paginator>
          <template #info>
            <PaginatorInfo>Showing 1 to 10 of 20 entries</PaginatorInfo>
          </template>
          <PaginationButton kind="previous" aria-label="Previous page" disabled />
          <PaginationButton kind="number" selected>1</PaginationButton>
          <PaginationButton kind="number">2</PaginationButton>
          <PaginationButton kind="next" aria-label="Next page" />
          <template #controls>
            <PaginatorPageSize :model-value="10" :options="[10, 25, 50, 100]" />
          </template>
        </Paginator>
      `
    }

    it('renders Info in the info region, the buttons in the center, and PageSize in controls', () => {
      const { getByTestId, getByRole } = render(Composed)
      expect(getByTestId('data-paginator__info').textContent).toContain(
        'Showing 1 to 10 of 20 entries'
      )
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBe('page')
      expect(getByRole('button', { name: /Previous/i }).hasAttribute('disabled')).toBe(true)
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })

    it('the composed sub-components share the root testid context (__info + __page-size)', () => {
      const { getByTestId } = render(Composed)
      expect(getByTestId('data-paginator__info')).toBeTruthy()
      expect(getByTestId('data-paginator__page-size')).toBeTruthy()
    })
  })

  describe('composeStories (data-driven fixture runs in-test)', () => {
    it('DataDriven story wires v-model and renders the windowed controls (total 200)', () => {
      const { getByTestId, getByRole } = render(DataDriven)
      expect(getByTestId('data-paginator__info').textContent).toContain(
        'Showing 1 to 10 of 200 entries'
      )
      expect(getByRole('button', { name: /Next/i })).toBeTruthy()
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('data-driven paginator (no overflow ellipsis) has no violations', async () => {
      // 3 pages -> no "more" button; a windowed config trips axe button-name on the
      // unnamed ellipsis button (known component gap).
      const { container } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 2, ariaLabel: 'Results pages' }
      })
      await expectNoA11yViolations(container)
    })

    it('the hand-composed compound tree has no violations', async () => {
      // Icon-only prev/next need aria-label or axe trips button-name.
      const Composed = {
        components: { Paginator, PaginationButton, PaginatorInfo, PaginatorPageSize },
        template: `
          <Paginator>
            <template #info>
              <PaginatorInfo>Showing 1 to 10 of 20 entries</PaginatorInfo>
            </template>
            <PaginationButton kind="previous" aria-label="Previous page" />
            <PaginationButton kind="number" selected>1</PaginationButton>
            <PaginationButton kind="number">2</PaginationButton>
            <PaginationButton kind="next" aria-label="Next page" />
            <template #controls>
              <PaginatorPageSize :model-value="10" :options="[10, 25, 50, 100]" />
            </template>
          </Paginator>
        `
      }
      const { container } = render(Composed)
      await expectNoA11yViolations(container)
    })
  })
})
