import type { TeamPermissionsTeam } from './team-permissions.vue'

export const sampleTeams: TeamPermissionsTeam[] = [
  {
    id: 'team-1',
    name: 'Administrators',
    description: 'Full access to the account',
    permissions: [
      'applications.view',
      'applications.edit',
      'domains.view',
      'domains.edit',
      'firewall.view',
      'firewall.edit',
      'certificates.view',
      'certificates.edit',
      'storage.view',
      'storage.edit',
      'metrics.view',
      'logs.view',
      'billing.view',
      'billing.edit',
      'users.view',
      'users.edit',
      'tokens.edit'
    ],
    members: 3,
    status: 'Active'
  },
  {
    id: 'team-2',
    name: 'Developers',
    description: 'Build and deploy applications',
    permissions: [
      'applications.view',
      'applications.edit',
      'domains.view',
      'storage.view',
      'storage.edit',
      'metrics.view',
      'logs.view'
    ],
    members: 12,
    status: 'Active'
  },
  {
    id: 'team-3',
    name: 'Security',
    description: 'Firewall rules and certificates',
    permissions: [
      'firewall.view',
      'firewall.edit',
      'certificates.view',
      'certificates.edit',
      'logs.view'
    ],
    members: 4,
    status: 'Active'
  },
  {
    id: 'team-4',
    name: 'Finance',
    description: 'Invoices and payment methods',
    permissions: ['billing.view', 'billing.edit'],
    members: 2,
    status: 'Active'
  },
  {
    id: 'team-5',
    name: 'Contractors',
    description: 'Read-only access for audits',
    permissions: ['applications.view', 'domains.view', 'metrics.view'],
    members: 0,
    status: 'Inactive'
  }
]
