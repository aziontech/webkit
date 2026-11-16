import type { OnboardingFormAccount, OnboardingFormPlan } from './onboarding-form.vue'

export const sampleAccount: OnboardingFormAccount = {
  email: 'myemail@example.com',
  address: {
    country: 'United States',
    postalCode: '94105',
    state: 'California',
    city: 'San Francisco',
    line1: '100 Market Street',
    line2: 'Suite 400'
  },
  cardLast4: '8888'
}

export const samplePlans: OnboardingFormPlan[] = [
  {
    value: 'free',
    label: "I'm working on personal projects",
    description: 'Start free for personal projects and experimentation',
    ariaLabel: "I'm working on personal projects. Free plan, Free.",
    name: 'Free',
    variant: 'contrast',
    price: 'Free'
  },
  {
    value: 'pro',
    label: "I'm working on commercial projects",
    description: 'For growing projects with higher usage demand',
    ariaLabel: "I'm working on commercial projects. Pro plan, From $20/mo.",
    name: 'Pro',
    severity: 'info',
    price: 'From $20/mo',
    features: [
      { label: '100 resources', description: 'then $0.10 per resource per month' },
      { label: '10M requests', description: 'then as low as $0.90 per 1M' },
      { label: '50 hours of compute time', description: 'then $0.18 per hour' },
      { label: '10 GB of event log storage', description: 'then $0.10 per GB-month' },
      { label: '100 GB of file storage', description: 'then as low as $0.021 per GB-month' },
      { label: '1 GB of database storage', description: 'then $0.75 per GB-month' },
      { label: '100M security rule evaluations', description: 'then as low as $0.30 per 1M' },
      { label: 'DDoS protection included' },
      { label: 'PCI DSS 4.0.1 Level 1' },
      { label: 'SOC 2 Type 2 / SOC 3' },
      { label: 'Data migration assistance' }
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next charge', value: '$25', suffix: 'on Dec 16, 2026' },
          { label: 'Subtotal', value: '$25', suffix: 'per month' }
        ],
        total: { value: '$25', suffix: 'per month' }
      },
      yearly: {
        rows: [
          { label: 'Next charge', value: '$240', suffix: 'on Nov 16, 2027' },
          { label: 'Subtotal', value: '$300', suffix: 'per year' },
          { label: 'Yearly discount', value: '−$60', suffix: 'per year' }
        ],
        total: { value: '$240', suffix: 'per year' }
      }
    }
  },
  {
    value: 'enterprise',
    label: "I'm running production at scale",
    description: 'Optimize costs with usage or spend commitments',
    ariaLabel: "I'm running production at scale. Enterprise plan, From $2,000/mo.",
    name: 'Enterprise',
    variant: 'primary',
    price: 'From $2,000/mo',
    features: [
      { label: 'Unlimited resources' },
      { label: '1B requests', description: 'then as low as $0.60 per 1M' },
      { label: '500 hours of compute time', description: 'then $0.12 per hour' },
      { label: '1 TB of event log storage', description: 'then $0.08 per GB-month' },
      { label: '10 TB of file storage', description: 'then as low as $0.015 per GB-month' },
      { label: '100 GB of database storage', description: 'then $0.50 per GB-month' },
      { label: '1B security rule evaluations', description: 'then as low as $0.20 per 1M' },
      { label: 'DDoS protection included' },
      { label: 'PCI DSS 4.0.1 Level 1' },
      { label: 'SOC 2 Type 2 / SOC 3' },
      { label: 'Data migration assistance' },
      { label: '99.99% uptime SLA' },
      { label: 'Named account team' }
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next charge', value: '$2,000', suffix: 'on Dec 16, 2026' },
          { label: 'Subtotal', value: '$2,000', suffix: 'per month' }
        ],
        total: { value: '$2,000', suffix: 'per month' }
      },
      yearly: {
        rows: [
          { label: 'Next charge', value: '$19,200', suffix: 'on Nov 16, 2027' },
          { label: 'Subtotal', value: '$24,000', suffix: 'per year' },
          { label: 'Yearly discount', value: '−$4,800', suffix: 'per year' }
        ],
        total: { value: '$19,200', suffix: 'per year' }
      }
    }
  }
]
