# AccountUserProfile (`account/account-user-profile`)

> One page for an Azion user's profile and personal settings, a page body for ConsoleLayout's default slot. A compact header (a 48 px `Avatar`, the name, a role `Tag`, handle, location and join year; no actions, the tabs are where you edit) sits over `PageTabs`, and from a 72rem-wide block it becomes a column beside the tab content with the bio under it. The settings tabs stop at the form measure, like the settings page; Overview uses the full width. The tabs: Overview, Profile and bio, Security and access, Notifications and Preferences. Overview shows five `StatTile`s in a `StatTileGroup` for the selected year (hidden on a phone), a `Card` with a `ContributionGraph` (a category `ToggleGroup`, a year rail of `Button`s that switches year over year, a day click that filters the history) and a `Card` with a month-grouped `Timeline` of contributions, or an `EmptyState`. The settings tabs are `SettingsGroup`s over flush `Card`s of `SettingsRow`s: profile fields, `PhoneInput`, `LanguageSelect` and visibility `Switch`es; `PasswordInput` with `PasswordRequirements` and a Change password button that checks each field, multi-factor (a `ConfirmDialog` before it turns off) and personal tokens, locked with an info `Alert` and a warning `Tag` when the organization's SSO and SCIM provider manages them; three scheduled digests and real-time alerts as `Select`s; `ThemeSwitcher` and a Keyboard shortcuts `Switch`. A docked `SaveBar` appears with unsaved profile, notification or preference changes (Discard, Save changes; Command S and its hint only while shortcuts are on). Loading draws `Skeleton`s; a load failure is a danger `Alert` with Retry.

