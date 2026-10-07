import {
  CAREERS_HOME_HERO,
  CAREERS_JOBS_PATH,
  CAREERS_JOIN,
  CAREERS_JOURNEY,
  CAREERS_ROLES,
  CAREERS_VALUES
} from '../careers-home.js'

const jobsFor = (area) => `${CAREERS_JOBS_PATH}?area=${encodeURIComponent(area)}`

export const CAREERS_HOME_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    title: CAREERS_HOME_HERO.title,
    description: CAREERS_HOME_HERO.description
  },
  {
    section: 'CapabilityGrid',
    items: CAREERS_VALUES.map((value) => ({ title: value, description: '' }))
  },
  {
    section: 'CardCarousel',
    kind: 'steps',
    title: CAREERS_JOURNEY.title,
    description: CAREERS_JOURNEY.description,
    cards: CAREERS_JOURNEY.steps
  },
  {
    section: 'CardCarousel',
    kind: 'areas',
    title: CAREERS_ROLES.title,
    cards: CAREERS_ROLES.areas.map((role) => ({
      title: role.area,
      description: role.description,
      action: {
        label: CAREERS_ROLES.action,
        href: jobsFor(role.area),
        kind: 'outlined',
        trailing: true
      }
    }))
  },
  {
    section: 'ClosingCallToAction',
    kind: 'panel',
    title: CAREERS_JOIN.title,
    description: CAREERS_JOIN.description,
    actions: [
      { label: CAREERS_JOIN.action, href: CAREERS_JOBS_PATH, kind: 'secondary', trailing: true }
    ]
  }
]
