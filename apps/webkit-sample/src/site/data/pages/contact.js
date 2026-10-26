import { CONSOLE_LOGIN, SYSTEM_STATUS } from '../contact.js'
import { COMPANY_CLOSING } from '../product-pages.js'

export const CONTACT_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band-small',
    titleLength: 'short',
    eyebrow: 'Contact',
    title: 'Contact us',
    description: 'Talk to sales about a new project, or reach support about one already running.'
  },
  {
    section: 'ContactHub',
    gap: false,
    lanes: [
      {
        icon: 'pi pi-briefcase',
        label: 'Sales',
        description:
          'Discuss your requirements, get custom pricing, or see the platform running on your own workload.',
        actions: [{ label: 'Talk to sales', href: '/site/contact/sales', kind: 'secondary' }]
      },
      {
        icon: 'pi pi-headphones',
        label: 'Support',
        description:
          'Log in with your Azion account to open a ticket. Our engineers pick it up 24/7 on paid support plans.',
        actions: [
          {
            label: 'Log in to open a ticket',
            href: CONSOLE_LOGIN,
            kind: 'secondary',
            trailing: true,
            external: true
          }
        ],
        status: SYSTEM_STATUS
      }
    ],
    channels: [
      {
        icon: 'pi pi-shield',
        title: 'Under a cyberattack?',
        description:
          'Get emergency mitigation for an attack in progress, even before you become a customer.',
        href: '/site/contact/under-attack'
      },
      {
        icon: 'pi pi-discord',
        title: 'Join the community',
        description: 'Ask developers and the Azion team on Discord. Open to everyone, on any plan.',
        href: 'https://discord.com/invite/pM8ANzztuB'
      },
      {
        icon: 'pi pi-book',
        title: 'Read the docs',
        description: 'Guides, API reference, and troubleshooting for every Azion product.',
        href: 'https://www.azion.com/en/documentation/'
      }
    ]
  },
  COMPANY_CLOSING
]
