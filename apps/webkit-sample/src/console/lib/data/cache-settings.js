// Cache Settings — how an application caches at the edge and in the browser.
//
// This module owns the VOCABULARY of the v4 request body, so the drawer that asks
// for it and the table that summarises it read from one place instead of each
// re-typing the enum. The endpoint:
//
//   POST /v4/edge_application/applications/{application_id}/cache_settings
//   {
//     name,
//     browser_cache: { behavior, max_age },
//     modules: {
//       cache: {
//         behavior, max_age,
//         stale_cache:      { enabled },
//         large_file_cache: { enabled, offset },
//         tiered_cache:     { enabled, topology }
//       },
//       application_accelerator: {
//         cache_vary_by_method:      [ … ],
//         cache_vary_by_querystring: { behavior, fields, sort_enabled },
//         cache_vary_by_cookies:     { behavior, cookie_names },
//         cache_vary_by_devices:     { behavior, device_group }
//       }
//     }
//   }
//
// Only `name` is required. The two halves of the rest split cleanly, and the drawer
// is built on that split:
//
//   browser_cache + modules.cache  — the CACHE. What a cache setting is for; every
//                                    one of them answers these questions.
//   modules.application_accelerator — the CACHE KEY. Which parts of the request make
//                                    two requests different objects. Optional, and
//                                    only honoured while the Application Accelerator
//                                    module is active on the application, so it is
//                                    the collapsed Advanced band.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { ref } from 'vue'

// `no-cache` exists on the browser half only: the edge half of a cache setting
// cannot be told not to cache — that is what a rule's Bypass Cache behavior is for.
export const BROWSER_CACHE_BEHAVIORS = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]

export const EDGE_CACHE_BEHAVIORS = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]

// Where the second cache layer sits. `nearest-region` lets Azion pick; the two
// pinned regions are for a workload whose origin is fixed to one of them.
export const TIERED_CACHE_TOPOLOGIES = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'br-east-1', label: 'br-east-1 — South America' },
  { value: 'us-east-1', label: 'us-east-1 — North America' }
]

// Query string and cookies share one behavior enum. `ignore` is the fastest cache
// (one object for every variation) and `all` the slowest, which is why the labels
// say what the choice costs rather than just naming it.
export const VARY_BEHAVIORS = [
  { value: 'ignore', label: 'Ignore all — best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]

// Devices take a narrower enum: there is no `all` and no `denylist`, because a
// device group is already a named set the reader has to opt into.
export const DEVICE_VARY_BEHAVIORS = [
  { value: 'ignore', label: 'Ignore all — best cache rate' },
  { value: 'allowlist', label: 'Vary by some device groups (allowlist)' }
]

// GET and HEAD are always cacheable and are not listed: `cache_vary_by_method`
// only carries the methods that need the request BODY in the cache key.
export const CACHEABLE_METHODS = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

/** The label for a value in one of the lists above, falling back to the raw value. */
export const optionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value

/** Joins a multi-value selection into a trigger label. */
export const optionsLabel = (options, values) =>
  (values ?? []).map((value) => optionLabel(options, value)).join(', ')

// The API counts TTL in seconds and the drawer asks for it in seconds — a field
// labelled "Maximum TTL (seconds)" must not silently take days. A LIST is the other
// job: `2592000s` is a number the reader has to divide before it means anything, so
// the table says `30d` and the form keeps the unit it posts.
// No minutes tier: a cache TTL under an hour is read in seconds — `60s` is the
// number the reader set and the number the docs quote, and `1m` only makes them
// convert it back.
const TTL_UNITS = [
  { seconds: 31536000, suffix: 'y' },
  { seconds: 86400, suffix: 'd' },
  { seconds: 3600, suffix: 'h' }
]

/** Seconds as the largest whole unit that divides them, else seconds. */
export const formatTtl = (seconds) => {
  const unit = TTL_UNITS.find((step) => seconds >= step.seconds && seconds % step.seconds === 0)
  return unit ? `${seconds / unit.seconds}${unit.suffix}` : `${seconds}s`
}

/**
 * A behavior + TTL as ONE cell. A table column headed "Browser cache" showing a
 * bare `0s` is a lie when the behavior is `honor` — the TTL field is not in effect
 * at all — so the summary names the behavior and only prints the TTL that applies.
 */
export const cacheSummary = ({ behavior, maxAge }) => {
  if (behavior === 'no-cache') return 'No cache'
  if (behavior === 'honor') return 'Honor origin'
  return `Override · ${formatTtl(maxAge)}`
}

// `fields` / `cookie_names` are lists of strings in the request body, and the drawer
// asks for them as one line of text — a query string allowlist is a handful of short
// names, and a repeater row per name would be four controls for four words.
const SEPARATORS = /[\s,]+/

/** Text as the API's list of strings: comma or whitespace separated, empties dropped. */
export const toList = (text) => text.split(SEPARATORS).filter(Boolean)

/** The API's list of strings back as one editable line. */
export const fromList = (list) => (list ?? []).join(', ')

/**
 * The stored shape of a cache setting: the request body plus what the list renders of
 * it. ONE decorator for the seed AND for what the drawer creates, so a setting authored
 * in this session cannot read differently from one that shipped with the sample.
 *
 * `modifiedAt` is the real instant — the Last Modified cell renders it relative — and
 * `lastModified` (the sortable display string) is derived from it by one formatter
 * rather than hand-written per row. The author is the sample's round-robin roster, the
 * face every console list identifies a change by (@shared/lib/people).
 */
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

// The store. Seeded so the tab lands populated, and shaped like the request body it
// posts — flat only where the request is flat.
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

/** Every cache setting on this application. */
export const useCacheSettings = () => cacheSettings

/** Prepends a new cache setting, so it appears in the list without a reload. */
export const addCacheSetting = (record) => {
  const modifiedAt = new Date()
  const created = decorate({ id: `cs-${modifiedAt.getTime()}`, ...record, modifiedAt })
  cacheSettings.value = [created, ...cacheSettings.value]
  return created
}
