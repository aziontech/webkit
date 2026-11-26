# MFA management

Multi-factor authentication for a whole account. An admin sees who signs in with a second factor and who uses a password only, requires MFA for everyone, reminds the people who have not set it up, and resets the factor of someone who lost their device. Setting up a factor and the sign-in challenge are `auth/auth-sign-in` (`MfaSetup`, `MfaCode`); this page manages them for other people. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- An account or organisation page where admins enforce or audit multi-factor authentication.
- Helping a person who lost the device that holds their factor.

## When not to use

- A person setting up their own factor: use `auth/auth-sign-in#MfaSetup`.
- The code prompt at sign-in: use `auth/auth-sign-in#MfaCode`.
- Inviting or removing people: use `account/account-users`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Multi-factor authentication` and one sentence on what the page holds. Action: Documentation.

### B. Require MFA — `Card`, `Item`, `SettingsRow`, `Switch`, `ConfirmDialog` (required)

One compact `SettingsRow` in an `Item.List` in a flush `Card`. Turning the `Switch` on opens a `ConfirmDialog` (`variant="primary"`) that names the people without a factor and says they cannot use the account until they set one up; turning it off weakens a security policy, the riskier direction, so it asks too: a `ConfirmDialog` (`variant="danger"`, `Stop requiring MFA`) that says how many people without a factor can sign in again and that new people may sign in with a password only. Nothing changes until it is confirmed. Either way the block updates `v-model:required` and the page saves it. While data loads or failed, the switch is disabled.

### C. Password-only warning — `Alert` (conditional)

While MFA is optional and someone has no factor, a warning `Alert` counts them (`2 of 5 people sign in with a password only.`) and points at the two remedies.

### D. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The `view/view-table` controls row, as on every account list: a `PropertyFilter` over Name, Email, MFA status and Method (`v-bind="propertyFilterProps"`), then Refresh and Download CSV as outlined `IconButton`s in a `Tooltip`, and `CollectionPreferences` for page size and columns. Download CSV is disabled when no row matches.

### E. People table — `DataTable`, `DataTablePagination`, `TableCellActions`, `TableCellStatus`, `TableCellTime`, `Avatar`, `EmptyState`, `useCollection` (required)

A `DataTable` with `v-bind="tableProps"` in a flush `Card`, paginated by `useCollection` through `DataTablePagination` (`v-bind="paginationProps" manual`) in the `footer` slot: Name (square `Avatar`, name, email under it, and below `sm` the MFA `TableCellStatus` under the email, hidden from assistive tech, so a phone shows who has MFA without scrolling past the pinned actions), MFA as `TableCellStatus` (Enabled success, Not set up warning), Method, and Set up as `TableCellTime` or a dash. When no person matches the filters, the table's `#empty` slot renders a small `EmptyState` (`No matching people`) with Clear filters.

### F. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`TableCellActions` named after the person: Reset MFA for an enabled factor, behind a `ConfirmDialog` that says what the person loses and when to use it; Send setup reminder for a person without one. Reset marks the row Not set up and emits `reset`; the reminder emits `remind`.

### G. Load failure and outcomes — `Alert` (required)

When the list fails to load, a danger `Alert` with Retry takes the table's place. The page that runs the request ends require, optional, reset and reminder in a success toast; they are not deploys, so no toast carries Edit or Redeploy. The page calls `toast` from `@aziontech/ui/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its people through props and emits every action; it fetches nothing. `MfaSettingsMember` and `MfaSettingsProps` are exported from `account-mfa-settings.vue`, and `sample.ts` holds the sample people the block renders when `members` is left out (and never while `loading` or `error` is set).

| Prop       | Type                  | What it does                                                                                                                                |
| ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `members`  | `MfaSettingsMember[]` | The rows; the filter, the sort and the pages run on them in the browser.                                                                    |
| `loading`  | `boolean`             | A request is in flight. With no people it is the first load (the Switch disables, the table shows loading rows); with people Refresh spins. |
| `error`    | `string`              | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table; the Switch disables.                  |
| `required` | `boolean`             | `v-model:required`: whether the account requires MFA; on hides the password-only warning.                                                   |

| Event             | Payload           | When                                                                                   |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `update:required` | `boolean`         | The require dialog was confirmed (`true`), or the stop dialog was confirmed (`false`). |
| `refresh`         | `(event)`         | Refresh.                                                                               |
| `retry`           | `(event)`         | Retry in the error alert.                                                              |
| `remind`          | `(event, member)` | Send setup reminder in the row menu.                                                   |
| `reset`           | `(event, member)` | The reset dialog was confirmed; the row already reads Not set up.                      |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import AccountMfaSettings from './account-mfa-settings.vue'

  const { data, pending, error, refresh } = useMfaStatus()
  const loadError = 'The MFA status could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountMfaSettings
    :members="data?.members ?? []"
    :required="data?.required ?? false"
    :loading="pending"
    :error="error ? loadError : ''"
    @update:required="saveRequired"
    @refresh="refresh"
    @retry="refresh"
    @remind="(_event, member) => sendReminder(member.id)"
    @reset="(_event, member) => resetMfa(member.id)"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- **No match:** `No matching people`, `No person matches these filters.`, `Clear filters`.
- **Toasts:** `MFA is now required.`, `MFA is optional again.`, `MFA reset for Jordan Reyes.`, `Reminder sent to priya.nair@example.com.`
- Follow `skills/azion-ui-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The Switch is named Require MFA and the setting description explains the effect.
- The row menu is named `Actions for <person>`; status is text, not color.
- Both confirmations are dialogs that return focus to their trigger.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.

## States

- Default: `members` holds five people, three with a factor, MFA optional, the warning shown.
- Required: MFA required for the account (`required` is `true`); the Switch is on and the warning is gone.
- Loading: the first load (`loading` with no `members`); the Switch is disabled and the table shows its loading rows.
- Error: the list did not load (`error` is set); a danger Alert with the message and Retry, the Switch disabled.

## Related

- `auth/auth-sign-in` — `MfaSetup` and `MfaCode`, the person's own side.
- `account/account-users` — the people in the account.
- `account/account-activity-history` — where MFA changes are audited.
