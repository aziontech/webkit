// The environment variables the sample is seeded with — the Build → Variables module.
//
// It lived inside the page as a local `ref` until global search needed it: the palette
// indexes every resource the platform holds (./search-index.js), and a seed only the page
// can see is a resource search cannot find. So the seed moved here, next to every other
// module's, and the page keeps its own mutable copy of it (`ref([...VARIABLES])`) — the
// same shape ./certificates.js, ./connectors.js and the rest already had.
//
// `modifiedAt` is the real instant — the Last Modified filter compares it — and
// `lastModified` (the sortable / exportable display string) is derived from it by one
// formatter instead of being hand-written per row (@shared/lib/dates.js explains why a
// display string is never parsed back).
//
// A VARIABLE'S VALUE IS NOT SEARCHABLE. Two of these are secrets, and a palette that
// matched on `value` would print `sk_live_…` into a result row the moment anyone typed a
// fragment of it. ./search-index.js indexes the KEY and nothing else.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

/** The seeded variables, in list order. */
export const VARIABLES = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    modifiedAt: daysAgo(32)
  },
  {
    id: 'v-002',
    key: 'STRIPE_SECRET_KEY',
    value: 'sk_live_51H8sX2eZv...',
    secret: true,
    modifiedAt: daysAgo(48)
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    modifiedAt: daysAgo(61)
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    modifiedAt: daysAgo(73)
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    modifiedAt: daysAgo(99)
  }
].map((variable, index) => {
  const person = authorAt(index)
  return {
    ...variable,
    lastEditor: person.name,
    lastEditorAvatar: person.avatar,
    lastModified: formatListDate(variable.modifiedAt)
  }
})
