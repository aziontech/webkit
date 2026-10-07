export const SUPPORT_HERO = {
  eyebrow: 'Support',
  title: 'Technical support for every stage of your growth',
  description: 'Designed to help you move independently. Backed by specialists when you need them.'
}

export const SUPPORT_MARKS = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

export const SUPPORT_REASONS = [
  {
    icon: 'pi pi-server',
    title: 'High availability',
    description:
      'Ensure operational continuity for latency-sensitive financial applications and APIs, with automatic scalability and real-time responses, even during transaction peaks.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Advanced security',
    description:
      'Protect financial data and transactions with multilayer security integrated into the application, mitigating API attacks, DDoS, and bots without increasing operational complexity.'
  },
  {
    icon: 'pi pi-check-circle',
    title: 'Continuous compliance',
    description:
      'Meet regulatory requirements with consistent security policies and continuous auditing across distributed environments, without compromising performance or development agility.'
  }
]

export const SUPPORT_TIERS = [
  {
    id: 'developer',
    name: 'Developer',
    description: 'Ideal for exploring the platform independently.',
    action: { label: 'Start Free', kind: 'outlined', to: '/signup' }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Ideal for teams that need support from specialists.',
    action: { label: 'Contact Us', kind: 'outlined', to: '/site/contact' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Ideal for organizations that require advanced support and ongoing services.',
    highlighted: true,
    action: { label: 'Contact Us', kind: 'secondary', to: '/site/contact' }
  },
  {
    id: 'mission-critical',
    name: 'Mission-Critical',
    description: 'Ideal for mission-critical operations that need priority and proactive support.',
    action: { label: 'Contact Us', kind: 'outlined', to: '/site/contact' }
  }
]

const SUPPORT_PRICING = 'https://www.azion.com/en/documentation/products/pricing/'

const heading = (label) => ({ label, group: true, values: ['', '', '', ''] })

export const SUPPORT_SECTIONS = [
  {
    eyebrow: 'Support',
    title: 'Get assistance when it matters most',
    link: { label: 'See Pricing', href: `${SUPPORT_PRICING}#support` },
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
      { label: 'Production system impaired', values: ['—', '< 4 hours', '< 4 hours', '< 2 hours'] },
      { label: 'Production system down', values: ['—', '< 2 hours', '< 1 hour', '< 30 minutes'] },
      { label: 'Business system down', values: ['—', '—', '< 15 minutes', '< 15 minutes'] }
    ]
  },
  {
    eyebrow: 'Professional Services',
    title: 'Move faster with specialist guidance',
    link: { label: 'See Pricing', href: `${SUPPORT_PRICING}#professional-services` },
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

export const SUPPORT_PRICING_LINK = {
  label: 'pricing documentation',
  href: `${SUPPORT_PRICING}#support`
}

export const SUPPORT_FAQ = [
  {
    value: 'developer-technical-cases',
    question: 'Can I open technical support cases with Developer Support?',
    answer:
      'Developer Support is self-service. It includes access to documentation, guides, white papers, the Learning Center, Azion Copilot (AI), and the Azion Community on Discord. It doesn’t include technical support through ticket, email, phone, or video call, and it doesn’t include response time commitments.'
  },
  {
    value: 'developer-billing-cases',
    question: 'Can I open a billing support case with Developer Support?',
    answer:
      'Yes. Billing support is available for paid Azion accounts regardless of the selected Support tier. If you have questions about invoices, charges, or billing, you can open a billing support case.'
  },
  {
    value: 'enterprise-plan',
    question: 'Does the Enterprise Plan include Enterprise Support?',
    answer:
      'No. The Enterprise Plan defines access to the Azion platform, including applicable usage or spend commitments and billing conditions. Enterprise Support is a support tier that gives you access to Azion professionals, support channels, response time commitments, and specialist assistance based on the contracted scope.'
  },
  {
    value: 'cancel-tier',
    question: 'What happens if I want to cancel my Support tier?',
    answer:
      'Paid Support tiers require a minimum 12-month commitment and follow the early termination and cancellation rules defined in the applicable Customer Agreement, Service Order, or related contract documents.'
  },
  {
    value: 'pricing',
    question: 'Where can I find Support pricing?',
    answer:
      'Support pricing is available in Azion’s pricing documentation. Prices may vary based on the selected Support tier, monthly product charges, and applicable contract conditions.'
  },
  {
    value: 'languages',
    question: 'In which languages does Azion provide Support?',
    answer:
      'Azion provides Technical Support in the language of the country where Azion was contracted. Depending on the contracting country, Support may be available in English, Spanish, or Portuguese.'
  },
  {
    value: 'channels',
    question: 'Which support channels are available?',
    answer:
      'Available channels depend on the selected tier. Business Support includes 24/7 assistance via ticket and email. Enterprise and Mission-Critical Support add access to phone and video call support. Slack-based communication may also be available as a paid add-on based on the contracted scope. Community Support on Discord is open to everyone.'
  },
  {
    value: 'response-time',
    question: 'How is first response time measured?',
    answer:
      'Response times depend on the selected Support tier, case severity, and applicable Support Guidelines. They are measured from the submission of a valid support case through ticket or email by an authorized contact.'
  },
  {
    value: 'professional-services',
    question: 'Do Support tiers include Professional Services?',
    answer:
      'Some paid Support tiers include selected Professional Services, such as Integration Services, Best Practices Review, Business Events Support, or Technical Account Manager hours. Included services are tier-specific, subject to their own scope and limits, and don’t accumulate with services included in lower tiers.'
  },
  {
    value: 'configuration-changes',
    question: 'Can Azion make configuration changes for me?',
    answer:
      'Support can help troubleshoot issues and provide guidance, but it does not include configuration changes on behalf of the customer. These changes may be performed through Integration Services or Managed Configuration Service, based on the contracted scope and the hours included in the package.'
  },
  {
    value: 'slack',
    question: 'Does Slack replace support cases?',
    answer:
      'No. Slack can be used for coordination, questions, updates, and support-related communication, but it doesn’t replace formal support case registration when required for severity classification, response time measurement, incident tracking, or contractual support obligations.'
  }
]

export const SUPPORT_CLOSING = {
  eyebrow: 'Get Started',
  title: 'Get the right assistance when it matters most',
  description: 'Explore how companies use Azion to improve performance, security, and reliability.',
  action: { label: 'Talk to a Specialist', to: '/site/contact' },
  aside: { label: 'Success Stories', to: '/site/success-cases' }
}
