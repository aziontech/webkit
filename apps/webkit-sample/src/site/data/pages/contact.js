import { CONSOLE_LOGIN, SYSTEM_STATUS } from '../contact.js'
import { COMPANY_CLOSING } from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'
import { HOME_SOLUTIONS_BAND, HOME_WHY_AZION, MARKET_RECOGNITIONS } from './home.js'

const SALES_HIGHLIGHTS = [
  {
    icon: 'ai ai-edge-ai',
    title: 'Build AI applications',
    description: 'Run AI agents and inference close to your users.'
  },
  {
    icon: 'ai ai-build-pillar',
    title: 'Modernize applications',
    description: 'Go from commit to a live URL in minutes.'
  },
  {
    icon: 'ai ai-secure-pillar',
    title: 'Protect applications and APIs',
    description: 'Block DDoS attacks, malicious bots, and API abuse.'
  },
  {
    icon: 'ai ai-app-accelerator',
    title: 'Speed up every workload',
    description: '100+ data centers, with a 30 ms median latency.'
  }
]

export const CONTACT_PAGE = [
  {
    section: 'HeroForm',
    eyebrow: 'Contact',
    title: 'Talk to our sales team',
    description:
      'Get a custom demo, plan your migration, and explore plans and pricing built for your company.',
    highlights: SALES_HIGHLIGHTS,
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
  HOME_WHY_AZION,
  {
    ...HOME_SOLUTIONS_BAND,
    eyebrow: 'Solutions',
    title: 'One platform for every workload you run',
    description:
      'Modernize applications, run AI, protect APIs, and deliver media from the same infrastructure.'
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('herospark') },
  {
    section: 'RecognitionMarquee',
    items: MARKET_RECOGNITIONS
  },
  COMPANY_CLOSING
]
