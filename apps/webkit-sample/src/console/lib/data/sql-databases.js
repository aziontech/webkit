// The databases the sample is seeded with — the Store → SQL Database module.
//
// Extracted from the page so global search can index them (./search-index.js); the page
// keeps its own mutable copy (`ref([...SQL_DATABASES])`).
//
// The Last Modified avatar comes from the shared team roster (@shared/lib/people.js),
// assigned round-robin per row. `modifiedAt` is the real instant — the Last Modified field
// compares it — and `lastModified` (the sortable display string) is derived from it by one
// formatter rather than hand-written per row (@shared/lib/dates.js).
import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

/** The seeded databases, in list order. */
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
