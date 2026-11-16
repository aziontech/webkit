import type { ActivityHistoryEvent } from './activity-history.vue'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))
const ago = (ms: number) => new Date(sampleNow.getTime() - ms)

export const sampleEvents: ActivityHistoryEvent[] = [
  {
    id: 'evt-1048',
    event: 'Signed in',
    category: 'Sign-in',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(25 * MINUTE)
  },
  {
    id: 'evt-1047',
    event: 'Revoked personal token “Nightly export”',
    category: 'Security',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(3 * HOUR)
  },
  {
    id: 'evt-1046',
    event: 'Deployed storefront to Production',
    category: 'Deploy',
    user: 'jonas.weber@example.com',
    ip: '198.51.100.7',
    at: ago(9 * HOUR)
  },
  {
    id: 'evt-1045',
    event: 'Changed the role of henry.young@example.com to Admin',
    category: 'Users',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(1 * DAY + 2 * HOUR)
  },
  {
    id: 'evt-1044',
    event: 'Turned on multi-factor authentication',
    category: 'Security',
    user: 'henry.young@example.com',
    ip: '192.0.2.61',
    at: ago(2 * DAY)
  },
  {
    id: 'evt-1043',
    event: 'Updated the billing email',
    category: 'Billing',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(3 * DAY)
  },
  {
    id: 'evt-1042',
    event: 'Failed sign-in: wrong authentication code',
    category: 'Sign-in',
    user: 'jonas.weber@example.com',
    ip: '198.51.100.90',
    at: ago(4 * DAY + 5 * HOUR)
  },
  {
    id: 'evt-1041',
    event: 'Invited lee.park@example.com to the team Developers',
    category: 'Users',
    user: 'henry.young@example.com',
    ip: '192.0.2.61',
    at: ago(6 * DAY)
  },
  {
    id: 'evt-1040',
    event: 'Created personal token “Deploy pipeline”',
    category: 'Security',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(12 * DAY)
  },
  {
    id: 'evt-1039',
    event: 'Changed the plan from Free to Pro',
    category: 'Billing',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(21 * DAY)
  }
]
