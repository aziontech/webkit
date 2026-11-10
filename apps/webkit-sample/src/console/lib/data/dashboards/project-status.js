export const PROJECT_DEFAULT = 'storefront-migration'

export const PROJECT_SPRINT_DEFAULT = 'sprint-6'

export const PROJECT_COMPARISON = 'vs previous sprint'

export const PROJECT_OPTIONS = [
  { value: 'storefront-migration', label: 'Storefront migration' },
  { value: 'website-redesign', label: 'Website redesign' },
  { value: 'billing-migration', label: 'Billing migration' }
]

export const PROJECT_SPRINTS = [
  { value: 'sprint-6', label: 'Sprint 6 · Oct 27 – Nov 7' },
  { value: 'sprint-5', label: 'Sprint 5 · Oct 13 – Oct 24' },
  { value: 'sprint-4', label: 'Sprint 4 · Sep 29 – Oct 10' }
]

const FIGURES = [
  {
    id: 'completion',
    label: 'Completion',
    description: 'Share of the project’s tasks marked done.',
    value: 58,
    format: 'percentage',
    delta: 13.7,
    inverse: false,
    trend: [41, 43, 46, 48, 50, 52, 55, 58]
  },
  {
    id: 'done',
    label: 'Tasks done',
    description: 'Tasks marked done since the project started.',
    value: 74,
    format: 'count',
    delta: 23.3,
    inverse: false,
    trend: [52, 55, 58, 61, 64, 67, 71, 74]
  },
  {
    id: 'open',
    label: 'Open tasks',
    description: 'Tasks not done yet: in progress, blocked or not started.',
    value: 54,
    format: 'count',
    delta: -8.5,
    inverse: true,
    trend: [61, 60, 58, 58, 57, 56, 55, 54]
  },
  {
    id: 'overdue',
    label: 'Overdue',
    description: 'Open tasks past their due date. A rise is a risk to the cutover date.',
    value: 7,
    format: 'count',
    delta: 75,
    inverse: true,
    trend: [3, 3, 4, 4, 5, 5, 6, 7]
  }
]

const COMPLETION = [
  { id: 'done', name: 'Done', values: [74] },
  { id: 'in-progress', name: 'In progress', values: [29] },
  { id: 'not-started', name: 'Not started', values: [19] },
  { id: 'blocked', name: 'Blocked', values: [6], color: 'danger' }
]

export const PROJECT_SPRINT_DAYS = [
  'Oct 27',
  'Oct 28',
  'Oct 29',
  'Oct 30',
  'Oct 31',
  'Nov 3',
  'Nov 4',
  'Nov 5',
  'Nov 6',
  'Nov 7'
]

const BURNDOWN = [
  { id: 'actual', name: 'Actual', values: [80, 77, 70, 66, 58, 55, 47, 41, null, null] },
  { id: 'ideal', name: 'Ideal', values: [80, 71, 62, 53, 44, 36, 27, 18, 9, 0] }
]

const BEHIND = { label: '23 pts behind', severity: 'warning', icon: 'pi pi-clock' }

const MILESTONES = [
  {
    id: 'scope',
    date: '2026-10-06',
    day: 'Oct 6',
    title: 'Scope signed off',
    description: 'Workloads, domains and cutover criteria approved.',
    status: 'Done',
    severity: 'success'
  },
  {
    id: 'rules-freeze',
    date: '2026-10-20',
    day: 'Oct 20',
    title: 'Rules Engine freeze',
    description: 'Final cache and routing rules handed off for testing.',
    status: 'Done',
    severity: 'success'
  },
  {
    id: 'staging',
    date: '2026-11-03',
    day: 'Nov 3',
    title: 'Staging environment live',
    description: 'Application shared with 120 internal testers.',
    status: 'Done',
    severity: 'success'
  },
  {
    id: 'feature-complete',
    date: '2026-11-10',
    day: 'Nov 10',
    title: 'Feature complete',
    description: 'Every migration task merged and in testing.',
    status: 'At risk',
    severity: 'warning'
  },
  {
    id: 'dns-cutover',
    date: '2026-11-14',
    day: 'Nov 14',
    title: 'Edge DNS cutover',
    description: 'Production domains point to the new workload.',
    status: 'Upcoming',
    severity: 'neutral'
  },
  {
    id: 'launch',
    date: '2026-11-17',
    day: 'Nov 17',
    title: 'Origin retired',
    description: 'Legacy origin switched off for every customer.',
    status: 'Upcoming',
    severity: 'neutral'
  }
]

const OWNERS = [
  ['Ana Souza', 12, 18, 3],
  ['Marcus Lee', 10, 15, 0],
  ['Priya Nair', 9, 14, 2],
  ['Tomás Ortega', 8, 11, 1],
  ['Hannah Kim', 8, 9, 0],
  ['David Chen', 7, 7, 1]
].map(([owner, open, done, overdue]) => ({
  id: owner.toLowerCase().replace(/[^a-z]+/g, '-'),
  owner,
  initials: owner
    .split(' ')
    .map((part) => part[0])
    .join(''),
  open,
  done,
  overdue
}))

export const PROJECT_OWNER_COLUMNS = [
  {
    id: 'owner',
    accessorKey: 'owner',
    header: 'Owner',
    align: 'start',
    enableSorting: true,
    principal: true
  },
  { id: 'open', accessorKey: 'open', header: 'Open', align: 'end', enableSorting: true },
  { id: 'done', accessorKey: 'done', header: 'Done', align: 'end', enableSorting: true },
  { id: 'overdue', accessorKey: 'overdue', header: 'Overdue', align: 'end', enableSorting: true }
]

const AT_RISK = [
  {
    id: 'checkout-function',
    title: 'Checkout function on older runtimes',
    reason: 'Blocked by a library upgrade waiting on security review.',
    tag: 'Blocked',
    severity: 'danger'
  },
  {
    id: 'waf-tuning',
    title: 'WAF rule set tuning',
    reason: 'Due Nov 3; waiting on the final list of allowed paths.',
    tag: 'Overdue',
    severity: 'danger'
  },
  {
    id: 'domains',
    title: 'Regional domains',
    reason: 'Certificates for 4 of 9 domains are still pending.',
    tag: 'Behind',
    severity: 'warning'
  },
  {
    id: 'load-test',
    title: 'Load test at peak volume',
    reason: 'Starts after feature complete, leaving 4 days to fix findings.',
    tag: 'At risk',
    severity: 'warning'
  }
]

const counted = new Intl.NumberFormat('en-US')

export const PROJECT_FORMATTERS = {
  count: (value) => counted.format(value),
  percentage: (value) => `${value.toFixed(0)}%`,
  points: (value) => `${value} pts`
}

export const resolveProjectStatus = ({ empty = false } = {}) =>
  empty
    ? {
        figures: FIGURES.map((figure) => ({ ...figure, value: null, delta: null, trend: [] })),
        completion: [],
        burndown: [],
        behind: null,
        milestones: [],
        owners: [],
        atRisk: []
      }
    : {
        figures: FIGURES,
        completion: COMPLETION,
        burndown: BURNDOWN,
        behind: BEHIND,
        milestones: MILESTONES,
        owners: OWNERS,
        atRisk: AT_RISK
      }