- Surface: app
- Source: `blocks/account/account-user-profile/account-user-profile.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-user-profile")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfirmDialog](../../components/confirm-dialog.md), [ContributionGraph](../../components/contribution-graph.md), [EmptyState](../../components/empty-state.md), `FieldError`, [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [LanguageSelect](../../components/language-select.md), [Link](../../components/link.md), [PageTabs](../../components/page-tabs.md), [PasswordInput](../../components/password-input.md), [PasswordRequirements](../../components/password-requirements.md), [PasswordRequirements](../../components/password-requirements.md), [PhoneInput](../../components/phone-input.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), [StatTileGroup](../../components/stat-tile-group.md), [Switch](../../components/switch.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [ThemeSwitcher](../../components/theme-switcher.md), [Timeline](../../components/timeline.md), [Timestamp](../../components/timestamp.md), [ToggleGroup](../../components/toggle-group.md), `use-locale`
- Skills: `webkit-form`, `webkit-layout`, `webkit-ui-states`, `webkit-data-viz`, `webkit-microcopy`

## Asked as

user profile; developer profile; my profile; profile settings; personal settings; contribution graph; platform contributions; contribution history; notification preferences; security settings; perfil do usuário; configurações de perfil; contribuições na plataforma; preferências de notificação

One page for an Azion user's profile and every personal setting: what they did on the platform (metrics, a year of daily contributions and the history behind them) and how their account is set up (profile, security, notifications and preferences). It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The signed-in user's own profile page in the Azion console (`/profile`).
- Showing a user's contributions year over year next to the settings they own, so they find everything personal in one place.

## When not to use

- Managing the other members of an account: use `account/account-users`.
- Requiring multi-factor authentication for every member: use `account/account-mfa-settings`.
- Searching and exporting the account's audit log: use `account/account-activity-history`.
- Creating and revoking personal tokens: use `account/account-personal-tokens`; this page links to it with Manage tokens.

## Building blocks

### A. Header — `Avatar`, `Tag`, `Skeleton` (required)

A 48 px `Avatar` (`size="large"`), the name as the page `h1`, the role `Tag`, then the handle, location and join year. When the block is at least 72rem wide (`@6xl`, a desktop next to the rail) the header becomes a 16rem column beside the tab content, under the tabs, with the facts one per line and the bio below them; narrower, it is a strip above the tabs and the facts wrap. No buttons: every setting is edited in place on its tab, so an Edit profile button or a copy link would only repeat the tabs. No cover picture and no large avatar: the graph and the settings stay above the fold.

### Width — one page, two measures

Overview is data and fills the content column. The four settings tabs and their `SaveBar` are a form: they stop at the form measure (`--layout-measure-form`, the width of the settings page), so a field stays next to the name it belongs to. The header column and the tabs keep their place on every tab, so switching tabs never moves them.

### B. Tabs — `PageTabs`, `Tabs` (required)

Five tabs on `v-model:active-tab`: Overview, Profile and bio, Security and access, Notifications, Preferences.

### C. Metrics — `StatTileGroup`, `StatTile` (required)

Five tiles for the selected year: Contributions (with the change against last year), Deployments, AI Copilot tasks, Longest streak, Current streak. Below the `md` breakpoint the tiles are hidden: stacked one per row they push the graph off the first screen of a phone.

### D. Contribution graph — `Card`, `ContributionGraph`, `ToggleGroup`, `Button` (required)

A year of daily contributions. A category `ToggleGroup` (All, Deploys, Functions, Security) filters the graph and the history. Days are squares; there is no shape switch. The year rail (one `Button` per year, `aria-pressed` on the shown one) changes the year of the metrics, the graph and the history. Picking a day filters the history to it.

### E. Contribution history — `Card`, `Timeline`, `Tag`, `Button`, `EmptyState` (required)

The year's contributions grouped by month in a `Timeline`, newest first. With a day picked, a `Tag` names the day and Show all days clears it. No match shows an `EmptyState` with Reset filters; a user with no contributions sees one that says what will appear.

### F. Settings tabs — `SettingsGroup`, `SettingsRow`, `Card`, `Item`, `Input`, `Textarea`, `Select`, `PhoneInput`, `LanguageSelect`, `Switch`, `PasswordInput`, `PasswordRequirements`, `Alert`, `Link`, `ThemeSwitcher` (required)

Each tab is `SettingsGroup`s over flush `Card`s of `SettingsRow`s in an `Item.List`.

- **Profile and bio:** picture, names, handle, bio, time zone, local time, language, email, phone, website, and two visibility switches.
- **Security and access:** current, new and confirm password with live `PasswordRequirements` and its own Change password button, multi-factor and personal tokens. These act on their own and never ride the `SaveBar`: Change password checks the three fields and puts each error on its field (`FieldError`) before it sends `change-password`; turning multi-factor off asks first in a `ConfirmDialog`. When `securityPolicy.ssoManaged` is on, an info `Alert` names the identity provider in place of the password fields; when `mfaEnforced` is on, a warning `Tag` says the organization requires it and the switch is disabled.
- **Notifications:** the notification email, the Application Security, Platform and Delivery, and Account Activity and AI Adoption digests (frequency and channel), and real-time alerts for watched resources, mentions, deployments and AI Copilot sessions.
- **Preferences:** `ThemeSwitcher` and Keyboard shortcuts.

### G. Unsaved changes — `SaveBar`, `Button`, `Kbd` (required)

Any edit in the Profile, Notifications or Preferences tab shows one `SaveBar` with Discard and Save changes, `docked`, so it takes its own row under the content and never covers the last row. Save first checks the first and last name, the handle and the email: each error shows under its field (`FieldError`), the Profile tab opens and the first wrong field takes focus. After Discard or a save, focus goes back to the field you last edited. Command S saves only while Keyboard shortcuts is on, and its `Kbd` hint hides with it. When one record comes back saved, only that tab resets; edits in the other tabs stay.

## Data

The block fetches nothing. It takes its data through props and hands edits back through events; `sample.ts` fills any record left out (and no activity while `loading`). The types live in `user-profile-model.ts`.

| Prop                    | Type                              | What it does                                                           |
| ----------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `profile`               | `UserProfileData`                 | Identity, contact and visibility.                                      |
| `years`                 | `UserProfileYearActivity[]`       | Metrics, daily contributions and history per year, newest first.       |
| `securityPolicy`        | `UserProfileSecurityPolicy`       | SSO and SCIM management, multi-factor state and policy, token summary. |
| `notifications`         | `UserProfileNotificationSettings` | Notification email, digests and alerts.                                |
| `preferences`           | `UserProfilePreferences`          | Theme and keyboard shortcuts.                                          |
| `loading`               | `boolean`                         | Skeletons in the header, metrics, graph, history and settings tabs.    |
| `error`                 | `string`                          | A danger `Alert` with Retry replaces the page.                         |
| `v-model:active-tab`    | `UserProfileTab`                  | The open tab.                                                          |
| `v-model:selected-year` | `number`                          | The year of the overview; moves to the newest year when it has none.   |

Events: `save` (profile, notifications and preferences), `change-password` (`event`, current and new password), `mfa-change` (on or off, after the confirmation), `retry`, `upload-avatar`, `remove-avatar`, `manage-tokens`, `view-watched`. To go live, pass the user's records from the Azion API, persist on `@save` and write every record you saved back to its prop (that tab resets and the `SaveBar` closes when nothing else is edited), update `securityPolicy.mfaEnabled` on `@mfa-change`, and delete `sample.ts`.

## Do

- Keep the avatar small and the facts short: one line in the strip, one per line in the column.
- Cap the settings tabs at the form measure; only Overview uses the full width.
- Say who locks a setting and why when the organization's identity provider manages it.
- Keep every personal setting on this page, behind its tabs, with one `SaveBar`.

## Don't

- Don't add a highlights card, a large cover picture or organization directory widgets to the overview.
- Don't let the user change a password or turn off multi-factor when the organization manages them.
- Don't fake a save with a timer; persist on `@save`.
- Don't send a password or a multi-factor change through `@save`; they have their own events.
- Don't put Edit profile or copy-link buttons in the header; the tabs already edit in place.

## Copy

- History titles are past tense and name the product: "Deployed 14 releases across 3 Applications".
- Product names follow the Azion catalog: Applications, Functions, Object Storage, Web Application Firewall, AI Copilot.

## Accessibility

- `ContributionGraph` is a grid: arrow keys move by day and week, Enter picks a day, Escape clears it, and a live region reads the focused day.
- The year rail is a `nav` with `aria-pressed` on the shown year; every control in a `SettingsRow` carries an accessible name that matches its row.

## States

- Default: the Overview tab for 2026 with metrics, the contribution graph, the year rail and the history.
- Profile: the Profile and bio tab (`active-tab` is `profile`).
- Security: the Security and access tab (`active-tab` is `security`) for an account that signs in with a password.
- SecuritySso: the same tab with `securityPolicy.ssoManaged` and `mfaEnforced` on; the controls are locked and say why.
- Notifications: the Notifications tab (`active-tab` is `notifications`).
- Preferences: the Preferences tab (`active-tab` is `preferences`).
- Empty: a new user (`years` holds one year with no contributions); zero metrics, an empty graph and an EmptyState for the history.
- Loading: the first load (`loading`); skeletons in the header, the metrics, the graph and the history.
- Error: the profile did not load (`error` is set); a danger Alert with Retry replaces the page.

## Related

- `account/account-mfa-settings` — multi-factor policy for every member.
- `account/account-personal-tokens` — creating and revoking tokens.
- `account/account-activity-history` — the account's audit log.

## Variants

- `Default` — primary (the code below)
- `Profile` — The Profile and bio tab: personal information, contact and links, and contribution visibility.
- `Security` — The Security and access tab for an account that signs in with a password: password fields with live requirements, multi-factor and personal tokens.
- `SecuritySso` — The Security and access tab when the organization's SSO and SCIM provider manages the password and requires multi-factor: the controls are locked and say why.
- `Notifications` — The Notifications tab: the notification email, the three scheduled digests and the real-time alerts.
- `Preferences` — The Preferences tab: theme and the Keyboard shortcuts switch that hides every shortcut hint when off.
- `Empty` — A new user with no contributions yet: zero metrics, an empty graph and an EmptyState in place of the history.
- `Loading` — The first load: Skeletons in the header, the metrics, the graph and the history.
- `Error` — The profile failed to load: a danger Alert with Retry replaces the page.

Each variant is the same screen in another state: `get_block("account/account-user-profile", { variant })`, or the file under `blocks/account/account-user-profile/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import { computed, nextTick, ref, watch } from 'vue'

  import ProfileBioTab from './parts/profile-bio-tab.vue'
  import ProfileHeader from './parts/profile-header.vue'
  import ProfileNotificationsTab from './parts/profile-notifications-tab.vue'
  import ProfileOverview from './parts/profile-overview.vue'
  import ProfilePreferencesTab from './parts/profile-preferences-tab.vue'
  import ProfileSecurityTab from './parts/profile-security-tab.vue'
  import {
    sampleNotifications,
    samplePreferences,
    sampleProfile,
    sampleSecurityPolicy,
    sampleYears
  } from './sample'
  import type {
    UserProfileData,
    UserProfileNotificationSettings,
    UserProfilePasswordChange,
    UserProfilePreferences,
    UserProfileSavePayload,
    UserProfileSecurityForm,
    UserProfileSecurityPolicy,
    UserProfileTab,
    UserProfileYearActivity
  } from './user-profile-model'
  import { profileFieldErrors } from './user-profile-model'

  export interface UserProfileProps {
    /** Identity, contact and visibility data. Left out, the sample profile renders. */
    profile?: UserProfileData
    /** Every year of activity, newest first. Left out, the sample years render. */
    years?: UserProfileYearActivity[]
    /** Security state and the organization's SSO, SCIM and multi-factor policy. */
    securityPolicy?: UserProfileSecurityPolicy
    /** Notification routing, digests and alerts. */
    notifications?: UserProfileNotificationSettings
    /** Theme and keyboard shortcut preferences. */
    preferences?: UserProfilePreferences
    /** The profile is loading. */
    loading?: boolean
    /** Load failure; replaces the page with a danger Alert and Retry. */
    error?: string
  }

  const props = withDefaults(defineProps<UserProfileProps>(), {
    profile: () => sampleProfile,
    years: undefined,
    securityPolicy: () => sampleSecurityPolicy,
    notifications: () => sampleNotifications,
    preferences: () => samplePreferences,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    save: [payload: UserProfileSavePayload]
    retry: [event: MouseEvent]
    'upload-avatar': [event: MouseEvent]
    'remove-avatar': [event: MouseEvent]
    'manage-tokens': [event: MouseEvent]
    'change-password': [event: MouseEvent, change: UserProfilePasswordChange]
    'mfa-change': [enabled: boolean]
    'view-watched': [event: MouseEvent]
  }>()

  const activeTab = defineModel<UserProfileTab>('activeTab', { default: 'overview' })
  const selectedYear = defineModel<number>('selectedYear', { default: 2026 })

  const years = computed(() => props.years ?? (props.loading ? [] : sampleYears))

  const profileForm = ref<UserProfileData>({ ...props.profile })
  const notificationForm = ref<UserProfileNotificationSettings>({ ...props.notifications })
  const preferencesForm = ref<UserProfilePreferences>({ ...props.preferences })
  const securityForm = ref<UserProfileSecurityForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const snapshot = (): UserProfileSavePayload => ({
    profile: { ...profileForm.value },
    notifications: { ...notificationForm.value },
    preferences: { ...preferencesForm.value }
  })

  const same = (edited: object, saved: object) => JSON.stringify(edited) === JSON.stringify(saved)

  const dirty = computed(
    () =>
      !same(profileForm.value, props.profile) ||
      !same(notificationForm.value, props.notifications) ||
      !same(preferencesForm.value, props.preferences)
  )

  function discard() {
    saveTried.value = false
    profileForm.value = { ...props.profile }
    notificationForm.value = { ...props.notifications }
    preferencesForm.value = { ...props.preferences }
  }

  watch(
    () => props.profile,
    (saved) => {
      profileForm.value = { ...saved }
    }
  )
  watch(
    () => props.notifications,
    (saved) => {
      notificationForm.value = { ...saved }
    }
  )
  watch(
    () => props.preferences,
    (saved) => {
      preferencesForm.value = { ...saved }
    }
  )

  watch(
    years,
    (list) => {
      if (list.length && !list.some((entry) => entry.year === selectedYear.value)) {
        selectedYear.value = list[0]!.year
      }
    },
    { immediate: true }
  )

  const rootEl = ref<HTMLElement | null>(null)
  const saveTried = ref(false)
  const fieldErrors = computed(() => (saveTried.value ? profileFieldErrors(profileForm.value) : {}))

  const panelLabel = ref<string | undefined>(undefined)
  const lastFieldEl = ref<HTMLElement | null>(null)

  watch(
    [activeTab, () => props.loading, () => props.error],
    async () => {
      await nextTick()
      panelLabel.value =
        rootEl.value?.querySelector('[role="tab"][aria-selected="true"]')?.id || undefined
    },
    { immediate: true }
  )

  function onFocusin(event: FocusEvent) {
    const target = event.target
    if (target instanceof HTMLElement && !target.closest('[data-testid="save-bar"]'))
      lastFieldEl.value = target
  }

  watch(dirty, async (isDirty) => {
    if (isDirty) return
    await nextTick()
    const active = globalThis.document?.activeElement
    if (lastFieldEl.value?.isConnected && (!active || active === globalThis.document.body))
      lastFieldEl.value.focus()
  })

  async function save() {
    if (Object.keys(profileFieldErrors(profileForm.value)).length) {
      saveTried.value = true
      activeTab.value = 'profile'
      await nextTick()
      rootEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    saveTried.value = false
    emit('save', snapshot())
  }
</script>

<template>
  <div
    ref="rootEl"
    class="layout-column layout-boundary @container/profile flex min-w-0 flex-col"
    @focusin="onFocusin"
  >
    <Alert
      v-if="error && !loading"
      severity="danger"
      title="Your profile didn't load"
      :label="error"
      action-label="Retry"
      @action="emit('retry', $event)"
    />
    <div
      v-else
      class="grid min-w-0 grid-cols-1 gap-(--layout-group-gap) @6xl/profile:grid-cols-[var(--container-3xs)_minmax(0,1fr)] @6xl/profile:gap-x-(--layout-section-gap)"
    >
      <ProfileHeader
        :profile="profile"
        :loading="loading"
        class="@6xl/profile:col-start-1 @6xl/profile:row-start-2 @6xl/profile:self-start"
      />

      <div class="min-w-0 @6xl/profile:col-span-2 @6xl/profile:row-start-1">
        <PageTabs v-model="activeTab">
          <Tabs.Trigger
            value="overview"
            label="Overview"
          />
          <Tabs.Trigger
            value="profile"
            label="Profile and bio"
          />
          <Tabs.Trigger
            value="security"
            label="Security and access"
          />
          <Tabs.Trigger
            value="notifications"
            label="Notifications"
          />
          <Tabs.Trigger
            value="preferences"
            label="Preferences"
          />
        </PageTabs>
      </div>

      <div
        :data-measure="activeTab === 'overview' ? null : 'form'"
        class="flex min-w-0 flex-col gap-(--layout-group-gap) data-[measure=form]:max-w-(--layout-measure-form) @6xl/profile:col-start-2 @6xl/profile:row-start-2"
      >
        <div
          role="tabpanel"
          :aria-labelledby="panelLabel"
          class="flex min-w-0 flex-col"
        >
          <Skeleton
            v-if="loading && activeTab !== 'overview'"
            width="100%"
            height="20rem"
          />
          <ProfileOverview
            v-else-if="activeTab === 'overview'"
            v-model:selected-year="selectedYear"
            :years="years"
            :loading="loading"
          />
          <ProfileBioTab
            v-else-if="activeTab === 'profile'"
            v-model:form="profileForm"
            :errors="fieldErrors"
            @upload-avatar="emit('upload-avatar', $event)"
            @remove-avatar="emit('remove-avatar', $event)"
          />
          <ProfileSecurityTab
            v-else-if="activeTab === 'security'"
            v-model:form="securityForm"
            :policy="securityPolicy"
            @manage-tokens="emit('manage-tokens', $event)"
            @change-password="(event, change) => emit('change-password', event, change)"
            @mfa-change="emit('mfa-change', $event)"
          />
          <ProfileNotificationsTab
            v-else-if="activeTab === 'notifications'"
            v-model:form="notificationForm"
            :emails="profile.alternateEmails"
            @view-watched="emit('view-watched', $event)"
          />
          <ProfilePreferencesTab
            v-else
            v-model:form="preferencesForm"
          />
        </div>

        <SaveBar
          v-if="dirty"
          variant="docked"
          v-on="preferencesForm.keyboardShortcuts ? { save } : {}"
        >
          You have unsaved changes.
          <template #actions>
            <Button
              type="button"
              label="Discard"
              variant="outline"
              size="medium"
              @click="discard"
            />
            <Button
              type="button"
              variant="primary"
              size="medium"
              :aria-keyshortcuts="
                preferencesForm.keyboardShortcuts ? 'Meta+S Control+S' : undefined
              "
              @click="save"
            >
              Save changes
              <span
                v-if="preferencesForm.keyboardShortcuts"
                class="inline-flex pointer-coarse:hidden"
              >
                <Kbd
                  meta
                  size="small"
                  aria-hidden="true"
                  >S</Kbd
                >
              </span>
            </Button>
          </template>
        </SaveBar>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  UserProfileData,
  UserProfileNotificationSettings,
  UserProfilePreferences,
  UserProfileSecurityPolicy,
  UserProfileYearActivity
} from './user-profile-model'

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
  phoneDigits: '4155550142',
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
```

## `user-profile-model.ts`

```ts
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

/** The password fields of the security tab. */
export interface UserProfileSecurityForm {
  /** Current password. */
  currentPassword: string
  /** New password. */
  newPassword: string
  /** New password, typed again. */
  confirmPassword: string
}

/** A field of the profile that must be filled in correctly before a save. */
export type UserProfileCheckedField = 'firstName' | 'lastName' | 'handle' | 'email'

/** The error shown under each profile field that blocks a save. */
export type UserProfileFieldErrors = Partial<Record<UserProfileCheckedField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function profileFieldErrors(profile: UserProfileData): UserProfileFieldErrors {
  const errors: UserProfileFieldErrors = {}
  if (!profile.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!profile.lastName.trim()) errors.lastName = 'Enter your last name.'
  if (!profile.handle.trim()) errors.handle = 'Enter a handle.'
  if (!EMAIL_PATTERN.test(profile.email.trim()))
    errors.email = 'Enter an email address like jane.doe@example.com.'
  return errors
}

/** Everything the save event hands back. */
export interface UserProfileSavePayload {
  /** The edited profile. */
  profile: UserProfileData
  /** The edited notification settings. */
  notifications: UserProfileNotificationSettings
  /** The edited preferences. */
  preferences: UserProfilePreferences
}

/** What the change-password event hands back. */
export interface UserProfilePasswordChange {
  /** The password the user signs in with today. */
  currentPassword: string
  /** The new password; it meets every requirement and was typed twice. */
  newPassword: string
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
  { label: 'Pacific Time (Los Angeles)', value: 'America/Los_Angeles' },
  { label: 'Eastern Time (New York)', value: 'America/New_York' },
  { label: 'Coordinated Universal Time (UTC)', value: 'UTC' },
  { label: 'Central European Time (Berlin)', value: 'Europe/Berlin' }
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
```

## `parts/profile-header.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { UserProfileData } from '../user-profile-model'

  export interface ProfileHeaderProps {
    /** The profile shown in the header. */
    profile: UserProfileData
    /** The profile is loading. */
    loading: boolean
  }

  const props = defineProps<ProfileHeaderProps>()

  const initials = computed(() =>
    `${props.profile.firstName.charAt(0)}${props.profile.lastName.charAt(0)}`.toUpperCase()
  )
  const fullName = computed(() => `${props.profile.firstName} ${props.profile.lastName}`.trim())
  const details = computed(() =>
    [
      props.profile.handle && `@${props.profile.handle}`,
      props.profile.location,
      props.profile.memberSince && `On Azion since ${props.profile.memberSince}`
    ].filter((detail): detail is string => Boolean(detail))
  )
</script>

<template>
  <header
    class="flex min-w-0 items-center gap-(--spacing-sm) @6xl/profile:flex-col @6xl/profile:items-start"
  >
    <Skeleton
      v-if="loading"
      width="3rem"
      height="3rem"
      variant="circle"
    />
    <Avatar
      v-else
      :label="initials"
      :alt="fullName"
      size="large"
    />
    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
      <Skeleton
        key="skeleton-2"
        v-if="loading"
        width="12rem"
        height="1.25rem"
      />
      <div
        v-else
        class="flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <h1 class="text-heading-sm text-(--text-default)">{{ fullName }}</h1>
        <Tag :label="profile.role" />
      </div>
      <Skeleton
        key="skeleton-3"
        v-if="loading"
        width="16rem"
        height="1rem"
      />
      <ul
        v-else
        class="flex min-w-0 flex-wrap text-body-sm text-(--text-muted) @6xl/profile:flex-col @6xl/profile:gap-(--spacing-2xs)"
      >
        <li
          v-for="detail in details"
          :key="detail"
          class="not-last:after:px-(--spacing-2xs) not-last:after:content-['·'_/_''] @6xl/profile:not-last:after:hidden"
        >
          {{ detail }}
        </li>
      </ul>
      <p
        v-if="!loading && profile.bio"
        class="hidden text-body-sm text-(--text-default) @6xl/profile:block"
      >
        {{ profile.bio }}
      </p>
    </div>
  </header>
</template>
```

## `parts/profile-overview.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ContributionGraph from '@aziontech/webkit/contribution-graph'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import Tag from '@aziontech/webkit/tag'
  import Timeline from '@aziontech/webkit/timeline'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, ref, watch } from 'vue'

  import {
    CATEGORY_OPTIONS,
    filterHistory,
    type UserProfileContributionCategory,
    type UserProfileYearActivity
  } from '../user-profile-model'

  export interface ProfileOverviewProps {
    /** Every year of activity, newest first. */
    years: UserProfileYearActivity[]
    /** The activity is loading. */
    loading: boolean
  }

  const props = defineProps<ProfileOverviewProps>()

  const selectedYear = defineModel<number>('selectedYear', { required: true })

  const category = ref<'all' | UserProfileContributionCategory>('all')
  const selectedDate = ref<string | null>(null)

  const activeYear = computed<UserProfileYearActivity | null>(
    () => props.years.find((entry) => entry.year === selectedYear.value) ?? props.years[0] ?? null
  )
  const shownYear = computed(() => activeYear.value?.year ?? selectedYear.value)

  const graphItems = computed(() => {
    const items = activeYear.value?.items ?? []
    return category.value === 'all'
      ? items
      : items.filter((item) => item.category === category.value)
  })

  const history = computed(() =>
    filterHistory(activeYear.value?.months ?? [], category.value, selectedDate.value)
  )
  const filtered = computed(() => selectedDate.value !== null || category.value !== 'all')

  const { formatDate } = useLocale()
  const formatDay = (iso: string) => formatDate(iso, { dateStyle: 'medium', timeZone: 'UTC' })

  watch(selectedYear, () => {
    selectedDate.value = null
  })

  const graphEl = ref<HTMLElement | null>(null)

  async function showAllDays() {
    selectedDate.value = null
    await nextTick()
    graphEl.value?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus()
  }

  const emptyTitle = computed(() => {
    if (!filtered.value) return 'No contributions yet'
    if (selectedDate.value && category.value === 'all')
      return `Nothing in the history on ${formatDay(selectedDate.value)}`
    return 'Nothing matches these filters'
  })

  function resetFilters() {
    selectedDate.value = null
    category.value = 'all'
  }
</script>

<template>
  <div class="flex flex-col gap-(--layout-group-gap)">
    <div class="max-md:hidden">
      <StatTileGroup aria-label="Platform contribution metrics">
        <StatTile
          label="Contributions"
          :value="activeYear?.totalContributions ?? 0"
          :delta="activeYear?.contributionsDelta || null"
          delta-label="vs. last year"
          :loading="loading"
        />
        <StatTile
          label="Deployments"
          :value="activeYear?.deployments ?? 0"
          :loading="loading"
        />
        <StatTile
          label="AI Copilot tasks"
          :value="activeYear?.copilotTasks ?? 0"
          :loading="loading"
        />
        <StatTile
          label="Longest streak"
          :value="activeYear?.longestStreakDays ?? 0"
          unit="days"
          :loading="loading"
        />
        <StatTile
          label="Current streak"
          :value="activeYear?.currentStreakDays ?? 0"
          unit="days"
          :loading="loading"
        />
      </StatTileGroup>
    </div>

    <Card>
      <div class="flex flex-col gap-(--spacing-md)">
        <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
          <div class="flex flex-col gap-(--spacing-2xs)">
            <h2 class="text-heading-xs text-(--text-default)">
              Platform contributions in {{ shownYear }}
            </h2>
            <p class="text-body-sm text-(--text-muted)">
              Deploys, Functions, firewall rules and AI Copilot workflows, one square per day.
            </p>
          </div>
          <ToggleGroup
            v-model="category"
            :options="CATEGORY_OPTIONS"
            size="small"
            aria-label="Contribution category"
          />
        </div>

        <div class="flex flex-col gap-(--spacing-md) lg:flex-row lg:items-start">
          <div
            ref="graphEl"
            class="min-w-0"
          >
            <ContributionGraph
              v-model:selected-date="selectedDate"
              :items="graphItems"
              :year="shownYear"
              :loading="loading"
              :aria-label="`Platform contributions in ${shownYear}`"
            />
          </div>
          <nav
            v-if="years.length > 1"
            aria-label="Contribution year"
            class="flex shrink-0 flex-row flex-wrap gap-(--spacing-2xs) lg:w-20 lg:flex-col"
          >
            <Button
              v-for="entry in years"
              :key="entry.year"
              type="button"
              size="small"
              :variant="entry.year === shownYear ? 'secondary' : 'ghost'"
              :label="String(entry.year)"
              :aria-pressed="entry.year === shownYear"
              @click="selectedYear = entry.year"
            />
          </nav>
        </div>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col gap-(--spacing-md)">
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <h2 class="text-heading-xs text-(--text-default)">Contribution history</h2>
          <Tag
            v-if="selectedDate"
            :label="formatDay(selectedDate)"
          />
          <Button
            v-if="selectedDate"
            type="button"
            label="Show all days"
            variant="ghost"
            size="small"
            @click="showAllDays"
          />
        </div>

        <EmptyState
          v-if="!loading && history.length === 0"
          :title="emptyTitle"
          :description="
            filtered
              ? 'The history keeps the larger changes of each month. Pick another day or category, or show everything again.'
              : 'Deploys, Functions and firewall changes you make show up here.'
          "
          icon="az az-history"
          size="small"
        >
          <template
            v-if="filtered"
            #actions
          >
            <Button
              type="button"
              label="Reset filters"
              variant="outline"
              size="small"
              @click="resetFilters"
            />
          </template>
        </EmptyState>
        <Timeline
          v-else
          :loading="loading"
          aria-label="Contribution history"
        >
          <Timeline.Group
            v-for="month in history"
            :key="month.label"
            :label="month.label"
          >
            <Timeline.Item
              v-for="entry in month.entries"
              :key="entry.id"
              :title="entry.title"
              :description="entry.description"
              :severity="entry.severity"
              :icon="entry.icon"
              :time="entry.time"
            />
          </Timeline.Group>
        </Timeline>
      </div>
    </Card>
  </div>
</template>
```

## `parts/profile-bio-tab.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, useId } from 'vue'

  import {
    TIMEZONE_OPTIONS,
    type UserProfileData,
    type UserProfileFieldErrors
  } from '../user-profile-model'
  import ProfileSelect from './profile-select.vue'

  export interface ProfileBioTabProps {
    /** The error under each field that blocks a save. */
    errors: UserProfileFieldErrors
  }

  defineProps<ProfileBioTabProps>()

  const form = defineModel<UserProfileData>('form', { required: true })

  const errorIds = {
    firstName: useId(),
    lastName: useId(),
    handle: useId(),
    email: useId()
  }

  const emit = defineEmits<{
    'upload-avatar': [event: MouseEvent]
    'remove-avatar': [event: MouseEvent]
  }>()

  const initials = computed(() =>
    `${form.value.firstName.charAt(0)}${form.value.lastName.charAt(0)}`.toUpperCase()
  )
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Personal information"
      hint="Who you are across the Azion console: in headers, activity and team lists."
      anchor="personal-information"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Profile picture"
            description="A small picture next to your name. Shown at 48 pixels or less."
            variant="compact"
          >
            <div class="flex items-center gap-(--spacing-xs)">
              <Avatar
                :label="initials"
                :alt="`${form.firstName} ${form.lastName}`"
              />
              <Button
                type="button"
                label="Upload"
                variant="outline"
                size="small"
                @click="emit('upload-avatar', $event)"
              />
              <Button
                type="button"
                label="Remove"
                variant="ghost"
                size="small"
                @click="emit('remove-avatar', $event)"
              />
            </div>
          </SettingsRow>
          <SettingsRow title="First name">
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.firstName"
                :invalid="Boolean(errors.firstName)"
                :aria-describedby="errors.firstName ? errorIds.firstName : undefined"
                size="large"
                class="w-full"
                aria-label="First name"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.firstName"
                :id="errorIds.firstName"
                >{{ errors.firstName }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow title="Last name">
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.lastName"
                :invalid="Boolean(errors.lastName)"
                :aria-describedby="errors.lastName ? errorIds.lastName : undefined"
                size="large"
                class="w-full"
                aria-label="Last name"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.lastName"
                :id="errorIds.lastName"
                >{{ errors.lastName }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Handle"
            description="Used for mentions and in your profile link."
          >
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.handle"
                :invalid="Boolean(errors.handle)"
                :aria-describedby="errors.handle ? errorIds.handle : undefined"
                size="large"
                class="w-full"
                aria-label="Handle"
              />
              <FieldError
                v-if="errors.handle"
                :id="errorIds.handle"
                >{{ errors.handle }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Bio"
            description="A line about what you build on Azion."
            variant="stacked"
          >
            <Textarea
              v-model="form.bio"
              class="w-full"
              aria-label="Bio"
            />
          </SettingsRow>
          <SettingsRow
            title="Time zone"
            description="Times in deployments, activity and audit logs use it."
          >
            <ProfileSelect
              v-model="form.timezone"
              :options="TIMEZONE_OPTIONS"
              aria-label="Time zone"
            />
          </SettingsRow>
          <SettingsRow
            title="Show my local time"
            description="Team members see the time difference from theirs."
            variant="compact"
          >
            <Switch
              v-model="form.displayLocalTime"
              aria-label="Show my local time"
            />
          </SettingsRow>
          <SettingsRow
            title="Language"
            description="The language of the console and of the emails Azion sends you."
          >
            <LanguageSelect
              v-model="form.language"
              size="large"
              class="w-full"
              aria-label="Language"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Contact and links"
      hint="How Azion and your team reach you."
      anchor="contact"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Email"
            description="For account recovery and notifications."
          >
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.email"
                type="email"
                :invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? errorIds.email : undefined"
                size="large"
                class="w-full"
                aria-label="Email"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.email"
                :id="errorIds.email"
                >{{ errors.email }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Phone number"
            description="With the country code."
          >
            <PhoneInput
              v-model="form.phoneDigits"
              v-model:country="form.phoneCountry"
              size="large"
              aria-label="Phone number"
            />
          </SettingsRow>
          <SettingsRow
            title="Website or GitHub"
            description="Shown on your profile."
          >
            <Input
              v-model="form.websiteUrl"
              inputmode="url"
              autocomplete="off"
              size="large"
              class="w-full"
              aria-label="Website or GitHub"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Contributions and visibility"
      hint="What other members of your organization see."
      anchor="visibility"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Private profile"
            description="Hide your contribution graph and history from organization directories."
            variant="compact"
          >
            <Switch
              v-model="form.privateProfile"
              aria-label="Private profile"
            />
          </SettingsRow>
          <SettingsRow
            title="Count private contributions"
            description="Add contributions to private accounts to the graph, without the resource names."
            variant="compact"
          >
            <Switch
              v-model="form.includePrivateContributions"
              aria-label="Count private contributions"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
```

## `parts/profile-security-tab.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import PasswordRequirements from '@aziontech/webkit/password-requirements-root'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { computed, ref, useId, watch } from 'vue'

  import type {
    UserProfilePasswordChange,
    UserProfileSecurityForm,
    UserProfileSecurityPolicy
  } from '../user-profile-model'

  export interface ProfileSecurityTabProps {
    /** The security state and the organization's policy. */
    policy: UserProfileSecurityPolicy
  }

  const props = defineProps<ProfileSecurityTabProps>()

  const form = defineModel<UserProfileSecurityForm>('form', { required: true })

  const emit = defineEmits<{
    'manage-tokens': [event: MouseEvent]
    'change-password': [event: MouseEvent, change: UserProfilePasswordChange]
    'mfa-change': [enabled: boolean]
  }>()

  const currentErrorId = useId()
  const newErrorId = useId()
  const confirmErrorId = useId()

  const submitted = ref(false)
  const confirmingMfaOff = ref(false)

  const currentError = computed(() =>
    submitted.value && !form.value.currentPassword ? 'Enter your current password.' : ''
  )
  const newError = computed(() =>
    submitted.value &&
    !DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(form.value.newPassword))
      ? 'Meet every requirement above.'
      : ''
  )
  const confirmError = computed(() =>
    submitted.value && form.value.confirmPassword !== form.value.newPassword
      ? "The passwords don't match."
      : ''
  )

  const mfaOn = ref(props.policy.mfaEnabled)
  watch(
    () => props.policy.mfaEnabled,
    (enabled) => {
      mfaOn.value = enabled
    }
  )

  const mfaEnabled = computed({
    get: () => mfaOn.value,
    set: (enabled: boolean) => {
      if (enabled) setMfa(true)
      else confirmingMfaOff.value = true
    }
  })

  function setMfa(enabled: boolean) {
    mfaOn.value = enabled
    confirmingMfaOff.value = false
    emit('mfa-change', enabled)
  }

  function changePassword(event: MouseEvent) {
    submitted.value = true
    if (currentError.value || newError.value || confirmError.value) return
    emit('change-password', event, {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    submitted.value = false
  }
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Password"
      :hint="
        policy.ssoManaged
          ? 'Your organization signs you in through its identity provider.'
          : 'Change the password you sign in to the Azion console with.'
      "
      anchor="password"
    >
      <div class="flex flex-col gap-(--layout-group-gap)">
        <Alert
          v-if="policy.ssoManaged"
          severity="info"
          :title="`Managed by ${policy.ssoProvider}`"
          label="Your password is set and reset in your organization's identity provider (SSO and SCIM), so it can't be changed here."
        />
        <Card
          v-if="!policy.ssoManaged"
          :padded="false"
        >
          <Item.List>
            <SettingsRow title="Current password">
              <div class="flex w-full flex-col gap-(--spacing-2xs)">
                <PasswordInput
                  v-model="form.currentPassword"
                  autocomplete="current-password"
                  :disabled="policy.ssoManaged"
                  :invalid="Boolean(currentError)"
                  :aria-describedby="currentError ? currentErrorId : undefined"
                  aria-label="Current password"
                />
                <FieldError
                  v-if="currentError"
                  :id="currentErrorId"
                  >{{ currentError }}</FieldError
                >
              </div>
            </SettingsRow>
            <SettingsRow
              title="New password"
              description="Use one you don't use anywhere else."
            >
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <PasswordInput
                  v-model="form.newPassword"
                  autocomplete="new-password"
                  :disabled="policy.ssoManaged"
                  :invalid="Boolean(newError)"
                  :aria-describedby="newError ? newErrorId : undefined"
                  aria-label="New password"
                />
                <PasswordRequirements
                  v-if="!policy.ssoManaged"
                  :value="form.newPassword"
                />
                <FieldError
                  v-if="newError"
                  :id="newErrorId"
                  >{{ newError }}</FieldError
                >
              </div>
            </SettingsRow>
            <SettingsRow title="Confirm new password">
              <div class="flex w-full flex-col gap-(--spacing-2xs)">
                <PasswordInput
                  v-model="form.confirmPassword"
                  autocomplete="new-password"
                  :disabled="policy.ssoManaged"
                  :invalid="Boolean(confirmError)"
                  :aria-describedby="confirmError ? confirmErrorId : undefined"
                  aria-label="Confirm new password"
                />
                <FieldError
                  v-if="confirmError"
                  :id="confirmErrorId"
                  >{{ confirmError }}</FieldError
                >
              </div>
            </SettingsRow>
          </Item.List>
        </Card>
        <div
          v-if="!policy.ssoManaged"
          class="flex justify-end"
        >
          <Button
            type="button"
            label="Change password"
            variant="secondary"
            size="medium"
            @click="changePassword"
          />
        </div>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Sign-in and access"
      hint="Protect how you sign in and how tools reach your account."
      anchor="access"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Multi-factor authentication"
            :description="
              policy.mfaEnforced
                ? 'Your organization requires it, so it stays on.'
                : 'Ask for a code from an authenticator app every time you sign in.'
            "
            variant="compact"
          >
            <template #title>
              <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                <span>Multi-factor authentication</span>
                <Tag
                  v-if="policy.mfaEnforced"
                  label="Required by your organization"
                  severity="warning"
                />
              </span>
            </template>
            <Switch
              v-model="mfaEnabled"
              :disabled="policy.mfaEnforced"
              aria-label="Multi-factor authentication"
            />
            <ConfirmDialog
              v-model:open="confirmingMfaOff"
              title="Turn off multi-factor authentication?"
              description="You'll sign in with your password alone, and anyone who learns it can get into your account."
              confirm-label="Turn off"
              @confirm="setMfa(false)"
            />
          </SettingsRow>
          <SettingsRow
            title="Personal tokens"
            variant="compact"
          >
            <template #description>
              {{ policy.activeTokensCount }} active. Last used
              <Timestamp :value="policy.lastTokenUsedAt" />
              from {{ policy.lastTokenClient }}.
            </template>
            <Button
              type="button"
              label="Manage tokens"
              variant="outline"
              size="small"
              @click="emit('manage-tokens', $event)"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
```

## `parts/profile-notifications-tab.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import {
    ALERT_CHANNEL_OPTIONS,
    CADENCE_OPTIONS,
    DEPLOY_ALERT_OPTIONS,
    DIGEST_CHANNEL_OPTIONS,
    DIGESTS,
    pickOption,
    type UserProfileNotificationSettings
  } from '../user-profile-model'
  import ProfileSelect from './profile-select.vue'

  export interface ProfileNotificationsTabProps {
    /** Verified addresses the user can route notifications to. */
    emails: string[]
  }

  const props = defineProps<ProfileNotificationsTabProps>()

  const form = defineModel<UserProfileNotificationSettings>('form', { required: true })

  const emit = defineEmits<{
    'view-watched': [event: MouseEvent]
  }>()

  const emailOptions = computed(() => props.emails.map((email) => ({ label: email, value: email })))
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Delivery"
      hint="Where Azion sends your notification emails."
      anchor="delivery"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Notification email"
            description="Every email below goes here unless your organization routes it elsewhere."
          >
            <ProfileSelect
              v-model="form.defaultEmail"
              :options="emailOptions"
              aria-label="Notification email"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Scheduled digests"
      hint="Summaries of what happened in your accounts, one per area of the platform."
      anchor="digests"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            v-for="digest in DIGESTS"
            :key="digest.key"
            :title="digest.title"
            :description="digest.description"
          >
            <div class="grid w-full grid-cols-2 gap-(--spacing-xs)">
              <ProfileSelect
                :model-value="form[digest.cadence]"
                @update:model-value="
                  form[digest.cadence] = pickOption(CADENCE_OPTIONS, $event, 'off')
                "
                :options="CADENCE_OPTIONS"
                :aria-label="`${digest.title} frequency`"
              />
              <ProfileSelect
                :model-value="form[digest.channel]"
                @update:model-value="
                  form[digest.channel] = pickOption(DIGEST_CHANNEL_OPTIONS, $event, 'email')
                "
                :options="DIGEST_CHANNEL_OPTIONS"
                :aria-label="`${digest.title} channel`"
              />
            </div>
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Watched resources and alerts"
      hint="What reaches you right away, and where."
      anchor="alerts"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow title="Watched resources">
            <template #description>
              Applications, Functions and firewalls you watch.
              <Link
                href="#watched-resources"
                inline
                @click.prevent="emit('view-watched', $event)"
                >See the {{ form.watchedResourcesCount }} you watch</Link
              >
            </template>
            <ProfileSelect
              :model-value="form.watchedResourcesChannel"
              @update:model-value="
                form.watchedResourcesChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="Watched resources channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Mentions"
            description="When someone mentions you in an incident note, a review or a deploy approval."
          >
            <ProfileSelect
              :model-value="form.mentionsChannel"
              @update:model-value="
                form.mentionsChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="Mentions channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Deployments and builds"
            description="Application deploys and Functions builds."
          >
            <ProfileSelect
              :model-value="form.deployAlertsChannel"
              @update:model-value="
                form.deployAlertsChannel = pickOption(DEPLOY_ALERT_OPTIONS, $event, 'off')
              "
              :options="DEPLOY_ALERT_OPTIONS"
              aria-label="Deployments and builds alerts"
            />
          </SettingsRow>
          <SettingsRow
            title="AI Copilot sessions"
            description="When a long agent task finishes or waits for your approval."
          >
            <ProfileSelect
              :model-value="form.copilotSessionsChannel"
              @update:model-value="
                form.copilotSessionsChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="AI Copilot sessions channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Personal token alerts"
            description="An email as soon as a token is created or is about to expire."
            variant="compact"
          >
            <Switch
              v-model="form.tokenAlerts"
              aria-label="Personal token alerts"
            />
          </SettingsRow>
          <SettingsRow
            title="Release notes and tips"
            description="New features and tips inside the console."
            variant="compact"
          >
            <Switch
              v-model="form.releaseNotes"
              aria-label="Release notes and tips"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
```

## `parts/profile-preferences-tab.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'

  import type { UserProfilePreferences } from '../user-profile-model'

  const form = defineModel<UserProfilePreferences>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Appearance and keyboard"
    hint="How the Azion console looks and responds for you."
    anchor="appearance"
  >
    <Card :padded="false">
      <Item.List>
        <SettingsRow
          title="Theme"
          description="Follow your system, or keep the console light or dark."
          variant="compact"
        >
          <ThemeSwitcher
            v-model="form.theme"
            aria-label="Theme"
          />
        </SettingsRow>
        <SettingsRow
          title="Keyboard shortcuts"
          description="Turn on console shortcuts and show their keys on buttons and menus. Off, the keys are hidden everywhere."
          variant="compact"
        >
          <Switch
            v-model="form.keyboardShortcuts"
            aria-label="Keyboard shortcuts"
          />
        </SettingsRow>
      </Item.List>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/profile-select.vue`

```ts
<script setup lang="ts">
  import Select from '@aziontech/webkit/select'

  import type { UserProfileOption } from '../user-profile-model'

  export interface ProfileSelectProps {
    /** Choices of the select. */
    options: UserProfileOption[]
    /** Accessible name of the trigger. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ProfileSelectProps>(), { ariaLabel: '' })

  const model = defineModel<string>({ required: true })

  const labelOf = (value: string) =>
    props.options.find((option) => option.value === value)?.label ?? value
</script>

<template>
  <Select
    v-model="model"
    size="large"
    class="w-full"
    :display-value="labelOf"
  >
    <Select.Trigger :aria-label="ariaLabel || undefined" />
    <Select.Content>
      <Select.Item
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select>
</template>
```
