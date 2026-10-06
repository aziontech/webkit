import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

export const VARIABLES = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    modifiedAt: daysAgo(32)
  },
  {
    id: 'v-002',
    key: 'STRIPE_SECRET_KEY',
    value: 'sk_live_51H8sX2eZv...',
    secret: true,
    modifiedAt: daysAgo(48)
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    modifiedAt: daysAgo(61)
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    modifiedAt: daysAgo(73)
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    modifiedAt: daysAgo(99)
  }
].map((variable, index) => {
  const person = authorAt(index)
  return {
    ...variable,
    lastEditor: person.name,
    lastEditorAvatar: person.avatar,
    lastModified: formatListDate(variable.modifiedAt)
  }
})
