import type { VariablesVariable } from './edit-variables.vue'

export const sampleVariables: VariablesVariable[] = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    lastEditor: 'Ethan Brooks',
    lastEditorAvatar: '',
    lastModified: '1 month ago'
  },
  {
    id: 'v-002',
    key: 'PAYMENT_SECRET_KEY',
    value: 'sk_example_4f8a2c9e',
    secret: true,
    scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
    lastEditor: 'Jordan Kim',
    lastEditorAvatar: '',
    lastModified: '2 months ago'
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
    lastEditor: 'Taylor Reed',
    lastEditorAvatar: '',
    lastModified: '2 months ago'
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
    lastEditor: 'John Smith',
    lastEditorAvatar: '',
    lastModified: '2 months ago'
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    lastEditor: 'Sam Lee',
    lastEditorAvatar: '',
    lastModified: '3 months ago'
  }
]
