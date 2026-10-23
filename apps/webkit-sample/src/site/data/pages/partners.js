import { PARTNER_FIGURES, PARTNER_REASONS, PARTNER_ROLES } from '../partners.js'

export const PARTNERS_PAGE = [
  {
    section: 'HeroForm',
    eyebrow: 'Partners',
    title: 'Grow as an Azion Partner',
    description:
      "Join Azion's global partner program and offer customers a platform that speeds up, protects, and scales their applications.",
    carouselMarks: [],
    formLabel: 'Become a Partner',
    roles: PARTNER_ROLES.map((role) => ({ value: role, label: role })),
    labels: {
      email: 'E-mail:',
      rolePlaceholder: 'Select your role',
      company: 'Company name',
      phone: 'Phone number:',
      submit: "Let's talk"
    },
    messages: {
      success: 'Request sent.',
      error: 'Could not send the request.'
    }
  },
  { section: 'StatsBand', items: PARTNER_FIGURES },
  { section: 'CapabilityGrid', items: PARTNER_REASONS },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
