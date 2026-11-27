import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import type { PhoneInputCountry } from '../lib/country-data'
import { usePhoneInputValue } from './use-phone-input-value'

const countries: PhoneInputCountry[] = [
  { code: 'US', dialCode: '+1', mask: '(###) ###-####', label: 'United States' },
  { code: 'BR', dialCode: '+55', mask: ['(##) ####-####', '(##) #####-####'], label: 'Brazil' },
  { code: 'XX', dialCode: '+99', mask: '###-###', label: 'Testland' }
]

const setup = (digits = '', country = '', defaultCountry = 'US') => {
  const models = { digits: ref(digits), country: ref(country) }
  return { ...models, ...usePhoneInputValue({ countries, defaultCountry, ...models }) }
}

describe('usePhoneInputValue', () => {
  it('uses the model country, then the default, then the first of the list', () => {
    expect(setup('', 'BR').selectedCountry.value.code).toBe('BR')
    expect(setup('', '', 'XX').selectedCountry.value.code).toBe('XX')
    expect(setup('', '', 'ZZ').selectedCountry.value.code).toBe('US')
  })

  it('falls back to the default, then US, then the first country for an unknown code', () => {
    expect(setup('', 'ZZ', 'BR').selectedCountry.value.code).toBe('BR')
    const sorted = [countries[1], countries[2], countries[0]]
    const pick = (defaultCountry: string, list: PhoneInputCountry[]) =>
      usePhoneInputValue({ countries: list, defaultCountry, digits: ref(''), country: ref('') })
        .selectedCountry.value.code
    expect(pick('ZZ', sorted)).toBe('US')
    expect(pick('ZZ', [countries[1], countries[2]])).toBe('BR')
  })

  it('stores typed text as digits and returns it masked', () => {
    const value = setup()
    expect(value.typeDigits('415-555 01')).toBe('(415) 555-01')
    expect(value.digits.value).toBe('41555501')
    expect(value.displayValue.value).toBe('(415) 555-01')
  })

  it('caps the digits at the longest mask of the country', () => {
    const value = setup('', 'XX')
    value.typeDigits('1234567890')
    expect(value.digits.value).toBe('123456')
  })

  it('reports the E.164 number and whether it is complete', () => {
    const value = setup('415555010')
    expect(value.phone.value).toEqual({
      country: 'US',
      dialCode: '+1',
      digits: '415555010',
      number: '+1415555010',
      complete: false
    })
    value.typeDigits('4155550100')
    expect(value.phone.value.complete).toBe(true)
    expect(setup().phone.value.number).toBe('')
  })

  it('accepts every length a country with several masks allows', () => {
    expect(setup('1133334444', 'BR').phone.value.complete).toBe(true)
    expect(setup('11933334444', 'BR').phone.value.complete).toBe(true)
  })

  it('drops the digits a newly picked country cannot hold', () => {
    const value = setup('4155550100')
    value.pickCountry('XX')
    expect(value.country.value).toBe('XX')
    expect(value.digits.value).toBe('415555')
  })
})
