import type {
  ChangePlanDrawerAddress,
  ChangePlanDrawerCharges,
  ChangePlanDrawerFeature,
  ChangePlanDrawerPeriod,
  ChangePlanDrawerPlan
} from './account-change-plan-drawer.vue'

export const samplePlans: ChangePlanDrawerPlan[] = [
  {
    id: 'free',
    name: 'Free',
    current: true,
    action: 'current',
    actionLabel: 'Current plan',
    featuresTitle: 'All features included',
    features: [
      { label: 'Global infrastructure' },
      { label: 'Serverless compute' },
      { label: 'Storage and database' },
      { label: 'Image optimization' },
      { label: 'DDoS mitigation and firewall' }
    ],
    card: {
      monthly: {
        value: 'Free',
        prefix: '$',
        suffix: '',
        showPrefix: false,
        showSuffix: false,
        details: 'Start free for personal projects and experimentation'
      },
      yearly: {
        value: 'Free',
        prefix: '$',
        suffix: '',
        showPrefix: false,
        showSuffix: false,
        details: 'Start free for personal projects and experimentation'
      }
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    current: false,
    action: 'upgrade',
    actionLabel: 'Continue with Pro',
    featuresTitle: 'All Free features, plus:',
    features: [
      { label: 'Additional resources' },
      { label: 'Higher request limits' },
      { label: 'More storage capacity' },
      { label: 'Broader security coverage' },
      { label: 'Configurable spend limit' }
    ],
    card: {
      monthly: {
        value: '25',
        prefix: '$',
        suffix: '/ month',
        showPrefix: true,
        showSuffix: true,
        details: 'Billed monthly, cancel anytime'
      },
      yearly: {
        value: '20',
        prefix: '$',
        suffix: '/ month',
        showPrefix: true,
        showSuffix: true,
        details: 'Billed annually, save 20%'
      }
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    current: false,
    action: 'contact',
    actionLabel: 'Contact sales',
    featuresTitle: 'All Pro features, plus:',
    features: [
      { label: 'On-demand pricing' },
      { label: 'Cut costs with commitments' },
      { label: 'Capacity Reservation available' },
      { label: 'Savings Plan available' },
      { label: 'Advanced support available' }
    ],
    card: {
      monthly: {
        value: 'Custom',
        prefix: '$',
        suffix: '',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      },
      yearly: {
        value: 'Custom',
        prefix: '$',
        suffix: '',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      }
    }
  }
]

export const sampleUpgradeFeatures: ChangePlanDrawerFeature[] = [
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
]

export const sampleCharges: Record<ChangePlanDrawerPeriod, ChangePlanDrawerCharges> = {
  monthly: {
    rows: [
      { label: 'Next charge', value: '$25', suffix: 'on Dec 16, 2026' },
      { label: 'Subtotal', value: '$25', suffix: 'per month' }
    ],
    total: { value: '$25', suffix: 'per month' },
    dueToday: '$25'
  },
  yearly: {
    rows: [
      { label: 'Next charge', value: '$240', suffix: 'on Nov 16, 2027' },
      { label: 'Subtotal', value: '$300', suffix: 'per year' },
      { label: 'Yearly discount', value: '−$60', suffix: 'per year' }
    ],
    total: { value: '$240', suffix: 'per year' },
    dueToday: '$240'
  }
}

export const sampleAccountAddress: ChangePlanDrawerAddress = {
  country: 'United States',
  postalCode: '94105',
  state: 'California',
  city: 'San Francisco',
  line1: '100 Market Street',
  line2: 'Suite 400'
}

export const sampleCardLast4 = '8888'
