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
    expect(view.getByTestId('property-filter__token').textContent).toContain('Status = Active')
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
    expect(view.getByTestId('property-filter__count').textContent).toBe('3 matches')
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

  it('keeps its own tokens and text when no v-model is bound', async () => {
    const view = render(PropertyFilter, { props: { properties } })
    const input = view.getByRole('combobox')
    await fireEvent.update(input, 'edge')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await fireEvent.update(input, 'cdn')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(view.getAllByTestId('property-filter__token')).toHaveLength(2)
    expect(lastQuery(view.emitted())?.tokens).toEqual([
      { operator: ':', value: 'edge' },
      { operator: ':', value: 'cdn' }
    ])

    const query = render(PropertyFilter, { props: { properties, mode: 'query' } })
    const field = query.getAllByRole('combobox').at(-1) as HTMLInputElement
    await fireEvent.update(field, 'status = Active')
    expect(field.value).toBe('status = Active')
    expect(query.emitted()['update:text']?.at(-1)).toEqual(['status = Active'])
  })

  it('sets the query text in the code face of the field, and the token text in the plain one', () => {
    const tokens = render(PropertyFilter, { props: { properties } })
    expect(
      tokens.getByRole('combobox').closest('[data-slot="input"]')?.hasAttribute('data-monospace')
    ).toBe(false)
    tokens.unmount()

    const query = render(PropertyFilter, { props: { properties, mode: 'query' } })
    expect(
      query.getByRole('combobox').closest('[data-slot="input"]')?.hasAttribute('data-monospace')
    ).toBe(true)
  })

  it('adds, removes and submits nothing while disabled', async () => {
    const view = render(PropertyFilter, {
      props: {
        properties,
        disabled: true,
        query: { tokens: [{ operator: ':', value: 'x' }], operation: 'and' }
      }
    })
    const input = view.getByRole('combobox') as HTMLInputElement
    expect(input.disabled).toBe(true)
    await fireEvent.focus(input)
    expect(input.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await fireEvent.keyDown(input, { key: 'Backspace' })
    const remove = view.queryByRole('button', { name: /^Remove/ }) as HTMLButtonElement | null
    if (remove) await fireEvent.click(remove)
    expect(view.emitted()['update:query']).toBeUndefined()
  })

  it('takes the consumer data-testid over the fallback', () => {
    const fallback = render(PropertyFilter, { props: { properties } })
    expect(fallback.getByTestId('property-filter')).toBeTruthy()
    fallback.unmount()
    const view = render(PropertyFilter, { props: { properties }, attrs: { 'data-testid': 'logs' } })
    expect(view.getByTestId('logs')).toBeTruthy()
    expect(view.queryByTestId('property-filter')).toBeNull()
  })

  it('renders at most 100 suggestions and keeps the typed-text row last', async () => {
    const many = [
      {
        key: 'host',
        label: 'Host',
        options: Array.from({ length: 1000 }, (_, i) => ({ value: `host-${i}.example.com` }))
      }
    ]
    const view = render(PropertyFilter, { props: { properties: many } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'example')
    const rows = options()
    expect(rows).toHaveLength(100)
    expect(rows.at(-1)?.getAttribute('data-group')).toBe('text')
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
    expect(view.getByTestId('property-filter__count').textContent).toBe('1 resultado')
  })

  it('narrows a useCollection table', async () => {
    const view = render(WithCollection)
    await waitFor(() => expect(view.getAllByRole('row')).toHaveLength(11))
    const input = view.getByRole('combobox', { name: 'Filter' })
    await fireEvent.update(input, 'Status = Degraded')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() =>
      expect(view.getByTestId('property-filter__count').textContent).toBe('12 matches')
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
      const error = view.getByTestId('property-filter__error')
      expect(error.textContent).toBe('There is no field named “stat”.')
      expect(input.getAttribute('aria-describedby')).toBe(error.id)
      await fireEvent.update(input, 'status >= Active')
      expect(view.getByTestId('property-filter__error').textContent).toBe(
        '“>=” does not apply to status.'
      )
      await fireEvent.update(input, 'status = "Active')
      expect(view.getByTestId('property-filter__error').textContent).toBe(
        'Close the quote that opens at character 10.'
      )
      await fireEvent.update(input, 'status = Active')
      expect(view.queryByTestId('property-filter__error')).toBeNull()
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
      expect(view.getByTestId('property-filter__error').textContent).toBe('Use between.')
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
      expect(view.emitted<unknown[]>()['submit']?.at(-1)?.[0]).toBeInstanceOf(KeyboardEvent)
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
      expect(view.queryByTestId('property-filter__tokens')).toBeNull()
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
      expect(listbox.getAttribute('data-side')).toMatch(/^(bottom|top)$/)
      expect(listbox.getAttribute('data-align')).toBe('start')
      await fireEvent.update(input, 'stat = x')
      await fireEvent.keyDown(input, { key: 'Enter' })
      const error = view.getByTestId('property-filter__error')
      const count = view.getByTestId('property-filter__count')
      expect(error.compareDocumentPosition(count) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(count.className).toContain('ms-auto')
      expect(input.closest('[dir]')?.getAttribute('dir')).toBe('auto')
    })

    it('has no axe violations with suggestions open and an error shown', async () => {
      const view = render(QueryMode)
      const input = view.getByRole('combobox', { name: 'Query events' }) as HTMLInputElement
      expect(view.getByTestId('property-filter__count').textContent).toBe('6 matches')
      await expectNoA11yViolations(view.container)
      await fireEvent.update(input, 'level = Warning')
      await fireEvent.keyDown(input, { key: 'Enter' })
      await waitFor(() =>
        expect(view.getByTestId('property-filter__count').textContent).toBe('10 matches')
      )
      await fireEvent.update(input, 'level = ')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(view.getByTestId('property-filter__error').textContent).toBe('Add a value after =.')
      await fireEvent.focus(input)
      await fireEvent.update(input, 'level = W')
      await expectNoA11yViolations(view.container)
      const listbox = document.body.querySelector('[role="listbox"]') as HTMLElement
      expect(listbox.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)
      await expectNoA11yViolations(listbox)
    })
  })

  type Query = {
    tokens: unknown[]
    operation: string
    groups?: { tokens: unknown[]; operation: string }[]
  }
  const latest = (emitted: Record<string, unknown[][]>) =>
    emitted['update:query']?.at(-1)?.[0] as Query | undefined

  describe('groups, async values, operator groups and value slot (spec v4)', () => {
    it('groups the operator suggestions under named headings', async () => {
      const view = render(PropertyFilter, { props: { properties } })
      const input = view.getByRole('combobox')
      await fireEvent.focus(input)
      await fireEvent.update(input, 'Requests ')
      const listbox = document.body.querySelector('[role="listbox"]') as HTMLElement
      const groups = within(listbox).getAllByRole('group')
      expect(
        groups.map(
          (g) =>
            g.getAttribute('aria-labelledby') &&
            document.getElementById(g.getAttribute('aria-labelledby')!)?.textContent
        )
      ).toEqual(['Equality', 'Comparison'])
      expect(within(groups[1]!).getAllByRole('option')).toHaveLength(4)
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      expect(input.getAttribute('aria-activedescendant')).toBe(options()[2]?.id)
      await expectNoA11yViolations(listbox)
    })

    it('builds groups with their own operation and an Add group action', async () => {
      const view = render(PropertyFilter, { props: { properties, grouped: true } })
      const input = view.getByRole('combobox')
      await fireEvent.update(input, 'Status = Active')
      await fireEvent.keyDown(input, { key: 'Enter' })
      await fireEvent.update(input, 'Status = Inactive')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(latest(view.emitted())).toEqual({
        tokens: [],
        operation: 'and',
        groups: [
          {
            operation: 'or',
            tokens: [
              { propertyKey: 'status', operator: '=', value: 'Active' },
              { propertyKey: 'status', operator: '=', value: 'Inactive' }
            ]
          }
        ]
      })
      await fireEvent.click(view.getByRole('button', { name: 'Add group' }))
      expect(view.getByTestId('property-filter__pending-group').textContent).toContain('New group')
      await fireEvent.update(input, 'Requests > 10')
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(latest(view.emitted())?.groups).toHaveLength(2)
      expect(view.getAllByTestId('property-filter__group')).toHaveLength(2)
      expect(view.getByRole('group', { name: 'Filter group 2' })).toBeTruthy()

      const groupToggle = view.getByRole('radiogroup', { name: 'Combine filters in group 1' })
      await fireEvent.click(within(groupToggle).getByRole('radio', { name: 'Match all' }))
      expect(latest(view.emitted())?.groups?.[0]?.operation).toBe('and')

      await fireEvent.keyDown(input, { key: 'Backspace' })
      expect(latest(view.emitted())?.groups).toHaveLength(1)
      await expectNoA11yViolations(view.container)
    })

    it('loads values for the typed text, shows counts, and drops stale answers', async () => {
      const calls: {
        text: string
        resolve: (v: { value: string; label?: string; count?: number }[]) => void
      }[] = []
      const loadValues = (_property: unknown, text: string) =>
        new Promise<{ value: string; label?: string; count?: number }[]>((resolve) => {
          calls.push({ text, resolve })
        })
      const view = render(PropertyFilter, {
        props: { properties: [{ key: 'host', label: 'Host' }], loadValues }
      })
      const input = view.getByRole('combobox')
      await fireEvent.focus(input)
      await fireEvent.update(input, 'Host = a')
      await nextTick()
      expect(document.body.querySelector('[data-testid="property-filter__loading"]')).not.toBeNull()
      expect(document.body.querySelector('[role="listbox"]')?.getAttribute('aria-busy')).toBe(
        'true'
      )
      await fireEvent.update(input, 'Host = ap')
      await nextTick()
      calls[1]!.resolve([{ value: 'api.example.com', label: 'API', count: 1200 }])
      calls[0]!.resolve([{ value: 'stale.example.com' }])
      await waitFor(() =>
        expect(document.body.querySelector('[data-testid="property-filter__loading"]')).toBeNull()
      )
      expect(calls.map((c) => c.text)).toEqual(['a', 'ap'])
      const texts = options().map((o) => o.textContent ?? '')
      expect(texts[0]).toContain('Host = API')
      expect(texts[0]).toContain('1,200')
      expect(texts.some((t) => t.includes('stale'))).toBe(false)
      await fireEvent.click(options()[0]!)
      expect(lastQuery(view.emitted())?.tokens).toEqual([
        { propertyKey: 'host', operator: '=', value: 'api.example.com' }
      ])
      expect(view.getByTestId('property-filter__token').textContent).toContain('Host = API')
    })

    it('shows an error row when loading values fails', async () => {
      const view = render(PropertyFilter, {
        props: {
          properties: [{ key: 'host', label: 'Host' }],
          loadValues: () => Promise.reject(new Error('down'))
        }
      })
      const input = view.getByRole('combobox')
      await fireEvent.focus(input)
      await fireEvent.update(input, 'Host = x')
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-testid="property-filter__values-error"]')?.textContent
        ).toContain('Could not load values')
      )
    })

    it('renders the value slot for a customValue property and applies its value', async () => {
      const view = render(PropertyFilter, {
        props: {
          properties: [
            { key: 'created', label: 'Created', type: 'date' as const, customValue: true }
          ]
        },
        slots: {
          value: `<template #value="{ property, operator, apply }">
          <button type="button" @click="apply('2026-01-15')">Pick {{ property.label }} {{ operator }}</button>
        </template>`
        }
      })
      const input = view.getByRole('combobox')
      expect(view.queryByTestId('property-filter__value-editor')).toBeNull()
      await fireEvent.update(input, 'Created > ')
      const editor = view.getByRole('group', { name: 'Value of Created' })
      await fireEvent.click(within(editor).getByRole('button', { name: 'Pick Created >' }))
      expect(lastQuery(view.emitted())?.tokens).toEqual([
        { propertyKey: 'created', operator: '>', value: '2026-01-15' }
      ])
      expect(view.queryByTestId('property-filter__value-editor')).toBeNull()
    })
  })

  describe('showOperations', () => {
    const query = {
      operation: 'and' as const,
      tokens: [
        { propertyKey: 'status', operator: '=' as const, value: 'Active' },
        { propertyKey: 'region', operator: '=' as const, value: 'us-east' }
      ]
    }
    const properties = [
      { key: 'status', label: 'Status' },
      { key: 'region', label: 'Region' }
    ]

    it('offers the Match all / Match any toggle by default and hides it with showOperations false', () => {
      const shown = render(PropertyFilter, { props: { properties, query } })
      expect(shown.getByTestId('property-filter__operation')).toBeTruthy()
      shown.unmount()
      const hidden = render(PropertyFilter, { props: { properties, query, showOperations: false } })
      expect(hidden.queryByTestId('property-filter__operation')).toBeNull()
      expect(hidden.getByTestId('property-filter').textContent).toContain('us-east')
    })
  })
})
