# Manage resources

Where an account admin arranges the account's hierarchy. Workspaces sit under groups, groups under organizations, and a role binding set on a parent applies to everything under it, so where a workspace lives decides who can reach it. The page shows the whole hierarchy as one tree table, lets the admin select across levels and act on the selection (move, label, delete), and shows the role bindings and labels of the one resource selected. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Any parent and child structure of billable or permission-bearing resources: organizations, groups, folders, projects, workspaces.
- Bulk changes where the position in the hierarchy matters (moving under a new parent, deleting a branch).

## When not to use

- A flat list of one resource type: use `platform/view/table-view`.
- Switching the current account: use the account switcher in `shells/console`.
- Editing who belongs to a team: use `platform/account/team-permissions`.
- A read-only file or folder browser: use `platform/view/file-browser`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Manage resources` and one sentence on what the hierarchy decides. No heading actions: `PageHeader` stretches its actions to full width on phones, so Refresh and the details toggle live at the end of the toolbar instead (the design sample put them in the heading).

### B. Toolbar — `Button`, `Tooltip`, `IconButton` (required)

A `role="group"` row named `Resource actions`: Create workspace (primary) and Create group, a divider, then Move, Labels and Delete. The three bulk actions are disabled until something is selected and act on every selected row, at any depth. At the end, Refresh (spins while the table reloads) and a transparent `Hide details` / `Show details` that toggles the details panel (`aria-expanded`, `aria-controls`). The row wraps on narrow screens.

### C. Resource tree — `Card`, `Table`, `Avatar`, `Tag`, `DropdownMenu`, `Link` (required)

A flush `Card` holding `Table` (tree rows) with `:get-sub-rows="(row) => row.children"`, `v-model:expanded` (the first organization and its first group open) and `v-model:row-selection`. The table turns into a treegrid: chevrons in the Name column, one indent step per level, and `aria-level` and `aria-expanded` on rows. Name: a square `Avatar` for organizations and groups, the type glyph for workspaces, and a check for the current workspace. ID as `Table.CellId` with copy for workspaces. Type as a `Tag` with icon and severity (Organization accent, Group info, Workspace secondary). Last accessed, Status (`Table.CellStatus`: Active, Pending, Suspended), Charges right-aligned in tabular figures with a help tooltip on the header, Labels as `Table.CellTags` with `+N`, and `Table.CellActions` (View details, Move, Edit labels, then Delete on its own). A dash stands in for any empty value. Below the card, a `Link` to Resources pending deletion.

The data stays flat (`parentId`) and the page builds the tree for the table, so a move only changes one field.

### D. Details panel — `Card`, `Tabs`, `Alert`, `Tag` (required)

An `aside` beside the table from `2xl` and under it below that: next to the panel, the nine columns of the tree do not fit under 1536 px. Its heading says what is selected (`No resource selected`, `1 resource selected`, `3 resources selected`) and is polite live. Tabs: Permissions lists the role bindings of the one selected resource (role and member count); Labels shows its labels and an Edit labels button. With none or several selected, an info `Alert` says what to do.

### E. Move — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Select` (required)

Title `Move <name>` or `Move 3 resources`. The description says that everything inside moves too and that inherited bindings stop applying. One `Select` of organizations and groups, excluding the moving resources and everything inside them. Move without a choice shows `Choose where to move the resources.` under the field. The new parent opens after the move.

### F. Labels — `Dialog`, `Field`, `MultiSelect` (required)

The same dialog frame as Move.

Add labels (every label in use in the account) and Remove labels (only those on the selection). Save labels is disabled until one of them has a value.

### G. Delete — `ConfirmDialog` (required)

Title `Delete <name>` or `Delete 3 resources`. The description counts what is inside the selection and says it stays recoverable for 30 days. Confirming clears the selection.

### H. Empty and failure — `EmptyState`, `Alert` (conditional)

No resource: a flush `EmptyState` with Create workspace replaces the table. Load failure: a danger `Alert` with Retry takes the table's place; the heading and toolbar stay.

### Outcomes — through `toast`

Every action ends in a success toast. Move and Delete carry Undo. Hierarchy changes are not deploys, so no toast offers Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Keep selection per row: selecting a group does not select its workspaces; Delete then says how many are inside.
- Open the destination after a move so the moved rows are visible.
- Say what moves with a resource, and what happens to its inherited bindings, before the move.
- Keep deleted resources recoverable and link to where they wait.

## Don't

- Don't offer a resource, or anything inside it, as its own new parent.
- Don't hide the chevron behind hover; leaves keep a blank space of the same width so names align.
- Don't put a separate expand button in the tab order; the row is the tab stop and Arrow Right and Arrow Left open and close it.
- Don't delete a branch without counting what is inside it.

## Copy

- **Title:** `Manage resources`. **Create:** `Create workspace`, `Create group`.
- **Bulk:** `Move`, `Labels`, `Delete`; row menu `View details`, `Move`, `Edit labels`, `Delete`.
- **Panel:** `No resource selected`, `1 resource selected`; `Select a resource to see its role bindings and labels.`; `Select a single resource to see its role bindings.`; `This resource has no labels.`
- **Toasts:** `2 resources moved to Digital services.`; `3 resources scheduled for deletion.` with `They stay in Resources pending deletion for 30 days.`; `Labels updated on 1 resource.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The table is a `treegrid` labelled by the Resources heading. Rows carry `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` when they have children, and `aria-selected` when selected.
- One row is in the tab order. Arrow Up and Arrow Down move between rows, Home and End go to the first and last, Arrow Right opens a row or moves into it, Arrow Left closes it or goes to its parent (mirrored right to left), Enter toggles it and Space selects it. Tab reaches the checkbox, ID copy and row menu of the focused row.
- The chevron is pointer-only and hidden from assistive technology; the row's `aria-expanded` is the state.
- The action row is a `role="group"` named `Resource actions` (plain Tab order, no arrow-key toolbar); disabled bulk buttons stay visible so the actions are discoverable.
- The details heading is a polite live region, so a change of selection is announced.
- Dialogs trap focus and return it to the button that opened them.

## States

- Default: two organizations, three groups and six workspaces; the first organization and its first group open, nothing selected, and every action wired.
- Selected: one workspace selected; bulk actions enabled and the details panel filled.
- Empty: no resource; an empty state with Create workspace.
- Loading: the first load; the table's loading rows.
- Failed: the hierarchy did not load; a danger Alert with Retry.

## Related

- `platform/account/team-permissions` — what a role binding grants.
- `platform/account/users` — who the members of a binding are.
- `platform/view/table-view` — the flat list page this one extends with tree rows.
- `platform/view/file-browser` — moving objects between folders with the same Move dialog pattern.
