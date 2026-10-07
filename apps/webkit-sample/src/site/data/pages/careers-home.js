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
    section: 'CapabilityGrid',
    items: CAREERS_JOURNEY.steps.map((step) => ({
      title: step.title,
      description: step.description
    }))
  },
  {
    section: 'ResourceGrid',
    eyebrow: '',
    title: CAREERS_ROLES.title,
    items: CAREERS_ROLES.areas.map((role) => ({
      title: role.area,
      description: role.description,
      href: jobsFor(role.area)
    })),
    actions: []
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
