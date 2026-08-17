// ONE list of everything the account owns, across types.
//
// Overview used to answer "what do I have" with a tab row over a table, which made
// the reader pick a type before they could see anything — and a table is the wrong
// shape for the question anyway: its columns have to be the same for every row, so a
// summary that spans applications, workloads and functions ends up showing the three
// fields they happen to share and hiding what actually distinguishes them. A card
// carries each type's own second line instead (a domain, a runtime), so one list can
// hold all three without flattening them.
//
// So this module normalizes the three seeded fixtures — the SAME fixtures the module
// lists read, so a name here is the name over there — into one shape:
//
//   { id, name, type, typeLabel, singular, icon, preset, subtitle, status, modifiedAt, path }
//
// `path` is where the card goes, which is where the row goes in its own module. A
// type with no detail view in this prototype carries `null` and simply does not
// navigate.
import { APPLICATIONS } from '@shared/lib/applications'
import { WORKLOADS } from '@shared/lib/workloads'

import { FUNCTIONS, runtimeOf } from './functions'

/**
 * The types the SUMMARY offers, in the order the segmented control lists them.
 *
 * Deliberately only the three the account can hold rows of. Edge DNS and Object
 * Storage are reachable in one click from the rail, and a summary of what you own is
 * the wrong place to advertise what you do not: their first-use surface is the
 * module's own (components/ui/ProductFirstUse.vue), which has room to say what the
 * product is instead of showing an empty card in a list of full ones.
 */
export const RESOURCE_TYPES = [
  { value: 'applications', label: 'Applications', singular: 'Application' },
  { value: 'workloads', label: 'Workloads', singular: 'Workload' },
  { value: 'functions', label: 'Functions', singular: 'Function' }
]

const applicationCards = () =>
  APPLICATIONS.map((row) => ({
    ...row,
    type: 'applications',
    typeLabel: 'Application',
    singular: 'Application',
    icon: 'ai ai-edge-application',
    // The framework mark, which only an application has — the card renders it in
    // place of the generic type glyph so the row reads the same as it does in the
    // module list.
    preset: row.preset,
    subtitle: row.domainName,
    path: `/applications/${row.id}`
  }))

const workloadCards = () =>
  WORKLOADS.map((row) => ({
    ...row,
    type: 'workloads',
    typeLabel: 'Workload',
    singular: 'Workload',
    icon: 'ai ai-workloads',
    subtitle: row.domain,
    path: `/workloads/${row.id}`
  }))

const functionCards = () =>
  FUNCTIONS.map((row) => ({
    ...row,
    type: 'functions',
    typeLabel: 'Function',
    singular: 'Function',
    icon: 'ai ai-edge-functions',
    // A function has no domain; what identifies it beyond its name is what it runs
    // on and how many places run it.
    subtitle: `${runtimeOf(row).label} · ${row.instances} instance${row.instances === 1 ? '' : 's'}`,
    path: `/functions/${row.id}`
  }))

/** Everything the account owns, newest first. */
export function allResources() {
  return [...applicationCards(), ...workloadCards(), ...functionCards()].sort(
    (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)
  )
}

/**
 * The most recently touched resources, across types.
 *
 * ACROSS TYPES IS THE WHOLE POINT: "what was I just working on" is never a question
 * about one type, and a per-type recents list is just the type's list again with
 * fewer rows in it.
 */
export function recentResources(rows, count = 4) {
  return rows.slice(0, count)
}

/** Free-text match over the fields a reader would actually type. */
export function matchesSearch(resource, term) {
  const query = term.trim().toLowerCase()
  if (!query) return true
  return [resource.name, resource.subtitle, resource.typeLabel, resource.status]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(query))
}
