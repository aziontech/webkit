# User profile

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

A compact strip: a 48 px `Avatar` (`size="large"`), the name as the page `h1`, the role `Tag`, then the handle, location and join year. No buttons: every setting is edited in place on its tab, so an Edit profile button or a copy link would only repeat the tabs. No cover picture and no large avatar: the graph and the settings stay above the fold.

### B. Tabs — `PageTabs`, `Tabs` (required)

Five tabs on `v-model:active-tab`: Overview, Profile and bio, Security and access, Notifications, Preferences.

### C. Metrics — `StatTileGroup`, `StatTile` (required)

Five tiles for the selected year: Contributions (with the change against last year), Deployments, AI Copilot tasks, Longest streak, Current streak. Below the `md` breakpoint the tiles are hidden: stacked one per row they push the graph off the first screen of a phone.

### D. Contribution graph — `Card`, `ContributionGraph`, `ToggleGroup`, `Button` (required)

A year of daily contributions. A category `ToggleGroup` (All, Deploys, Functions, Security) filters the graph and the history. Days are squares; there is no shape switch. The year rail (one `Button` per year, `aria-current` on the shown one) changes the year of the metrics, the graph and the history. Picking a day filters the history to it.

### E. Contribution history — `Card`, `Timeline`, `Tag`, `Button`, `EmptyState` (required)

The year's contributions grouped by month in a `Timeline`, newest first. With a day picked, a `Tag` names the day and Show all days clears it. No match shows an `EmptyState` with Reset filters; a user with no contributions sees one that says what will appear.

### F. Settings tabs — `SettingsGroup`, `SettingsRow`, `Card`, `Item`, `Input`, `Textarea`, `Select`, `PhoneInput`, `LanguageSelect`, `Switch`, `PasswordInput`, `PasswordRequirements`, `Alert`, `Link`, `ThemeSwitcher` (required)

Each tab is `SettingsGroup`s over flush `Card`s of `SettingsRow`s in an `Item.List`.

- **Profile and bio:** picture, names, handle, bio, time zone, local time, language, email, phone, website, and two visibility switches.
- **Security and access:** current, new and confirm password with live `PasswordRequirements` and its own Change password button, multi-factor and personal tokens. These act on their own and never ride the `SaveBar`: Change password checks the three fields and puts each error on its field (`FieldError`) before it sends `change-password`; turning multi-factor off asks first in a `ConfirmDialog`. When `securityPolicy.ssoManaged` is on, an info `Alert` names the identity provider and the password fields are disabled; when `mfaEnforced` is on, a warning `Tag` says the organization requires it and the switch is disabled.
- **Notifications:** the notification email, the Application Security, Platform and Delivery, and Account Activity and AI Adoption digests (frequency and channel), and real-time alerts for watched resources, mentions, deployments and AI Copilot sessions.
- **Preferences:** `ThemeSwitcher` and Keyboard shortcuts.

### G. Unsaved changes — `SaveBar`, `Button`, `Kbd` (required)

Any edit in the Profile, Notifications or Preferences tab shows one `SaveBar` with Discard and Save changes. Command S saves only while Keyboard shortcuts is on, and its `Kbd` hint hides with it. When one record comes back saved, only that tab resets; edits in the other tabs stay.

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

- Keep the avatar small and the header to one line of facts.
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
- The year rail is a `nav` with `aria-current` on the shown year; every control in a `SettingsRow` carries an accessible name that matches its row.

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
