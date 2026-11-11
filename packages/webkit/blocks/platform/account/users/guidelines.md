# Users

Who can sign in to the account, and through which teams. An admin invites a teammate by email, chooses their teams, sees who has not accepted yet, resends or cancels an invitation, moves a person between teams and removes people who left. Permissions come only from teams (`platform/account/team-permissions`), so this page assigns teams; it never grants a permission to a person.

## When to use

- Inviting people to an account or organisation and assigning them to teams or roles.
- Following pending invitations: resend or cancel.
- Removing a person's access.

## When not to use

- Defining what a team can do: use `platform/account/team-permissions`.
- Credentials that act as a person: use `platform/account/tokens`.
- Who turned on multi-factor authentication: use `platform/account/mfa-management`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Users` and one sentence that says access comes from teams. Actions: Documentation and the primary `Invite User` at `size="large"`, which opens the invite drawer.

### B. Search — `Input` (required)

A search `Input` bound with `v-bind="filterProps"` over name, email and status. Hidden while the list failed to load.

### C. Users table — `Card`, `Table`, `Avatar`, `useCollection` (required)

`Table` with `v-bind="tableProps"` in a flush `Card`, sortable by name. Name: a square `Avatar` with the initials, the name (or the email while the invitation is pending), `Owner` in muted text after the owner's name, and the email under it. Status is `Table.CellStatus`: Active (success), Invited (warning), Inactive (secondary). Last active is `Table.CellTime`, or `Not signed in yet` for an invitation.

### D. Teams per person — `MultiSelect`, `Tooltip` (required)

The Teams cell is a small `MultiSelect` named `Teams of <person>` whose value reads the team names. A change applies at once and raises a toast that names the new teams with Undo; clearing every team keeps the seat but removes all access, and the toast says so. The owner's teams are locked, with a `Tooltip` saying why; an inactive person's teams are disabled.

### E. Row actions — `Table`, `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the person, disabled for the owner. An invited person gets `Resend invitation` (toast: the earlier link stops working) and `Cancel invitation`; everyone else gets `Remove from account`. Both removals ask in a `ConfirmDialog` that says what the person loses and what stays.

### F. Invite drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Input`, `MultiSelect`, `Button` (required)

A medium right `Drawer` around a `form`: a description of what the invitation does, a required Email `Field` and a required Teams `Field` with Developers preselected and a description saying permissions add up. Footer: Cancel and the primary `Send invitation`, which shows its loading state; the drawer cannot be dismissed while it sends. Errors follow `platform/states/form-error`: nothing is red before the first Send; after it each field shows its own `Field.Error` and focus moves to the first invalid one.

### G. Only the owner, no match and load failure — `EmptyState`, `Alert` (conditional)

With only the owner, a small `EmptyState` under the table invites the first teammate. `No matching users` with Clear search sits in the table's `#empty` slot. When the list fails to load, a danger `Alert` with Retry takes the table's place.

### H. Outcomes — `Toaster` (required)

Invitations, team changes, resends and removals end in a success toast. They are not deploys, so no toast carries Edit or Redeploy.

## Do

- Show pending invitations in the same list, marked Invited, with Resend and Cancel.
- Name the teams in the invitation toast and in every team change, and offer Undo for a team change.
- Say what stays when a person is removed (their teams and the resources they created).
- Keep the owner's row visible, with its controls locked and the reason on the tooltip.

## Don't

- Don't grant a permission to one person here; teams are the only way.
- Don't apply an invitation without a team silently; a person with no team gets no access, so the form asks for one.
- Don't hide the email of an invited person; it is the only name they have until they accept.

## Copy

- **Title:** `Users`. **Action:** `Invite User`; the drawer title `Invite User`, the submit `Send invitation`.
- **Statuses:** `Active`, `Invited`, `Inactive`; **Last active** for an invitation: `Not signed in yet`.
- **Errors:** `Enter the email address to invite.`, `Enter an email address like name@example.com.`, `This person is already in the account.`, `Choose at least one team, or they get no access.`
- **Toasts:** `Invitation sent to sam.okafor@example.com.`, `Teams updated for Priya Nair.`, `Invitation sent again to sam.okafor@example.com.`, `Jordan Reyes removed from the account.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- Each Teams control is named `Teams of <person>`; the row menu is named `Actions for <person>`.
- The invite form is a `form` named Invite User; each `Field` ties its label, description and error to the control, and `Field.Error` is announced when it appears.
- After a failed Send, focus moves to the first invalid control.
- The owner's locked controls are disabled and the reason is on the tooltip, not only in color.

## States

- Default: six people (the owner, four active or inactive, one invited) with search, inline team changes, resend, cancel and remove wired.
- Invite: the invite drawer open.
- OnlyOwner: the owner alone and the invite empty state.
- Loading: the first load.
- Failed: the list did not load; a danger Alert with Retry.

## Related

- `platform/account/team-permissions` — what each team can do.
- `platform/account/mfa-management` — who has multi-factor authentication on.
- `platform/account/activity-history` — where invitations and removals are audited.
- `platform/states/form-error` — the error pattern the invite form follows.
