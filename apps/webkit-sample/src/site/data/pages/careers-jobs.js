import {
  CAREERS_ALL,
  CAREERS_AREAS,
  CAREERS_EMPTY,
  CAREERS_JOBS,
  CAREERS_LOCATIONS,
  CAREERS_TOOLBAR,
  jobFacets,
  jobId,
  jobLocations
} from '../careers.js'
import { CAREERS_ROLES } from '../careers-home.js'

const narrowing = (options) => options.filter((option) => option.value !== CAREERS_ALL)

const allLabel = (options) => options.find((option) => option.value === CAREERS_ALL)?.label ?? ''

const JOB_ROWS = CAREERS_JOBS.map((job) => {
  const [team, location, arrangement, contract] = jobFacets(job)
  return {
    href: `/site/careers/${jobId(job)}`,
    group: job.area,
    values: {
      role: job.title,
      team: `${team} · ${location}`,
      type: `${arrangement} · ${contract}`
    },
    facets: { area: [job.area], location: jobLocations(job) }
  }
})

export const CAREERS_JOBS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    eyebrow: 'Careers',
    title: "We're hiring!"
  },
  {
    section: 'ListingBrowser',
    title: 'Open positions',
    columns: [
      { key: 'role', label: CAREERS_ROLES.columns.role, grow: 2 },
      { key: 'team', label: CAREERS_ROLES.columns.team, grow: 2 },
      { key: 'type', label: CAREERS_ROLES.columns.type, align: 'end' }
    ],
    rows: JOB_ROWS,
    groups: narrowing(CAREERS_AREAS).map((option) => option.value),
    facets: [
      {
        key: 'area',
        label: CAREERS_TOOLBAR.areasLabel,
        allLabel: CAREERS_TOOLBAR.allAreas,
        options: narrowing(CAREERS_AREAS)
      },
      {
        key: 'location',
        label: CAREERS_TOOLBAR.locationLabel,
        allLabel: allLabel(CAREERS_LOCATIONS),
        options: narrowing(CAREERS_LOCATIONS)
      }
    ],
    sorts: CAREERS_TOOLBAR.sorts.map((sort) => ({
      ...sort,
      by: sort.value === 'title' ? 'role' : ''
    })),
    sortLabel: CAREERS_TOOLBAR.sortLabel,
    search: {
      placeholder: CAREERS_TOOLBAR.search,
      shortPlaceholder: CAREERS_TOOLBAR.searchShort,
      label: CAREERS_TOOLBAR.searchLabel
    },
    empty: CAREERS_EMPTY
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
