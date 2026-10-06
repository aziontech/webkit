const complianceFeatures = [
  { title: 'DDoS Protection included' },
  { title: 'PCI DSS 4.0.1 Level 1' },
  { title: 'SOC 2 Type 2 / SOC 3' },
  { title: 'Universal Data Migration Service' }
]

const pricingLinks = [
  { label: 'Learn more about Pricing', href: '/site/pricing' },
  { label: 'Compare Plans', href: '/site/pricing#comparison' }
]

export const azionPlans = [
  {
    id: 'hobby',
    name: 'Hobby',
    headline: "I'm working on personal projects",
    description: 'Start free for personal projects and experimentation',
    price: 'Free',
    card: {
      monthly: { value: 'Free', showPrefix: false, showSuffix: false, details: '' },
      yearly: { value: 'Free', showPrefix: false, showSuffix: false, details: '' }
    },
    severity: 'contrast',
    requiresPayment: false,
    comparison: {
      featuresTitle: 'All Features Included.',
      features: [
        { icon: 'pi pi-globe', label: 'Global infrastructure' },
        { icon: 'ai ai-edge-functions', label: 'Serverless functions' },
        { icon: 'ai ai-edge-storage', label: 'Storage and database' },
        { icon: 'pi pi-image', label: 'Image optimization' },
        { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation and firewall' }
      ]
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    headline: "I'm working on commercial projects",
    description: 'For growing applications with higher usage demand',
    price: 'From $20/mo',
    card: {
      monthly: {
        value: '25',
        prefix: '$',
        suffix: '/ mon',
        details: 'Billed monthly, cancel anytime'
      },
      yearly: { value: '20', prefix: '$', suffix: '/ mon', details: 'Billed annually, save 20%' }
    },
    severity: 'info',
    requiresPayment: true,
    comparison: {
      featuresTitle: 'All Hobby features, plus:',
      features: [
        { icon: 'ai ai-workloads', label: 'Additional workloads' },
        { icon: 'ai ai-edge-application', label: 'Higher application limits' },
        { icon: 'ai ai-store', label: 'More storage capacity' },
        { icon: 'ai ai-waf-rules', label: 'Broader security coverage' },
        { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
      ]
    },
    upgrade: {
      featuresTitle: "What's included",
      features: [
        { title: '100 Workloads', detail: 'then $0.10 per workload per month' },
        { title: '10M Application requests', detail: 'then as low as $0.90 per 1M' },
        { title: '50 hours Function compute time', detail: 'then $0.18 per hour' },
        { title: '10 GB Real-Time Events Storage', detail: 'then $0.10 per GB-month' },
        { title: '100 GB Object Storage', detail: 'then as low as $0.021 per GB-month' },
        { title: '1 GB SQL Database Storage', detail: 'then $0.75 per GB-month' },
        { title: '100M Firewall requests', detail: 'then as low as $0.30 per 1M' },
        ...complianceFeatures
      ],
      links: pricingLinks
    },
    charge: {
      periods: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
      ],
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
        ],
        total: { value: '$ 3.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 2.200', suffix: 'per month' }
        ],
        total: { value: '$ 2.200', suffix: 'per year' }
      }
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    headline: "I'm running production at scale",
    description: 'Optimize costs with usage or spend commitments',
    price: 'From $2.000/mo',
    card: {
      monthly: {
        value: 'Custom',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      },
      yearly: {
        value: 'Custom',
        showPrefix: false,
        showSuffix: false,
        details: 'Tailored to your usage requirements and payment terms'
      }
    },
    severity: 'primary',
    requiresPayment: true,
    comparison: {
      featuresTitle: 'All Pro features, plus:',
      features: [
        { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
        { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
        { icon: 'ai ai-layers', label: 'Capacity Reservation available' },
        { icon: 'pi pi-calendar', label: 'Savings Plan available' },
        { icon: 'ai ai-business-support', label: 'Advanced support available' }
      ]
    },
    contactSales: true,
    upgrade: {
      featuresTitle: "What's included",
      features: [
        { title: 'Unlimited Workloads' },
        { title: '1B Application requests', detail: 'then as low as $0.60 per 1M' },
        { title: '500 hours Function compute time', detail: 'then $0.12 per hour' },
        { title: '1 TB Real-Time Events Storage', detail: 'then $0.08 per GB-month' },
        { title: '10 TB Object Storage', detail: 'then as low as $0.015 per GB-month' },
        { title: '100 GB SQL Database Storage', detail: 'then $0.50 per GB-month' },
        { title: '1B Firewall requests', detail: 'then as low as $0.20 per 1M' },
        ...complianceFeatures,
        { title: '99.99% uptime SLA' },
        { title: 'Named account team' }
      ],
      links: pricingLinks
    },
    charge: {
      periods: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
      ],
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' }
        ],
        total: { value: '$ 24.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 4.800', suffix: 'per month' }
        ],
        total: { value: '$ 19.200', suffix: 'per year' }
      }
    }
  }
]

export const planFor = (id) => azionPlans.find((plan) => plan.id === id)

export const planByName = (name) =>
  azionPlans.find((plan) => plan.name.toLowerCase() === String(name ?? '').toLowerCase())

export const planSeverityFor = (name) => planByName(name)?.severity ?? 'secondary'

export const planNameFor = (id) => planFor(id)?.name ?? azionPlans[0].name

export const planRequiresPayment = (id) => Boolean(planFor(id)?.requiresPayment)

export const chargeFor = (id, period) => planFor(id)?.charge?.[period] ?? null

export const cardFor = (id, period) => {
  const plan = planFor(id)
  if (!plan) return null
  return (
    plan.card?.[period] ?? {
      value: plan.price,
      showPrefix: false,
      showSuffix: false,
      details: ''
    }
  )
}
