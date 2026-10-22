export interface Country {
  code: string
  dialCode: string
  mask: string | string[]
  label: string
}

export const OTHER_COUNTRY_CODE = 'ZZ'

const E164_MIN_DIGITS = 7
const E164_MAX_DIGITS = 15

export const defaultCountries: Country[] = [
  { code: 'BR', dialCode: '+55', mask: ['(##) ####-####', '(##) #####-####'], label: 'Brazil' },
  { code: 'US', dialCode: '+1', mask: '(###) ###-####', label: 'United States' },
  { code: 'GB', dialCode: '+44', mask: '#### ######', label: 'United Kingdom' },
  { code: 'PT', dialCode: '+351', mask: '### ### ###', label: 'Portugal' },
  { code: 'ES', dialCode: '+34', mask: '### ### ###', label: 'Spain' },
  { code: 'AR', dialCode: '+54', mask: ['## ####-####', '# ## ####-####'], label: 'Argentina' },
  { code: 'MX', dialCode: '+52', mask: '## #### ####', label: 'Mexico' },
  { code: 'CL', dialCode: '+56', mask: '# #### ####', label: 'Chile' },
  { code: 'CO', dialCode: '+57', mask: '### ### ####', label: 'Colombia' },
  { code: 'DE', dialCode: '+49', mask: ['### #######', '#### #######'], label: 'Germany' },
  { code: 'FR', dialCode: '+33', mask: '# ## ## ## ##', label: 'France' },
  { code: 'IT', dialCode: '+39', mask: '### ### ####', label: 'Italy' },
  { code: 'AU', dialCode: '+61', mask: '### ### ###', label: 'Australia' },
  { code: 'BE', dialCode: '+32', mask: ['# ### ## ##', '### ## ## ##'], label: 'Belgium' },
  { code: 'BO', dialCode: '+591', mask: '#### ####', label: 'Bolivia' },
  { code: 'CA', dialCode: '+1', mask: '(###) ###-####', label: 'Canada' },
  { code: 'CN', dialCode: '+86', mask: ['## #### ####', '### #### ####'], label: 'China' },
  { code: 'EC', dialCode: '+593', mask: ['# ### ####', '## ### ####'], label: 'Ecuador' },
  { code: 'IN', dialCode: '+91', mask: '##### #####', label: 'India' },
  { code: 'IE', dialCode: '+353', mask: ['# ### ####', '## ### ####'], label: 'Ireland' },
  { code: 'IL', dialCode: '+972', mask: ['#-###-####', '##-###-####'], label: 'Israel' },
  { code: 'JP', dialCode: '+81', mask: ['#-####-####', '##-####-####'], label: 'Japan' },
  { code: 'NL', dialCode: '+31', mask: '# #### ####', label: 'Netherlands' },
  { code: 'PY', dialCode: '+595', mask: '### ### ###', label: 'Paraguay' },
  { code: 'PE', dialCode: '+51', mask: ['# ### ####', '### ### ###'], label: 'Peru' },
  { code: 'PL', dialCode: '+48', mask: '### ### ###', label: 'Poland' },
  { code: 'SG', dialCode: '+65', mask: '#### ####', label: 'Singapore' },
  { code: 'ZA', dialCode: '+27', mask: '## ### ####', label: 'South Africa' },
  { code: 'KR', dialCode: '+82', mask: ['#-####-####', '##-####-####'], label: 'South Korea' },
  { code: 'CH', dialCode: '+41', mask: '## ### ## ##', label: 'Switzerland' },
  { code: 'TR', dialCode: '+90', mask: '### ### ## ##', label: 'Türkiye' },
  {
    code: 'AE',
    dialCode: '+971',
    mask: ['# ### ####', '## ### ####'],
    label: 'United Arab Emirates'
  },
  { code: 'UY', dialCode: '+598', mask: '#### ####', label: 'Uruguay' },
  { code: 'VE', dialCode: '+58', mask: '### ### ####', label: 'Venezuela' },
  {
    code: OTHER_COUNTRY_CODE,
    dialCode: '+',
    mask: Array.from({ length: E164_MAX_DIGITS - E164_MIN_DIGITS + 1 }, (_, i) =>
      '#'.repeat(E164_MIN_DIGITS + i)
    ),
    label: 'Other'
  }
]

export function stripToDigits(input: string): string {
  return input.replace(/\D/g, '')
}

export function applyMask(digits: string, mask: string): string {
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

export function slotCount(mask: string): number {
  let n = 0
  for (const ch of mask) if (ch === '#') n += 1
  return n
}

export function masksOf(country: Country): string[] {
  const masks = Array.isArray(country.mask) ? country.mask : [country.mask]
  return [...masks].sort((a, b) => slotCount(a) - slotCount(b))
}

export function maxDigits(country: Country): number {
  const masks = masksOf(country)
  return slotCount(masks[masks.length - 1])
}

export function maskFor(country: Country, digits: string): string {
  const masks = masksOf(country)
  return masks.find((mask) => slotCount(mask) >= digits.length) ?? masks[masks.length - 1]
}

export function formatNational(country: Country, digits: string): string {
  return applyMask(digits, maskFor(country, digits))
}

export function placeholderFor(country: Country): string {
  const masks = masksOf(country)
  return masks[masks.length - 1].replace(/#/g, '9')
}

export function isComplete(country: Country, digits: string): boolean {
  return masksOf(country).some((mask) => slotCount(mask) === digits.length)
}
