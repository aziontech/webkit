import { CAREERS_JOBS, jobFacets, jobId } from '../careers.js'
import {
  CAREERS_HOME_HERO,
  CAREERS_JOBS_PATH,
  CAREERS_JOIN,
  CAREERS_PHOTOS,
  CAREERS_ROLES,
  CAREERS_WORK
} from '../careers-home.js'

const LATEST_ROLES = CAREERS_JOBS.slice(0, CAREERS_ROLES.previewCount).map((job) => {
  const [team, location, arrangement, contract] = jobFacets(job)
  return {
    href: `/site/careers/${jobId(job)}`,
    values: {
      role: job.title,
      team: `${team} · ${location}`,
      type: `${arrangement} · ${contract}`
    }
  }
})

export const CAREERS_HOME_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: CAREERS_HOME_HERO.eyebrow,
    title: CAREERS_HOME_HERO.title,
    description: CAREERS_HOME_HERO.description,
    actions: [{ label: CAREERS_HOME_HERO.action, href: '#latest-roles', kind: 'secondary' }]
  },
  {
    section: 'PhotoMarquee',
    title: CAREERS_WORK.title,
    description: CAREERS_WORK.description,
    photos: CAREERS_PHOTOS,
    ariaLabel: 'Azion offices',
    duration: 60
  },
  {
    section: 'ListingTable',
    anchor: 'latest-roles',
    title: CAREERS_ROLES.title,
    columns: [
      { key: 'role', label: CAREERS_ROLES.columns.role, grow: 2 },
      { key: 'team', label: CAREERS_ROLES.columns.team, grow: 2 },
      { key: 'type', label: CAREERS_ROLES.columns.type, align: 'end' }
    ],
    rows: LATEST_ROLES,
    action: { label: CAREERS_ROLES.action(CAREERS_JOBS.length), href: CAREERS_JOBS_PATH }
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    title: CAREERS_JOIN.title,
    description: CAREERS_JOIN.description,
    actions: [{ label: CAREERS_JOIN.action, href: CAREERS_JOBS_PATH, kind: 'secondary' }]
  }
]
