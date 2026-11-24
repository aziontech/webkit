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
    lastModified: '2026-10-10T12:00:00Z'
  },
  {
    id: 'v-002',
    key: 'PAYMENT_SECRET_KEY',
    value: 'sk_example_4f8a2c9e',
    secret: true,
    scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
    lastEditor: 'Jordan Kim',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
    lastEditor: 'Taylor Reed',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
    lastEditor: 'John Smith',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    lastEditor: 'Sam Lee',
    lastEditorAvatar: '',
    lastModified: '2026-08-06T12:00:00Z'
  }
]

export const sampleEnv = [
  '# Copied from the project .env',
  'API_BASE_URL=https://api.example.com',
  'CACHE_TTL=300',
  'export FEATURE_FLAGS="search,checkout"',
  'api_token=example',
  'CACHE_TTL=600'
].join('\n')

export const sampleNetworkList = [
  '# Office and partner ranges',
  '203.0.113.0/24  # head office',
  '198.51.100.17',
  '198.51.100.300',
  '2001:db8::/32  # partner VPN',
  '192.0.2.44',
  '198.51.100.17',
  '192.0.2.0/33',
  '192.0.2.128/25  # staging'
].join('\n')
