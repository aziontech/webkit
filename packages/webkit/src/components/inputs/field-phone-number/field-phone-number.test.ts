import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-phone-number/FieldPhoneNumber.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import { defaultCountries, OTHER_COUNTRY_CODE } from './countries'
import FieldPhoneNumber, { type PhoneNumber } from './field-phone-number.vue'

const { Default, Countries, Invalid, Disabled, Readonly } = composeStories(stories)

/** The dial-code dropdown Teleports to document.body — query it from there. */
const getContent = () =>
  document.body.querySelector('[data-testid="select-content"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[data-testid="select-option"]')) as HTMLElement[]

const lastPhone = (emitted: Record<string, unknown[]>) => {
  const events = emitted['update:phone'] as PhoneNumber[][]
  return events[events.length - 1][0]
}

afterEach(() => {
  // Teleported content can outlive a wrapper unmounted mid-transition; remove
  // strays so document.body queries stay deterministic across tests.
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
})

describe('FieldPhoneNumber', () => {
  describe('data-testid', () => {
    it('renders the root fallback testid and the composed parts', () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', helperText: 'Helper' }
      })

      expect(getByTestId('input-field-phone-number')).toBeTruthy()
      expect(getByTestId('input-field-phone-number__label')).toBeTruthy()
      expect(getByTestId('input-field-phone-number__group')).toBeTruthy()
      expect(getByTestId('input-field-phone-number__country')).toBeTruthy()
      expect(getByTestId('input-field-phone-number__helper')).toBeTruthy()
    })

    it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', helperText: 'Helper' },
        attrs: { 'data-testid': 'my-phone' }
      })

      expect(getByTestId('my-phone')).toBeTruthy()
      expect(getByTestId('my-phone__label')).toBeTruthy()
      expect(getByTestId('my-phone__group')).toBeTruthy()
      expect(getByTestId('my-phone__country')).toBeTruthy()
      expect(getByTestId('my-phone__helper')).toBeTruthy()
    })
  })

  describe('internal input semantics', () => {
    it('renders a tel input with inputmode and autocomplete for national numbers', () => {
      const { getByRole } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('tel')
      expect(input.getAttribute('inputmode')).toBe('tel')
      expect(input.getAttribute('autocomplete')).toBe('tel-national')
    })

    it("falls back to the selected country's mask as placeholder (BR default)", () => {
      const { getByRole } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(99) 99999-9999')
    })

    it('prefers an explicit placeholder over the mask', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', placeholder: 'Your number' }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('Your number')
    })

    it('falls back to the first country when the country code is unknown', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: 'QQ' }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(99) 99999-9999')
    })

    it('honors a consumer-provided countries list', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: {
          label: 'Phone',
          country: 'XX',
          countries: [{ code: 'XX', dialCode: '+99', mask: '###-###', label: 'Testland' }]
        }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('999-999')
    })
  })

  describe('mask display (modelValue -> formatted value)', () => {
    it('renders the BR mask over the bound digits', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '11999999999', country: 'BR' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(11) 99999-9999')
    })

    it('formats a BR landline with the 10-digit mask', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '1133334444', country: 'BR' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(11) 3333-4444')
    })

    it('honors a consumer country with several masks', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: {
          label: 'Phone',
          country: 'XX',
          modelValue: '12345',
          countries: [
            { code: 'XX', dialCode: '+99', mask: ['##-###', '###-####'], label: 'Testland' }
          ]
        }
      })
      const input = getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('12-345')
      expect(input.getAttribute('placeholder')).toBe('999-9999')
    })

    it('renders the US mask over the bound digits', () => {
      const { getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '5555550123', country: 'US' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(555) 555-0123')
    })
  })

  describe('update:modelValue — digits only', () => {
    it('emits stripped digits and rewrites the input to the masked value', async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      const input = getByRole('textbox') as HTMLInputElement

      await fireEvent.update(input, '(11) 9abc')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual(['119'])
      expect(input.value).toBe('(11) 9')
    })

    it("truncates typed digits to the mask's capacity", async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.update(getByRole('textbox'), '119999999990000')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events[0]).toEqual(['11999999999'])
    })

    it('clears non-digit input without emitting an unchanged value', async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      const input = getByRole('textbox') as HTMLInputElement

      await fireEvent.update(input, 'abc')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('')
    })

    it('switches a BR number from the landline to the mobile mask as it grows', async () => {
      const { getByRole } = render(Default)
      const input = getByRole('textbox') as HTMLInputElement

      await fireEvent.update(input, '1199998888')
      expect(input.value).toBe('(11) 9999-8888')

      await fireEvent.update(input, '11999998888')
      expect(input.value).toBe('(11) 99999-8888')
    })
  })

  describe('dial-code select', () => {
    it('names the country combobox itself, not the roleless wrapper', () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      expect(getByTestId('select-trigger').getAttribute('aria-label')).toBe('Country dial code')
      expect(getByTestId('input-field-phone-number__country').getAttribute('aria-label')).toBeNull()
    })

    it("shows the selected country's dial code in the trigger", () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+55')
    })

    it("shows the picked country's dial code, not its ISO code", () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: 'US' }
      })
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+1')
    })

    it('opens the Teleported listbox with one option per country', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      expect(getContent()).toBeNull()
      await fireEvent.click(getByTestId('select-trigger'))

      const content = getContent()
      expect(content).not.toBeNull()
      expect(content?.querySelector('[role="listbox"]')).not.toBeNull()

      const options = getOptions()
      expect(options).toHaveLength(defaultCountries.length)
      expect(options[1].textContent?.trim()).toBe('+1 United States')
    })

    it('emits update:country and re-emits truncated digits when a country is picked', async () => {
      const { getByTestId, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '11999999999', country: 'BR' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      // defaultCountries[1] is US (mask capacity 10 digits).
      await fireEvent.click(getOptions()[1])

      expect(emitted()['update:country']).toEqual([['US']])
      const modelEvents = emitted()['update:modelValue'] as string[][]
      expect(modelEvents[modelEvents.length - 1]).toEqual(['1199999999'])
      // single-select closes on pick
      expect(getContent()).toBeNull()
    })

    it('applies the new mask after the country v-model round-trips (Default story)', async () => {
      const { getByTestId, getByRole } = render(Default)

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.click(getOptions()[1]) // US

      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(999) 999-9999')
    })

    it('disables the trigger and keeps the dropdown closed when disabled', async () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true }
      })

      const trigger = getByTestId('select-trigger') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)

      await fireEvent.click(trigger)
      expect(getContent()).toBeNull()
    })

    it('disables the trigger while readonly (dial code cannot change)', async () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', readonly: true }
      })

      const trigger = getByTestId('select-trigger') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)

      await fireEvent.click(trigger)
      expect(getContent()).toBeNull()
    })
  })

  describe('update:phone — full number and completeness', () => {
    it('reports the initial state on mount', () => {
      const { emitted } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      expect(emitted()['update:phone']).toEqual([
        [{ country: 'BR', dialCode: '+55', digits: '', number: '', complete: false }]
      ])
    })

    it('reports a pre-filled number as complete with its dial code', () => {
      const { emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '5555550123', country: 'US' }
      })

      expect(lastPhone(emitted())).toEqual({
        country: 'US',
        dialCode: '+1',
        digits: '5555550123',
        number: '+15555550123',
        complete: true
      })
    })

    it('accepts both BR lengths as complete and rejects anything in between', async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      const input = getByRole('textbox')

      await fireEvent.update(input, '119999888')
      expect(lastPhone(emitted())).toMatchObject({ digits: '119999888', complete: false })

      await fireEvent.update(input, '1133334444')
      expect(lastPhone(emitted())).toMatchObject({ number: '+551133334444', complete: true })

      await fireEvent.update(input, '11999998888')
      expect(lastPhone(emitted())).toMatchObject({ number: '+5511999998888', complete: true })
    })

    it('reports the new country after a pick', async () => {
      const { getByTestId, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '11999999999' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.click(getOptions()[1])

      expect(lastPhone(emitted())).toEqual({
        country: 'US',
        dialCode: '+1',
        digits: '1199999999',
        number: '+11199999999',
        complete: true
      })
    })
  })

  describe('countries', () => {
    it('ships Other as the last option', () => {
      const other = defaultCountries[defaultCountries.length - 1]
      expect(other.code).toBe(OTHER_COUNTRY_CODE)
      expect(other.dialCode).toBe('+')
    })

    it('takes the country code and number together under Other', async () => {
      const { getByRole, getByTestId, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: OTHER_COUNTRY_CODE }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+')

      await fireEvent.update(input, '81312345678')
      expect(input.value).toBe('81312345678')
      expect(lastPhone(emitted())).toMatchObject({ number: '+81312345678', complete: true })

      await fireEvent.update(input, '123456')
      expect(lastPhone(emitted())).toMatchObject({ complete: false })

      await fireEvent.update(input, '1234567890123456789')
      expect(lastPhone(emitted())).toMatchObject({ digits: '123456789012345', complete: true })
    })

    it('changes country without a v-model:country binding', async () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.click(getOptions()[1])

      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+1')
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(999) 999-9999')
    })
  })

  describe('dial-code search', () => {
    const getSearch = () =>
      document.body.querySelector(
        '[data-testid="input-field-phone-number__search"]'
      ) as HTMLInputElement | null

    it('focuses the search box when the list opens', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.click(getByTestId('select-trigger'))

      expect(getSearch()).not.toBeNull()
      expect(document.activeElement).toBe(getSearch())
    })

    it('filters by country name ignoring case and accents', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'MÉX')

      expect(getOptions().map((o) => o.textContent?.trim())).toEqual(['+52 Mexico'])
    })

    it('filters by dial code with or without the plus sign', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, '+55')
      expect(getOptions().map((o) => o.textContent?.trim())).toEqual(['+55 Brazil'])

      await fireEvent.update(getSearch() as HTMLInputElement, '351')
      expect(getOptions().map((o) => o.textContent?.trim())).toEqual(['+351 Portugal'])
    })

    it('shows the empty label when nothing matches', async () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', searchEmptyLabel: 'Nenhum país' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'zzz')

      expect(getOptions()).toHaveLength(0)
      expect(
        document.body.querySelector('[data-testid="input-field-phone-number__search-empty"]')
          ?.textContent
      ).toContain('Nenhum país')
    })

    it('picks the first match on Enter and moves focus to the number', async () => {
      const { getByTestId, getByRole, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: 'US' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'bra')
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Enter' })

      expect(emitted()['update:country']).toEqual([['BR']])
      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(getByRole('textbox'))
    })

    it('moves the highlight with the arrows while focus stays in the search', async () => {
      const { getByTestId, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: 'BR' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'ArrowDown' })
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'ArrowDown' })

      expect(document.activeElement).toBe(getSearch())
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Enter' })
      expect(emitted()['update:country']).toEqual([['GB']])
    })

    it('opens with the typed letter when typing on the closed trigger', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.keyDown(getByTestId('select-trigger'), { key: 'p' })

      expect(getSearch()?.value).toBe('p')
      expect(getOptions().map((o) => o.textContent?.trim())).toEqual([
        '+351 Portugal',
        '+595 Paraguay',
        '+51 Peru',
        '+48 Poland'
      ])
    })

    it('clears the search when the list closes', async () => {
      const { getByTestId } = render(FieldPhoneNumber, { props: { label: 'Phone' } })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'chi')
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Escape' })
      await fireEvent.click(getByTestId('select-trigger'))

      expect(getSearch()?.value).toBe('')
      expect(getOptions()).toHaveLength(defaultCountries.length)
    })

    it('does not open or change the country from a letter typed while readonly', async () => {
      const { getByTestId, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', country: 'BR', readonly: true }
      })

      await fireEvent.keyDown(getByTestId('select-trigger'), { key: 'p' })

      expect(getSearch()).toBeNull()
      expect(emitted()['update:country']).toBeUndefined()
    })
  })

  describe('suppression (disabled / readonly)', () => {
    it('does not emit update:modelValue when disabled and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.disabled).toBe(true)
      await userEvent.type(input, '119')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('')
    })

    it('does not emit update:modelValue when readonly and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldPhoneNumber, {
        props: { label: 'Phone', modelValue: '11999999999', readonly: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.readOnly).toBe(true)
      await userEvent.type(input, '123')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('(11) 99999-9999')
    })
  })

  describe('label / helper / aria wiring', () => {
    it('wires the label to the input via matching for/id when inputId is given', () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', inputId: 'phone-field' }
      })

      const label = getByTestId('input-field-phone-number__label')
      expect(label.tagName).toBe('LABEL')
      expect(label.getAttribute('for')).toBe('phone-field')
      expect(getByRole('textbox').id).toBe('phone-field')
    })

    it('points aria-describedby at the helper element when a helper is shown', () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', helperText: 'We need this.', inputId: 'phone-field' }
      })

      expect(getByRole('textbox').getAttribute('aria-describedby')).toBe('phone-field-helper')
      expect(getByTestId('input-field-phone-number__helper').id).toBe('phone-field-helper')
    })

    it('drops aria-describedby when no helper is rendered', () => {
      const { getByRole } = render(FieldPhoneNumber, { props: { label: 'Phone' } })
      expect(getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
    })

    it('omits the helper row when disabled with no helper text', () => {
      const { queryByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true }
      })

      // The field writes no copy of its own, so a transient disable grows no padlock line.
      expect(queryByTestId('input-field-phone-number__helper')).toBeNull()
    })

    it('renders a supplied helper with the disabled kind while disabled', () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true, helperText: 'Managed by your organization.' }
      })

      const helper = getByTestId('input-field-phone-number__helper')
      expect(helper.textContent).toContain('Managed by your organization.')
      expect(helper.getAttribute('data-kind')).toBe('disabled')
    })

    it('switches the helper to kind=invalid on the invalid state', () => {
      const { getByTestId } = render(FieldPhoneNumber, {
        props: { label: 'Phone', invalid: true, helperText: 'Enter a valid phone number.' }
      })

      expect(getByTestId('input-field-phone-number__helper').getAttribute('data-kind')).toBe(
        'invalid'
      )
    })
  })

  describe('required / invalid / disabled reflection', () => {
    it('marks input, root, group and label for the required state', () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', required: true }
      })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(getByTestId('input-field-phone-number').getAttribute('data-required')).toBe('true')
      expect(getByTestId('input-field-phone-number__group').getAttribute('data-required')).toBe(
        'true'
      )
      expect(getByTestId('input-field-phone-number__label__required').textContent).toContain(
        '(Required)'
      )
    })

    it('marks input, root and group for the invalid state', () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', invalid: true }
      })

      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId('input-field-phone-number').getAttribute('data-invalid')).toBe('true')
      expect(getByTestId('input-field-phone-number__group').getAttribute('data-invalid')).toBe(
        'true'
      )
    })

    it('disables the native input and marks root and group when disabled', () => {
      const { getByTestId, getByRole } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true }
      })

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect(getByTestId('input-field-phone-number').getAttribute('data-disabled')).toBe('true')
      expect(getByTestId('input-field-phone-number__group').getAttribute('data-disabled')).toBe(
        'true'
      )
    })
  })

  describe('a11y (axe)', () => {
    it('has no violations in the default labelled + helper state', async () => {
      const { container } = render(FieldPhoneNumber, {
        props: {
          label: 'Phone',
          helperText: "We'll use this to send the verification code.",
          inputId: 'a11y-phone'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state', async () => {
      const { container } = render(FieldPhoneNumber, {
        props: { label: 'Phone', disabled: true, inputId: 'a11y-phone-disabled' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story with label, dial-code trigger and masked input', () => {
      const { getByTestId, getByRole } = render(Default)

      expect(getByTestId('input-field-phone-number')).toBeTruthy()
      expect(getByTestId('select-trigger').getAttribute('role')).toBe('combobox')
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(99) 99999-9999')
    })

    it('round-trips typing through the Default story v-model into the masked value', async () => {
      const { getByRole } = render(Default)
      const input = getByRole('textbox') as HTMLInputElement

      await fireEvent.update(input, '11999999999')

      expect(input.value).toBe('(11) 99999-9999')
    })

    it('renders the Countries story with one mask per country', () => {
      const { getAllByRole } = render(Countries)

      const values = (getAllByRole('textbox') as HTMLInputElement[]).map((el) => el.value)
      expect(values).toEqual(['(11) 99999-9999', '(11) 3333-4444', '(555) 555-0123', '7911 123456'])
    })

    it('renders the Invalid story with aria-invalid on the input', () => {
      const { getByRole } = render(Invalid)
      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
    })

    it('renders the Disabled story with input and trigger disabled', () => {
      const { getByRole, getByTestId } = render(Disabled)

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect((getByTestId('select-trigger') as HTMLButtonElement).disabled).toBe(true)
      expect(getByTestId('input-field-phone-number__helper').textContent).toContain(
        'Managed by your organization.'
      )
    })

    it('renders the Readonly story with a readonly input and a locked dial code', () => {
      const { getByRole, getByTestId } = render(Readonly)

      expect((getByRole('textbox') as HTMLInputElement).readOnly).toBe(true)
      expect((getByTestId('select-trigger') as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
