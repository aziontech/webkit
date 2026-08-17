// ONE list of everything the account owns, across types.
//
// Overview used to answer "what do I have" with a tab row over a table, which made
// the reader pick a type before they could see anything — and a table is the wrong
// shape for the question anyway: its columns have to be the same for every row, so a
// summary that spans applications, workloads, domains and functions ends up showing
// the fields they happen to share and hiding what actually distinguishes them. A row
// carries each type's own second line instead (a domain, a runtime, the workload that
// serves it), so one list can hold every type without flattening any of them.
//
// So this module normalizes the seeded fixtures — the SAME fixtures the module
// lists read, so a name here is the name over there — into one shape:
//
//   { id, name, type, typeLabel, singular, icon, preset, subtitle, subtitleUrl,
//     subtitlePath, status, modifiedAt, path }
//
// `path` is where the row goes, which is where the row goes in its own module. A
// type with no detail view in this prototype carries `null` and simply does not
// navigate.
//
// ── THE SECOND LINE IS OFTEN A DESTINATION, AND SAYS SO HERE ──
//
// A row's second line is not always inert prose: for an application and a workload it
// is a LIVE HOSTNAME, and for a domain it names the WORKLOAD that serves it. Both are
// places the reader can go, and a summary whose most concrete field is unclickable
// makes them copy it into a URL bar by hand.
//
// Which destination it is, is a fact about the TYPE — so the type declares it and the
// row never has to guess from the string:
//
//   subtitleUrl   the line is a live hostname → an external link (new tab)
//   subtitlePath  the line names another resource → an in-app route
//   neither       the line is prose (a runtime and an instance count) → plain text
//
// Never both. A line has one destination or none, and string-sniffing in the template
// ("does it contain a dot?") is exactly the guess this pair exists to remove.
import { APPLICATIONS } from '@shared/lib/applications'
import { WORKLOADS } from '@shared/lib/workloads'

import { FUNCTIONS, runtimeOf } from './functions'

/**
 * The types the SUMMARY offers, in the order the segmented control lists them.
 *
 * Deliberately only the ones the account can hold rows of. Edge DNS and Object
 * Storage are reachable in one click from the rail, and a summary of what you own is
 * the wrong place to advertise what you do not: their first-use surface is the
 * module's own (components/ui/ProductFirstUse.vue), which has room to say what the
 * product is instead of showing an empty card in a list of full ones.
 */
export const RESOURCE_TYPES = [
  { value: 'applications', label: 'Applications', singular: 'Application' },
  { value: 'workloads', label: 'Workloads', singular: 'Workload' },
  { value: 'domains', label: 'Domains', singular: 'Domain' },
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
    // The application's own domain: the site it serves, so the line opens it.
    subtitleUrl: `https://${row.domainName}`,
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
    // The workload's primary domain — the aliases stay in its module list's "+N"
    // Popover; a summary links the one the reader would actually open.
    subtitleUrl: `https://${row.domain}`,
    path: `/workloads/${row.id}`
  }))

// A DOMAIN IS DERIVED, NOT SEEDED. The console treats a domain as a first-level
// resource (../behavior/surfaces.js lists `/domains/new` as a Page), but this
// prototype seeds no domains fixture — what it seeds is the domain each WORKLOAD
// serves. So the type is projected off that seed rather than invented beside it: one
// row per workload's primary domain, carrying the workload's own status and
// timestamp, because that workload is what makes the domain live or not.
//
// The primary only. A workload also seeds up to 99 aliases (the "+N" Popover in its
// module list), and a summary that answered "what do I have" with two thousand alias
// rows would answer nothing.
//
// `path` is the workload's: a domain has no detail view of its own here, and the
// workload is where its binding is edited — so the row still lands somewhere true.
const domainCards = () =>
  WORKLOADS.map((row) => ({
    ...row,
    id: `domain-${row.id}`,
    name: row.domain,
    type: 'domains',
    typeLabel: 'Domain',
    singular: 'Domain',
    icon: 'ai ai-domains',
    preset: undefined,
    subtitle: `Served by ${row.name}`,
    // The line NAMES the workload, so that is where it goes — in-app, not out to the
    // hostname (which is this row's title). It lands on the same page the title does,
    // and deliberately: until a domain has a detail view of its own, the workload is
    // the only true destination either half of this row has.
    subtitlePath: `/workloads/${row.id}`,
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
    // on and how many places run it. Prose, not a destination — so no `subtitleUrl`
    // and no `subtitlePath`, and the line stays plain text.
    subtitle: `${runtimeOf(row).label} · ${row.instances} instance${row.instances === 1 ? '' : 's'}`,
    path: `/functions/${row.id}`
  }))

/** Everything the account owns, newest first. */
export function allResources() {
  return [...applicationCards(), ...workloadCards(), ...domainCards(), ...functionCards()].sort(
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
