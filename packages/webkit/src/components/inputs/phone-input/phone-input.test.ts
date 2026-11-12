import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import Default from '../../../../examples/phone-input/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Field from '../field/field.vue'
import FieldLabel from '../field/field-label/field-label.vue'
import { defaultCountries } from './countries'
import PhoneInput, { type PhoneNumber } from './phone-input.vue'

/** The dial-code dropdown Teleports to document.body — query it from there. */
const getContent = () =>
  document.body.querySelector('[data-testid="select-content"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[data-testid="select-option"]')) as HTMLElement[]

const optionText = (option: HTMLElement) =>
  [
    option.querySelector('.truncate'),
    option.querySelector('[data-testid="phone-input__dial-code"]')
  ]
    .map((el) => el?.textContent?.trim())
    .join(' ')

const lastPhone = (emitted: Record<string, unknown[]>) => {
  const events = emitted['update:phone'] as PhoneNumber[][]
  return events[events.length - 1][0]
}

afterEach(() => {
  // Teleported content can outlive a wrapper unmounted mid-transition; remove
  // strays so document.body queries stay deterministic across tests.
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
})

describe('PhoneInput', () => {
  describe('size', () => {
    it('defaults to medium on the root, the group and the dial-code trigger', () => {
      const { getByTestId, getByRole } = render(PhoneInput, {})

      expect(getByTestId('phone-input').dataset.size).toBe('medium')
      expect(getByTestId('phone-input').dataset.size).toBe('medium')
      expect(getByRole('combobox', { name: 'Country dial code' }).dataset.size).toBe('medium')
    })

    it.each(['small', 'large'] as const)(
      'forwards %s to the group and the dial-code trigger',
      (size) => {
        const { getByTestId, getByRole } = render(PhoneInput, {
          props: { size }
        })

        expect(getByTestId('phone-input').dataset.size).toBe(size)
        expect(getByTestId('phone-input').dataset.size).toBe(size)
        expect(getByRole('combobox', { name: 'Country dial code' }).dataset.size).toBe(size)
      }
    )
  })

  describe('internal input semantics', () => {
    it('renders a tel input with inputmode and autocomplete for national numbers', () => {
      const { getByRole } = render(PhoneInput, {})

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('tel')
      expect(input.getAttribute('inputmode')).toBe('tel')
      expect(input.getAttribute('autocomplete')).toBe('tel-national')
    })

    it("falls back to the selected country's mask as placeholder (BR default)", () => {
      const { getByRole } = render(PhoneInput, {})
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(99) 99999-9999')
    })

    it('prefers an explicit placeholder over the mask', () => {
      const { getByRole } = render(PhoneInput, {
        props: { placeholder: 'Your number' }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('Your number')
    })

    it('falls back to the first country when the country code is unknown', () => {
      const { getByRole } = render(PhoneInput, {
        props: { country: 'QQ' }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(99) 99999-9999')
    })

    it('honors a consumer-provided countries list', () => {
      const { getByRole } = render(PhoneInput, {
        props: {
          country: 'XX',
          countries: [{ code: 'XX', dialCode: '+99', mask: '###-###', label: 'Testland' }]
        }
      })
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('999-999')
    })
  })

  describe('mask display (modelValue -> formatted value)', () => {
    it('renders the BR mask over the bound digits', () => {
      const { getByRole } = render(PhoneInput, {
        props: { modelValue: '11999999999', country: 'BR' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(11) 99999-9999')
    })

    it('formats a BR landline with the 10-digit mask', () => {
      const { getByRole } = render(PhoneInput, {
        props: { modelValue: '1133334444', country: 'BR' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(11) 3333-4444')
    })

    it('honors a consumer country with several masks', () => {
      const { getByRole } = render(PhoneInput, {
        props: {
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
      const { getByRole } = render(PhoneInput, {
        props: { modelValue: '5555550123', country: 'US' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('(555) 555-0123')
    })
  })

  describe('update:modelValue — digits only', () => {
    it('emits stripped digits and rewrites the input to the masked value', async () => {
      const { getByRole, emitted } = render(PhoneInput, {})
      const input = getByRole('textbox') as HTMLInputElement

      await fireEvent.update(input, '(11) 9abc')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual(['119'])
      expect(input.value).toBe('(11) 9')
    })

    it("truncates typed digits to the mask's capacity", async () => {
      const { getByRole, emitted } = render(PhoneInput, {})

      await fireEvent.update(getByRole('textbox'), '119999999990000')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events[0]).toEqual(['11999999999'])
    })

    it('clears non-digit input without emitting an unchanged value', async () => {
      const { getByRole, emitted } = render(PhoneInput, {})
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
      const { getByTestId } = render(PhoneInput, {})

      expect(getByTestId('select-trigger').getAttribute('aria-label')).toBe('Country dial code')
      expect(getByTestId('phone-input__country').getAttribute('aria-label')).toBeNull()
    })

    it("shows the selected country's dial code in the trigger", () => {
      const { getByTestId } = render(PhoneInput, {})
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+55')
    })

    it('keeps the number and the dial codes left-to-right on an RTL page', async () => {
      const { getByTestId } = render(PhoneInput, {})
      expect(getByTestId('phone-input__input').getAttribute('dir')).toBe('ltr')
      await fireEvent.click(getByTestId('select-trigger'))
      expect(
        getOptions()[0].querySelector('[data-testid="phone-input__dial-code"]')?.getAttribute('dir')
      ).toBe('ltr')
    })

    it("shows the picked country's dial code, not its ISO code", () => {
      const { getByTestId } = render(PhoneInput, {
        props: { country: 'US' }
      })
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+1')
    })

    it('opens the Teleported listbox with one option per country', async () => {
      const { getByTestId } = render(PhoneInput, {})

      expect(getContent()).toBeNull()
      await fireEvent.click(getByTestId('select-trigger'))

      const content = getContent()
      expect(content).not.toBeNull()
      expect(content?.getAttribute('role')).toBe('listbox')

      const options = getOptions()
      expect(options).toHaveLength(defaultCountries.length)
      const us = options[1]
      const flag = us.querySelector('[data-testid="phone-input__flag"]')
      expect(flag?.getAttribute('data-country')).toBe('US')
      expect(flag?.getAttribute('aria-hidden')).toBe('true')
      expect(us.querySelector('.truncate')?.textContent?.trim()).toBe('United States')
      expect(us.querySelector('[data-testid="phone-input__dial-code"]')?.textContent?.trim()).toBe(
        '+1'
      )
    })

    it('keeps the check on the selected country, after the dial code', async () => {
      const { getByTestId } = render(PhoneInput, { props: { country: 'BR' } })
      await fireEvent.click(getByTestId('select-trigger'))

      const br = getOptions()[0]
      const dialCode = br.querySelector('[data-testid="phone-input__dial-code"]')
      const check = br.querySelector('[data-testid="select-option__check"]')
      expect(check).not.toBeNull()
      expect(dialCode?.compareDocumentPosition(check as Node)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    })

    it('emits update:country and re-emits truncated digits when a country is picked', async () => {
      const { getByTestId, emitted } = render(PhoneInput, {
        props: { modelValue: '11999999999', country: 'BR' }
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
      const { getByTestId } = render(PhoneInput, {
        props: { disabled: true }
      })

      const trigger = getByTestId('select-trigger') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)

      await fireEvent.click(trigger)
      expect(getContent()).toBeNull()
    })

    it('disables the trigger while readonly (dial code cannot change)', async () => {
      const { getByTestId } = render(PhoneInput, {
        props: { readonly: true }
      })

      const trigger = getByTestId('select-trigger') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)

      await fireEvent.click(trigger)
      expect(getContent()).toBeNull()
    })
  })

  describe('update:phone — full number and completeness', () => {
    it('reports the initial state on mount', () => {
      const { emitted } = render(PhoneInput, {})

      expect(emitted()['update:phone']).toEqual([
        [{ country: 'BR', dialCode: '+55', digits: '', number: '', complete: false }]
      ])
    })

    it('reports a pre-filled number as complete with its dial code', () => {
      const { emitted } = render(PhoneInput, {
        props: { modelValue: '5555550123', country: 'US' }
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
      const { getByRole, emitted } = render(PhoneInput, {})
      const input = getByRole('textbox')

      await fireEvent.update(input, '119999888')
      expect(lastPhone(emitted())).toMatchObject({ digits: '119999888', complete: false })

      await fireEvent.update(input, '1133334444')
      expect(lastPhone(emitted())).toMatchObject({ number: '+551133334444', complete: true })

      await fireEvent.update(input, '11999998888')
      expect(lastPhone(emitted())).toMatchObject({ number: '+5511999998888', complete: true })
    })

    it('reports the new country after a pick', async () => {
      const { getByTestId, emitted } = render(PhoneInput, {
        props: { modelValue: '11999999999' }
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
    it('changes country without a v-model:country binding', async () => {
      const { getByTestId, getByRole } = render(PhoneInput, {})

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.click(getOptions()[1])

      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('+1')
      expect(getByRole('textbox').getAttribute('placeholder')).toBe('(999) 999-9999')
    })
  })

  describe('dial-code search', () => {
    const getSearch = () =>
      document.body.querySelector('[data-testid="phone-input__search"]') as HTMLInputElement | null

    it('focuses the search box when the list opens', async () => {
      const { getByTestId } = render(PhoneInput, {})

      await fireEvent.click(getByTestId('select-trigger'))

      expect(getSearch()).not.toBeNull()
      expect(document.activeElement).toBe(getSearch())
    })

    it('filters by country name ignoring case and accents', async () => {
      const { getByTestId } = render(PhoneInput, {})

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'MÉX')

      expect(getOptions().map(optionText)).toEqual(['Mexico +52'])
    })

    it('filters by dial code with or without the plus sign', async () => {
      const { getByTestId } = render(PhoneInput, {})

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, '+55')
      expect(getOptions().map(optionText)).toEqual(['Brazil +55'])

      await fireEvent.update(getSearch() as HTMLInputElement, '351')
      expect(getOptions().map(optionText)).toEqual(['Portugal +351'])
    })

    it('shows the empty label when nothing matches', async () => {
      const { getByTestId } = render(PhoneInput, {
        props: { searchEmptyLabel: 'Nenhum país' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'zzz')

      expect(getOptions()).toHaveLength(0)
      expect(
        document.body.querySelector('[data-testid="phone-input__search-empty"]')?.textContent
      ).toContain('Nenhum país')
    })

    it('picks the first match on Enter and moves focus to the number', async () => {
      const { getByTestId, getByRole, emitted } = render(PhoneInput, {
        props: { country: 'US' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'bra')
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Enter' })

      expect(emitted()['update:country']).toEqual([['BR']])
      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(getByRole('textbox'))
    })

    it('moves the highlight with the arrows while focus stays in the search', async () => {
      const { getByTestId, emitted } = render(PhoneInput, {
        props: { country: 'BR' }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'ArrowDown' })
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'ArrowDown' })

      expect(document.activeElement).toBe(getSearch())
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Enter' })
      expect(emitted()['update:country']).toEqual([['GB']])
    })

    it('opens with the typed letter when typing on the closed trigger', async () => {
      const { getByTestId } = render(PhoneInput, {})

      await fireEvent.keyDown(getByTestId('select-trigger'), { key: 'p' })

      expect(getSearch()?.value).toBe('p')
      expect(getOptions().map(optionText)).toEqual([
        'Portugal +351',
        'Paraguay +595',
        'Peru +51',
        'Poland +48'
      ])
    })

    it('clears the search when the list closes', async () => {
      const { getByTestId } = render(PhoneInput, {})

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.update(getSearch() as HTMLInputElement, 'chi')
      await fireEvent.keyDown(getSearch() as HTMLInputElement, { key: 'Escape' })
      await fireEvent.click(getByTestId('select-trigger'))

      expect(getSearch()?.value).toBe('')
      expect(getOptions()).toHaveLength(defaultCountries.length)
    })

    it('does not open or change the country from a letter typed while readonly', async () => {
      const { getByTestId, emitted } = render(PhoneInput, {
        props: { country: 'BR', readonly: true }
      })

      await fireEvent.keyDown(getByTestId('select-trigger'), { key: 'p' })

      expect(getSearch()).toBeNull()
      expect(emitted()['update:country']).toBeUndefined()
    })
  })

  describe('suppression (disabled / readonly)', () => {
    it('does not emit update:modelValue when disabled and the user tries to type', async () => {
      const { getByRole, emitted } = render(PhoneInput, {
        props: { disabled: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.disabled).toBe(true)
      await userEvent.type(input, '119')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('')
    })

    it('does not emit update:modelValue when readonly and the user tries to type', async () => {
      const { getByRole, emitted } = render(PhoneInput, {
        props: { modelValue: '11999999999', readonly: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.readOnly).toBe(true)
      await userEvent.type(input, '123')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('(11) 99999-9999')
    })
  })

  describe('required / invalid / disabled reflection', () => {
    it('marks input, root, group and label for the required state', () => {
      const { getByTestId, getByRole } = render(PhoneInput, {
        props: { required: true }
      })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(getByTestId('phone-input').getAttribute('data-required')).toBe('true')
      expect(getByTestId('phone-input').getAttribute('data-required')).toBe('true')
    })

    it('marks input, root and group for the invalid state', () => {
      const { getByTestId, getByRole } = render(PhoneInput, {
        props: { invalid: true }
      })

      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId('phone-input').getAttribute('data-invalid')).toBe('true')
      expect(getByTestId('phone-input').getAttribute('data-invalid')).toBe('true')
    })

    it('disables the native input and marks root and group when disabled', () => {
      const { getByTestId, getByRole } = render(PhoneInput, {
        props: { disabled: true }
      })

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect(getByTestId('phone-input').getAttribute('data-disabled')).toBe('true')
      expect(getByTestId('phone-input').getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('field integration', () => {
    it('takes its id, description and state from an enclosing Field', async () => {
      const { getByLabelText, getByTestId } = render(Default)
      await nextTick()
      const input = getByLabelText(/Phone/) as HTMLInputElement
      expect(input.getAttribute('type')).toBe('tel')
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-describedby')).toBe(getByTestId('input-field-description').id)
    })
  })

  describe('a11y (axe)', () => {
    it('has no violations in the Default example', async () => {
      const { container } = render(Default)
      await nextTick()
      await expectNoA11yViolations(container)
    })

    it('has no violations while disabled', async () => {
      const { container } = render(
        defineComponent({
          components: { Field, FieldLabel, PhoneInput },
          template: '<Field disabled><FieldLabel>Phone</FieldLabel><PhoneInput /></Field>'
        })
      )
      await nextTick()
      expect((container.querySelector('input[type=tel]') as HTMLInputElement).disabled).toBe(true)
      await expectNoA11yViolations(container)
    })
  })

  describe('documented examples', () => {
    it('renders the Default example with a dial-code trigger and the masked input', async () => {
      const { getByTestId, getByLabelText } = render(Default)
      const input = getByLabelText(/Phone/) as HTMLInputElement

      expect(getByTestId('phone-input')).toBeTruthy()
      expect(getByTestId('select-trigger').getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('placeholder')).toBe('(99) 99999-9999')

      await fireEvent.update(input, '11999999999')
      expect(input.value).toBe('(11) 99999-9999')
    })
  })
})
