import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

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
].map(bucketRow)

export function bucketRow(bucket, index = 0) {
  const person = authorAt(index)
  return {
    ...bucket,
    author: person.name,
    authorAvatar: person.avatar,
    lastModified: formatListDate(bucket.modifiedAt)
  }
}
