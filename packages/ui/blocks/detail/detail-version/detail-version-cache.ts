/** One cache setting of the version. */
export type CacheSetting = {
  id: string
  name: string
  browserBehavior: string
  browserMaxAge: number
  edgeBehavior: string
  edgeMaxAge: number
  staleCache: boolean
  largeFileCache: boolean
  largeFileOffset: number
  tieredCache: boolean
  tieredTopology: string
  varyByMethod: string[]
  queryStringBehavior: string
  queryStringFields: string
  cookieBehavior: string
  cookieNames: string
  deviceBehavior: string
  deviceGroups: string[]
  author: string
  modifiedAt: string
}

/** The fields the drawer edits. */
export type CacheSettingForm = Omit<CacheSetting, 'id' | 'author' | 'modifiedAt'>

export const browserBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]
export const edgeBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]
export const topologies = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' }
]
export const varyBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]
export const deviceBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'allowlist', label: 'Vary by some device groups (allowlist)' }
]
export const methods = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]
export const deviceGroupOptions = [
  { value: 'mobile', label: 'mobile' },
  { value: 'tablet', label: 'tablet' },
  { value: 'crawlers', label: 'crawlers' }
]

export const labelOf = (options: { value: string; label: string }[]) => (value: unknown) =>
  options.find((option) => option.value === value)?.label ?? String(value ?? '')
export const methodsLabel = (values: unknown[] | undefined) =>
  values?.length ? values.join(', ') : ''
export const deviceGroupsLabel = (values: unknown[] | undefined) =>
  values?.length ? values.join(', ') : ''

export const cacheSummary = (behavior: string, maxAge: number) => {
  if (behavior === 'honor') return 'Origin headers'
  if (behavior === 'no-cache') return 'No cache'
  if (maxAge % 86400 === 0) return `${maxAge / 86400} ${maxAge === 86400 ? 'day' : 'days'}`
  if (maxAge % 3600 === 0) return `${maxAge / 3600} ${maxAge === 3600 ? 'hour' : 'hours'}`
  return `${maxAge} seconds`
}

export const blankSetting = (): CacheSettingForm => ({
  name: '',
  browserBehavior: 'honor',
  browserMaxAge: 0,
  edgeBehavior: 'override',
  edgeMaxAge: 60,
  staleCache: false,
  largeFileCache: false,
  largeFileOffset: 1024,
  tieredCache: false,
  tieredTopology: 'nearest-region',
  varyByMethod: [],
  queryStringBehavior: 'ignore',
  queryStringFields: '',
  cookieBehavior: 'ignore',
  cookieNames: '',
  deviceBehavior: 'ignore',
  deviceGroups: []
})
