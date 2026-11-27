import type { ProductionChecklistStep } from './detail-production-checklist.vue'

export const sampleSteps: ProductionChecklistStep[] = [
  {
    id: 'domain',
    icon: 'az az-globe',
    title: 'Add a custom domain',
    description:
      'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
    actionLabel: 'Add Domain',
    done: true,
    doneNote: 'Serving shop.example.com.'
  },
  {
    id: 'policy',
    icon: 'az az-shield',
    title: 'Enable a security policy',
    description:
      'Attach a policy so requests are inspected before they reach the service. Rate limiting, access rules, and IP allowlists.',
    actionLabel: 'Attach Policy',
    done: false,
    doneNote: ''
  },
  {
    id: 'customPage',
    icon: 'az az-file',
    title: 'Set custom error pages',
    description: 'Answer 4xx and 5xx with your own page instead of the default response.',
    actionLabel: 'Add Error Page',
    done: false,
    doneNote: ''
  }
]

export const sampleCompletedSteps: ProductionChecklistStep[] = [
  { ...sampleSteps[0] },
  { ...sampleSteps[1], done: true, doneNote: 'Protected by policy-production.' },
  { ...sampleSteps[2], done: true, doneNote: 'Serving Branded 404.' }
]
