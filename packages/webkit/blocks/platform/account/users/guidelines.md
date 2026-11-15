# Users

Who can sign in to the account, with which role and through which teams. An admin invites a teammate by email, chooses their teams, sees who has not accepted yet, resends or cancels an invitation, changes a person's role, moves a person between teams and removes people who left. The role decides what a person can do on the account itself (Admin manages people, teams and billing; Developer and Viewer do not); resource permissions come only from teams (`platform/account/team-permissions`), so this page never grants a single permission to a person. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Inviting people to an account or organisation, choosing their role and assigning them to teams.
- Following pending invitations: resend or cancel.
- Removing a person's access.

## When not to use

- Defining what a team can do: use `platform/account/team-permissions`.
- Credentials that act as a person: use `platform/account/tokens`.
- Who turned on multi-factor authentication: use `platform/account/mfa-management`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Users` and one sentence that says access comes from teams. Actions: Documentation and the primary `Invite User` at `size="large"`, which opens the invite drawer.

### B. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The table-view controls row (`platform/view/table-view`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, email, role and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, and is disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden while the list failed to load.

### C. Users table — `Card`, `DataTable`, `Table`, `Avatar`, `Tag`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`, sortable by name, role and status. Name: a square `Avatar` with the initials and the name (or the email while the invitation is pending). Email in its own column, left to right in every language. Role is a small `Tag`: Owner (highlight), Admin (info), Developer and Viewer (secondary). Status is `Table.CellStatus`: Active (success), Invited (warning), Inactive (secondary). Last active is `Table.CellTime`, or `Not signed in yet` for an invitation.

### D. Teams per person — `MultiSelect`, `Tooltip` (required)

The Teams cell is a small `MultiSelect` named `Teams of <person>` whose value reads the team names. A change applies at once and raises a toast that names the new teams with Undo; clearing every team keeps the seat but removes all access, and the toast says so. The owner's teams are locked, with a `Tooltip` saying why; an inactive person's teams are disabled.

### E. Row actions — `DataTable`, `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the person. Everyone gets `View profile`; everyone but the owner gets `Edit role`. An invited person gets `Resend invitation` (toast: the earlier link stops working) and `Cancel invitation`; everyone else but the owner gets `Remove from account`. Both removals ask in a `ConfirmDialog` that says what the person loses and what stays.

### F. Profile and role dialogs — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `KeyValuePairs`, `Select` (required)

View profile opens a medium `Dialog` titled with the person's name and `Avatar`: `KeyValuePairs` with Email, Role, Teams, Status and Last active, then Close and, for anyone but the owner, `Edit role`. Edit role opens a small `Dialog` around a `form`: a role `Select` (Admin, Developer, Viewer; Owner is never assignable) whose `Field.Description` says what the chosen role allows, then Cancel and the primary `Save role`. Saving changes the Role tag at once and raises a toast with Undo; saving the same role closes without a toast.

### G. Invite drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `DrawerDescription`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Input`, `MultiSelect`, `Button` (required)

A large right `Drawer` around a `form`: a description of what the invitation does, a required Email `Field` and a required Teams `Field` with Developers preselected and a description saying permissions add up. Footer: Cancel and the primary `Send invitation`, which shows its loading state; the drawer cannot be dismissed while it sends. Errors follow `platform/states/form-validation` (SectionRejected): nothing is red before the first Send; after it each field shows its own `Field.Error` and focus moves to the first invalid one.

### H. Only the owner, no match and load failure — `EmptyState`, `Alert` (conditional)

With only the owner, a small `EmptyState` under the table invites the first teammate. `No matching users` with Clear filters sits in the table's `#empty` slot. When the list fails to load, a danger `Alert` with Retry takes the table's place.

### Outcomes — through `toast`

Invitations, team changes, resends and removals end in a success toast. They are not deploys, so no toast carries Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Show pending invitations in the same list, marked Invited, with Resend and Cancel.
- Name the teams in the invitation toast and in every team change, and offer Undo for a team change.
- Say what stays when a person is removed (their teams and the resources they created).
- Keep the owner's row visible, with its controls locked and the reason on the tooltip; the owner keeps View profile.
- Say in the role dialog what the chosen role allows, and that teams still decide the resources.

## Don't

- Don't grant a resource permission to one person here; teams are the only way. The role covers account settings only.
- Don't offer Owner in the role list; ownership is transferred elsewhere.
- Don't apply an invitation without a team silently; a person with no team gets no access, so the form asks for one.
- Don't hide the email of an invited person; it is the only name they have until they accept.

## Copy

- **Title:** `Users`. **Action:** `Invite User`; the drawer title `Invite User`, the submit `Send invitation`.
- **Roles:** `Owner`, `Admin`, `Developer`, `Viewer`; the dialog `Edit role` with `Save role`.
- **Statuses:** `Active`, `Invited`, `Inactive`; **Last active** for an invitation: `Not signed in yet`.
- **Errors:** `Enter the email address to invite.`, `Enter an email address like name@example.com.`, `This person is already in the account.`, `Choose at least one team, or they get no access.`
- **Toasts:** `Invitation sent to sam.okafor@example.com.`, `Teams updated for Priya Nair.`, `Jordan Reyes is now Developer.`, `Invitation sent again to sam.okafor@example.com.`, `Jordan Reyes removed from the account.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The filter is named Filter users; Refresh and Download CSV are icon buttons with an accessible name and a tooltip.
- Each Teams control is named `Teams of <person>`; the row menu is named `Actions for <person>`.
- The role form is a `form` named Edit role; the `Select` is labelled Role and described by what the role allows.
- The invite form is a `form` named Invite User; each `Field` ties its label, description and error to the control, and `Field.Error` is announced when it appears.
- After a failed Send, focus moves to the first invalid control.
- The owner's locked controls are disabled and the reason is on the tooltip, not only in color.

## States

- Default: six people (the owner, four active or inactive, one invited) with the property filter, Refresh, Download CSV, preferences, inline team changes, View profile, Edit role, resend, cancel and remove wired.
- Invite: the invite drawer open.
- EditRole: the Edit role dialog open for Jordan Reyes.
- OnlyOwner: the owner alone and the invite empty state.
- Loading: the first load.
- Failed: the list did not load; a danger Alert with Retry.

## Related

- `platform/account/team-permissions` — what each team can do.
- `platform/account/mfa-management` — who has multi-factor authentication on.
- `platform/account/activity-history` — where invitations and removals are audited.
- `platform/states/form-validation` (SectionRejected) — the error pattern the invite form follows.
