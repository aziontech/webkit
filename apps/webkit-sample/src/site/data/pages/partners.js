import { PARTNER_FIGURES, PARTNER_REASONS, PARTNER_ROLES } from '../partners.js'
import { COMPANY_CLOSING } from '../product-pages.js'

export const PARTNERS_PAGE = [
  {
    section: 'HeroForm',
    anchor: 'become-a-partner',
    eyebrow: 'Partners',
    title: 'Grow as an Azion partner',
    description:
      "Join Azion's global partner program and offer customers a platform that speeds up, protects, and scales their applications.",
    carouselMarks: [],
    formLabel: 'Become a partner',
    roles: PARTNER_ROLES,
    labels: {
      email: 'Email',
      rolePlaceholder: 'Select your role',
      company: 'Company name',
      phone: 'Phone number',
      submit: 'Send'
    },
    messages: {
      success: 'Request sent.',
      error: "Couldn't send the request. Try again."
    }
  },
  { section: 'StatsBand', items: PARTNER_FIGURES },
  {
    section: 'CapabilityGrid',
    title: 'Why partner on Azion Marketplace',
    description:
      'Add a revenue channel by offering your solution to Azion customers through Azion Marketplace. Partners already cover fraud detection, authentication and authorization, bot mitigation, and facial recognition, with visual computing and AI that run close to users.',
    items: PARTNER_REASONS,
    actions: [
      { label: 'Become a partner', href: '#become-a-partner', kind: 'secondary' },
      { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  COMPANY_CLOSING
]
