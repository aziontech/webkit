import { PARTNER_FIGURES, PARTNER_REASONS, PARTNER_ROLES } from '../partners.js'

export const PARTNERS_PAGE = [
  {
    section: 'HeroForm',
    title: 'Grow as an Azion Partner',
    description:
      "Join Azion's global partner ecosystem and unlock new business opportunities with a platform built to accelerate, protect, and scale modern applications.",
    carouselMarks: [],
    formLabel: 'Become a Partner',
    roles: PARTNER_ROLES.map((role) => ({ value: role, label: role })),
    labels: {
      email: 'E-mail:',
      rolePlaceholder: 'Please Select',
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
