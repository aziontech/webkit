import type {
  BillingInvoice,
  BillingPaymentInformation,
  BillingPaymentMethod,
  BillingSubscription
} from './account-billing.vue'

export const sampleUpdatedAt = new Date(Date.UTC(2026, 10, 10, 12))

export const sampleSubscription: BillingSubscription = {
  plan: 'Pro',
  startedAt: new Date(Date.UTC(2023, 0, 25)),
  nextChargeAt: new Date(Date.UTC(2026, 11, 1)),
  nextChargeAmount: 184.2
}

export const samplePaymentInformation: BillingPaymentInformation = {
  email: 'billing@example.com',
  autoRenewal: true,
  address: '100 Market Street, Suite 400, San Francisco, CA 94105',
  taxId: ''
}

export const samplePaymentMethods: BillingPaymentMethod[] = [
  {
    id: 'pm-1',
    holder: 'Jane Doe',
    brand: 'Mastercard',
    last4: '1702',
    expires: '02 / 2027',
    default: true
  },
  {
    id: 'pm-2',
    holder: 'Acme Inc.',
    brand: 'Visa',
    last4: '4431',
    expires: '11 / 2026',
    default: false
  },
  {
    id: 'pm-3',
    holder: 'John Smith',
    brand: 'American Express',
    last4: '9008',
    expires: '05 / 2028',
    default: false
  }
]

const usage = [
  184.2, 171.95, 168.4, 159.1, 162.75, 148.3, 139.9, 131.25, 126.6, 118.4, 104.15, 96.8
]
const seatsByMonth = [8, 8, 7, 7, 7, 6, 6, 6, 5, 5, 4, 4]

export const sampleInvoices: BillingInvoice[] = usage.map((amount, index) => ({
  id: `INV-A${12401 - index}`,
  number: 132 - index,
  plan: 'Pro',
  cycle: 'Monthly',
  seats: seatsByMonth[index],
  billedAt: new Date(Date.UTC(2026, 10 - index, 1)),
  amount,
  brand: 'Mastercard',
  paymentMethod: 'Mastercard •••• 1702',
  status: index === 3 ? 'Refunded' : 'Paid'
}))
