import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { ref } from 'vue'

export const BROWSER_CACHE_BEHAVIORS = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]

export const EDGE_CACHE_BEHAVIORS = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]

export const TIERED_CACHE_TOPOLOGIES = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'br-east-1', label: 'br-east-1 — South America' },
  { value: 'us-east-1', label: 'us-east-1 — North America' }
]

export const VARY_BEHAVIORS = [
  { value: 'ignore', label: 'Ignore all — best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]

export const DEVICE_VARY_BEHAVIORS = [
  { value: 'ignore', label: 'Ignore all — best cache rate' },
  { value: 'allowlist', label: 'Vary by some device groups (allowlist)' }
]

export const CACHEABLE_METHODS = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

export const optionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value

export const optionsLabel = (options, values) =>
  (values ?? []).map((value) => optionLabel(options, value)).join(', ')

const TTL_UNITS = [
  { seconds: 31536000, suffix: 'y' },
  { seconds: 86400, suffix: 'd' },
  { seconds: 3600, suffix: 'h' }
]

export const formatTtl = (seconds) => {
  const unit = TTL_UNITS.find((step) => seconds >= step.seconds && seconds % step.seconds === 0)
  return unit ? `${seconds / unit.seconds}${unit.suffix}` : `${seconds}s`
}

export const cacheSummary = ({ behavior, maxAge }) => {
  if (behavior === 'no-cache') return 'No cache'
  if (behavior === 'honor') return 'Honor origin'
  return `Override · ${formatTtl(maxAge)}`
}

const SEPARATORS = /[\s,]+/

export const toList = (text) => text.split(SEPARATORS).filter(Boolean)

export const fromList = (list) => (list ?? []).join(', ')

const decorate = ({ modifiedAt, ...setting }, index = 0) => {
  const person = authorAt(index)
  return {
    ...setting,
    modifiedAt,
    lastModified: formatListDate(modifiedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
}

const cacheSettings = ref(
  [
    {
      id: 'cs-default',
      name: 'Default Cache',
      browserCache: { behavior: 'honor', maxAge: 0 },
      edgeCache: { behavior: 'override', maxAge: 60 },
      tieredCache: false,
      modifiedAt: daysAgo(9)
    },
    {
      id: 'cs-static',
      name: 'Static Assets',
      browserCache: { behavior: 'override', maxAge: 604800 },
      edgeCache: { behavior: 'override', maxAge: 2592000 },
      tieredCache: true,
      modifiedAt: daysAgo(31)
    }
  ].map(decorate)
)

export const useCacheSettings = () => cacheSettings

export const addCacheSetting = (record) => {
  const modifiedAt = new Date()
  const created = decorate({ id: `cs-${modifiedAt.getTime()}`, ...record, modifiedAt })
  cacheSettings.value = [created, ...cacheSettings.value]
  return created
}

export const updateCacheSetting = (id, record) => {
  const modifiedAt = new Date()
  let updated
  cacheSettings.value = cacheSettings.value.map((setting) => {
    if (setting.id !== id) return setting
    updated = decorate({ id, ...record, modifiedAt })
    return updated
  })
  return updated
}
