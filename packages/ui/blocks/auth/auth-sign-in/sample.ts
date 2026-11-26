import type { AuthScope } from './parts/scope-list.vue'

export const signedInAccount = { name: 'Jane Doe', initials: 'JD', email: 'jane.doe@example.com' }

export const oauthClient = {
  name: 'Acme Deploy',
  initials: 'AD',
  publisher: 'Acme Inc.',
  site: 'deploy.example.com',
  redirect: 'https://deploy.example.com/oauth/callback'
}

export const oauthScopes: AuthScope[] = [
  {
    id: 'profile',
    icon: 'az az-user',
    title: 'Read your profile',
    description: 'Your name, email address and avatar.'
  },
  {
    id: 'workloads:read',
    icon: 'az az-globe',
    title: 'Read your workloads',
    description: 'Names, domains and status. Not their settings or secrets.'
  },
  {
    id: 'applications:deploy',
    icon: 'az az-upload',
    title: 'Deploy your applications',
    description: 'Create and publish new versions of the applications in this account.'
  }
]

export const deviceRequest = {
  code: 'WDJBMJHT',
  client: 'Acme CLI',
  device: 'build-runner-01',
  address: '203.0.113.24',
  requested: 'Nov 14, 2026, 10:42 UTC',
  expires: '15 minutes'
}

export const deviceScopes: AuthScope[] = [
  {
    id: 'workloads:read',
    icon: 'az az-globe',
    title: 'Read your workloads',
    description: 'Names, domains and status.'
  },
  {
    id: 'applications:deploy',
    icon: 'az az-upload',
    title: 'Deploy your applications',
    description: 'Create and publish new versions from the terminal.'
  }
]

export const mfaAccount = 'jane.doe@example.com'

export const mfaSetupKey = 'JBSW Y3DP EHPK 3PXP'

export const recoveryCodes = [
  'K7QM2XPA',
  'R4TD9WLN',
  'B8VJ3HQE',
  'N2CY6FMT',
  'H5LP8KRW',
  'W9EX4GDB',
  'T3NA7ZQC',
  'F6RU2MJV'
]
