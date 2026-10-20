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

const file = (size, ext) => ({ size, ext, lastModified: 'Jun 22, 2026, 07:21:21 PM' })

const STORYBOOK_BUILD = {
  'assets/': { children: {} },
  'sb-addons/': { children: {} },
  'sb-common-assets/': { children: {} },
  'sb-manager/': { children: {} },
  'favicon.svg': file('1.25 KB', 'svg'),
  'iframe.html': file('17.75 KB', 'html'),
  'index.html': file('6.03 KB', 'html'),
  'index.json': file('183.1 KB', 'json'),
  'nunito-sans-bold-italic.woff2': file('49.46 KB', 'woff2'),
  'nunito-sans-bold.woff2': file('47.14 KB', 'woff2'),
  'nunito-sans-italic.woff2': file('49.62 KB', 'woff2'),
  'nunito-sans-regular.woff2': file('47.07 KB', 'woff2'),
  'project.json': file('1.01 KB', 'json')
}

const BUCKET_TREES = {
  'webkit-storybook-dev': {
    '20260622162046/': { children: STORYBOOK_BUILD },
    '20260610093012/': { children: STORYBOOK_BUILD },
    'logs/': {
      children: {
        'access.log': file('2.4 MB', 'log'),
        'error.log': file('128 KB', 'log')
      }
    },
    'robots.txt': file('64 B', 'txt')
  }
}

const FALLBACK_TREE = {
  'images/': {
    children: {
      'hero.png': file('842 KB', 'png'),
      'logo.svg': file('3.2 KB', 'svg')
    }
  },
  'docs/': { children: { 'readme.md': file('4.1 KB', 'md') } },
  'config.json': file('512 B', 'json')
}

export const APPLICATION_BUILD_TREE = {
  'assets/': {
    children: {
      'index-B7xq2k1d.js': file('148.2 KB', 'js'),
      'index-Cm4r9zLp.css': file('21.6 KB', 'css'),
      'vendor-D1f8sKqa.js': file('412.9 KB', 'js'),
      'logo-9aW3eT0c.svg': file('3.2 KB', 'svg')
    }
  },
  'images/': {
    children: {
      'hero.webp': file('186 KB', 'webp'),
      'og-image.png': file('94 KB', 'png')
    }
  },
  'favicon.ico': file('15 KB', 'ico'),
  'index.html': file('2.1 KB', 'html'),
  'manifest.json': file('412 B', 'json'),
  'robots.txt': file('64 B', 'txt')
}

export const bucketTree = (id) => BUCKET_TREES[id] ?? FALLBACK_TREE
