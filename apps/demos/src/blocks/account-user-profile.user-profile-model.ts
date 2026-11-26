/** Active tab of the user profile page. */
export type UserProfileTab = 'overview' | 'profile' | 'security' | 'notifications' | 'preferences'

/** Category of a platform contribution. */
export type UserProfileContributionCategory = 'deploy' | 'function' | 'security'

/** Colour meaning of a history entry marker. */
export type UserProfileHistorySeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

/** One daily contribution point with its platform category. */
export interface UserProfileContributionPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** Number of contributions recorded on this day. */
  count: number
  /** Platform category, used by the category filter. */
  category: UserProfileContributionCategory
}

/** One entry of the contribution history. */
export interface UserProfileHistoryEntry {
  /** Stable key. */
  id: string
  /** Past-tense summary of what the user did. */
  title: string
  /** The resources it touched. */
  description: string
  /** Platform category, used by the category filter. */
  category: UserProfileContributionCategory
  /** Marker colour. */
  severity: UserProfileHistorySeverity
  /** Azion icon class of the marker. */
  icon: string
  /** ISO timestamp of the entry. */
  time: string
  /** ISO date (YYYY-MM-DD), matched against the day picked in the graph. */
  date: string
}

/** One month of the contribution history. */
export interface UserProfileHistoryMonth {
  /** Month heading, such as November 2026. */
  label: string
  /** Entries of the month, newest first. */
  entries: UserProfileHistoryEntry[]
}

/** One year of metrics, daily contributions and history. */
export interface UserProfileYearActivity {
  /** Calendar year. */
  year: number
  /** Platform contributions in the year. */
  totalContributions: number
  /** Change against the year before, in percent; 0 hides it. */
  contributionsDelta: number
  /** Application and Function deployments in the year. */
  deployments: number
  /** Completed AI Copilot and agent tasks in the year. */
  copilotTasks: number
  /** Longest run of consecutive active days. */
  longestStreakDays: number
  /** Current run of consecutive active days. */
  currentStreakDays: number
  /** Daily contribution points for the graph. */
  items: UserProfileContributionPoint[]
  /** Month-grouped contribution history. */
  months: UserProfileHistoryMonth[]
}

/** Personal profile, contact and visibility data. */
export interface UserProfileData {
  /** First name. */
  firstName: string
  /** Last name. */
  lastName: string
  /** Profile handle, without the leading at sign. */
  handle: string
  /** Account role shown as a Tag. */
  role: string
  /** Primary email address. */
  email: string
  /** Verified addresses notifications can be sent to. */
  alternateEmails: string[]
  /** ISO 3166-1 alpha-2 country of the phone number. */
  phoneCountry: string
  /** Phone digits. */
  phoneDigits: string
  /** IANA time zone. */
  timezone: string
  /** Show the local time to team members. */
  displayLocalTime: boolean
  /** BCP 47 interface language. */
  language: string
  /** City and country. */
  location: string
  /** Year the user joined the Azion platform. */
  memberSince: string
  /** Short bio. */
  bio: string
  /** Website or GitHub profile URL. */
  websiteUrl: string
  /** Hide the profile and its activity from organization directories. */
  privateProfile: boolean
  /** Count contributions to private accounts in the graph. */
  includePrivateContributions: boolean
}

/** Security state and the organization's SSO and SCIM policy. */
export interface UserProfileSecurityPolicy {
  /** The password is managed by an external SSO or SCIM provider. */
  ssoManaged: boolean
  /** Name of the identity provider. */
  ssoProvider: string
  /** Multi-factor authentication is on for the user. */
  mfaEnabled: boolean
  /** The organization requires multi-factor authentication. */
  mfaEnforced: boolean
  /** Active personal tokens. */
  activeTokensCount: number
  /** ISO timestamp of the last time a personal token was used. */
  lastTokenUsedAt: string
  /** The client that used it, such as the Azion CLI. */
  lastTokenClient: string
}

/** How often a digest is sent. */
export type UserProfileDigestCadence = 'daily' | 'weekly' | 'monthly' | 'off'

/** Where a digest is delivered. */
export type UserProfileDigestChannel = 'email' | 'in-app' | 'both'

/** Where a real-time alert is delivered. */
export type UserProfileAlertChannel = 'both' | 'email' | 'in-app' | 'off'

/** Which deployments raise an alert. */
export type UserProfileDeployAlertChannel = 'failures' | 'all' | 'in-app' | 'off'

/** Notification routing, scheduled digests and real-time alerts. */
export interface UserProfileNotificationSettings {
  /** Default notification address. */
  defaultEmail: string
  /** Application Security Digest cadence. */
  securityDigestCadence: UserProfileDigestCadence
  /** Application Security Digest channel. */
  securityDigestChannel: UserProfileDigestChannel
  /** Platform and Delivery Digest cadence. */
  deliveryDigestCadence: UserProfileDigestCadence
  /** Platform and Delivery Digest channel. */
  deliveryDigestChannel: UserProfileDigestChannel
  /** Account Activity and AI Adoption Digest cadence. */
  activityAiDigestCadence: UserProfileDigestCadence
  /** Account Activity and AI Adoption Digest channel. */
  activityAiDigestChannel: UserProfileDigestChannel
  /** Resources the user watches. */
  watchedResourcesCount: number
  /** Channel for watched resources. */
  watchedResourcesChannel: UserProfileAlertChannel
  /** Channel for mentions. */
  mentionsChannel: UserProfileAlertChannel
  /** Which deployments raise an alert. */
  deployAlertsChannel: UserProfileDeployAlertChannel
  /** Channel for AI Copilot and agent sessions. */
  copilotSessionsChannel: UserProfileAlertChannel
  /** Email when a personal token is created or expires. */
  tokenAlerts: boolean
  /** Show release notes and tips in the console. */
  releaseNotes: boolean
}

