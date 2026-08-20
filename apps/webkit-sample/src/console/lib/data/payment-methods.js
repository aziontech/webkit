// The cards on the account — the Billing → Payment Methods surface.
//
// A LIST, NOT A FIELD. The sample used to carry one card as a fact band, which reads
// well right up to the moment an account has two: a company paying by one card and
// expensing overages to another is the ordinary case, not the exotic one, and a single
// field cannot express "this is the one we charge". The console lists them for that
// reason, and marks exactly one DEFAULT.
//
// The number is stored MASKED. There is no state of this app in which the full pan is
// needed — the list identifies a card, it does not transact with one — so the unmasked
// value never exists to be leaked into a log, a screenshot or this file.
import { authorAt } from '@shared/lib/people'

/** The card networks the seed uses, and the glyph each one renders with. */
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
  // The console's Card Number column shows the masked pan, not the last four on their
  // own: `•••• 1702` is a card, `1702` is a number the reader has to be told the
  // meaning of.
  cardNumber: `•••• •••• •••• ${card.last4}`,
  author: authorAt(index).name
}))

/** The card an invoice is charged to. */
export const defaultPaymentMethod = () =>
  PAYMENT_METHODS.find((card) => card.default) ?? PAYMENT_METHODS[0]
