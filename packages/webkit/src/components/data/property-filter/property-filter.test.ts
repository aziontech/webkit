import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/property-filter/default.vue'
import QueryMode from '../../../../examples/property-filter/query-mode.vue'
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

  describe('query mode', () => {
    const lastText = (emitted: Record<string, unknown[][]>) =>
      emitted['update:text']?.at(-1)?.[0] as string | undefined
    const lastSubmit = (emitted: Record<string, unknown[][]>) =>
      emitted['submit']?.at(-1)?.[1] as { text: string; query: unknown } | undefined
    const queryProps = { properties, mode: 'query' as const }
    const optionText = () => options().map((o) => o.textContent)

    it('suggests a field, then an operator, then a value, then AND or OR', async () => {
      const view = render(PropertyFilter, { props: queryProps })
      const input = view.getByRole('combobox') as HTMLInputElement
      expect(input.getAttribute('aria-label')).toBe('Query')
      await fireEvent.focus(input)
      await fireEvent.update(input, 'sta')
      expect(optionText()).toEqual(['statusStatus'])
      await fireEvent.click(options()[0] as HTMLElement)
      expect(lastText(view.emitted())).toBe('status ')
      expect(input.value).toBe('status ')
      expect(optionText()).toContain('=Equals')
      await fireEvent.click(options().find((o) => o.textContent === '=Equals') as HTMLElement)
      expect(input.value).toBe('status = ')
      expect(optionText()).toEqual(['ActiveValues', 'InactiveValues'])
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      expect(input.getAttribute('aria-activedescendant')).toBe(options()[0]?.id)
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(input.value).toBe('status = Active ')
      expect(optionText()).toEqual(['ANDEvery condition matches', 'ORAny condition matches'])
      await fireEvent.click(options()[0] as HTMLElement)
      expect(input.value).toBe('status = Active AND ')
      expect(optionText()).toContain('requestsRequests')
      expect(view.emitted()['update:query']).toBeUndefined()
    })

    it('replaces only the word at the caret', async () => {
      const view = render(PropertyFilter, { props: queryProps })
      const input = view.getByRole('combobox') as HTMLInputElement
      await fireEvent.focus(input)
      await fireEvent.update(input, 'status = Act AND requests > 10')
      input.setSelectionRange(12, 12)
      await fireEvent.click(input)
      expect(optionText()).toEqual(['ActiveValues', 'InactiveValues'])
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(input.value).toBe('status = Active AND requests > 10')
      await waitFor(() => expect(input.selectionStart).toBe(16))
    })

    it('shows the reason of an invalid query and does not submit it', async () => {
      const view = render(PropertyFilter, { props: queryProps })
      const input = view.getByRole('combobox') as HTMLInputElement
      await fireEvent.update(input, 'stat = Active')
      expect(input.getAttribute('aria-invalid')).toBeNull()
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(view.emitted()['submit']).toBeUndefined()
      expect(input.getAttribute('aria-invalid')).toBe('true')
      const error = view.getByTestId('data-property-filter__error')
      expect(error.textContent).toBe('There is no field named “stat”.')
      expect(input.getAttribute('aria-describedby')).toBe(error.id)
      await fireEvent.update(input, 'status >= Active')
      expect(view.getByTestId('data-property-filter__error').textContent).toBe(
        '“>=” does not apply to status.'
      )
      await fireEvent.update(input, 'status = "Active')
      expect(view.getByTestId('data-property-filter__error').textContent).toBe(
        'Close the quote that opens at character 10.'
      )
      await fireEvent.update(input, 'status = Active')
      expect(view.queryByTestId('data-property-filter__error')).toBeNull()
      expect(input.getAttribute('aria-invalid')).toBeNull()
      expect(input.getAttribute('aria-describedby')).toBeNull()
    })

    it('uses the validate and suggest props in place of the built-in grammar', async () => {
      const view = render(PropertyFilter, {
        props: {
          ...queryProps,
          validate: (text: string) => (text.includes('between') ? '' : 'Use between.'),
          suggest: () => [{ label: 'between (a, b)', insert: 'between', description: 'Range' }]
        }
      })
      const input = view.getByRole('combobox') as HTMLInputElement
      await fireEvent.focus(input)
      await fireEvent.update(input, 'status bet')
      expect(optionText()).toEqual(['between (a, b)Range'])
      await fireEvent.click(options()[0] as HTMLElement)
      expect(input.value).toBe('status between ')
      await fireEvent.keyDown(input, { key: 'Escape' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(lastSubmit(view.emitted())).toEqual({ text: 'status between ', query: null })
      await fireEvent.update(input, 'status')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(view.getByTestId('data-property-filter__error').textContent).toBe('Use between.')
    })

    it('emits submit as (event, payload) when Enter is pressed in the field', async () => {
      const view = render(PropertyFilter, { props: queryProps })
      const input = view.getByRole('combobox') as HTMLInputElement
      input.focus()
      await userEvent.keyboard('status = Active')
      await userEvent.keyboard('{Escape}')
      await userEvent.keyboard('{Enter}')
      const payload = view.emitted()['submit']?.at(-1) as unknown[]
      expect(payload[0]).toBeInstanceOf(KeyboardEvent)
      expect((payload[0] as KeyboardEvent).key).toBe('Enter')
      expect(payload[1]).toEqual({
        text: 'status = Active',
        query: {
          tokens: [{ propertyKey: 'status', operator: '=', value: 'Active' }],
          operation: 'and'
        }
      })
    })

    it('submits the text with its flat query', async () => {
      const view = render(PropertyFilter, { props: queryProps })
      const input = view.getByRole('combobox') as HTMLInputElement
      await fireEvent.update(input, 'status = Active OR requests >= 40 or "edge cache"')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(lastSubmit(view.emitted())).toEqual({
        text: 'status = Active OR requests >= 40 or "edge cache"',
        query: {
          tokens: [
            { propertyKey: 'status', operator: '=', value: 'Active' },
            { propertyKey: 'requests', operator: '>=', value: '40' },
            { operator: ':', value: 'edge cache' }
          ],
          operation: 'or'
        }
      })
      expect(view.emitted()['submit']?.at(-1)?.[0]).toBeInstanceOf(KeyboardEvent)
      await fireEvent.update(input, 'status = Active AND requests > 1 OR edge')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(lastSubmit(view.emitted())?.query).toBeNull()
      await fireEvent.update(input, '')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(lastSubmit(view.emitted())?.query).toEqual({ tokens: [], operation: 'and' })
    })

    it('closes on Escape, then clears, and never removes tokens on Backspace', async () => {
      const view = render(PropertyFilter, {
        props: {
          ...queryProps,
          text: 'status',
          query: { tokens: [{ operator: ':', value: 'x' }], operation: 'and' }
        }
      })
      const input = view.getByRole('combobox') as HTMLInputElement
      expect(view.queryByTestId('data-property-filter__tokens')).toBeNull()
      await fireEvent.focus(input)
      expect(input.getAttribute('aria-expanded')).toBe('true')
      await fireEvent.keyDown(input, { key: 'Escape' })
      expect(input.getAttribute('aria-expanded')).toBe('false')
      await fireEvent.keyDown(input, { key: 'Escape' })
      expect(lastText(view.emitted())).toBe('')
      await fireEvent.keyDown(input, { key: 'Backspace' })
      expect(view.emitted()['update:query']).toBeUndefined()
    })

    it('keeps the provider direction in right-to-left', async () => {
      const view = render({
        components: { PropertyFilter },
        setup() {
          provideLocale({ locale: 'en', dir: 'rtl', catalogs: { en } })
          return { properties }
        },
        template: `<div dir="rtl"><PropertyFilter mode="query" text="stat = x" :properties="properties" :total-count="2" /></div>`
      })
      const input = view.getByRole('combobox') as HTMLInputElement
      await fireEvent.focus(input)
      await fireEvent.update(input, 'sta')
      const listbox = document.body.querySelector('[role="listbox"]') as HTMLElement
      expect(listbox.getAttribute('dir')).toBe('rtl')
      await fireEvent.update(input, 'stat = x')
      await fireEvent.keyDown(input, { key: 'Enter' })
      const error = view.getByTestId('data-property-filter__error')
      const count = view.getByTestId('data-property-filter__count')
      expect(error.compareDocumentPosition(count) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(count.className).toContain('ms-auto')
      expect(input.closest('[dir]')?.getAttribute('dir')).toBe('auto')
    })

    it('has no axe violations with suggestions open and an error shown', async () => {
      const view = render(QueryMode)
      const input = view.getByRole('combobox', { name: 'Query events' }) as HTMLInputElement
      expect(view.getByTestId('data-property-filter__count').textContent).toBe('6 matches')
      await expectNoA11yViolations(view.container)
      await fireEvent.update(input, 'level = Warning')
      await fireEvent.keyDown(input, { key: 'Enter' })
      await waitFor(() =>
        expect(view.getByTestId('data-property-filter__count').textContent).toBe('10 matches')
      )
      await fireEvent.update(input, 'level = ')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(view.getByTestId('data-property-filter__error').textContent).toBe(
        'Add a value after =.'
      )
      await fireEvent.focus(input)
      await fireEvent.update(input, 'level = W')
      await expectNoA11yViolations(view.container)
      const listbox = document.body.querySelector('[role="listbox"]') as HTMLElement
      expect(listbox.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)
      await expectNoA11yViolations(listbox)
    })
  })
})
