import { PARTNER_FIGURES, PARTNER_REASONS, PARTNER_ROLES } from '../partners.js'
import { COMPANY_CLOSING } from '../product-pages.js'

export const PARTNERS_PAGE = [
  {
    section: 'HeroForm',
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
  {
    section: 'CapabilityGrid',
    title: 'Why you should be a partner of the Azion Marketplace?',
    description:
      'With the Azion Marketplace, we enable you to expand your revenue channels by offering edge-enabled solutions integrated into the Azion Edge Computing Platform. Azion is rapidly expanding the number of use cases covered by the Marketplace, which already include fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge.',
    items: PARTNER_REASONS
  },
  COMPANY_CLOSING
]
