import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const PURGE_LAYERS = [
  {
    value: 'cache',
    label: 'Cache',
    description: "Evicts the objects from Azion's cache layer, in every edge location."
  },
  {
    value: 'tiered_cache',
    label: 'Tiered Cache',
    description:
      'Evicts the objects from the tiered cache layer that sits between the edge and your origin.'
  }
]

export const PURGE_TYPES = [
  {
    value: 'cachekey',
    label: 'Cache Key',
    noun: 'cache key',
    description: 'The exact keys objects were cached under, including any @@ variations.',
    placeholder: 'www.example.com/images/image.jpg@@cookie_name=value',
    helper: 'One cache key per line, without the protocol.'
  },
  {
    value: 'url',
    label: 'URL',
    noun: 'URL',
    description: 'Every cached variation of each address.',
    placeholder: 'www.example.com/index.html\nwww.example.com/styles/main.css',
    helper: 'One URL per line, without the protocol.'
  },
  {
    value: 'wildcard',
    label: 'Wildcard',
    noun: 'wildcard expression',
    description: 'Everything that matches a pattern, where an asterisk matches any path.',
    placeholder: 'www.example.com/images/*',
    helper: 'One expression per line. An asterisk matches any sequence of characters.'
  }
]

export const TIERED_CACHE_TYPES = ['cachekey']

export const purgeLayerLabel = (value) =>
  PURGE_LAYERS.find((layer) => layer.value === value)?.label ?? value

export const purgeTypeOf = (value) => PURGE_TYPES.find((type) => type.value === value)

export const purgeTypeLabel = (value) => purgeTypeOf(value)?.label ?? value

export const purgeLayerOptions = PURGE_LAYERS.map(({ value, label }) => ({ value, label }))

export const purgeTypeOptions = PURGE_TYPES.map(({ value, label }) => ({ value, label }))

export const purgeLines = (value) =>
  String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export const purgeSummary = (type, count) => {
  const noun = purgeTypeOf(type)?.noun ?? 'object'
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`
}

export const PURGES = [
  {
    id: 'purge-9012',
    type: 'url',
    layer: 'cache',
    arguments: ['www.example.com/index.html', 'www.example.com/pricing'],
    modifiedAt: hoursAgo(2)
  },
  {
    id: 'purge-9011',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['www.example.com/assets/css/*'],
    modifiedAt: hoursAgo(5)
  },
  {
    id: 'purge-9010',
    type: 'cachekey',
    layer: 'tiered_cache',
    arguments: [
      'www.example.com/images/hero.webp',
      'www.example.com/images/hero@2x.webp',
      'www.example.com/images/og.png',
      'www.example.com/images/logo.svg'
    ],
    modifiedAt: hoursAgo(20)
  },
  {
    id: 'purge-9009',
    type: 'url',
    layer: 'cache',
    arguments: ['shop.example.com/products/sneakers-x1'],
    modifiedAt: daysAgo(1)
  },
  {
    id: 'purge-9008',
    type: 'cachekey',
    layer: 'cache',
    arguments: [
      'api.example.com/v1/catalog@@country=BR',
      'api.example.com/v1/catalog@@country=US',
      'api.example.com/v1/catalog@@country=PT'
    ],
    modifiedAt: daysAgo(3)
  },
  {
    id: 'purge-9007',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['blog.example.com/2026/10/*', 'blog.example.com/feed/*'],
    modifiedAt: daysAgo(4)
  },
  {
    id: 'purge-9006',
    type: 'url',
    layer: 'cache',
    arguments: [
      'www.example.com/',
      'www.example.com/about',
      'www.example.com/careers',
      'www.example.com/contact',
      'www.example.com/legal/privacy',
      'www.example.com/legal/terms'
    ],
    modifiedAt: daysAgo(6)
  },
  {
    id: 'purge-9005',
    type: 'cachekey',
    layer: 'tiered_cache',
    arguments: ['media.example.com/videos/launch-keynote/master.m3u8'],
    modifiedAt: daysAgo(9)
  },
  {
    id: 'purge-9004',
    type: 'wildcard',
    layer: 'cache',
    arguments: ['docs.example.com/*'],
    modifiedAt: daysAgo(13)
  },
  {
    id: 'purge-9003',
    type: 'url',
    layer: 'cache',
    arguments: ['www.example.com/sitemap.xml', 'www.example.com/robots.txt'],
    modifiedAt: daysAgo(18)
  },
  {
    id: 'purge-9002',
    type: 'cachekey',
    layer: 'cache',
    arguments: ['shop.example.com/cart@@session=guest'],
    modifiedAt: daysAgo(24)
  },
  {
    id: 'purge-9001',
    type: 'url',
    layer: 'cache',
    arguments: ['status.example.com/'],
    modifiedAt: daysAgo(29)
  }
].map(purgeRow)

export function purgeRow(purge, index = 0) {
  const person = authorAt(index)
  return {
    ...purge,
    typeLabel: purgeTypeLabel(purge.type),
    layerLabel: purgeLayerLabel(purge.layer),
    argumentsText: purge.arguments.join(' '),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(purge.modifiedAt)
  }
}
