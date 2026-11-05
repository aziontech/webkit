const GROUPS = [
  {
    name: 'Engineering',
    rows: [
      {
        href: '/careers/senior-platform-engineer',
        role: 'Senior Platform Engineer',
        team: 'Delivery Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/software-engineer-go',
        role: 'Software Engineer (Go)',
        team: 'Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/software-engineer-frontend',
        role: 'Software Engineer (Frontend)',
        team: 'UX Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    ]
  },
  {
    name: 'Security',
    rows: [
      {
        href: '/careers/defensive-security-engineer',
        role: 'Defensive Security Engineer (SOC)',
        team: 'Cybersecurity · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/grc-analyst',
        role: 'GRC Analyst (Governance, Risk & Compliance)',
        team: 'Compliance and Corporate IT · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      }
    ]
  }
]
const FACETS = [
  {
    label: 'Department',
    all: 'All departments',
    options: ['Engineering', 'Marketing', 'Revenue', 'Operations', 'Security']
  },
  {
    label: 'Location',
    all: 'All locations',
    options: ['Palo Alto, USA', 'São Paulo, Brazil', 'Porto Alegre, Brazil']
  },
  { label: 'Sort positions', all: 'Newest posted', options: ['Newest posted', 'Title (A–Z)'] }
]

export const SITE_SECTION = {
  _id: 'listing-browser',
  props: {
    title: 'Open positions',
    columns: [
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ],
    rows: GROUPS.flatMap((group) =>
      group.rows.map(({ href, role, team, type }) => ({
        href,
        group: group.name,
        values: { role, team, type },
        facets: { area: [group.name], location: team.split(' · ')[1].split(' / ') }
      }))
    ),
    groups: GROUPS.map((group) => group.name),
    facets: [
      {
        key: 'area',
        label: FACETS[0].label,
        allLabel: FACETS[0].all,
        options: FACETS[0].options.map((option) => ({ value: option, label: option }))
      },
      {
        key: 'location',
        label: FACETS[1].label,
        allLabel: FACETS[1].all,
        options: FACETS[1].options.map((option) => ({
          value: option.split(', ')[0],
          label: option
        }))
      }
    ],
    sorts: [
      { value: 'newest', label: FACETS[2].options[0], by: '' },
      { value: 'title', label: FACETS[2].options[1], by: 'role' }
    ],
    sortAriaLabel: FACETS[2].label,
    search: {
      placeholder: 'Search by title, team, or location',
      shortPlaceholder: 'Search positions',
      label: 'Search positions'
    },
    empty: {
      title: 'Nothing here yet',
      description: 'No open positions match your search.',
      clearLabel: 'View all open positions'
    }
  }
}
