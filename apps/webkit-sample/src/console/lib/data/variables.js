import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

export const VARIABLES = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    modifiedAt: daysAgo(32)
  },
  {
    id: 'v-002',
    key: 'STRIPE_SECRET_KEY',
    value: 'sk_live_51H8sX2eZv...',
    secret: true,
    scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
    modifiedAt: daysAgo(48)
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    scope: [{ type: 'application', id: '1784552864', name: 'my-app-vue' }],
    modifiedAt: daysAgo(61)
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    scope: [{ type: 'firewall', id: '5540117', name: 'edgeflow-production' }],
    modifiedAt: daysAgo(73)
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
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
