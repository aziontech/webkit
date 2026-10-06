import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

import { createdRowsFor } from '../state/created-resources'

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

export const allCustomPages = () => [...createdRowsFor('custom-pages'), ...CUSTOM_PAGES]

export const customPageById = (id) => allCustomPages().find((page) => page.id === String(id))

export const customPageIdByName = (name) =>
  allCustomPages().find((page) => page.name === name)?.id ?? ''

export const existingCustomPageOptions = () =>
  allCustomPages()
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
    .map((page) => ({ value: page.name, label: page.name }))
