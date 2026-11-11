# Team permissions

Who can do what in the account. An admin keeps one team per role (Administrators, Developers, Security, Finance), sees what each grants and how many people it covers, and creates or edits a team by ticking View and Edit per resource in one matrix. People get permissions only through teams; nothing is granted per person, so the list of teams is the whole access model.

## When to use

- Role-based access for an account or organisation: teams, roles or groups that bundle permissions.
- Any grant of view and edit rights over a fixed list of resources.

## When not to use

- Inviting people or assigning them to teams: a users list with a team `MultiSelect` per person.
- Credentials that act as one person: use `platform/account/tokens`.
- Feature flags or plan entitlements: use `platform/settings/settings-form`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Teams and permissions` and the sentence that states the model. Actions: Documentation and the primary `Create Team` at `size="large"`, which opens the CreateTeam page.

### B. Search and refresh — `Input`, `Tooltip`, `IconButton` (required)

A search `Input` bound with `v-bind="filterProps"` (name, description, status) and Refresh. Hidden when there is no team.

### C. Team table — `Card`, `Table`, `Avatar`, `useCollection` (required)

`Table` with `v-bind="tableProps"` in a flush `Card`. Name: a square `Avatar` with the initials, the name as `Table.CellLink` to the team's page and its description under it. Permissions: `Table.CellTags` shows as many as fit and the rest behind `+N`; a team with every permission reads `All permissions`. Members as a number, Status as `Table.CellStatus` (Active, Inactive).

### D. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the team: Edit and Duplicate, then Delete in its own group. Duplicate copies the permissions with no members and toasts. Delete asks in a `ConfirmDialog` that says how many members lose what the team grants.

### E. No match and empty — `EmptyState` (required)

`No matching teams` with Clear search in the table's `#empty` slot; `No teams yet` with Create Team in a flush `Card` when the account has none.

### F. Load failure — `Alert` (conditional)

When the teams do not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Outcomes — `Toaster` (required)

Duplicate and Delete end in a success toast. Team changes are not deploys, so the toast has no Edit or Redeploy.

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
- **Delete:** `Delete team`; `The 12 members of “Developers” lose the permissions it grants, unless another team grants them.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The matrix is a real `table` with a caption, column headers View and Edit, one `tbody` per area whose first row is a `rowgroup` header holding the area's checkbox, and a row header per resource.
- Each matrix checkbox is named `View <Resource>` or `Edit <Resource>`; the area checkbox is named by its label and reports mixed when partly checked.
- After a failed save, focus moves to the name field or to the permissions filter.
- Table name links say where they go on their tooltip; the row menu is named `Actions for <team>`.

## States

- Default: five teams (one with every permission, one inactive with no members) with search, refresh, sorting, row menus, duplicate and delete wired.
- CreateTeam: the create page with three permissions preselected; the matrix filter, Select all, Clear, Edit-implies-View, required name and at-least-one-permission errors, and a success toast on Create.
- Empty: no team yet; the heading and an empty state with Create Team.
- Loading: the first load; the search row and the table's loading rows.
- Failed: the teams did not load; a danger Alert with Retry.

## Related

- `platform/view/table-view` — the list page this one follows.
- `platform/create/single-page-create` — the create page frame of the CreateTeam variant.
- `platform/account/activity-history` — where role and team changes are audited.
- `platform/account/tokens` — tokens act with the permissions of the person who created them.
