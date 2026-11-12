# Tokens

The Personal tokens page of the account settings. A person creates a token for a script, a CI job or the CLI, copies its secret the one time it is shown, sees which tokens are still alive and when each expires or was last used, and revokes one that leaked or is no longer needed. The secret never comes back: the list shows only the name, status and dates, and a lost secret means a new token.

## When to use

- Credentials a person creates for themselves to call the API: personal tokens, API keys, deploy keys.
- Any secret the server returns once: the same reveal dialog (warning, masked value, copy) applies.

## When not to use

- Team or service credentials with roles and scopes managed by an admin: start from `platform/account/team-permissions` and add a scope field to the create drawer.
- Secrets the product stores and shows again (environment variables): use `platform/edit/attribute-editor` with masked values.
- A single key shown on a resource's details page: use `CopyButton` beside the value in `platform/detail/details-page`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Personal tokens` and one sentence that says what a token does and that it is shown once. Actions: the outlined Documentation button and the primary `Create Personal Token` at `size="large"`.

### B. Search and refresh — `Input`, `Tooltip`, `IconButton` (required)

A search `Input` bound with `v-bind="filterProps"` (name, description, status), then Refresh as an outlined `IconButton` in a `Tooltip`. Hidden when the account has no token.

### C. Token table — `Card`, `Table`, `useCollection` (required)

One `useCollection` over the rows, `Table` bound with `v-bind="tableProps"` inside a flush `Card`. Columns: Name (the description under it in muted text), Status, Expires, Last used, Created, and the row menu. Status uses `Table.CellStatus`: Active (success), `Expires in N days` within 7 days (warning), Expired (danger), Revoked (secondary). Last used and Created use `Table.CellTime` (relative time, exact time on the tooltip, the creator's avatar on Created); a token never used reads `Never used`.

### D. Row actions — `DropdownMenu` (required)

`Table.CellActions` named after the token. A live token offers only Revoke; an expired or revoked one offers only Delete, which removes it from the list. A token cannot be edited or extended.

### E. No match and empty — `EmptyState` (required)

The table's `#empty` slot holds `No matching tokens` with Clear search; an account without tokens shows `No personal tokens yet` with Create Personal Token in a flush `Card` instead of the search row and the table.

### F. Load failure — `Alert` (conditional)

When the list does not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Create drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `SettingsSection`, `PanelFooter` (required)

A medium right `Drawer` with one `form`: General (Name, Description) and Expiration. Footer: Cancel and Create. The fields lock while it submits.

### H. Fields — `Field`, `Textarea`, `Select`, `HelperText` (required)

Name is required and unique; the error sits under the field (`This field is required.`, `A token with this name already exists. Use another name.`) and focus moves to it. Expires in is a `Select` of 7, 30, 60 and 90 days and 1 year (default 30), and the `HelperText` under it says the exact date it stops working.

### I. One-time reveal — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PasswordInput`, `CopyButton` (required)

After Create the drawer closes and a `Dialog` opens: the token's name, a warning `Alert` that this is the only time the secret is shown, the secret in a read-only `PasswordInput` (masked, with show) and a `CopyButton` beside it. A polite status line confirms the copy and the footer button changes from `I copied the token` to `Done`. Closing clears the secret from memory.

### J. Confirmations and outcomes — `ConfirmDialog`, `Toaster` (required)

Revoke asks in a danger `ConfirmDialog` that says what stops working and that it cannot be undone; the confirm button spins while the request runs. Delete asks the same way. Both end in a success toast; a create, revoke or delete is not a deploy, so the toast carries no Edit or Redeploy.

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

- **Title:** `Personal tokens`. **Create:** `Create Personal Token` on the page, `Create personal token` as the drawer title, `Create` in the footer.
- **Status:** `Active`, `Expires in 3 days`, `Expired`, `Revoked`. **Last used:** relative time, or `Never used`.
- **Reveal:** title `Copy your new token`; warning `Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost.`
- **Revoke:** title `Revoke token`; description `Scripts and tools that use “<name>” stop working right away. You cannot undo this.`; button `Revoke token`; toast `Token “<name>” revoked. Requests that use it are now refused.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- One `main`; the `PageHeader` title is the only `h1`.
- The search `Input` and every icon-only button carry an `aria-label`; the row menu is named `Actions for <token>`.
- The drawer and the dialogs trap focus, are named by their titles and return focus to their trigger; the first invalid field takes focus after Create.
- The reveal labels the secret field `Token`; the copy result is announced in a polite status region.

## States

- Default: four tokens (active, expiring in 5 days, expired, revoked) with search, refresh, sorting, row menus, the create drawer, the reveal, revoke and delete wired.
- Empty: no token; the heading and a flush empty state with Create Personal Token.
- Loading: the first load; search row and the table's loading rows.
- Failed: the list did not load; a danger Alert with Retry replaces the table.
- Created: the one-time reveal dialog open after Create.

## Related

- `platform/view/table-view` — the list page this one follows.
- `platform/create/create-in-drawer` — the drawer pattern behind Create.
- `platform/account/team-permissions` — who can do what; tokens act with the creator's permissions.
- `platform/account/activity-history` — where token creation and revocation are audited.
