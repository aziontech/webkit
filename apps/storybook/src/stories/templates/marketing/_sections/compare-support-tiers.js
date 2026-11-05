const PRICING = 'https://www.azion.com/en/documentation/products/pricing/'

const TIERS = [
  {
    id: 'developer',
    name: 'Developer',
    description: 'Ideal for exploring the platform independently.',
    highlighted: false,
    action: { label: 'Start for free', href: '/signup' }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Ideal for teams that need support from specialists.',
    highlighted: false,
    action: { label: 'Talk to a specialist', href: '/contact' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Ideal for organizations that require advanced support and ongoing services.',
    highlighted: true,
    action: { label: 'Talk to a specialist', href: '/contact' }
  },
  {
    id: 'mission-critical',
    name: 'Mission-Critical',
    description: 'Ideal for mission-critical operations that need priority and proactive support.',
    highlighted: false,
    action: { label: 'Talk to a specialist', href: '/contact' }
  }
]

const heading = (label) => ({ label, group: true, values: ['', '', '', ''] })

const SECTIONS = [
  {
    eyebrow: 'Support',
    title: 'Get help when it matters most',
    action: { label: 'See pricing', href: `${PRICING}#support` },
    rows: [
      heading('Self-service support'),
      { label: 'Learning Center', values: [true, true, true, true] },
      { label: 'Azion Copilot (AI)', values: [true, true, true, true] },
      heading('Technical Support'),
      { label: 'Community Support (Discord)', values: [true, true, true, true] },
      { label: '24/7 support via ticket and email', values: ['—', true, true, true] },
      { label: 'Phone and video support', values: ['—', '—', true, true] },
      { label: 'Slack channel', values: ['—', '—', 'Paid add-on', 'Paid add-on'] },
      heading('First response time'),
      { label: 'General guidance', values: ['—', '< 24 hours', '< 24 hours', '< 12 hours'] },
      { label: 'System impaired', values: ['—', '< 12 hours', '< 12 hours', '< 12 hours'] },
      {
        label: 'Production system impaired',
        values: ['—', '< 4 hours', '< 4 hours', '< 2 hours']
      },
      { label: 'Production system down', values: ['—', '< 2 hours', '< 1 hour', '< 30 minutes'] },
      { label: 'Business system down', values: ['—', '—', '< 15 minutes', '< 15 minutes'] }
    ]
  },
  {
    eyebrow: 'Professional Services',
    title: 'Move faster with specialist guidance',
    action: { label: 'See pricing', href: `${PRICING}#professional-services` },
    rows: [
      {
        label: 'Integration Services',
        group: true,
        values: ['—', '5 hours/year included', '20 hours/year included', '60 hours/year included']
      },
      {
        label: 'Best Practices Review',
        group: true,
        values: ['—', 'Paid add-on', '20 hours/year included', '40 hours/year included']
      },
      {
        label: 'Business Events Support',
        group: true,
        values: ['—', '—', '1 event per year', '100 hours/year included']
      },
      {
        label: 'Technical Account Manager',
        group: true,
        values: ['—', '—', 'Paid add-on', '20 hours/month included']
      },
      {
        label: 'Instructor-Led Training',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      },
      {
        label: 'Managed Configuration Service',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      },
      {
        label: 'Security Response Team',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      }
    ]
  }
]

export const SITE_SECTION = {
  _id: 'compare-support-tiers',
  props: {
    anchor: 'tiers',
    caption:
      'Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers.',
    columnLabel: 'Support',
    pickerAriaLabel: 'Tier being compared',
    includedLabel: 'Included',
    excludedLabel: 'Not included',
    tiers: TIERS,
    sections: SECTIONS
  }
}
