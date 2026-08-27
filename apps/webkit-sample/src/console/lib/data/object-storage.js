// The buckets the sample is seeded with — the Store → Object Storage module.
//
// Extracted from the page for the same reason ./variables.js was: global search indexes
// every resource the platform holds (./search-index.js), and a seed that lives inside a
// page component is invisible to it. The page keeps its own mutable copy
// (`ref([...BUCKETS])`) and still leads the list with what this session's deploy
// provisioned (@shared/lib/provisioning.js) — that half is session state, not seed.
//
// Object counts and sizes are mock figures; the file navigator inside a bucket
// (../../pages/storage/BucketBrowser.vue) owns the actual object tree.
//
// `modifiedAt` is the real instant — the Last Modified field compares it — and
// `lastModified` (the sortable display string) is derived from it by one formatter
// rather than hand-written per row (@shared/lib/dates.js).
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

/** The seeded buckets, in list order. */
export const BUCKETS = [
  {
    id: 'webkit-storybook-dev',
    name: 'webkit-storybook-dev',
    access: 'Public',
    objects: 128,
    size: '412.6 MB',
    modifiedAt: daysAgo(29)
  },
  {
    id: 'azion-assets-prod',
    name: 'azion-assets-prod',
    access: 'Public',
    objects: 4210,
    size: '18.4 GB',
    modifiedAt: daysAgo(2)
  },
  {
    id: 'user-uploads',
    name: 'user-uploads',
    access: 'Private',
    objects: 902,
    size: '2.1 GB',
    modifiedAt: daysAgo(1)
  }
].map((bucket, index) => {
  const person = authorAt(index)
  return {
    ...bucket,
    author: person.name,
    authorAvatar: person.avatar,
    lastModified: formatListDate(bucket.modifiedAt)
  }
})
