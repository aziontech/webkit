# Team permissions

Who can do what in the account. An admin keeps one team per role (Administrators, Developers, Security, Finance), sees what each grants and how many people it covers, and creates or edits a team by ticking View and Edit per resource in one matrix. People get permissions only through teams; nothing is granted per person, so the list of teams is the whole access model. The list is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`. Create Team and Edit Team are full pages in the creation frame instead (building block I).

## When to use

- Role-based access for an account or organisation: teams, roles or groups that bundle permissions.
- Any grant of view and edit rights over a fixed list of resources.

## When not to use

- Inviting people or assigning them to teams: a users list with a team `MultiSelect` per person.
- Credentials that act as one person: use `account/personal-tokens`.
- Feature flags or plan entitlements: use `settings/settings-form`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Teams and permissions` and the sentence that states the model. Actions: Documentation and the primary `Create Team` at `size="large"`, which opens the CreateTeam page.

### B. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The table-view controls row (`view/table-view`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, description and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden when there is no team.

### C. Team table — `Card`, `DataTable`, `Table`, `Avatar`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`. Name: a square `Avatar` with the initials, the name as `Table.CellLink` to the team's page and its description under it. Permissions: `Table.CellTags` shows as many as fit and the rest behind `+N`; a team with every permission reads `All permissions`. Members as a number, Status as `Table.CellStatus` (Active, Inactive).

### D. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the team: Edit and Duplicate, then Delete in its own group. Edit and Duplicate emit `row-action` for the page to open the team or copy it. Delete asks in a `ConfirmDialog` that says how many members lose what the team grants, then removes the row and emits `delete`.

### E. No match and empty — `EmptyState` (required)

`No matching teams` with Clear filters in the table's `#empty` slot; `No teams yet` with Create Team in a flush `Card` when the account has none.

### F. Load failure — `Alert` (conditional)

When the teams do not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Members — `Button`, `Avatar`, `IconButton` (EditTeam)

Variant EditTeam only; it adds `Combobox`, `Field`, `SettingsSection`, `Switch`, `Textarea`, `Checkbox`, `Alert` and `SaveBar`.

On the Edit Team page, a Members section above the matrix: an Add member `Combobox` over the account's users (`allow-custom` off, each option the name with the email as its description) with an Add button, then the members as a list with a square `Avatar`, name, email and a Remove `IconButton` named `Remove <name>`. With no member, a dashed sentence says the team grants nothing until someone joins. Members join from existing users only; inviting a new person belongs to `account/users`.

### H. Delete team and save — `ConfirmDialog`, `Button` (EditTeam)

A Delete team section at the end of the form opens a `ConfirmDialog` that says how many members lose what the team grants; the confirm button spins while the request runs. The `SaveBar` says `You have unsaved changes.` and offers Discard and Save changes only once something differs from the saved team; unchanged, it offers Back to teams and a disabled Save changes.

### I. Creation frame — `IconButton` (CreateTeam, EditTeam)

Variants CreateTeam and EditTeam only; they add `AppHeader`, `Brand` and `Breadcrumb`.

Creating or editing a team is a full page in the creation frame of `create/create-page`, not a page body in `ConsoleLayout`: a `AppHeader` with no rail, a small outlined `IconButton` named `Back to Teams and permissions` that returns to the list, the `Brand` linking home, a `Breadcrumb` (`Teams and permissions` › `Create Team` or `Edit Team`) and nothing on the right: the frame is for one task, so it carries no account control that does nothing. The form scrolls in the `main` under it, and its `SaveBar variant="centered"` floats at the bottom of that scroll region on both pages.

### J. Permission matrix — `Table`, `EmptyState` (CreateTeam, EditTeam)

The matrix is the `Table` compound composed by hand, `bordered`: `aria-label="Permissions granted by this team"` names it, `Table.Header` holds Resource, View and Edit as `Table.HeadCell`s, and each area is one `Table.Body` whose first `Table.Row` carries the area's group `Checkbox` and whose next rows are the resources, with a `Checkbox` per action in a centred `Table.Cell` (a dash for an action the resource does not have). When the filter matches nothing, a small `EmptyState` (`No matching permissions`) with Clear filter takes the table's place.

### Outcomes — through `toast`

The list emits Duplicate and Delete; the page that runs the request ends it in a success toast (Team changes are not deploys, so the toast has no Edit or Redeploy). The page calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

## Data

