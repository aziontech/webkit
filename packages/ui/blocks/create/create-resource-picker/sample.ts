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

/** A firewall the OptionalBinding variant can bind. */
export interface ResourcePickerFirewall {
  /** Stable key. */
  value: string
  /** Display name. */
  label: string
  /** Its rules and modules, already phrased. */
  description?: string
}

export const sampleFirewalls: ResourcePickerFirewall[] = [
  { value: 'production-firewall', label: 'production-firewall', description: '12 rules · WAF' },
  { value: 'api-firewall', label: 'api-firewall', description: '4 rules · Rate limiting' },
  { value: 'docs-firewall', label: 'docs-firewall', description: '1 rule · Bot Manager' },
  { value: 'staging-firewall', label: 'staging-firewall', description: '3 rules · WAF' },
  {
    value: 'checkout-firewall',
    label: 'checkout-firewall',
    description: '8 rules · WAF, Bot Manager'
  },
  {
    value: 'partner-api-firewall',
    label: 'partner-api-firewall',
    description: '2 rules · Network Shield'
  },
  { value: 'marketing-firewall', label: 'marketing-firewall', description: '1 rule · WAF' }
]
export const sampleFirewallModules = [
  {
    key: 'ddos',
    title: 'DDoS Protection',
    description: 'Absorbs volumetric attacks at the network layer. Always on.',
    locked: true
  },
  {
    key: 'waf',
    title: 'WAF',
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'networkShield',
    title: 'Network Shield',
    description: 'Blocks traffic by country, ASN or IP range using network lists.'
  },
  {
    key: 'botManager',
    title: 'Bot Manager',
    description: 'Scores automated traffic and challenges the requests that fail.'
  }
]
