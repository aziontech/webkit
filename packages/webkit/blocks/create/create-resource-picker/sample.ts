import type { ResourcePickerOption } from './create-resource-picker.vue'

export const sampleProjects: ResourcePickerOption[] = [
  { value: 'web-app', label: 'web-app', description: 'Astro · acme/web-app' },
  {
    value: 'black-friday-2025',
    label: 'black-friday-2025',
    description: 'Next.js · acme/black-friday-2025'
  },
  {
    value: 'black-friday-2026',
    label: 'black-friday-2026',
    description: 'Next.js · acme/black-friday-2026'
  },
  { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs-site' },
  { value: 'docs-next', label: 'docs-next', description: 'Next.js · acme/docs-next' },
  { value: 'vue-sample', label: 'vue-sample', description: 'Vue · jane-doe/vue-sample' },
  { value: 'hello-world', label: 'hello-world', description: 'JavaScript · acme/hello-world' },
  { value: 'company-site', label: 'company-site', description: 'HTML · acme/company-site' },
  { value: 'company-docs', label: 'company-docs', description: 'HTML · acme/company-docs' },
  { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
  { value: 'analytics-api', label: 'analytics-api', description: 'Next.js · acme/analytics-api' },
  {
    value: 'react-dashboard',
    label: 'react-dashboard',
    description: 'React · acme/react-dashboard'
  },
  { value: 'docs-portal', label: 'docs-portal', description: 'Vue · acme/docs-portal' },
  { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · acme/ecommerce-v2' },
  {
    value: 'ecommerce-storefront',
    label: 'ecommerce-storefront',
    description: 'Nuxt · acme/ecommerce-storefront'
  },
  {
    value: 'marketing-site',
    label: 'marketing-site',
    description: 'Astro · acme/marketing-site'
  },
  { value: 'blog-platform', label: 'blog-platform', description: 'Astro · acme/blog-platform' },
  { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
  { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · acme/mobile-app' }
]

export const sampleSelected = 'web-app'
