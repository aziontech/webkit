import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

export const SQL_DATABASES = [
  {
    id: 'db-store-sessions',
    name: 'store-sessions',
    status: 'Created',
    tables: 4,
    modifiedAt: daysAgo(1)
  },
  {
    id: 'db-analytics-events',
    name: 'analytics-events',
    status: 'Created',
    tables: 12,
    modifiedAt: daysAgo(9)
  },
  {
    id: 'db-feature-flags',
    name: 'feature-flags',
    status: 'Creating',
    tables: 0,
    modifiedAt: hoursAgo(3)
  }
].map((db, index) => {
  const person = authorAt(index)
  return {
    ...db,
    author: person.name,
    authorAvatar: person.avatar,
    lastModified: formatListDate(db.modifiedAt)
  }
})
