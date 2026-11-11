import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/property-filter/default.vue'
import WithCollection from '../../../../examples/property-filter/with-collection.vue'
import { en, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import PropertyFilter from './property-filter.vue'

const properties = [
  { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
  { key: 'requests', label: 'Requests', type: 'number' as const }
]

const options = () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))

const lastQuery = (emitted: Record<string, unknown[][]>) =>
  emitted['update:query']?.at(-1)?.[0] as { tokens: unknown[]; operation: string } | undefined

describe('PropertyFilter', () => {
  it('suggests properties, then operators, then values, and commits a token', async () => {
    const view = render(PropertyFilter, { props: { properties } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'Sta')
    expect(options().map((o) => o.textContent)).toContain('StatusProperties')
    await fireEvent.click(options()[0] as HTMLElement)
    expect((input as HTMLInputElement).value).toBe('Status ')
    expect(options().some((o) => o.textContent?.includes('Status !='))).toBe(true)
    await fireEvent.update(input, 'Status = ')
    await nextTick()
    expect(options().map((o) => o.textContent)).toEqual([
      'Status = ActiveValues',
      'Status = InactiveValues'
    ])
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.getAttribute('aria-activedescendant')).toBe(options()[0]?.id)
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(lastQuery(view.emitted())).toEqual({
      tokens: [{ propertyKey: 'status', operator: '=', value: 'Active' }],
      operation: 'and'
    })
    expect(view.getByTestId('data-property-filter__token').textContent).toContain('Status = Active')
  })

  it('commits typed text, a typed property value, and free text on Enter', async () => {
    const view = render(PropertyFilter, { props: { properties } })
    const input = view.getByRole('combobox')
    await fireEvent.update(input, 'Requests >= 40')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await fireEvent.update(input, 'edge')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(lastQuery(view.emitted())?.tokens).toEqual([
      { propertyKey: 'requests', operator: '>=', value: '40' },
      { operator: ':', value: 'edge' }
    ])
  })

  it('does not take free text when freeText is off', async () => {
    const view = render(PropertyFilter, { props: { properties, freeText: false } })
    const input = view.getByRole('combobox')
    await fireEvent.update(input, 'edge')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(view.emitted()['update:query']).toBeUndefined()
  })

  it('removes a token, switches and / or, and clears every token', async () => {
    const view = render(PropertyFilter, {
      props: {
        properties,
        totalCount: 3,
        query: {
          tokens: [
            { propertyKey: 'status', operator: '=', value: 'Active' },
            { propertyKey: 'requests', operator: '>', value: '10' }
          ],
          operation: 'and'
        }
      }
    })
    expect(view.getByTestId('data-property-filter__count').textContent).toBe('3 matches')
    const group = view.getByRole('group', { name: 'Applied filters' })
    expect(within(group).getAllByText('and')).toHaveLength(1)
    await fireEvent.click(view.getByRole('radio', { name: 'Match any' }))
    expect(lastQuery(view.emitted())?.operation).toBe('or')
    await fireEvent.click(view.getByRole('button', { name: 'Remove Status = Active' }))
    expect(lastQuery(view.emitted())?.tokens).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Clear filters' }))
    expect(lastQuery(view.emitted())?.tokens).toEqual([])
  })

  it('closes the suggestions on Escape and removes the last token on Backspace', async () => {
    const view = render(PropertyFilter, {
      props: {
        properties,
        query: { tokens: [{ operator: ':', value: 'x' }], operation: 'and' }
      }
    })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    expect(input.getAttribute('aria-expanded')).toBe('true')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.keyDown(input, { key: 'Backspace' })
    expect(lastQuery(view.emitted())?.tokens).toEqual([])
  })

  it('reads its strings from the active locale', async () => {
    const view = render({
      components: { PropertyFilter },
      setup() {
        provideLocale({ locale: 'pt-BR', catalogs: { en, ...LOCALES } })
        return { properties }
      },
      template: `<PropertyFilter :properties="properties" :total-count="1" :query="{ tokens: [{ operator: ':', value: 'x' }], operation: 'and' }" />`
    })
    expect(view.getByRole('combobox').getAttribute('placeholder')).toBe(
      'Filtrar por propriedade ou texto'
    )
    expect(view.getByTestId('data-property-filter__count').textContent).toBe('1 resultado')
  })

  it('narrows a useCollection table', async () => {
    const view = render(WithCollection)
    await waitFor(() => expect(view.getAllByRole('row')).toHaveLength(11))
    const input = view.getByRole('combobox', { name: 'Filter' })
    await fireEvent.update(input, 'Status = Degraded')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() =>
      expect(view.getByTestId('data-property-filter__count').textContent).toBe('12 matches')
    )
  })

  it('has no axe violations, open or closed', async () => {
    const view = render(Default)
    await expectNoA11yViolations(view.container)
    await fireEvent.focus(view.getByRole('combobox'))
    await fireEvent.update(view.getByRole('combobox'), 'Reg')
    await expectNoA11yViolations(view.container)
    const listbox = document.body.querySelector('[role="listbox"]') as HTMLElement
    expect(listbox.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)
    await expectNoA11yViolations(listbox)
  })
})
