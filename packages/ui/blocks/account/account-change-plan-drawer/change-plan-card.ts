import type {
  ChangePlanDrawerAddress,
  ChangePlanDrawerCard
} from './account-change-plan-drawer.vue'

/** A field of the card form. */
export type CardField = 'holder' | 'number' | 'expiry' | 'code'

export const cardFieldIds: Record<CardField, string> = {
  holder: 'card-holder',
  number: 'card-number',
  expiry: 'card-expiry',
  code: 'card-code'
}

export const blankCard = (): ChangePlanDrawerCard => ({
  holder: '',
  country: undefined,
  number: '',
  expiry: '',
  code: ''
})

export const blankAddress = (): ChangePlanDrawerAddress => ({
  country: undefined,
  postalCode: '',
  state: undefined,
  city: undefined,
  line1: '',
  line2: ''
})

const required = 'This field is required.'

const numberError = (number: string): string => {
  const digits = number.replace(/\D/g, '')
  if (!digits) return required
  return digits.length >= 12 && digits.length <= 19
    ? ''
    : 'Enter the 12 to 19 digits on the front of the card.'
}

const expiryError = (expiry: string): string => {
  if (!expiry.trim()) return required
  return /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiry.trim())
    ? ''
    : 'Enter the month and year as MM/YY.'
}

const codeError = (value: string): string => {
  const code = value.trim()
  if (!code) return required
  return /^\d{3,4}$/.test(code) ? '' : 'Enter the 3 or 4 digits on the back of the card.'
}

export const cardErrorsOf = (card: ChangePlanDrawerCard): Record<CardField, string> => ({
  holder: card.holder.trim() ? '' : required,
  number: numberError(card.number),
  expiry: expiryError(card.expiry),
  code: codeError(card.code)
})
