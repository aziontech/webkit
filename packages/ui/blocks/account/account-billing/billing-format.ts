import type { TagSeverity } from '@aziontech/ui/tag'

import type { BillingInvoiceStatus, BillingPaymentMethod } from './account-billing.vue'

export const formatAmount = (value: number): string => value.toFixed(2)

export const methodLabel = (method: BillingPaymentMethod): string =>
  `${method.brand} •••• ${method.last4}`

export const statusSeverity = (status: BillingInvoiceStatus): TagSeverity =>
  (({ Paid: 'success', Refunded: 'neutral', Overdue: 'danger' }) as const)[status] ?? 'neutral'
