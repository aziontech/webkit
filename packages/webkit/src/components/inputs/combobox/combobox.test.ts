import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import Default from '../../../../examples/combobox/default.vue'
import Grouped from '../../../../examples/combobox/grouped.vue'
import Server from '../../../../examples/combobox/server.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Field from '../field'
import Combobox from './combobox.vue'

const options = [
  { value: 'API_URL', description: 'Suggested' },
  { value: 'API_TOKEN' },
  { value: 'NODE_ENV', disabled: true },
  { value: 'LOG_LEVEL', label: 'Log level' }
]

const optionEls = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]')).filter(
    (el) => !el.closest('[style*="display: none"]')
  )

const lastValue = (emitted: Record<string, unknown[][]>) =>
  emitted['update:modelValue']?.at(-1)?.[0] as string | undefined

describe('Combobox', () => {
  it('wires the ARIA 1.2 combobox pattern and opens on focus', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.focus(input)
    expect(input.getAttribute('aria-expanded')).toBe('true')
    const listbox = document.getElementById(input.getAttribute('aria-controls') ?? '')
    expect(listbox?.getAttribute('role')).toBe('listbox')
    expect(optionEls()).toHaveLength(4)
    expect(view.getByTestId('combobox').getAttribute('data-state')).toBe('open')
    view.unmount()
  })

  it('filters by value and label, accent and case insensitive, and announces the count', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'lóg')
    expect(optionEls().map((el) => el.textContent?.trim())).toEqual(['Log level', 'Use "lóg"'])
    expect(view.getByTestId('combobox__status').textContent).toBe('2 options')
    expect(view.emitted()['search']?.at(-1)).toEqual(['lóg'])
    view.unmount()
  })

  it('moves the highlight with arrows, skips disabled options and commits with Enter', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0]?.id)
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[3]?.id)
    await fireEvent.keyDown(input, { key: 'Home' })
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0]?.id)
    await fireEvent.keyDown(input, { key: 'End' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(lastValue(view.emitted())).toBe('LOG_LEVEL')
    expect((input as HTMLInputElement).value).toBe('Log level')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    view.unmount()
  })

  it('accepts a custom value and emits create', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'FEATURE_FLAG ')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(lastValue(view.emitted())).toBe('FEATURE_FLAG')
    expect(view.emitted()['create']?.[0]).toEqual(['FEATURE_FLAG'])
    view.unmount()
  })

  it('commits an exact match typed in another case to the option value', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.update(input, 'api_url')
    await fireEvent.blur(input)
    expect(lastValue(view.emitted())).toBe('API_URL')
    expect(view.emitted()['create']).toBeUndefined()
    view.unmount()
  })

  it('restores the last value when custom entry is off and nothing matches', async () => {
    const view = render(Combobox, {
      props: { options, ariaLabel: 'Variable', modelValue: 'API_URL', allowCustom: false }
    })
    const input = view.getByRole('combobox') as HTMLInputElement
    await fireEvent.focus(input)
    await fireEvent.update(input, 'nothing')
    expect(optionEls()).toHaveLength(0)
    expect(view.getByTestId('combobox__empty').textContent?.trim()).toBe('No matches')
    await fireEvent.keyDown(input, { key: 'Tab' })
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    expect(input.value).toBe('API_URL')
    view.unmount()
  })

  it('Escape closes the list, then restores the typed text', async () => {
    const view = render(Combobox, {
      props: { options, ariaLabel: 'Variable', modelValue: 'API_URL' }
    })
    const input = view.getByRole('combobox') as HTMLInputElement
    await fireEvent.focus(input)
    await fireEvent.update(input, 'API')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.getAttribute('aria-expanded')).toBe('false')
    expect(input.value).toBe('API')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('API_URL')
    view.unmount()
  })

  it('picks an option with the pointer and ignores disabled options', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable' } })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    const disabled = optionEls()[2] as HTMLElement
    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    await fireEvent.click(disabled)
    expect(view.emitted()['update:modelValue']).toBeUndefined()
    await fireEvent.click(optionEls()[1] as HTMLElement)
    expect(lastValue(view.emitted())).toBe('API_TOKEN')
    view.unmount()
  })

  it('renders groups as named listbox groups', async () => {
    const view = render(Combobox, {
      props: {
        ariaLabel: 'Header',
        options: [
          { value: 'a', group: 'Recent' },
          { value: 'b', group: 'Standard' },
          { value: 'c', group: 'Standard' }
        ]
      }
    })
    await fireEvent.focus(view.getByRole('combobox'))
    const groups = Array.from(document.body.querySelectorAll<HTMLElement>('[role="group"]'))
    expect(groups).toHaveLength(2)
    const title = document.getElementById(groups[1]?.getAttribute('aria-labelledby') ?? '')
    expect(title?.textContent).toBe('Standard')
    expect(groups[1]?.querySelectorAll('[role="option"]')).toHaveLength(2)
    view.unmount()
  })

  it('shows the loading row and spinner, and clears the value', async () => {
    const view = render(Combobox, {
      props: { options: [], ariaLabel: 'Region', loading: true, clearable: true, modelValue: 'x' }
    })
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    expect(view.getByTestId('combobox__spinner')).toBeTruthy()
    expect(view.getByTestId('combobox__loading').textContent?.trim()).toBe('Loading options')
    expect(view.getByRole('listbox', { hidden: true }).getAttribute('aria-busy')).toBe('true')
    await fireEvent.click(view.getByRole('button', { name: 'Clear' }))
    expect(lastValue(view.emitted())).toBe('')
    expect(document.activeElement).toBe(input)
    view.unmount()
  })

  it('takes id, describedby, invalid and required from Field', async () => {
    const Host = defineComponent({
      components: { Combobox, Field, FieldLabel: Field.Label, FieldError: Field.Error },
      setup: () => ({ value: ref('') }),
      template: `
        <Field required invalid>
          <FieldLabel>Name</FieldLabel>
          <Combobox v-model="value" :options="[{ value: 'one' }]" />
          <FieldError>Required.</FieldError>
        </Field>`
    })
    const view = render(Host)
    const input = view.getByRole('combobox', { name: /^Name/ })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-required')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBeTruthy()
    expect(view.getByTestId('combobox').hasAttribute('data-invalid')).toBe(true)
    await expectNoA11yViolations(view.container)
    view.unmount()
  })

  it('does not open when disabled or read-only', async () => {
    const view = render(Combobox, { props: { options, ariaLabel: 'Variable', readonly: true } })
    await fireEvent.focus(view.getByRole('combobox'))
    expect(view.getByRole('combobox').getAttribute('aria-expanded')).toBe('false')
    view.unmount()
  })

  it('keeps vertical keys under dir="rtl" and renders the list mirrored', async () => {
    const view = render(
      defineComponent({
        components: { Combobox },
        setup: () => ({ options }),
        template: '<div dir="rtl"><Combobox :options="options" aria-label="Variable" /></div>'
      })
    )
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[0]?.id)
    view.unmount()
  })

  it.each([
    ['Default', Default],
    ['Grouped', Grouped],
    ['Server', Server]
  ])('renders the %s example without axe violations, open and closed', async (_, Example) => {
    const view = render(Example)
    await expectNoA11yViolations(view.container)
    const input = view.getByRole('combobox')
    await fireEvent.focus(input)
    await nextTick()
    await expectNoA11yViolations(view.container)
    const listbox = document.getElementById(input.getAttribute('aria-controls') ?? '')
    await expectNoA11yViolations(listbox as HTMLElement)
    view.unmount()
  })
})
