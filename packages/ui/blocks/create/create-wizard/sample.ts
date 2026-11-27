import type { CreateWizardPolicy } from './create-wizard.vue'
import type {
  ServiceWizardCachePolicy,
  ServiceWizardOption,
  ServiceWizardOriginField,
  ServiceWizardOriginType
} from './lib/service-wizard'

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

export const projectModes = [
  { label: 'Existing project', value: 'existing' },
  { label: 'New project', value: 'new' }
]
export const projects: ServiceWizardOption[] = [
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
export const cachePolicies: ServiceWizardCachePolicy[] = [
  {
    value: 'images',
    label: 'Image caching',
    description:
      'Caches images for a long TTL and ignores the query string, so one object serves every variation of the same file.',
    fields: [
      {
        name: 'extensions',
        label: 'Extension matches',
        placeholder: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff',
        required: true,
        description:
          'Comma-separated. The policy applies to requests whose path ends in one of them.'
      }
    ]
  },
  {
    value: 'files-optimization',
    label: 'File optimization',
    description:
      'Caches static assets and compresses them on the way out. The template carries the TTLs and the cache key.',
    fields: []
  }
]
export const originTypes = [
  { value: 'http', label: 'HTTP', description: 'An origin server, reached by host name.' },
  {
    value: 'storage',
    label: 'Storage',
    description: 'A storage location in this workspace, read by name and prefix.'
  },
  {
    value: 'live-ingest',
    label: 'Live Ingest',
    description: 'A region a live stream is ingested from.'
  }
]
export const originFieldsByType: Record<ServiceWizardOriginType, ServiceWizardOriginField[]> = {
  http: [
    {
      kind: 'text',
      name: 'address',
      label: 'Origin address',
      placeholder: 'origin.example.com',
      required: true,
      description: 'The host the project fetches from. No scheme.'
    },
    {
      kind: 'text',
      name: 'path',
      label: 'Path',
      placeholder: '/',
      description: 'Prefixed to the request path before it reaches the origin.'
    },
    {
      kind: 'text',
      name: 'uriPrefix',
      label: 'Apply when $uri starts with',
      placeholder: '/api',
      description: 'Leave it empty to send every request to this origin.'
    }
  ],
  storage: [
    {
      kind: 'select',
      name: 'location',
      label: 'Location',
      options: [
        { value: 'static-assets', label: 'static-assets' },
        { value: 'media-prod', label: 'media-prod' },
        { value: 'user-uploads', label: 'user-uploads' }
      ],
      required: true,
      description: 'A storage location in this workspace.'
    },
    {
      kind: 'text',
      name: 'prefix',
      label: 'Prefix',
      placeholder: 'assets/',
      description: 'The folder inside the location the origin reads from.'
    }
  ],
  'live-ingest': [
    {
      kind: 'select',
      name: 'region',
      label: 'Region',
      options: [
        { value: 'br-east-1', label: 'br-east-1, South America' },
        { value: 'us-east-1', label: 'us-east-1, North America' }
      ],
      required: true,
      description: 'Where the stream is ingested. Select the one closest to the broadcaster.'
    }
  ]
}
export const domainTypes = [
  { label: 'Free platform domain', value: 'platform' },
  { label: 'Your own domain', value: 'own' }
]
export const deploymentModes = [
  { label: 'Create one', value: 'auto' },
  { label: 'Use existing', value: 'existing' }
]
export const environments = [
  {
    value: 'Production',
    label: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.'
  },
  {
    value: 'Preview',
    label: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
  }
]
export const certificates: ServiceWizardOption[] = [
  { value: 'lets_encrypt', label: 'Let’s Encrypt' },
  { value: 'shared_san', label: 'Shared SAN' },
  { value: 'own', label: 'A certificate you upload' }
]
export const tlsVersions: ServiceWizardOption[] = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]
export const errorPages: ServiceWizardOption[] = [
  { value: 'Rate limited', label: 'Rate limited' },
  { value: 'Blocked by firewall', label: 'Blocked by firewall' },
  { value: 'Branded 404', label: 'Branded 404' },
  { value: 'Server error', label: 'Server error' },
  { value: 'Maintenance window', label: 'Maintenance window' }
]
export const deployments: ServiceWizardOption[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
  },
  { value: 's1', label: 'storefront-prod', description: 'Storefront traffic for production.' },
  { value: 's2', label: 'acme-storefront', description: 'Acme storefront, production traffic.' },
  {
    value: 's5',
    label: 'analytics-canary',
    description: 'Canary slice of the analytics project.'
  },
  { value: 's6', label: 'auth-service-prod', description: 'Authored in this workspace.' },
  { value: 's7', label: 'marketing-site-prod', description: 'Authored in this workspace.' },
  { value: 's9', label: 'internal-tools-dev', description: 'Authored in this workspace.' },
  { value: 's10', label: 'blog-platform-stage', description: 'Authored in this workspace.' },
  { value: 's11', label: 'web-app-prod', description: 'Production traffic for the web app.' },
  {
    value: 's12',
    label: 'web-app-preview',
    description: 'Per-version preview URLs for the web app.'
  },
  { value: 's13', label: 'web-app-stage', description: 'Stage rehearsals for the web app.' },
  {
    value: 's14',
    label: 'campaign-landing-prod',
    description: 'Production traffic for the seasonal campaign page.'
  },
  {
    value: 's15',
    label: 'campaign-landing-preview',
    description: 'Per-version preview URLs for the seasonal campaign page.'
  },
  {
    value: 's16',
    label: 'docs-site-prod',
    description: 'Production traffic for the documentation site.'
  },
  {
    value: 's17',
    label: 'docs-site-preview',
    description: 'Per-version preview URLs for the documentation site.'
  },
  {
    value: 'ws-1020655',
    label: 'service-01',
    description: 'Created with the service-01 service for Production.'
  },
  {
    value: 'ws-1020655-preview',
    label: 'service-01-preview',
    description: 'Created with the service-01 service for Preview.'
  },
  {
    value: 'ws-1020828',
    label: 'service-02',
    description: 'Created with the service-02 service for Production.'
  },
  {
    value: 'ws-1020828-preview',
    label: 'service-02-preview',
    description: 'Created with the service-02 service for Preview.'
  },
  {
    value: 'ws-1021001',
    label: 'service-03',
    description: 'Created with the service-03 service for Production.'
  },
  {
    value: 'ws-1021001-preview',
    label: 'service-03-preview',
    description: 'Created with the service-03 service for Preview.'
  },
  {
    value: 'ws-1021174',
    label: 'service-04',
    description: 'Created with the service-04 service for Production.'
  },
  {
    value: 'ws-1021174-preview',
    label: 'service-04-preview',
    description: 'Created with the service-04 service for Preview.'
  },
  {
    value: 'ws-1021347',
    label: 'service-05',
    description: 'Created with the service-05 service for Production.'
  },
  {
    value: 'ws-1021347-preview',
    label: 'service-05-preview',
    description: 'Created with the service-05 service for Preview.'
  },
  {
    value: 'ws-1021520',
    label: 'service-06',
    description: 'Created with the service-06 service for Production.'
  },
  {
    value: 'ws-1021520-preview',
    label: 'service-06-preview',
    description: 'Created with the service-06 service for Preview.'
  },
  {
    value: 'ws-1021693',
    label: 'service-07',
    description: 'Created with the service-07 service for Production.'
  },
  {
    value: 'ws-1021693-preview',
    label: 'service-07-preview',
    description: 'Created with the service-07 service for Preview.'
  },
  {
    value: 'ws-1021866',
    label: 'service-08',
    description: 'Created with the service-08 service for Production.'
  },
  {
    value: 'ws-1021866-preview',
    label: 'service-08-preview',
    description: 'Created with the service-08 service for Preview.'
  },
  {
    value: 'ws-1022039',
    label: 'service-09',
    description: 'Created with the service-09 service for Production.'
  },
  {
    value: 'ws-1022039-preview',
    label: 'service-09-preview',
    description: 'Created with the service-09 service for Preview.'
  },
  {
    value: 'ws-1022212',
    label: 'service-10',
    description: 'Created with the service-10 service for Production.'
  },
  {
    value: 'ws-1022212-preview',
    label: 'service-10-preview',
    description: 'Created with the service-10 service for Preview.'
  },
  {
    value: 'ws-1022385',
    label: 'service-11',
    description: 'Created with the service-11 service for Production.'
  },
  {
    value: 'ws-1022385-preview',
    label: 'service-11-preview',
    description: 'Created with the service-11 service for Preview.'
  },
  {
    value: 'ws-1022558',
    label: 'service-12',
    description: 'Created with the service-12 service for Production.'
  },
  {
    value: 'ws-1022558-preview',
    label: 'service-12-preview',
    description: 'Created with the service-12 service for Preview.'
  },
  {
    value: 'ws-1022731',
    label: 'service-13',
    description: 'Created with the service-13 service for Production.'
  },
  {
    value: 'ws-1022731-preview',
    label: 'service-13-preview',
    description: 'Created with the service-13 service for Preview.'
  },
  {
    value: 'ws-1022904',
    label: 'service-14',
    description: 'Created with the service-14 service for Production.'
  },
  {
    value: 'ws-1022904-preview',
    label: 'service-14-preview',
    description: 'Created with the service-14 service for Preview.'
  },
  {
    value: 'ws-1023077',
    label: 'service-15',
    description: 'Created with the service-15 service for Production.'
  },
  {
    value: 'ws-1023077-preview',
    label: 'service-15-preview',
    description: 'Created with the service-15 service for Preview.'
  },
  {
    value: 'ws-1023250',
    label: 'service-16',
    description: 'Created with the service-16 service for Production.'
  },
  {
    value: 'ws-1023250-preview',
    label: 'service-16-preview',
    description: 'Created with the service-16 service for Preview.'
  },
  {
    value: 'ws-1023423',
    label: 'service-17',
    description: 'Created with the service-17 service for Production.'
  },
  {
    value: 'ws-1023423-preview',
    label: 'service-17-preview',
    description: 'Created with the service-17 service for Preview.'
  },
  {
    value: 'ws-1023596',
    label: 'service-18',
    description: 'Created with the service-18 service for Production.'
  },
  {
    value: 'ws-1023596-preview',
    label: 'service-18-preview',
    description: 'Created with the service-18 service for Preview.'
  },
  {
    value: 'ws-1023769',
    label: 'service-19',
    description: 'Created with the service-19 service for Production.'
  },
  {
    value: 'ws-1023769-preview',
    label: 'service-19-preview',
    description: 'Created with the service-19 service for Preview.'
  },
  {
    value: 'ws-1023942',
    label: 'service-20',
    description: 'Created with the service-20 service for Production.'
  },
  {
    value: 'ws-1023942-preview',
    label: 'service-20-preview',
    description: 'Created with the service-20 service for Preview.'
  }
]
export const platformDomainSuffix = '.example.com'
