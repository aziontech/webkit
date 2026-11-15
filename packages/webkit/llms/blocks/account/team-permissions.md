# TeamPermissions (`account/team-permissions`)

> Teams and their permissions. The primary is the Teams and permissions list: a `PageHeader` with Create Team, the table-view controls row (`PropertyFilter`, Refresh and Download CSV as `IconButton`s, `CollectionPreferences`) over a `Table` of teams (name as `Table.CellLink` with a square `Avatar` and the description, permissions as `Table.CellTags` with `+N`, members, `Table.CellStatus`, and `Table.CellActions` with Edit, Duplicate and Delete behind a `ConfirmDialog`), on one `useCollection`. The CreateTeam variant is the permission matrix: General (name, description), a Permissions table grouped by area with View and Edit columns, a group `Checkbox` that is indeterminate when partly checked, filter, Select all and Clear, Edit implying View, and a `SaveBar`. The EditTeam variant fills it with a saved team and adds Members (add from the account's users, remove) and Delete team. The list and its states are a page body for ConsoleLayout, rendered in its default slot; CreateTeam and EditTeam are full pages in the creation frame of `create/create-page` (a `AppHeader` with Back to Teams and permissions, no rail).

- Surface: app
- Source: `blocks/account/team-permissions/team-permissions.vue` in `@aziontech/webkit`
- MCP: `get_block("account/team-permissions")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [CollectionPreferences](../../components/collection-preferences.md), [Combobox](../../components/combobox.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [PageHeader](../../components/page-header.md), [PropertyFilter](../../components/property-filter.md), [SaveBar](../../components/save-bar.md), [SettingsSection](../../components/settings-section.md), [Switch](../../components/switch.md), [Table](../../components/table.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

teams; teams and permissions; roles; roles and permissions; permission matrix; access control; rbac; create team; user groups; times e permissões; papéis e permissões; matriz de permissões; controle de acesso; criar time; edit team; team members; editar time; membros do time

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

`Table.CellActions` named after the team: Edit and Duplicate, then Delete in its own group. Duplicate copies the permissions with no members and toasts. Delete asks in a `ConfirmDialog` that says how many members lose what the team grants.

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

Duplicate and Delete end in a success toast. Team changes are not deploys, so the toast has no Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

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

- Default: five teams (one with every permission, one inactive with no members) with the property filter, Refresh, Download CSV, preferences, sorting, row menus, duplicate and delete wired.
- CreateTeam: the create page in the creation frame (Back to Teams and permissions, no rail) with three permissions preselected; the matrix filter, Select all, Clear, Edit-implies-View, required name and at-least-one-permission errors, and a success toast on Create. Cancel and Create sit in a `SaveBar variant="centered"`, a raised card centred over the bottom of the scroll region, as on Edit Team. A filter with no match shows a small `EmptyState` with Clear filter.
- EditTeam: in the same creation frame, a saved team with three members and six permissions; add and remove members, Discard, Save changes with a success toast, Delete team behind a `ConfirmDialog`.
- Empty: no team yet; the heading and an empty state with Create Team.
- Loading: the first load; the controls row and the table's loading rows.
- Error: the teams did not load; a danger Alert with Retry.

## Related

- `view/table-view` — the list page this one follows.
- `create/create-page` — the create page frame of the CreateTeam variant.
- `account/users` — invites people and assigns teams per person.
- `account/activity-history` — where role and team changes are audited.
- `account/personal-tokens` — tokens act with the permissions of the person who created them.

## Variants

- `Default` — primary (the code below)
- `CreateTeam` — The Create Team page in the creation frame (a `AppHeader` with Back to Teams and permissions, the brand and a breadcrumb; no rail): name and description, the View and Edit permission matrix as a `Table` grouped by area with group checkboxes (a small `EmptyState` with Clear filter when the filter matches nothing), filter, Select all and Clear, a status Switch, and Cancel and Create in a centered SaveBar floating over the bottom of the form; errors on the name field and above the matrix.
- `EditTeam` — The Edit Team page in the same creation frame: the CreateTeam form filled with a saved team, a Members section (Add member `Combobox` over the account's users with Add, each member with Remove), Delete team behind a `ConfirmDialog`, and the same centered `SaveBar`, which offers Discard and Save changes only once something changed.
- `Empty` — No team yet: the heading and a flush EmptyState with Create Team replace the controls row and the table.
- `Loading` — The first load: the controls row and the table's loading rows.
- `Error` — The teams did not load: a danger Alert with Retry replaces the table; Retry loads them.

Each variant is the same screen in another state: `get_block("account/team-permissions", { variant })`, or the file under `blocks/account/team-permissions/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  type TeamStatus = 'Active' | 'Inactive'

  interface Team {
    id: string
    name: string
    description: string
    permissions: string[]
    members: number
    status: TeamStatus
  }

  type TeamRow = Team & { permissionNames: string[] }

  const permissionLabels: Record<string, string> = {
    'applications.view': 'View Applications',
    'applications.edit': 'Edit Applications',
    'domains.view': 'View Domains',
    'domains.edit': 'Edit Domains',
    'firewall.view': 'View Firewall',
    'firewall.edit': 'Edit Firewall',
    'certificates.view': 'View Certificates',
    'certificates.edit': 'Edit Certificates',
    'storage.view': 'View Storage',
    'storage.edit': 'Edit Storage',
    'metrics.view': 'View Metrics',
    'logs.view': 'View Logs',
    'billing.view': 'View Billing',
    'billing.edit': 'Edit Billing',
    'users.view': 'View Users',
    'users.edit': 'Edit Users',
    'tokens.edit': 'Manage Personal Tokens'
  }
  const allPermissions = Object.keys(permissionLabels)

  const seedTeams: Team[] = [
    {
      id: 'team-1',
      name: 'Administrators',
      description: 'Full access to the account',
      permissions: allPermissions,
      members: 3,
      status: 'Active'
    },
    {
      id: 'team-2',
      name: 'Developers',
      description: 'Build and deploy applications',
      permissions: [
        'applications.view',
        'applications.edit',
        'domains.view',
        'storage.view',
        'storage.edit',
        'metrics.view',
        'logs.view'
      ],
      members: 12,
      status: 'Active'
    },
    {
      id: 'team-3',
      name: 'Security',
      description: 'Firewall rules and certificates',
      permissions: [
        'firewall.view',
        'firewall.edit',
        'certificates.view',
        'certificates.edit',
        'logs.view'
      ],
      members: 4,
      status: 'Active'
    },
    {
      id: 'team-4',
      name: 'Finance',
      description: 'Invoices and payment methods',
      permissions: ['billing.view', 'billing.edit'],
      members: 2,
      status: 'Active'
    },
    {
      id: 'team-5',
      name: 'Contractors',
      description: 'Read-only access for audits',
      permissions: ['applications.view', 'domains.view', 'metrics.view'],
      members: 0,
      status: 'Inactive'
    }
  ]

  const teams = ref<Team[]>(seedTeams)

  const rows = computed<TeamRow[]>(() =>
    teams.value.map((team) => ({
      ...team,
      permissionNames: team.permissions.map((id) => permissionLabels[id] ?? id)
    }))
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'permissionNames', header: 'Permissions', grow: 2 },
    { accessorKey: 'members', header: 'Members', sortable: true, minWidth: 100 },
    { accessorKey: 'status', header: 'Status', minWidth: 110 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const statusOptions = [...new Set(rows.value.map((row) => row.status))]
    .sort()
    .map((value) => ({ value }))

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', options: statusOptions }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'account-teams' }
    })

  const teamsTableEl = ref<TableExposed<TeamRow> | null>(null)
  const exportCsv = () => teamsTableEl.value?.exportCsv({ filename: 'teams.csv' })

  const statusSeverity = (value: TeamStatus): TagSeverity =>
    value === 'Active' ? 'success' : 'neutral'

  const loading = ref(false)
  const loadFailed = ref(false)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const refreshing = ref(false)
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const pending = ref<TeamRow | null>(null)
  const deleteOpen = ref(false)

  const onAction = (value: DropdownMenuItemValue, row: TeamRow) => {
    if (value === 'duplicate') {
      const source = teams.value.find((team) => team.id === row.id)
      if (!source) return
      const copy: Team = {
        ...source,
        id: `team-${teams.value.length + 1}-copy`,
        name: `${row.name} copy`,
        members: 0
      }
      teams.value = [...teams.value, copy]
      toast.success(`Team "${copy.name}" created with the same permissions and no members.`)
      return
    }
    if (value === 'delete') {
      pending.value = row
      deleteOpen.value = true
    }
  }

  const remove = () => {
    const row = pending.value
    if (!row) return
    teams.value = teams.value.filter((team) => team.id !== row.id)
    deleteOpen.value = false
    toast.success(`Team "${row.name}" deleted.`)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Teams and permissions"
        description="A team is a named set of permissions. Members inherit exactly what their teams grant; nothing is granted per person."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/teams"
            target="_blank"
          />
          <Button
            label="Create Team"
            icon="ai ai-plus"
            variant="primary"
            size="large"
            href="/account/teams/new"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed && (loading || status !== 'empty')"
          class="flex flex-wrap items-start gap-(--layout-group-gap)"
        >
          <div class="flex min-w-0 grow basis-(--container-2xs)">
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Filter teams"
              aria-label="Filter teams"
            />
          </div>
          <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
            <Tooltip
              content="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="ai ai-refresh"
                variant="outline"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="refresh"
              />
            </Tooltip>
            <Tooltip
              content="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="ai ai-download"
                variant="outline"
                size="medium"
                :disabled="!matchingItems.length"
                aria-label="Download CSV"
                @click="exportCsv"
              />
            </Tooltip>
            <CollectionPreferences
              v-bind="preferencesProps"
              title="Table preferences"
            />
          </div>
        </header>

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          The teams could not be loaded. Nothing was changed; try again.
          <template #actions>
            <Button
              label="Retry"
              variant="secondary"
              size="small"
              @click="retryLoad"
            />
          </template>
        </Alert>

        <Card
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #default>
            <EmptyState
              size="medium"
              icon="ai ai-users"
              title="No teams yet"
              description="Create a team for each role in your organisation, then add people to it."
            >
              <template #actions>
                <Button
                  label="Create Team"
                  icon="ai ai-plus"
                  variant="secondary"
                  size="small"
                  href="/account/teams/new"
                />
              </template>
            </EmptyState>
          </template>
        </Card>

        <Card
          key="card-2"
          v-else
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="teamsTableEl"
              v-bind="tableProps"
              :loading="loading || refreshing"
              sortable
              :bordered="false"
              aria-label="Teams"
            >
              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="row.name"
                    size="small"
                    variant="square"
                  />
                  <div class="flex min-w-0 flex-col">
                    <Table.CellLink
                      :label="row.name"
                      :href="`/account/teams/${row.id}`"
                      destination="Team settings"
                    />
                    <span class="truncate text-body-xs text-(--text-muted)">{{
                      row.description
                    }}</span>
                  </div>
                </div>
              </template>
              <template #cell-permissionNames="{ value }">
                <Table.CellTags
                  v-if="value.length < allPermissions.length"
                  :items="value"
                />
                <span
                  v-else
                  class="text-body-sm text-(--text-default)"
                  >All permissions</span
                >
              </template>
              <template #cell-members="{ value }">
                <span class="tabular-nums">{{ value }}</span>
              </template>
              <template #cell-status="{ value }">
                <Table.CellStatus
                  :label="value"
                  :severity="statusSeverity(value)"
                />
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <Table.CellActions
                  :name="row.name"
                  @select="(_event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="edit"
                      label="Edit"
                    />
                    <DropdownMenu.Item
                      value="duplicate"
                      label="Duplicate"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete"
                    />
                  </DropdownMenu.Group>
                </Table.CellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-search"
                  title="No matching teams"
                  description="No team matches these filters."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
                      variant="outline"
                      size="small"
                      @click="clearFilters"
                    />
                  </template>
                </EmptyState>
              </template>
            </DataTable>
          </template>
        </Card>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete team"
      :description="
        pending?.members
          ? `The ${pending.members} members of “${pending.name}” lose the permissions it grants, unless another team grants them.`
          : `“${pending?.name ?? ''}” has no members. Deleting it removes it from this list.`
      "
      confirm-label="Delete team"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
```
