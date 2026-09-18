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

import { createdRowsFor } from '../state/created-resources'

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
].map(customPageRow)

/**
 * A custom page as a LIST ROW — the record itself plus the fields its table displays.
 *
 * Exported because the seed is not the only source of rows any more: a custom page created
 * in this session is stored as the answers the reader gave (../state/created-resources.js)
 * and has to arrive in the list as the SAME row, derived fields and all. Two projections
 * would be two lists that disagree about what a row is.
 *
 * @param {object} page The base record.
 * @param {number} [index] Position in the seed — picks the round-robin author.
 * @returns {object} The row.
 */
export function customPageRow(page, index = 0) {
  const person = authorAt(index)
  return {
    ...page,
    statusCodes: page.statuses.join(', '),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(page.modifiedAt)
  }
}

/** A seeded custom page by id, or `undefined`. */
/**
 * EVERY custom page there is — the ones created in this session, then the seed. Same
 * argument as `allFirewalls` in ./firewalls.js: the create page stores what it makes
 * (../state/created-resources.js), so the seed is no longer the whole list.
 */
export const allCustomPages = () => [...createdRowsFor('custom-pages'), ...CUSTOM_PAGES]

export const customPageById = (id) => allCustomPages().find((page) => page.id === String(id))

/** The id of a seeded custom page by NAME, or `''`. Deployment settings bind by name, so
 *  this is what turns a binding into a link to the page's own settings. */
export const customPageIdByName = (name) =>
  allCustomPages().find((page) => page.name === name)?.id ?? ''

/** The seeded custom pages as SELECTABLE ROWS — what a create offers under "bind a custom
 *  page". Most recently touched first, the same order the firewall list uses. */
export const existingCustomPageOptions = () =>
  allCustomPages()
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .map((page) => ({ value: page.name, label: page.name }))
