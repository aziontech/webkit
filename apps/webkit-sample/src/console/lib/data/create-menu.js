// EVERYTHING THE CONSOLE CAN CREATE, as one ordered list.
//
// The global Create in the header (../../components/shell/AppLayout.vue) is the console's
// front door for "make something", and it makes exactly one promise: it opens the Creation
// Center. This list is what that screen lays out — the rail on
// ../../pages/resources/CreationCenter.vue lists every first-level resource an account can
// create under its two ways to deploy code, from here, in this order.
//
// IT WAS ONCE THE HEADER'S MENU TOO — the second segment of a SplitButton, a shortcut past
// the Center for a reader who already knew the object. That segment is gone (the reasoning
// is in AppLayout beside the button), so this file now feeds one surface. It stays a
// registry rather than markup in that page for the reason it always was one: a resource
// missing from it is a resource with no row on the console's front door, and that is a fact
// worth stating in one place instead of hand-listing in a template.
//
// ── WHERE THE ROWS COME FROM ──
//
// Ten of these resources are generated from one spec (./create-resources.js), which already
// holds the create page's own title and the module's icon — so those rows are READ from it
// rather than restated here. The other four have hand-written create flows (two wizards and
// two forms) whose titles live in their own components, and those are the only strings this
// file declares.
//
// A ROW'S LABEL IS THE CREATE PAGE'S TITLE, exactly. The microcopy standard's rule is that
// the label does not change on the way in — `Create zone` in the menu opens a page titled
// `Create zone` — so a row that invented its own wording ("New DNS zone") would be a second
// name for one act. That is also why the labels are not derived by lowercasing an object
// name: `WAF rule set` and `DNS zone` carry acronyms that a `toLowerCase()` would eat.
//
// ── WHAT IS NOT IN IT ──
//
//   THE METHODS. Importing a repository and cloning a template are not objects; they are two
//     ways to make an application, and they live on the Creation Center the button opens.
//   ANYTHING CREATED INSIDE A RESOURCE. A DNS record, a rule, a table, a column, a cache
//     setting: these open a drawer over the list they belong to (../behavior/surfaces.js),
//     and there is no such list to open one over from the header.
//   VARIABLES. The one first-level create that is a drawer, for the reason recorded in the
//     surface rule — a KEY=value tuple, normally pasted in bulk. Its create is a row on its
//     own page; reaching it from here would mean landing on that page and popping a drawer
//     the URL cannot describe.
//   ORGANIZATIONS AND TEAMS. Account structure rather than platform resources: their lists
//     live under Settings, and that is where they are created.
import { createResource, createResourcePath } from './create-resources'

// The four flows that own their create page, with the title that page renders. Everything
// else about a row is read from the resource spec.
const HAND_WRITTEN = {
  workloads: { label: 'Create Workload', icon: 'ai ai-workloads', path: '/workloads/new' },
  applications: {
    label: 'Create Application',
    icon: 'ai ai-edge-application',
    path: '/applications/new'
  },
  'edge-dns': { label: 'Create Zone', icon: 'ai ai-edge-dns', path: '/edge-dns/new' },
  'sql-database': { label: 'Create Database', icon: 'ai ai-edge-sql', path: '/sql-database/new' }
}

// THE ORDER IS THE SIDEBAR'S. A flat list has no section titles to lean on, so the only
// thing that can group it is the sequence — and the reader already knows one: the sidebar's
// areas, in the sidebar's order (../../components/shell/AppSidebar.vue). What a workload
// serves first, then Build, Secure, Store, Observe. Both surfaces above take it from here,
// so the header menu and the rail cannot list the same fourteen resources in two orders.
const ORDER = [
  // The entry point, and what answers on it
  'workloads',
  // Build
  'applications',
  'functions',
  'connectors',
  'custom-pages',
  'domains',
  // Secure
  'firewall',
  'waf-rules',
  'edge-dns',
  'certificates',
  'network-lists',
  // Store
  'object-storage',
  'sql-database',
  // Observe
  'data-stream'
]

/**
 * The OBJECT a row creates, on its own: the create page's title with the verb taken off
 * (`Create WAF rule set` → `WAF rule set`), capitalized.
 *
 * The Creation Center's rail needs this form and the header menu does not. The rail's rows
 * sit under a `Resources` heading, which says the verb once, above all of them — fourteen
 * rows each repeating `Create` would be the heading's own word fourteen times down a 256px
 * column. It is DERIVED from the label rather than declared beside it for the same reason
 * the label is read from the create page: two strings for one object drift apart, and
 * lowercasing a module name would eat the `WAF` and `DNS` the titles carry.
 */
const objectNoun = (label) => {
  const noun = label.replace(/^Create /, '')
  return noun.charAt(0).toUpperCase() + noun.slice(1)
}

/**
 * One row: `{ value, label, object, icon, path }`.
 *
 * `value` is the resource id — what the menu reports back on select — and `path` is the
 * create page it opens. `label` is the create page's title and `object` is the bare noun
 * inside it; both come from the resource spec unless the flow is hand-written.
 */
const row = (id) => {
  const own = HAND_WRITTEN[id]
  // `createResourcePath` is `/<id>/new`, which is also the route every hand-written page
  // follows — so a generated row needs no path of its own, including `functions`, whose
  // page is hand-written at exactly that address.
  const spec = own ? null : createResource(id)
  const base = own ?? { label: spec.title, icon: spec.icon, path: createResourcePath(id) }

  return { value: id, object: objectNoun(base.label), ...base }
}

/** Every first-level create, in the order above. */
export const createMenu = ORDER.map(row)
