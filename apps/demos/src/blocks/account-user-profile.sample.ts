import type {
  UserProfileData,
  UserProfileNotificationSettings,
  UserProfilePreferences,
  UserProfileSecurityPolicy,
  UserProfileYearActivity
} from './account-user-profile.user-profile-model'

function buildYearItems(year: number, seed: number) {
  let state = seed % 2_147_483_647
  const next = () => {
    state = (state * 16_807) % 2_147_483_647
    return (state - 1) / 2_147_483_646
  }
  const categories = ['deploy', 'function', 'security'] as const
  const items = []
  for (let day = 0; day < 365; day += 1) {
    const dt = new Date(Date.UTC(year, 0, 1 + day))
    if (dt.getUTCFullYear() !== year) break
    const wave = Math.sin(day / 28) * 0.22 + 0.5
    const active = next() < wave * 0.65
    const count = active ? Math.max(1, Math.floor(next() * 14)) : 0
    if (count > 0) {
      items.push({
        date: dt.toISOString().slice(0, 10),
        count,
        category: categories[Math.floor(next() * categories.length)] ?? 'deploy'
      })
    }
  }
  return items
}

export const sampleProfile: UserProfileData = {
  firstName: 'Jane',
  lastName: 'Doe',
  handle: 'jane.doe',
  role: 'Account owner',
  email: 'jane.doe@example.com',
  alternateEmails: ['jane.doe@example.com', 'ops@example.com'],
  phoneCountry: 'US',
  phoneDigits: '5550142',
  timezone: 'America/Los_Angeles',
  displayLocalTime: true,
  language: 'en',
  location: 'San Francisco, United States',
  memberSince: '2023',
  bio: 'Building the Acme storefront on Azion Applications and Functions.',
  websiteUrl: 'https://example.com/jane',
  privateProfile: false,
  includePrivateContributions: true
}

export const sampleSecurityPolicy: UserProfileSecurityPolicy = {
  ssoManaged: false,
  ssoProvider: 'Okta',
  mfaEnabled: true,
  mfaEnforced: false,
  activeTokensCount: 3,
  lastTokenUsedAt: '2026-11-24T14:48:00Z',
  lastTokenClient: 'the Azion CLI'
}

export const sampleNotifications: UserProfileNotificationSettings = {
  defaultEmail: 'jane.doe@example.com',
  securityDigestCadence: 'weekly',
  securityDigestChannel: 'email',
  deliveryDigestCadence: 'weekly',
  deliveryDigestChannel: 'email',
  activityAiDigestCadence: 'monthly',
  activityAiDigestChannel: 'email',
  watchedResourcesCount: 12,
  watchedResourcesChannel: 'both',
  mentionsChannel: 'both',
  deployAlertsChannel: 'failures',
  copilotSessionsChannel: 'both',
  tokenAlerts: true,
  releaseNotes: true
}

export const samplePreferences: UserProfilePreferences = {
  theme: 'system',
  keyboardShortcuts: true
}

