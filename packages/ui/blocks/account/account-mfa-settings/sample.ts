import type { MfaSettingsMember } from './account-mfa-settings.vue'

const DAY = 86_400_000
const REFERENCE = Date.UTC(2026, 10, 10, 12)

export const sampleMembers: MfaSettingsMember[] = [
  {
    id: 'm-1',
    name: 'Avery Stone',
    email: 'avery.stone@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 210 * DAY)
  },
  {
    id: 'm-2',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 40 * DAY)
  },
  {
    id: 'm-3',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    method: '',
    enabled: false,
    since: null
  },
  {
    id: 'm-4',
    name: 'Lena Fischer',
    email: 'lena.fischer@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 6 * DAY)
  },
  {
    id: 'm-5',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    method: '',
    enabled: false,
    since: null
  }
]
