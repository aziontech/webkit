import type { CreateWizardPolicy } from './create-wizard.vue'

export const samplePolicies: CreateWizardPolicy[] = [
  { value: 'acme-production', label: 'acme-production', description: 'acme-site', ready: true },
  { value: 'acme-staging', label: 'acme-staging', description: 'acme-site', ready: false },
  { value: 'api-hardening', label: 'api-hardening', description: 'legacy-api', ready: false },
  {
    value: 'checkout-shield',
    label: 'checkout-shield',
    description: 'ecommerce-v2',
    ready: false
  },
  { value: 'dev-sandbox', label: 'dev-sandbox', description: 'internal', ready: false },
  {
    value: 'marketing-site',
    label: 'marketing-site',
    description: 'marketing-site',
    ready: false
  },
  { value: 'payments-api', label: 'payments-api', description: 'ecommerce-v2', ready: false },
  { value: 'partner-gateway', label: 'partner-gateway', description: 'legacy-api', ready: true },
  { value: 'admin-allowlist', label: 'admin-allowlist', description: 'status-page', ready: true },
  {
    value: 'media-delivery',
    label: 'media-delivery',
    description: 'blog-platform',
    ready: false
  },
  { value: 'acme-canary', label: 'acme-canary', description: 'acme-docs', ready: false },
  {
    value: 'search-api-shield',
    label: 'search-api-shield',
    description: 'ecommerce-storefront',
    ready: false
  },
  {
    value: 'legacy-storefront',
    label: 'legacy-storefront',
    description: 'ecommerce-storefront',
    ready: false
  },
  { value: 'qa-sandbox', label: 'qa-sandbox', description: 'internal', ready: false }
]