/** Console theme and keyboard shortcut preferences. */
export interface UserProfilePreferences {
  /** Console theme. */
  theme: 'system' | 'dark' | 'light'
  /** Keyboard shortcuts on, and their hints shown on buttons and menus. */
  keyboardShortcuts: boolean
}

/** The password and multi-factor fields of the security tab. */
export interface UserProfileSecurityForm {
  /** Multi-factor authentication on. */
  mfaEnabled: boolean
  /** Current password. */
  currentPassword: string
  /** New password. */
  newPassword: string
  /** New password, typed again. */
  confirmPassword: string
}

/** Everything the save event hands back. */
export interface UserProfileSavePayload {
  /** The edited profile. */
  profile: UserProfileData
  /** The edited notification settings. */
  notifications: UserProfileNotificationSettings
  /** The edited preferences. */
  preferences: UserProfilePreferences
  /** The edited security fields. */
  security: UserProfileSecurityForm
}

/** One choice of a select or a toggle group. */
export interface UserProfileOption<TValue extends string = string> {
  /** Text of the choice. */
  label: string
  /** Value it writes. */
  value: TValue
}

export const CATEGORY_OPTIONS: UserProfileOption<'all' | UserProfileContributionCategory>[] = [
  { label: 'All', value: 'all' },
  { label: 'Deploys', value: 'deploy' },
  { label: 'Functions', value: 'function' },
  { label: 'Security', value: 'security' }
]

export const TIMEZONE_OPTIONS: UserProfileOption[] = [
  { label: '(UTC -08:00) America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: '(UTC -05:00) America/New_York', value: 'America/New_York' },
  { label: '(UTC +00:00) UTC', value: 'UTC' },
  { label: '(UTC +01:00) Europe/Berlin', value: 'Europe/Berlin' }
]

export const CADENCE_OPTIONS: UserProfileOption<UserProfileDigestCadence>[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Off', value: 'off' }
]

export const DIGEST_CHANNEL_OPTIONS: UserProfileOption<UserProfileDigestChannel>[] = [
  { label: 'Email', value: 'email' },
  { label: 'Email and in-app', value: 'both' },
  { label: 'In-app', value: 'in-app' }
]

export const ALERT_CHANNEL_OPTIONS: UserProfileOption<UserProfileAlertChannel>[] = [
  { label: 'Email and in-app', value: 'both' },
  { label: 'Email only', value: 'email' },
  { label: 'In-app only', value: 'in-app' },
  { label: 'Off', value: 'off' }
]

export const DEPLOY_ALERT_OPTIONS: UserProfileOption<UserProfileDeployAlertChannel>[] = [
  { label: 'Failed deploys only', value: 'failures' },
  { label: 'Every deploy', value: 'all' },
  { label: 'In-app only', value: 'in-app' },
  { label: 'Off', value: 'off' }
]

type DigestKey = 'security' | 'delivery' | 'activityAi'

export interface UserProfileDigest {
  /** Stable key. */
  key: DigestKey
  /** Digest name. */
  title: string
  /** What the digest summarizes. */
  description: string
  /** Settings field that holds its cadence. */
  cadence: `${DigestKey}DigestCadence`
  /** Settings field that holds its channel. */
  channel: `${DigestKey}DigestChannel`
}

export const DIGESTS: UserProfileDigest[] = [
  {
    key: 'security',
    title: 'Application Security Digest',
    description:
      'Threats the Web Application Firewall blocked, Network Shield mitigations, Bot Manager hits and certificate health.',
    cadence: 'securityDigestCadence',
    channel: 'securityDigestChannel'
  },
  {
    key: 'delivery',
    title: 'Platform and Delivery Digest',
    description:
      'Application deploys, Functions error rates, cache offload trends and build status.',
    cadence: 'deliveryDigestCadence',
    channel: 'deliveryDigestChannel'
  },
  {
    key: 'activityAi',
    title: 'Account Activity and AI Adoption Digest',
    description:
      'Team and permission changes, personal token audits and AI Copilot usage across your accounts.',
    cadence: 'activityAiDigestCadence',
    channel: 'activityAiDigestChannel'
  }
]

export function pickOption<TValue extends string>(
  options: UserProfileOption<TValue>[],
  value: string,
  fallback: TValue
): TValue {
  return options.find((option) => option.value === value)?.value ?? fallback
}

export function filterHistory(
  months: UserProfileHistoryMonth[],
  category: 'all' | UserProfileContributionCategory,
  date: string | null
): UserProfileHistoryMonth[] {
  return months
    .map((month) => ({
      label: month.label,
      entries: month.entries.filter(
        (entry) =>
          (category === 'all' || entry.category === category) && (!date || entry.date === date)
      )
    }))
    .filter((month) => month.entries.length > 0)
}
