import { computed, type ComputedRef, type MaybeRefOrGetter, type Ref, toValue } from 'vue'

import type { PhoneInputCountry } from '../lib/country-data'
import { formatNational, isComplete, maxDigits, stripToDigits } from '../lib/phone-mask'

/** Snapshot of the number emitted by phone-change. */
export interface PhoneInputValue {
  /** ISO 3166-1 alpha-2 code of the selected country. */
  country: string
  /** Dial code of the selected country, such as +1. */
  dialCode: string
  /** National number as digits only. */
  digits: string
  /** Full E.164 number (dial code followed by the digits); empty while there are no digits. */
  number: string
  /** True when the digit count is one the selected country allows. */
  complete: boolean
}

export interface UsePhoneInputValueOptions {
  /** Countries the field offers. */
  countries: MaybeRefOrGetter<PhoneInputCountry[]>
  /** Country shown while the country model is empty. */
  defaultCountry: MaybeRefOrGetter<string>
  /** The national digits model. */
  digits: Ref<string>
  /** The country code model. */
  country: Ref<string>
}

export interface UsePhoneInputValueReturn {
  /** The country in use: the model, then the default, then the first of the list. */
  selectedCountry: ComputedRef<PhoneInputCountry>
  /** The digits drawn with the selected country's mask. */
  displayValue: ComputedRef<string>
  /** The number as the form reads it. */
  phone: ComputedRef<PhoneInputValue>
  /** Stores what was typed as digits, capped at the country's longest mask, and returns the masked text. */
  typeDigits: (raw: string) => string
  /** Selects a country and drops the digits its longest mask cannot hold. */
  pickCountry: (code: string) => void
}

export function usePhoneInputValue(options: UsePhoneInputValueOptions): UsePhoneInputValueReturn {
  const { digits, country } = options

  const find = (code: string) => toValue(options.countries).find((c) => c.code === code)

  const selectedCountry = computed<PhoneInputCountry>(
    () => find(country.value || toValue(options.defaultCountry)) ?? toValue(options.countries)[0]
  )

  const displayValue = computed(() => formatNational(selectedCountry.value, digits.value))

  const phone = computed<PhoneInputValue>(() => {
    const { code, dialCode } = selectedCountry.value
    return {
      country: code,
      dialCode,
      digits: digits.value,
      number: digits.value ? `${dialCode}${digits.value}` : '',
      complete: isComplete(selectedCountry.value, digits.value)
    }
  })

  const typeDigits = (raw: string): string => {
    const next = stripToDigits(raw).slice(0, maxDigits(selectedCountry.value))
    digits.value = next
    return formatNational(selectedCountry.value, next)
  }

  const pickCountry = (code: string): void => {
    country.value = code
    digits.value = digits.value.slice(0, maxDigits(find(code) ?? selectedCountry.value))
  }

  return { selectedCountry, displayValue, phone, typeDigits, pickCountry }
}
