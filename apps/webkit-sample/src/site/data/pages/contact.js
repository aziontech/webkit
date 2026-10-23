import { COMPANY_CLOSING } from '../product-pages.js'

export const CONTACT_PAGE = [
  {
    section: 'HeroForm',
    eyebrow: 'Contact',
    title: 'Talk to a specialist',
    description:
      'Get help with performance, security, and AI workloads. Use live chat or send your question through the form.',
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
  COMPANY_CLOSING
]
