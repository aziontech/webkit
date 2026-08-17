// WHERE A CREATE LIVES — the console's surface rule, written down once and read by
// the Forms hub so it cannot drift from what the app actually does.
//
// The question "page, drawer, or dialog?" used to get asked per module and answered
// differently every time: one module shipped a create page, the next a modal for the
// same shape of task, a third an inline row. That teaches the reader three habits for
// one action, and it costs more than looks — a modal cannot be linked or reloaded, a
// page thrown over a list destroys the context the reader was working in, and a dialog
// holding a nine-field form traps them in a box they cannot resize.
//
// So the surface is a PROPERTY OF WHAT IS BEING CREATED, not a choice a module makes.
//
// The full standard, including the anatomy and the commit model, ships to consuming
// projects as the `/webkit-create-surface` skill
// (packages/webkit/cli-templates/claude/skills/webkit-create-surface/). This file is
// the console's own instance of it: the three clauses, and the routes that obey them.

/** The rule, in the order the clauses are applied. */
export const surfaceRules = [
  {
    id: 'first-level',
    surface: 'Page',
    title: 'A first-level resource creates on a page',
    detail:
      'A resource the sidebar routes to directly. Creating one is the whole task: the reader came to do it, nothing behind it needs to stay visible, and the result is something they will link to, reload and share. So it gets its own URL at /<module>/new, no sidebar, and it survives a refresh and the back button.'
  },
  {
    id: 'in-resource',
    surface: 'Drawer',
    title: 'Anything created inside a resource opens a drawer',
    detail:
      'A thing that only exists in the context of another — a record in a zone, a rule in an application, a column in a table, a domain on a workload. Creating one is a step in work already underway, so the list behind it has to stay visible: what is being added is judged against what is already there. A page here would throw that context away.'
  },
  {
    id: 'never-dialog',
    surface: 'Dialog',
    title: 'Nothing creates in a dialog',
    detail:
      'A dialog is for a short blocking decision with one answer — a confirmation, a destructive guard. The moment it holds a form it is a drawer with worse ergonomics: no resize, no scroll room, and a stray Escape destroys typed work.'
  }
]

// THE ONE EXCEPTION, and the test that licenses another. A variable is a KEY=value
// pair, the flow is a repeater over one triad, and it is routinely used to paste a
// whole .env at once — a dedicated page for that would be a page whose entire content
// is one repeated row.
//
// Both halves of the test have to hold: the resource is a single small tuple, AND
// creating it is normally done in bulk. "It only has three fields" is not enough — a
// certificate has three fields and still creates on a page, because one certificate is
// one deliberate act.
export const firstLevelDrawerExceptions = [
  {
    id: 'variables',
    label: 'Variables',
    path: '/variables',
    why: 'A KEY=value tuple, normally added several at a time from a pasted .env.'
  }
]

// Every create surface in the console, and the rule clause it answers to. Kept here
// rather than derived from the router because the router knows a path exists, not
// which of the three clauses put it there — and it is the CLAUSE that has to stay
// true as modules are added.
export const createSurfaces = [
  // ── Pages: first-level resources ────────────────────────────────────────────
  { id: 'applications', label: 'Application', surface: 'Page', path: '/applications/new' },
  { id: 'workloads', label: 'Workload', surface: 'Page', path: '/workloads/new' },
  { id: 'organizations', label: 'Organization', surface: 'Page', path: '/organizations/new' },
  { id: 'teams', label: 'Team', surface: 'Page', path: '/teams/new' },
  { id: 'edge-dns', label: 'DNS zone', surface: 'Page', path: '/edge-dns/new' },
  { id: 'sql-database', label: 'SQL database', surface: 'Page', path: '/sql-database/new' },
  { id: 'domains', label: 'Domain', surface: 'Page', path: '/domains/new' },
  { id: 'functions', label: 'Function', surface: 'Page', path: '/functions/new' },
  { id: 'connectors', label: 'Connector', surface: 'Page', path: '/connectors/new' },
  { id: 'custom-pages', label: 'Custom page', surface: 'Page', path: '/custom-pages/new' },
  { id: 'firewall', label: 'Firewall', surface: 'Page', path: '/firewall/new' },
  { id: 'waf-rules', label: 'WAF rule set', surface: 'Page', path: '/waf-rules/new' },
  { id: 'certificates', label: 'Certificate', surface: 'Page', path: '/certificates/new' },
  { id: 'network-lists', label: 'Network list', surface: 'Page', path: '/network-lists/new' },
  { id: 'data-stream', label: 'Data stream', surface: 'Page', path: '/data-stream/new' },
  { id: 'object-storage', label: 'Bucket', surface: 'Page', path: '/object-storage/new' },

  // ── Drawers: created inside a resource ──────────────────────────────────────
  { id: 'record', label: 'DNS record', surface: 'Drawer', inside: 'a zone' },
  { id: 'rule', label: 'Create rule', surface: 'Drawer', inside: 'an application' },
  { id: 'table', label: 'Table', surface: 'Drawer', inside: 'a SQL database' },
  { id: 'column', label: 'Column', surface: 'Drawer', inside: 'a table' },
  { id: 'row', label: 'Row', surface: 'Drawer', inside: 'a table' },
  { id: 'domain-binding', label: 'Domain', surface: 'Drawer', inside: 'a workload' },
  { id: 'device-group', label: 'Device group', surface: 'Drawer', inside: 'an application' },
  { id: 'cache-setting', label: 'Cache setting', surface: 'Drawer', inside: 'an application' },
  {
    id: 'function-instance',
    label: 'Function instance',
    surface: 'Drawer',
    inside: 'an application'
  },
  {
    id: 'deployment-settings',
    label: 'Deployment settings',
    surface: 'Drawer',
    inside: 'a workload'
  },

  // ── The exception ───────────────────────────────────────────────────────────
  { id: 'variable', label: 'Variable', surface: 'Drawer', path: '/variables', exception: true }
]

/** How many creates answer to each clause — the hub prints these beside the rule. */
export const surfaceCounts = () => ({
  Page: createSurfaces.filter((entry) => entry.surface === 'Page').length,
  Drawer: createSurfaces.filter((entry) => entry.surface === 'Drawer' && !entry.exception).length,
  Dialog: 0
})
