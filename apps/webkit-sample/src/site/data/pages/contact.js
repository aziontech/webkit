import { CONSOLE_LOGIN, SYSTEM_STATUS } from '../contact.js'
import { COMPANY_CLOSING } from '../product-pages.js'

export const CONTACT_PAGE = [
  {
    section: 'HeroForm',
    eyebrow: 'Contact',
    title: 'Talk to our sales team',
    description:
      'Get a custom demo, plan your migration, and explore plans and pricing built for your company.',
    formLabel: 'Contact sales',
    labels: {
      email: 'Company e-mail',
      message: 'How can we help?',
      messagePlaceholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
      submit: 'Contact sales'
    },
    messages: {
      success: 'Request sent. Our sales team will be in touch.',
      error: 'Could not send your request.'
    }
  },
  {
    section: 'ContactHub',
    lanes: [
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
      },
      {
        icon: 'pi pi-shield',
        label: 'Under a cyberattack?',
        description:
          'Get emergency mitigation for an attack in progress, even before you become a customer.',
        actions: [
          {
            label: 'Request immediate contact',
            href: '/site/contact/under-attack',
            kind: 'secondary',
            trailing: true
          }
        ]
      }
    ],
    channels: [
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
