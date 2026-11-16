import type { PersonalTokensToken } from './personal-tokens.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

export const sampleNow = new Date(referenceTime)

export const sampleTokens: PersonalTokensToken[] = [
  {
    id: 'tok-7c1e',
    name: 'Local CLI',
    description: 'Development laptop',
    createdAt: daysFrom(-40),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(50),
    lastUsedAt: daysFrom(-0.1),
    revoked: false
  },
  {
    id: 'tok-3a90',
    name: 'Deploy pipeline',
    description: 'CI job that publishes the storefront',
    createdAt: daysFrom(-85),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(5),
    lastUsedAt: daysFrom(-1),
    revoked: false
  },
  {
    id: 'tok-b412',
    name: 'Infrastructure as code',
    description: 'Provider for the staging stack',
    createdAt: daysFrom(-120),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(-30),
    lastUsedAt: daysFrom(-31),
    revoked: false
  },
  {
    id: 'tok-55d2',
    name: 'Nightly export',
    description: 'Retired reporting script',
    createdAt: daysFrom(-200),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(160),
    lastUsedAt: null,
    revoked: true
  }
]
