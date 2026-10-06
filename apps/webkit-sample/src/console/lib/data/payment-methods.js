import { authorAt } from '@shared/lib/people'

export const CARD_BRANDS = {
  Mastercard: 'pi pi-credit-card',
  Visa: 'pi pi-credit-card',
  'American Express': 'pi pi-credit-card'
}

export const PAYMENT_METHODS = [
  {
    id: 'pm-001',
    brand: 'Mastercard',
    last4: '1702',
    expires: '02 / 2027',
    holder: 'Maria Silva',
    default: true
  },
  {
    id: 'pm-002',
    brand: 'Visa',
    last4: '4431',
    expires: '11 / 2026',
    holder: 'Azion Technologies',
    default: false
  },
  {
    id: 'pm-003',
    brand: 'American Express',
    last4: '9008',
    expires: '05 / 2028',
    holder: 'Robson Junior',
    default: false
  }
].map((card, index) => ({
  ...card,
  cardNumber: `•••• •••• •••• ${card.last4}`,
  author: authorAt(index).name
}))

export const defaultPaymentMethod = () =>
  PAYMENT_METHODS.find((card) => card.default) ?? PAYMENT_METHODS[0]
