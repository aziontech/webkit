import { agentsClosing } from '../product-pages.js'

export const CONTACT_PAGE = [
  {
    section: 'HeroForm',
    eyebrow: 'Contact',
    title: 'Talk to a specialist',
    description: 'Get help with performance, security, and AI workloads. Call us at',
    link: { label: '+1 833-332-9466', href: 'tel:+18333329466' },
    descriptionAfter: ', use live chat, or send your question through the form.',
    actions: [
      { label: 'Talk to support', href: '/site/support', kind: 'secondary' },
      {
        label: 'Stop an active attack',
        href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  agentsClosing('Build once. Run everywhere.')
]
