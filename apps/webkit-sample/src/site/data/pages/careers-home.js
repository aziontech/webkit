import { markRaw } from 'vue'

import BrandGlobeScene from '../../ui/BrandGlobeScene.vue'
import { CAREERS_JOBS, jobFacets, jobId } from '../careers.js'
import {
  CAREERS_HOME_HERO,
  CAREERS_JOBS_PATH,
  CAREERS_PHOTOS,
  CAREERS_PROCESS,
  CAREERS_ROLES,
  CAREERS_VISION,
  CAREERS_WORK
} from '../careers-home.js'
import { COMPANY_CLOSING } from '../product-pages.js'

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
    gap: false,
    title: CAREERS_WORK.title,
    description: CAREERS_WORK.description,
    descriptionWidth: 'wide',
    photos: CAREERS_PHOTOS,
    ariaLabel: 'Azion offices',
    duration: 60
  },
  {
    section: 'MediaSplitBand',
    eyebrow: CAREERS_VISION.eyebrow,
    title: CAREERS_VISION.title,
    description: CAREERS_VISION.description,
    size: 'large',
    mediaPadded: true,
    scene: { component: markRaw(BrandGlobeScene) }
  },
  {
    section: 'ProcessScroll',
    title: CAREERS_PROCESS.title,
    titleKind: 'centered',
    description: CAREERS_PROCESS.description,
    steps: CAREERS_PROCESS.steps,
    ariaLabel: 'Hiring process stages'
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
  COMPANY_CLOSING
]