The list takes its teams through props and emits every action; it fetches nothing. `TeamPermissionsTeam` and `TeamPermissionsProps` are exported from `team-permissions.vue`, and `sample.ts` holds the sample teams the block renders when `teams` is left out (and never while `loading` or `error` is set). CreateTeam and EditTeam are separate pages with their own form state.

| Prop      | Type                    | What it does                                                                                                             |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `teams`   | `TeamPermissionsTeam[]` | The rows; the filter, the sort and the pages run on them in the browser. Pass `[]` for an account with none.             |
| `loading` | `boolean`               | A request is in flight. With no teams it is the first load (the table shows its loading rows); with teams Refresh spins. |
| `error`   | `string`                | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table.                    |

| Event        | Payload                    | When                                                                     |
| ------------ | -------------------------- | ------------------------------------------------------------------------ |
| `refresh`    | `(event)`                  | Refresh.                                                                 |
| `retry`      | `(event)`                  | Retry in the error alert.                                                |
| `row-action` | `(event, { value, team })` | Edit or Duplicate in the row menu.                                       |
| `delete`     | `(event, team)`            | The delete dialog was confirmed; the row is already gone from the table. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import TeamPermissions from './team-permissions.vue'

  const { data, pending, error, refresh } = useTeams()
  const loadError = 'The teams could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <TeamPermissions
    :teams="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Grant through teams only, and say so in the page description.
- In the matrix, make Edit imply View: checking Edit checks View, clearing View clears Edit.
- Give each area a group checkbox that is indeterminate when partly checked.
- Show how many permissions are selected out of the total while editing.
- Say how many people lose access before a team is deleted.

## Don't

- Don't list permissions as a long paragraph in the table; use `Table.CellTags` with `+N`.
- Don't offer an Edit checkbox for a resource that has no edit action; show a dash with a hidden "Not available".
- Don't save a team with no permission; say so above the matrix.

## Copy

- **Title:** `Teams and permissions`. **Create:** `Create Team`; the page title is `Create Team`, the save button `Create`.
- **Permissions:** `View <Resource>`, `Edit <Resource>`; the whole set reads `All permissions`.
- **Matrix hint:** `What this team can see and change. 3 of 15 selected.`
- **Errors:** `This field is required.` under Name; `Select at least one permission.` above the matrix.
- **Edit:** the page title is `Edit Team`, the save button `Save changes`; `Team "Developers" updated.` after saving.
- **Members:** `Add member`, `Search users of this account`, `Remove <name>`; `Choose a user to add.` when Add is pressed with nothing chosen.
- **Delete:** `Delete team`; `The 12 members of “Developers” lose the permissions it grants, unless another team grants them.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The matrix is the `DataTable` (role `table`) named by its `aria-label`, with column headers Resource, View and Edit and one row group per area whose first row holds the area's checkbox.
- Each matrix checkbox is named `View <Resource>` or `Edit <Resource>`; the area checkbox is named by its label and reports mixed when partly checked.
- After a failed save, focus moves to the name field or to the permissions filter.
- Members are a list named `Members`; after Remove, focus moves to the next member's Remove button, or to Add member when the list is empty.
- The filter is named Filter teams; Refresh and Download CSV carry an accessible name and a tooltip.
- The Back button of the creation frame is named `Back to Teams and permissions`.
- Table name links say where they go on their tooltip; the row menu is named `Actions for <team>`.

## States

- Default: `teams` holds five teams (one with every permission, one inactive with no members) with the property filter, Refresh, Download CSV, preferences, sorting, row menus, duplicate and delete wired.
- CreateTeam: the create page in the creation frame (Back to Teams and permissions, no rail) with three permissions preselected; the matrix filter, Select all, Clear, Edit-implies-View, required name and at-least-one-permission errors, and a success toast on Create. Cancel and Create sit in a `SaveBar variant="centered"`, a raised card centred over the bottom of the scroll region, as on Edit Team. A filter with no match shows a small `EmptyState` with Clear filter.
- EditTeam: in the same creation frame, a saved team with three members and six permissions; add and remove members, Discard, Save changes with a success toast, Delete team behind a `ConfirmDialog`.
- Empty: no team yet (`teams` is `[]`); the heading and an empty state with Create Team.
- Loading: the first load (`loading` with no `teams`); the controls row and the table's loading rows.
- Error: the teams did not load (`error` is set); a danger Alert with the message and Retry.

## Related

- `view/table-view` — the list page this one follows.
- `create/create-page` — the create page frame of the CreateTeam variant.
- `account/users` — invites people and assigns teams per person.
- `account/activity-history` — where role and team changes are audited.
- `account/personal-tokens` — tokens act with the permissions of the person who created them.
