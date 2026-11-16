import type { UsersTeam, UsersUser } from './users.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleTeams: UsersTeam[] = [
  { value: 'administrators', label: 'Administrators' },
  { value: 'developers', label: 'Developers' },
  { value: 'security', label: 'Security' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Support' }
]

export const sampleUsers: UsersUser[] = [
  {
    id: 'u-1',
    name: 'Avery Stone',
    email: 'avery.stone@example.com',
    owner: true,
    role: 'Owner',
    teams: ['administrators'],
    status: 'Active',
    lastActive: new Date(referenceTime - 0.02 * DAY)
  },
  {
    id: 'u-2',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    owner: false,
    role: 'Admin',
    teams: ['administrators', 'security'],
    status: 'Active',
    lastActive: new Date(referenceTime - 0.1 * DAY)
  },
  {
    id: 'u-3',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    owner: false,
    role: 'Developer',
    teams: ['developers'],
    status: 'Active',
    lastActive: new Date(referenceTime - 1 * DAY)
  },
  {
    id: 'u-4',
    name: '',
    email: 'sam.okafor@example.com',
    owner: false,
    role: 'Developer',
    teams: ['developers', 'support'],
    status: 'Invited',
    lastActive: null
  },
  {
    id: 'u-5',
    name: 'Lena Fischer',
    email: 'lena.fischer@example.com',
    owner: false,
    role: 'Viewer',
    teams: ['finance'],
    status: 'Active',
    lastActive: new Date(referenceTime - 3 * DAY)
  },
  {
    id: 'u-6',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    owner: false,
    role: 'Viewer',
    teams: [],
    status: 'Inactive',
    lastActive: new Date(referenceTime - 64 * DAY)
  }
]
