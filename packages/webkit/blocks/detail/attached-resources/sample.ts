import type { AttachedResourcesDomain } from './attached-resources.vue'

export const sampleDomains: AttachedResourcesDomain[] = [
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
