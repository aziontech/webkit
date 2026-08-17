// The custom pages the sample is seeded with — the Build → Custom Pages module.
//
// A CUSTOM PAGE is what the edge serves instead of a default error body: which HTTP
// statuses it covers, and where the content comes from. It is one of the three things
// a Deployment setting can bind (application · firewall · custom page — see
// lib/deployment-strategies.js), which is why it is its own module rather than a tab.
//
// `statuses` is a list per row, so it is a COLUMN but not a field: a field over it
// would ask "covers any of these", a different question from the membership every
// other field asks.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** The seeded custom pages, in list order. */
export const CUSTOM_PAGES = [
  {
    id: 'cp-4013',
    name: 'Branded 404',
    statuses: [404],
    connector: 'assets-bucket',
    status: 'Active',
    modifiedAt: daysAgo(5)
  },
  {
    id: 'cp-4014',
    name: 'Maintenance window',
    statuses: [503],
    connector: 'assets-bucket',
    status: 'Inactive',
    modifiedAt: daysAgo(52)
  },
  {
    id: 'cp-4015',
    name: 'Server error',
    statuses: [500, 502, 504],
    connector: 'assets-bucket',
    status: 'Active',
    modifiedAt: daysAgo(13)
  },
  {
    id: 'cp-4016',
    name: 'Blocked by firewall',
    statuses: [403],
    connector: 'storybook-static',
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  {
    id: 'cp-4017',
    name: 'Rate limited',
    statuses: [429],
    connector: 'storybook-static',
    status: 'Draft',
    modifiedAt: daysAgo(1)
  }
].map((page, index) => {
  const person = authorAt(index)
  return {
    ...page,
    statusCodes: page.statuses.join(', '),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(page.modifiedAt)
  }
})

/** A seeded custom page by id, or `undefined`. */
export const customPageById = (id) => CUSTOM_PAGES.find((page) => page.id === String(id))
