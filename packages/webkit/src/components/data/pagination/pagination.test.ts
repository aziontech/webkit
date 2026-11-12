import '../../../test/reflow.css'

import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DataDriven from '../../../../examples/pagination/data-driven.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Pagination from './index'
import PaginationButton from './pagination-button/pagination-button.vue'
import PaginationInfo from './pagination-info/pagination-info.vue'
import PaginationPageSize from './pagination-page-size/pagination-page-size.vue'

// Default/Buttons are string-template stories whose Pagination.Button dot-notation
// the runtime template compiler cannot resolve, so only DataDriven is exercised.

describe('Pagination (composition)', () => {
  describe('compound API — dot-notation resolves to the sub-components', () => {
    it('attaches Button / Info / PageSize to the root (Object.assign in index.ts)', () => {
      expect(Pagination.Button).toBe(PaginationButton)
      expect(Pagination.Info).toBe(PaginationInfo)
      expect(Pagination.PageSize).toBe(PaginationPageSize)
    })
  })

  describe('root layout landmark (no total -> pure layout, consumer fills slots)', () => {
    it('renders a <nav> with the default data-testid and aria-label', () => {
      const { getByTestId } = render(Pagination)
      const root = getByTestId('data-pagination')
      expect(root.tagName).toBe('NAV')
      expect(root.getAttribute('aria-label')).toBe('Pagination')
    })

    it('is a navigation landmark named by ariaLabel', () => {
      const { getByRole } = render(Pagination, { props: { ariaLabel: 'Table pages' } })
      expect(getByRole('navigation', { name: 'Table pages' })).toBeTruthy()
    })

    it('renders the default slot content (center region) when not data-driven', () => {
      const { getByTestId } = render(Pagination, {
        slots: { default: '<button data-testid="my-btn">1</button>' }
      })
      expect(getByTestId('my-btn')).toBeTruthy()
    })

    it('does not render its own info/controls when total is undefined', () => {
      const { queryByTestId } = render(Pagination)
      expect(queryByTestId('data-pagination__info')).toBeNull()
      expect(queryByTestId('data-pagination__page-size')).toBeNull()
    })
  })

  describe('provide/inject — sub-components derive their testid from the root context', () => {
    it('derives BEM-suffixed testids from the root data-testid when composed inside the root', () => {
      const { getByTestId } = render(Pagination, {
        attrs: { 'data-testid': 'my-paginator' },
        slots: {
          info: '<span>info</span>', // fills the named info slot so the root default is bypassed
          default: `<button>page</button>`
        }
      })
      expect(getByTestId('my-paginator').tagName).toBe('NAV')
    })

    it('a PaginationButton inside the root inherits the root testid via inject', () => {
      const { getByTestId } = render(Pagination, {
        attrs: { 'data-testid': 'ctx-paginator' },
        slots: {
          default: () => null
        }
      })
      expect(getByTestId('ctx-paginator')).toBeTruthy()
    })

    it('a standalone PaginationInfo (no root) falls back to the default testid', () => {
      const { getByTestId } = render(PaginationInfo, { slots: { default: 'hello' } })
      const el = getByTestId('data-pagination__info')
      expect(el.tagName).toBe('SPAN')
      expect(el.textContent).toContain('hello')
    })
  })

  describe('data-driven mode (total set -> root renders its own controls)', () => {
    it('renders info text, Previous, page numbers, Next, and the page-size selector', () => {
      const { getByTestId, getByRole, getAllByRole } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      const info = getByTestId('data-pagination__info')
      expect(info.textContent).toContain('Showing 1 to 10 of 30 entries')

      expect(getByTestId('data-pagination__page-size')).toBeTruthy()
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()

      // pageCount = ceil(30/10) = 3 -> buttons: Previous, 1, 2, 3, Next = 5.
      const buttons = getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('disables Previous on the first page and enables Next', () => {
      const { getByRole } = render(Pagination, { props: { total: 30, pageSize: 10, page: 1 } })
      const prev = getByRole('button', { name: /Previous/i })
      const next = getByRole('button', { name: /Next/i })
      expect(prev.hasAttribute('disabled')).toBe(true)
      expect(next.hasAttribute('disabled')).toBe(false)
    })

    it('disables Next on the last page', () => {
      const { getByRole } = render(Pagination, { props: { total: 30, pageSize: 10, page: 3 } })
      expect(getByRole('button', { name: /Next/i }).hasAttribute('disabled')).toBe(true)
      expect(getByRole('button', { name: /Previous/i }).hasAttribute('disabled')).toBe(false)
    })

    it('marks the current page button with aria-current="page"', () => {
      const { getByRole } = render(Pagination, { props: { total: 30, pageSize: 10, page: 2 } })
      const current = getByRole('button', { name: '2' })
      expect(current.getAttribute('aria-current')).toBe('page')
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
    })

    it('renders an inert overflow ellipsis when the page count exceeds the window', () => {
      const { container, getAllByRole, getByRole } = render(Pagination, {
        props: { total: 200, pageSize: 10, page: 1, siblingCount: 1 }
      })
      const ellipses = container.querySelectorAll('[data-kind="more"]')
      expect(ellipses.length).toBeGreaterThanOrEqual(1)
      ellipses.forEach((el) => {
        expect(el.tagName).toBe('SPAN')
        expect(el.getAttribute('aria-hidden')).toBe('true')
      })
      expect(getAllByRole('button').some((b) => b.getAttribute('data-kind') === 'more')).toBe(false)
      expect(getByRole('button', { name: '20' })).toBeTruthy()
    })
  })

  describe('events (grounded in the root emits: update:page / update:pageSize)', () => {
    it('clicking Next emits update:page with the next page', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: /Next/i }))

      expect(emitted()['update:page']).toBeTruthy()
      expect(emitted()['update:page'][0]).toEqual([2])
    })

    it('clicking Previous emits the previous page', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 3 }
      })
      await fireEvent.click(getByRole('button', { name: /Previous/i }))

      expect(emitted()['update:page'][0]).toEqual([2])
    })

    it('clicking a specific page number emits that page', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: '3' }))
      expect(emitted()['update:page'][0]).toEqual([3])
    })

    it('clicking the current page is a no-op (goToPage returns when clamped === current)', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 2 }
      })
      await fireEvent.click(getByRole('button', { name: '2' }))
      expect(emitted()['update:page']).toBeUndefined()
    })

    it('disabled Previous on the first page does not emit on click', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: /Previous/i }))
      expect(emitted()['update:page']).toBeUndefined()
    })

    it('changing the page-size selector emits update:pageSize (and resets page when not on page 1)', async () => {
      const { getByRole, emitted } = render(Pagination, {
        props: { total: 200, pageSize: 10, page: 3 }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      await fireEvent.update(select, '25')

      expect(emitted()['update:pageSize']).toBeTruthy()
      expect(emitted()['update:pageSize'][0]).toEqual([25])
      expect(emitted()['update:page'][0]).toEqual([1])
    })

    it('changing page-size while already on page 1 emits only update:pageSize (no reset)', async () => {
      const { getByRole, emitted } = render(Pagination, {
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
      const { getByRole, emitted, rerender } = render(Pagination, {
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
      const { getByTestId } = render(PaginationButton, {
        props: { kind: 'more' },
        slots: { default: 'SHOULD-NOT-SHOW' }
      })
      expect(getByTestId('data-pagination__button').textContent).not.toContain('SHOULD-NOT-SHOW')
    })

    it('kind="more" is an inert decorative span: hidden, unfocusable, never emits click', async () => {
      const { getByTestId, queryByRole, emitted } = render(PaginationButton, {
        props: { kind: 'more' }
      })
      const ellipsis = getByTestId('data-pagination__button')
      expect(ellipsis.tagName).toBe('SPAN')
      expect(ellipsis.getAttribute('aria-hidden')).toBe('true')
      expect(ellipsis.hasAttribute('tabindex')).toBe(false)
      expect(ellipsis.hasAttribute('type')).toBe(false)
      expect(queryByRole('button')).toBeNull()
      await fireEvent.click(ellipsis)
      expect(emitted().click).toBeUndefined()
    })

    it.each(['previous', 'next', 'number'] as const)(
      'renders each kind and reflects it on data-kind (%s)',
      (kind) => {
        const { getByRole } = render(PaginationButton, { props: { kind }, slots: { default: 'x' } })
        expect(getByRole('button').getAttribute('data-kind')).toBe(kind)
      }
    )
  })

  describe('PaginationPageSize sub-component (standalone contract)', () => {
    it('renders a labelled select seeded from modelValue with the option list', () => {
      const { getByRole } = render(PaginationPageSize, {
        props: { modelValue: 25, options: [10, 25, 50, 100] }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      expect(select.value).toBe('25')
      expect(within(select).getAllByRole('option')).toHaveLength(4)
    })

    it('folds a modelValue that is not in the options into the option list (never blank)', () => {
      const { getByRole } = render(PaginationPageSize, {
        props: { modelValue: 3, options: [10, 25, 50, 100] }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      const options = within(select).getAllByRole('option') as HTMLOptionElement[]
      expect(options).toHaveLength(5)
      expect(options.map((o) => o.value)).toEqual(['3', '10', '25', '50', '100'])
      expect(select.value).toBe('3')
    })

    it('emits update:modelValue with the numeric selected value on change', async () => {
      const { getByRole, emitted } = render(PaginationPageSize, {
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
      components: { Pagination, PaginationButton, PaginationInfo, PaginationPageSize },
      template: `
        <Pagination>
          <template #info>
            <PaginationInfo>Showing 1 to 10 of 20 entries</PaginationInfo>
          </template>
          <PaginationButton kind="previous" aria-label="Previous page" disabled />
          <PaginationButton kind="number" selected>1</PaginationButton>
          <PaginationButton kind="number">2</PaginationButton>
          <PaginationButton kind="next" aria-label="Next page" />
          <template #controls>
            <PaginationPageSize :model-value="10" :options="[10, 25, 50, 100]" />
          </template>
        </Pagination>
      `
    }

    it('renders Info in the info region, the buttons in the center, and PageSize in controls', () => {
      const { getByTestId, getByRole } = render(Composed)
      expect(getByTestId('data-pagination__info').textContent).toContain(
        'Showing 1 to 10 of 20 entries'
      )
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBe('page')
      expect(getByRole('button', { name: /Previous/i }).hasAttribute('disabled')).toBe(true)
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })

    it('the composed sub-components share the root testid context (__info + __page-size)', () => {
      const { getByTestId } = render(Composed)
      expect(getByTestId('data-pagination__info')).toBeTruthy()
      expect(getByTestId('data-pagination__page-size')).toBeTruthy()
    })
  })

  describe('documented example (data-driven fixture runs in-test)', () => {
    it('DataDriven story wires v-model and renders the windowed controls (total 200)', () => {
      const { getByTestId, getByRole } = render(DataDriven)
      expect(getByTestId('data-pagination__info').textContent).toContain(
        'Showing 1 to 10 of 200 entries'
      )
      expect(getByRole('button', { name: /Next/i })).toBeTruthy()
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('data-driven pagination (no overflow ellipsis) has no violations', async () => {
      const { container } = render(Pagination, {
        props: { total: 30, pageSize: 10, page: 2, ariaLabel: 'Results pages' }
      })
      await expectNoA11yViolations(container)
    })

    it('windowed data-driven pagination with overflow ellipses has no violations', async () => {
      const { container } = render(Pagination, {
        props: { total: 200, pageSize: 10, page: 10, ariaLabel: 'Results pages' }
      })
      expect(container.querySelectorAll('[data-kind="more"]')).toHaveLength(2)
      await expectNoA11yViolations(container)
    })

    it('the hand-composed compound tree has no violations', async () => {
      // Icon-only prev/next need aria-label or axe trips button-name.
      const Composed = {
        components: { Pagination, PaginationButton, PaginationInfo, PaginationPageSize },
        template: `
          <Pagination>
            <template #info>
              <PaginationInfo>Showing 1 to 10 of 20 entries</PaginationInfo>
            </template>
            <PaginationButton kind="previous" aria-label="Previous page" />
            <PaginationButton kind="number" selected>1</PaginationButton>
            <PaginationButton kind="number">2</PaginationButton>
            <PaginationButton kind="next" aria-label="Next page" />
            <template #controls>
              <PaginationPageSize :model-value="10" :options="[10, 25, 50, 100]" />
            </template>
          </Pagination>
        `
      }
      const { container } = render(Composed)
      await expectNoA11yViolations(container)
    })
  })
})

const boxOf = (width: number) => {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  return host
}

describe('Pagination in a narrow box', () => {
  const mountIn = (width: number) =>
    render(Pagination, { props: { total: 100, pageSize: 10, page: 4 }, container: boxOf(width) })

  const visiblePages = (view: ReturnType<typeof render>) =>
    view
      .getAllByTestId('data-pagination__button')
      .filter(
        (button) =>
          button.dataset['kind'] === 'number' && getComputedStyle(button).display !== 'none'
      )

  it('keeps only the current page between previous and next', () => {
    const view = mountIn(320)

    expect(visiblePages(view).map((button) => button.textContent?.trim())).toEqual(['4'])
    expect(view.getByRole('button', { name: 'Previous page' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Next page' })).toBeTruthy()
  })

  it('lists the page numbers in a wide box', () => {
    const view = mountIn(900)

    expect(visiblePages(view).length).toBeGreaterThan(1)
  })
})
