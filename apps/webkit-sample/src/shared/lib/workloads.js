// The workloads the sample is seeded with.
//
// Extracted from components/Workloads.vue because a second module needs the same
// records: a deployment belongs to exactly one workload, so the deployment history
// (./deployment-history.js) is keyed by these ids and reads these names. When the
// seed lived inside the list page, the only way for another surface to name a
// workload was to hard-code its id — and an id typed twice is an id that drifts.
//
// The list page still owns its own copy (`ref([...WORKLOADS])`): it deletes rows,
// and a page mutating a shared module-level array would leak that into every other
// surface reading it.
import { daysAgo, formatListDate } from './dates'
import { authorAt } from './people'

/** How many workloads the sample seeds. */
export const WORKLOAD_COUNT = 20

/**
 * The seeded workloads, in list order.
 *
 * `modifiedAt` is the real instant — the Last Modified filter compares it and
 * `lastModified` (the sortable, exportable display string) is derived from it by
 * one formatter, never hand-written per row (see ./dates.js).
 */
export const WORKLOADS = Array.from({ length: WORKLOAD_COUNT }, (_, i) => {
  const n = i + 1
  // The primary domain shown in the cell, plus the aliases revealed in the
  // "+N" Popover. `domainCount` is the overflow count (everything after the primary).
  const extraCount = (n * 7) % 99
  const domains = [
    `my-workload-${n}.azion.run`,
    ...Array.from({ length: extraCount }, (_, j) => `my-workload-${n}-alias-${j + 1}.azion.run`)
  ]
  const modified = daysAgo(i * 18)
  return {
    id: `10${(20482 + n * 173).toString()}`,
    name: `workload_${String(n).padStart(2, '0')}`,
    domain: domains[0],
    domains,
    domainCount: extraCount,
    status: n % 9 === 0 ? 'Inactive' : 'Live',
    // Spread across ~12 months (18 days apart) so the Last Modified filter has
    // something to narrow — every row used to carry the identical timestamp.
    modifiedAt: modified,
    lastModified: formatListDate(modified),
    owner: authorAt(i).name,
    ownerAvatar: authorAt(i).avatar
  }
})

/** A seeded workload by id, or `undefined` for one this sample does not seed. */
export const workloadById = (id) => WORKLOADS.find((workload) => workload.id === String(id))
