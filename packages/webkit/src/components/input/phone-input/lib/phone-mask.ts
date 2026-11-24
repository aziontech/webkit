import type { PhoneInputCountry } from './country-data'

export function stripToDigits(input: string): string {
  return input.replace(/\D/g, '')
}

function applyMask(digits: string, mask: string): string {
  let result = ''
  let i = 0
  for (const ch of mask) {
    if (i >= digits.length) break
    if (ch === '#') {
      result += digits[i]
      i += 1
    } else {
      result += ch
    }
  }
  return result
}

function slotCount(mask: string): number {
  let n = 0
  for (const ch of mask) if (ch === '#') n += 1
  return n
}

export function masksOf(country: PhoneInputCountry): string[] {
  const masks = Array.isArray(country.mask) ? country.mask : [country.mask]
  return [...masks].sort((a, b) => slotCount(a) - slotCount(b))
}

export function maxDigits(country: PhoneInputCountry): number {
  const masks = masksOf(country)
  return slotCount(masks[masks.length - 1])
}

function maskFor(country: PhoneInputCountry, digits: string): string {
  const masks = masksOf(country)
  return masks.find((mask) => slotCount(mask) >= digits.length) ?? masks[masks.length - 1]
}

export function formatNational(country: PhoneInputCountry, digits: string): string {
  return applyMask(digits, maskFor(country, digits))
}

export function placeholderFor(country: PhoneInputCountry): string {
  const masks = masksOf(country)
  return masks[masks.length - 1].replace(/#/g, '9')
}

export function isComplete(country: PhoneInputCountry, digits: string): boolean {
  return masksOf(country).some((mask) => slotCount(mask) === digits.length)
}
