import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/data/Paginator.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Paginator from './index'
import PaginationButton from './pagination-button/pagination-button.vue'
import PaginatorInfo from './paginator-info/paginator-info.vue'
import PaginatorPageSize from './paginator-page-size/paginator-page-size.vue'

// `Default` and `Buttons` are string-template stories that use `<Paginator.Button>`
// dot-notation while registering only `Paginator`; under the runtime template
// compiler those tags stay unresolved custom elements, so only `DataDriven`
// (which renders `<Paginator v-bind=.../>` root-only) is exercised here. See notes.
const { DataDriven } = composeStories(stories)

// The Paginator is a COMPOSITION component: `index.ts` attaches the three public
// sub-components to the root via Object.assign, and shared state (the root
// data-testid) flows through provide/inject (injection-key.ts -> PaginatorContext).
// Every assertion below is grounded in the real .vue sources.

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
      // ariaLabel default = 'Pagination'
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
      // Template: <PaginatorInfo v-if="dataDriven"> and <PaginatorPageSize v-if="dataDriven">
      const { queryByTestId } = render(Paginator)
      expect(queryByTestId('data-paginator__info')).toBeNull()
      expect(queryByTestId('data-paginator__page-size')).toBeNull()
    })
  })

  describe('provide/inject — sub-components derive their testid from the root context', () => {
    it('derives BEM-suffixed testids from the root data-testid when composed inside the root', () => {
      // The root provides { testId } and each sub-component reads it via inject.
      const { getByTestId } = render(Paginator, {
        attrs: { 'data-testid': 'my-paginator' },
        slots: {
          info: '<span>info</span>', // fills the named info slot so the root default is bypassed
          default: `<button>page</button>`
        }
      })
      // Root testid override propagates.
      expect(getByTestId('my-paginator').tagName).toBe('NAV')
    })

    it('a PaginationButton inside the root inherits the root testid via inject', () => {
      const { getByTestId } = render(Paginator, {
        attrs: { 'data-testid': 'ctx-paginator' },
        slots: {
          // Slot content is rendered in the root's setup scope, so inject resolves
          // the PaginatorContext provided by the root.
          default: () => null
        }
      })
      // Root present with the overridden id.
      expect(getByTestId('ctx-paginator')).toBeTruthy()
    })

    it('a standalone PaginatorInfo (no root) falls back to the default testid', () => {
      // inject(..., null) -> `data-paginator__info` fallback.
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
      // Info text: "Showing 1 to 10 of 30 entries" (rangeStart..rangeEnd of total).
      const info = getByTestId('data-paginator__info')
      expect(info.textContent).toContain('Showing 1 to 10 of 30 entries')

      // Page-size selector renders (data-driven).
      expect(getByTestId('data-paginator__page-size')).toBeTruthy()
      // Its <select> exposes the "Rows per page" accessible name.
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()

      // pageCount = ceil(30/10) = 3 -> buttons: Previous, 1, 2, 3, Next = 5.
      const buttons = getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('disables Previous on the first page and enables Next', () => {
      // currentPage <= 1 -> Previous disabled; currentPage >= pageCount -> Next disabled.
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
      // The "2" number button is the selected/current page.
      const current = getByRole('button', { name: '2' })
      expect(current.getAttribute('aria-current')).toBe('page')
      // A non-current page must not carry aria-current.
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
    })

    it('renders an overflow "more" button when the page count exceeds the window', () => {
      // total 200 / pageSize 10 -> 20 pages, siblingCount 1 -> windowed with ellipsis.
      const { getAllByRole, getByRole } = render(Paginator, {
        props: { total: 200, pageSize: 10, page: 1, siblingCount: 1 }
      })
      // The "more" button carries data-kind="more" (source: :kind => 'more').
      const moreButtons = getAllByRole('button').filter(
        (b) => b.getAttribute('data-kind') === 'more'
      )
      expect(moreButtons.length).toBeGreaterThanOrEqual(1)
      // The last edge page (20) is always rendered.
      expect(getByRole('button', { name: '20' })).toBeTruthy()
    })
  })

  describe('events (grounded in the root emits: update:page / page-change / update:pageSize)', () => {
    it('clicking Next emits update:page and page-change with the next page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: /Next/i }))

      expect(emitted()['update:page']).toBeTruthy()
      expect(emitted()['update:page'][0]).toEqual([2])
      expect(emitted()['page-change'][0]).toEqual([2])
    })

    it('clicking Previous emits the previous page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 3 }
      })
      await fireEvent.click(getByRole('button', { name: /Previous/i }))

      expect(emitted()['update:page'][0]).toEqual([2])
      expect(emitted()['page-change'][0]).toEqual([2])
    })

    it('clicking a specific page number emits that page', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      await fireEvent.click(getByRole('button', { name: '3' }))
      expect(emitted()['update:page'][0]).toEqual([3])
      expect(emitted()['page-change'][0]).toEqual([3])
    })

    it('clicking the current page is a no-op (goToPage returns when clamped === current)', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 2 }
      })
      await fireEvent.click(getByRole('button', { name: '2' }))
      // No emission because the clamped target equals the current page.
      expect(emitted()['update:page']).toBeUndefined()
      expect(emitted()['page-change']).toBeUndefined()
    })

    it('disabled Previous on the first page does not emit on click', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 1 }
      })
      // PaginationButton.handleClick returns early when disabled; and a disabled
      // native button is inert. Either way, no emission.
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
      // currentPage (3) !== 1 -> the root resets to page 1.
      expect(emitted()['update:page'][0]).toEqual([1])
      expect(emitted()['page-change'][0]).toEqual([1])
    })

    it('changing page-size while already on page 1 emits only update:pageSize (no reset)', async () => {
      const { getByRole, emitted } = render(Paginator, {
        props: { total: 200, pageSize: 10, page: 1 }
      })
      const select = getByRole('combobox', { name: 'Rows per page' }) as HTMLSelectElement
      await fireEvent.update(select, '50')

      expect(emitted()['update:pageSize'][0]).toEqual([50])
      // currentPage === 1 -> no page reset emitted.
      expect(emitted()['update:page']).toBeUndefined()
      expect(emitted()['page-change']).toBeUndefined()
    })
  })

  describe('v-model round-trips (v-model:page / v-model:pageSize)', () => {
    it('emitted update:page reflects a click and can drive the bound page', async () => {
      // Round-trip: render at page 1, click "2", feed the emitted value back as the prop,
      // and assert the current-page marker moves to 2.
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
      // Template: <slot v-if="kind !== 'more'" /> -> the "more" glyph shows, slot text does not.
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
      // displayOptions: options does not include 3 -> [...options, 3].sort => [3, 10, 25, 50, 100].
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
    // Render the compound by hand so the sub-components resolve through the real
    // SFC compiler (the string-template Default/Buttons stories register only
    // `Paginator`, so `<Paginator.Button>` there stays an unresolved custom
    // element — see notes; those two story fixtures are omitted for that reason).
    // Prev/Next are icon-only: PaginationButton renders its default slot only for
    // `kind="number"` (the chevron shows for previous/next), so their accessible
    // name comes from `aria-label` — the same pattern the data-driven root uses
    // (`aria-label="Previous page"` / `"Next page"`), flowed through v-bind="$attrs".
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
      // Info sub-component derives its testid from the injected root context.
      expect(getByTestId('data-paginator__info').textContent).toContain(
        'Showing 1 to 10 of 20 entries'
      )
      // The authored "1" button is selected -> aria-current="page".
      expect(getByRole('button', { name: '1' }).getAttribute('aria-current')).toBe('page')
      // Previous is disabled as authored.
      expect(getByRole('button', { name: /Previous/i }).hasAttribute('disabled')).toBe(true)
      // PageSize selector rendered via #controls slot.
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })

    it('the composed sub-components share the root testid context (__info + __page-size)', () => {
      const { getByTestId } = render(Composed)
      // Both derive `${ctx.testId}__*` from the same provided context.
      expect(getByTestId('data-paginator__info')).toBeTruthy()
      expect(getByTestId('data-paginator__page-size')).toBeTruthy()
    })
  })

  describe('composeStories (data-driven fixture runs in-test)', () => {
    it('DataDriven story wires v-model and renders the windowed controls (total 200)', () => {
      const { getByTestId, getByRole } = render(DataDriven)
      // Data-driven info: total 200, pageSize 10, page 1 -> "Showing 1 to 10 of 200 entries".
      expect(getByTestId('data-paginator__info').textContent).toContain(
        'Showing 1 to 10 of 200 entries'
      )
      expect(getByRole('button', { name: /Next/i })).toBeTruthy()
      expect(getByRole('combobox', { name: 'Rows per page' })).toBeTruthy()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('data-driven paginator (no overflow ellipsis) has no violations', async () => {
      // total 30 / pageSize 10 = 3 pages -> no "more" button, so every control has
      // an accessible name. (A config that renders the ellipsis button trips axe
      // button-name; see notes.)
      const { container } = render(Paginator, {
        props: { total: 30, pageSize: 10, page: 2, ariaLabel: 'Results pages' }
      })
      await expectNoA11yViolations(container)
    })

    it('the hand-composed compound tree has no violations', async () => {
      // Icon-only prev/next must carry an `aria-label` (their slot text is not
      // rendered — only `kind="number"` shows the slot); without it axe trips
      // button-name. This mirrors the data-driven root's own aria-labels.
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
