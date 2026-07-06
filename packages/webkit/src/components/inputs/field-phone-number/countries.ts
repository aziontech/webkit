export interface Country {
  code: string
  dialCode: string
  mask: string
  label: string
}

export const defaultCountries: Country[] = [
  { code: 'BR', dialCode: '+55', mask: '(##) #####-####', label: 'Brazil' },
  { code: 'US', dialCode: '+1', mask: '(###) ###-####', label: 'United States' },
  { code: 'GB', dialCode: '+44', mask: '#### ######', label: 'United Kingdom' },
  { code: 'PT', dialCode: '+351', mask: '### ### ###', label: 'Portugal' },
  { code: 'ES', dialCode: '+34', mask: '### ### ###', label: 'Spain' },
  { code: 'AR', dialCode: '+54', mask: '## ####-####', label: 'Argentina' },
  { code: 'MX', dialCode: '+52', mask: '## #### ####', label: 'Mexico' },
  { code: 'CL', dialCode: '+56', mask: '# #### ####', label: 'Chile' },
  { code: 'CO', dialCode: '+57', mask: '### ### ####', label: 'Colombia' },
  { code: 'DE', dialCode: '+49', mask: '#### #######', label: 'Germany' },
  { code: 'FR', dialCode: '+33', mask: '# ## ## ## ##', label: 'France' },
  { code: 'IT', dialCode: '+39', mask: '### ### ####', label: 'Italy' }
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

export function maxDigits(mask: string): number {
  let n = 0
  for (const ch of mask) if (ch === '#') n += 1
  return n
}
