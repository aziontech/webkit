const ROLES = [
  {
    href: '/careers/senior-platform-engineer',
    role: 'Senior Platform Engineer',
    team: 'Delivery Engineering · Porto Alegre',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/senior-quality-automation-engineer',
    role: 'Senior Quality Automation Engineer',
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
    href: '/careers/software-engineer-rust',
    role: 'Software Engineer (Rust and/or C/C++)',
    team: 'Platform Engineering · Porto Alegre / São Paulo',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/senior-infrastructure-analyst',
    role: 'Senior Infrastructure Analyst',
    team: 'SRE · Porto Alegre / São Paulo',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/software-engineer-frontend',
    role: 'Software Engineer (Frontend)',
    team: 'UX Engineering · Porto Alegre',
    type: 'Hybrid · Full-time'
  }
]

export const SITE_SECTION = {
  _id: 'listing-table',
  props: {
    title: 'Latest roles',
    columns: [
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ],
    rows: ROLES.map(({ href, role, team, type }) => ({ href, values: { role, team, type } })),
    primaryAction: { label: 'See all 23 roles', href: '/careers/jobs', trailing: true }
  }
}