const sampleYearsSource: UserProfileYearActivity[] = [
  {
    year: 2026,
    totalContributions: 1482,
    contributionsDelta: 18,
    deployments: 318,
    copilotTasks: 124,
    longestStreakDays: 42,
    currentStreakDays: 6,
    items: buildYearItems(2026, 2026),
    months: [
      {
        label: 'November 2026',
        entries: [
          {
            id: '2026-11-deploys',
            title: 'Deployed 14 releases across 3 Applications',
            description: 'acme-store (8), production-api (4), docs-site (2)',
            category: 'deploy',
            severity: 'info',
            icon: 'az az-cloud-upload',
            time: '2026-11-22T18:20:00Z',
            date: '2026-11-22'
          },
          {
            id: '2026-11-functions',
            title: 'Published 3 Functions updates',
            description: 'jwt-auth 2.4.1 and traffic-router 1.2.0',
            category: 'function',
            severity: 'success',
            icon: 'az az-code',
            time: '2026-11-18T14:05:00Z',
            date: '2026-11-18'
          },
          {
            id: '2026-11-firewall',
            title: 'Updated 4 firewall rule sets',
            description: 'Added rate limits to the production and checkout firewalls',
            category: 'security',
            severity: 'warning',
            icon: 'az az-shield',
            time: '2026-11-11T10:40:00Z',
            date: '2026-11-11'
          }
        ]
      },
      {
        label: 'October 2026',
        entries: [
          {
            id: '2026-10-deploys',
            title: 'Deployed 21 releases across 4 Applications',
            description: 'acme-store (12), checkout (6), site-assets (3)',
            category: 'deploy',
            severity: 'info',
            icon: 'az az-cloud-upload',
            time: '2026-10-28T16:15:00Z',
            date: '2026-10-28'
          },
          {
            id: '2026-10-copilot',
            title: 'Completed 19 AI Copilot workflows',
            description: 'Cache policy review (11 tasks) and staging migration (8 tasks)',
            category: 'function',
            severity: 'neutral',
            icon: 'az az-sparkles',
            time: '2026-10-14T21:00:00Z',
            date: '2026-10-14'
          }
        ]
      }
    ]
  },
  {
    year: 2025,
    totalContributions: 1254,
    contributionsDelta: 24,
    deployments: 274,
    copilotTasks: 88,
    longestStreakDays: 31,
    currentStreakDays: 0,
    items: buildYearItems(2025, 2025),
    months: [
      {
        label: 'December 2025',
        entries: [
          {
            id: '2025-12-deploys',
            title: 'Deployed 19 releases across 3 Applications',
            description: 'acme-store (11), production-api (8)',
            category: 'deploy',
            severity: 'info',
            icon: 'az az-cloud-upload',
            time: '2025-12-19T17:45:00Z',
            date: '2025-12-19'
          },
          {
            id: '2025-12-tls',
            title: 'Renewed 6 TLS certificates',
            description: 'Automatic renewal is on for *.example.com',
            category: 'security',
            severity: 'success',
            icon: 'az az-shield',
            time: '2025-12-04T09:30:00Z',
            date: '2025-12-04'
          }
        ]
      }
    ]
  },
  {
    year: 2024,
    totalContributions: 980,
    contributionsDelta: 41,
    deployments: 196,
    copilotTasks: 41,
    longestStreakDays: 22,
    currentStreakDays: 0,
    items: buildYearItems(2024, 2024),
    months: [
      {
        label: 'November 2024',
        entries: [
          {
            id: '2024-11-functions',
            title: 'Created 5 Functions and 2 Object Storage buckets',
            description: 'image-resizer and site-assets',
            category: 'function',
            severity: 'info',
            icon: 'az az-code',
            time: '2024-11-15T12:00:00Z',
            date: '2024-11-15'
          }
        ]
      }
    ]
  },
  {
    year: 2023,
    totalContributions: 412,
    contributionsDelta: 0,
    deployments: 84,
    copilotTasks: 0,
    longestStreakDays: 14,
    currentStreakDays: 0,
    items: buildYearItems(2023, 2023),
    months: [
      {
        label: 'March 2023',
        entries: [
          {
            id: '2023-03-joined',
            title: 'Joined Azion and deployed a first Application',
            description: 'First production deploy of staging',
            category: 'deploy',
            severity: 'success',
            icon: 'az az-cloud-upload',
            time: '2023-03-12T15:00:00Z',
            date: '2023-03-12'
          }
        ]
      }
    ]
  }
]

function matchHistory(entry: UserProfileYearActivity): UserProfileYearActivity {
  const history = entry.months.flatMap((month) => month.entries)
  const newest = history.reduce((last, item) => (item.date > last ? item.date : last), '')
  const end = entry.year === 2026 ? newest : `${entry.year}-12-31`
  const byDate = new Map(
    entry.items.filter((item) => item.date <= end).map((item) => [item.date, { ...item }])
  )
  for (const item of history) {
    const day = byDate.get(item.date)
    if (day) day.category = item.category
    else byDate.set(item.date, { date: item.date, count: 3, category: item.category })
  }
  return {
    ...entry,
    items: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  }
}

export const sampleYears: UserProfileYearActivity[] = sampleYearsSource.map(matchHistory)
