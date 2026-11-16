import type { DomainsCardDomain } from './domains-card.vue'

export const sampleDomains: DomainsCardDomain[] = [
  {
    id: 'generated',
    domain: 'web-app-7f3a.example.net',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Managed',
    generated: true
  },
  {
    id: 'shop',
    domain: 'shop.example.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Managed',
    generated: false
  },
  {
    id: 'preview',
    domain: 'preview.example.com',
    environment: 'Stage',
    policy: 'Versioned',
    certificate: '*.example.com',
    generated: false
  }
]
