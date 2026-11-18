# Tokens

The Personal tokens page of the account settings. A person creates a token for a script, a CI job or the CLI, copies its secret the one time it is shown, sees which tokens are still alive and when each expires or was last used, and revokes one that leaked or is no longer needed. The secret never comes back: the list shows only the name, status and dates, and a lost secret means a new token. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Credentials a person creates for themselves to call the API: personal tokens, API keys, deploy keys.
- Any secret the server returns once: the same reveal dialog (warning, masked value, copy) applies.

## When not to use

- Team or service credentials with roles and scopes managed by an admin: start from `account/account-team-permissions` and add a scope field to the create drawer.
- Secrets the product stores and shows again (environment variables): use `edit/edit-variables` with masked values.
- A single key shown on a resource's details page: use `CopyButton` beside the value in `detail/detail-resource`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Personal tokens` and one sentence that says what a token does and that it is shown once. Actions: the outlined Documentation button and the primary `Create Personal Token` at `size="large"`.

### B. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The view-table controls row (`view/view-table`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, description and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden when the account has no token.

### C. Token table — `Card`, `DataTable`, `TableCellActions`, `TableCellStatus`, `TableCellTime`, `useCollection` (required)

One `useCollection` over the rows, `DataTable` bound with `v-bind="tableProps"` inside a flush `Card`. Columns: Name, Description (muted; `No description` when empty), Status, Expires, Last used, Created, and the row menu. Status uses `TableCellStatus`: Active (success), `Expires in N days` within 7 days (warning), Expired (danger), Revoked (secondary). Last used and Created use `TableCellTime` (relative time, exact time on the tooltip, the creator's avatar on Created); a token never used reads `Never used`.

### D. Row actions — `DropdownMenu` (required)

`TableCellActions` named after the token. A live token offers only Revoke; an expired or revoked one offers only Delete, which removes it from the list. A token cannot be edited or extended.

### E. No match and empty — `EmptyState` (required)

The table's `#empty` slot holds `No matching tokens` with Clear filters; an account without tokens shows `No personal tokens yet` with Create Personal Token in a flush `Card` instead of the controls row and the table.

### F. Load failure — `Alert` (conditional)

When the list does not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Create drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody`, `SettingsSection`, `PanelFooter` (required)

A large right `Drawer` with one `form`: General (Name, Description) and Expiration. Titled `Create Personal Token`. Footer: Cancel and `Create Personal Token`, so the label does not change on the way in. Create emits `create` with the values; the fields lock while `creating` is set.

### H. Fields — `Field`, `Input`, `Textarea`, `Select`, `FieldDescription` (required)

Name is required and unique; the error sits under the field (`This field is required.`, `A token with this name already exists. Use another name.`) and focus moves to it. Expires in is a `Select` of 7, 30, 60 and 90 days and 1 year (default 30), and the `FieldError` under it says the exact date it stops working.

### I. One-time reveal — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PasswordInput`, `CopyButton` (required)

When the page sets `v-model:secret` to what the create request returned, the drawer closes and a `Dialog` opens: the token's name, a warning `Alert` that this is the only time the secret is shown, the secret in a read-only `PasswordInput` (masked, with show) and a `CopyButton` beside it. The `CopyButton` announces `Token copied` (its `copied-label`), the only announcement; a muted line repeats `Copied to the clipboard.` for sighted users, hidden from assistive technology, and the footer button changes from `I copied the token` to `Done`. Closing sets `secret` back to `null`, which clears it from memory.

### J. Confirmations and outcomes — `ConfirmDialog` (required)

Revoke asks in a danger `ConfirmDialog` that says what stops working and that it cannot be undone, then marks the row revoked and emits `revoke`. Delete asks the same way, removes the row and emits `delete`. The page that runs the request ends both in a success toast; a create, revoke or delete is not a deploy, so the toast carries no Edit or Redeploy. The page calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its tokens through props and emits every action; it fetches nothing and never makes a secret. `PersonalTokensToken`, `PersonalTokensCreateValues`, `PersonalTokensSecret` and `PersonalTokensProps` are exported from `account-personal-tokens.vue`, and `sample.ts` holds the sample tokens and clock the block renders when `tokens` and `now` are left out (the tokens never while `loading` or `error` is set).

| Prop       | Type                           | What it does                                                                                                               |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `tokens`   | `PersonalTokensToken[]`        | The rows; the filter, the sort and the pages run on them in the browser. Pass `[]` for an account with none.               |
| `loading`  | `boolean`                      | A request is in flight. With no tokens it is the first load (the table shows its loading rows); with tokens Refresh spins. |
| `error`    | `string`                       | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table.                      |
| `creating` | `boolean`                      | The create request is in flight; the drawer's fields lock and its submit spins.                                            |
| `now`      | `Date`                         | The moment Status and the expiry hint count from.                                                                          |
| `secret`   | `PersonalTokensSecret \| null` | `v-model:secret`: the token the create request returned; set, the reveal dialog opens; closing it sets `null`.             |

| Event     | Payload                                         | When                                                                     |
| --------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `refresh` | `(event)`                                       | Refresh.                                                                 |
| `retry`   | `(event)`                                       | Retry in the error alert.                                                |
| `create`  | `(event, { name, description, expiresInDays })` | The drawer passed validation and was submitted.                          |
| `revoke`  | `(event, token)`                                | The revoke dialog was confirmed; the row already reads Revoked.          |
| `delete`  | `(event, token)`                                | The delete dialog was confirmed; the row is already gone from the table. |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import AccountPersonalTokens, {
    type PersonalTokensCreateValues,
    type PersonalTokensSecret
  } from './account-personal-tokens.vue'

  const { data, pending, error, refresh } = usePersonalTokens()
  const loadError = 'The tokens could not be loaded. Nothing was changed; try again.'
  const creating = ref(false)
  const secret = ref<PersonalTokensSecret | null>(null)

  const create = async (_event: Event, values: PersonalTokensCreateValues) => {
    creating.value = true
    secret.value = await createPersonalToken(values)
    creating.value = false
    refresh()
  }
</script>

<template>
  <AccountPersonalTokens
    v-model:secret="secret"
    :tokens="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    :creating="creating"
    :now="new Date()"
    @refresh="refresh"
    @retry="refresh"
    @create="create"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show the secret once, masked by default, with a copy button and a warning that says it will not be shown again.
- Say the exact expiry date while the person picks the duration.
- Warn in the Status column a week before a token expires.
- Revoke behind a confirmation that names the token and what breaks.

## Don't

- Don't show a secret, or part of one, in the list.
- Don't let a token be edited or extended; create a new one.
- Don't offer Delete on a live token; revoke it first.
- Don't toast the reveal; the secret belongs in the dialog, where it can be copied.

## Copy

- **Title:** `Personal tokens`. **Create:** `Create Personal Token` on the page, as the drawer title and on the footer submit.
- **Status:** `Active`, `Expires in 3 days`, `Expired`, `Revoked`. **Last used:** relative time, or `Never used`.
- **Reveal:** title `Copy your new token`; warning `Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost.`
- **Revoke:** title `Revoke token`; description `Scripts and tools that use “<name>” stop working right away. You cannot undo this.`; button `Revoke token`; toast `Token “<name>” revoked. Requests that use it are now refused.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`.
- The `PropertyFilter` (Filter tokens) and every icon-only button carry an `aria-label`; the row menu is named `Actions for <token>`.
- The drawer and the dialogs trap focus, are named by their titles and return focus to their trigger; the first invalid field takes focus after Create.
- The reveal labels the secret field `Token`; the copy result is announced once, by the `CopyButton`.

## States

- Default: `tokens` holds four tokens (active, expiring in 5 days, expired, revoked) with the property filter, Refresh, Download CSV, preferences, sorting, row menus, the create drawer, the reveal, revoke and delete wired.
- Empty: no token (`tokens` is `[]`); the heading and a flush empty state with Create Personal Token.
- Loading: the first load (`loading` with no `tokens`); controls row and the table's loading rows.
- Error: the list did not load (`error` is set); a danger Alert with the message and Retry replaces the table.
- Created: the one-time reveal dialog open after Create (`secret` holds the returned token).

## Related

- `view/view-table` — the list page this one follows.
- `create/create-drawer` — the drawer pattern behind Create.
- `account/account-team-permissions` — who can do what; tokens act with the creator's permissions.
- `account/account-activity-history` — where token creation and revocation are audited.
