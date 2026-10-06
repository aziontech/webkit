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

export const firstLevelDrawerExceptions = [
  {
    id: 'variables',
    label: 'Variables',
    path: '/variables',
    why: 'A KEY=value tuple, normally added several at a time from a pasted .env.'
  }
]

export const createSurfaces = [
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
    inside: 'account settings'
  },

  { id: 'variable', label: 'Variable', surface: 'Drawer', path: '/variables', exception: true }
]

export const surfaceCounts = () => ({
  Page: createSurfaces.filter((entry) => entry.surface === 'Page').length,
  Drawer: createSurfaces.filter((entry) => entry.surface === 'Drawer' && !entry.exception).length,
  Dialog: 0
})
