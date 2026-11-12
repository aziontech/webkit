# MFA management

Multi-factor authentication for a whole account. An admin sees who signs in with a second factor and who uses a password only, requires MFA for everyone, reminds the people who have not set it up, and resets the factor of someone who lost their device. Setting up a factor and the sign-in challenge are `platform/auth` (`MfaSetup`, `MfaChallenge`); this page manages them for other people. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- An account or organisation page where admins enforce or audit multi-factor authentication.
- Helping a person who lost the device that holds their factor.

## When not to use

- A person setting up their own factor: use `platform/auth#MfaSetup`.
- The code prompt at sign-in: use `platform/auth#MfaChallenge`.
- Inviting or removing people: use `platform/account/users`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Multi-factor authentication` and one sentence on what the page holds. Action: Documentation.

### B. Require MFA — `Card`, `Item`, `SettingRow`, `Switch`, `ConfirmDialog` (required)

One compact `SettingRow` in an `Item.List` in a flush `Card`. Turning the `Switch` on opens a `ConfirmDialog` (`kind="primary"`) that names the people without a factor and says they cannot use the account until they set one up; turning it off applies at once with a toast. While data loads or failed, the switch is disabled.

### C. Password-only warning — `Alert` (conditional)

While MFA is optional and someone has no factor, a warning `Alert` counts them (`2 of 5 people sign in with a password only.`) and points at the two remedies.

### D. People table — `Input`, `Table`, `Avatar`, `useCollection` (required)

A search `Input` with `v-bind="filterProps"`, then a `Table` with `v-bind="tableProps"` in a flush `Card`: Name (square `Avatar`, name, email under it), MFA as `Table.CellStatus` (Enabled success, Not set up warning), Method, and Set up as `Table.CellTime` or a dash.

### E. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the person: Reset MFA for an enabled factor, behind a `ConfirmDialog` that says what the person loses and when to use it; Send setup reminder for a person without one.

### F. Load failure and outcomes — `Alert`, `Toaster` (required)

When the list fails to load, a danger `Alert` with Retry takes the table's place. Require, optional, reset and reminder end in a success toast; they are not deploys, so no toast carries Edit or Redeploy.

## Do

- Name who is affected before requiring MFA.
- Keep people without a factor visible and marked, with a way to remind them.
- Say what a reset does (password only until they set it up again) before confirming it.

## Don't

- Don't show or copy anyone's secret or recovery codes here; only the owner of the factor sees them.
- Don't reset without a confirmation; it weakens one person's sign-in.
- Don't make the warning color the only signal; the Alert and the status say it in words.

## Copy

- **Title:** `Multi-factor authentication`. **Setting:** `Require MFA`.
- **Statuses:** `Enabled`, `Not set up`. **Actions:** `Reset MFA`, `Send setup reminder`.
- **Toasts:** `MFA is now required.`, `MFA is optional again.`, `MFA reset for Jordan Reyes.`, `Reminder sent to priya.nair@example.com.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The Switch is named Require MFA and the setting description explains the effect.
- The row menu is named `Actions for <person>`; status is text, not color.
- Both confirmations are dialogs that return focus to their trigger.

## States

- Default: five people, three with a factor, MFA optional, the warning shown.
- Required: MFA required for the account.
- Loading: the first load.
- Failed: the list did not load; a danger Alert with Retry.

## Related

- `platform/auth` — `MfaSetup` and `MfaChallenge`, the person's own side.
- `platform/account/users` — the people in the account.
- `platform/account/activity-history` — where MFA changes are audited.
