# Users (`account/users`)

> The people who can sign in to an account. A `PageHeader` with Documentation and the primary Invite User over the table-view controls row (`PropertyFilter` over name, email, role and status, Refresh and Download CSV as `IconButton`s, `CollectionPreferences`) and a flush `Card` holding a `Table` on one `useCollection`: Name (square `Avatar`, the name or the invited email), Email, Role as a `Tag` (Owner, Admin, Developer, Viewer), Teams as an inline `MultiSelect` per person that applies at once with an Undo toast (disabled for the owner and inactive people), Status as `Table.CellStatus` (Active, Invited, Inactive), Last active as `Table.CellTime` or `Not signed in yet`, and `Table.CellActions` with View profile (a `Dialog` with `KeyValuePairs`), Edit role (a `Dialog` with a role `Select` and an Undo toast), Resend invitation for invited people and Remove from account (or Cancel invitation) behind a `ConfirmDialog`. Invite User opens a large `Drawer` form with Email and a Teams `MultiSelect`, errors after Send, and a toast that names the teams. Built from `PageHeader`, `Button`, `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences`, `Card`, `Table`, `Avatar`, `Tag`, `MultiSelect`, `DropdownMenu`, `Dialog` and its parts, `KeyValuePairs`, `Select`, `ConfirmDialog`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Input`, `EmptyState`, `Alert`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/users/users.vue` in `@aziontech/webkit`
- MCP: `get_block("account/users")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [KeyValuePairs](../../components/key-value-pairs.md), [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [Select](../../components/select.md), [Table](../../components/table.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

users; users management; invite user; invite teammates; members; account members; assign teams; resend invitation; remove user; usuários; gerenciar usuários; convidar usuário; membros da conta; atribuir times; edit role; change role; user roles; view profile; alterar papel; papel do usuário

Who can sign in to the account, with which role and through which teams. An admin invites a teammate by email, chooses their teams, sees who has not accepted yet, resends or cancels an invitation, changes a person's role, moves a person between teams and removes people who left. The role decides what a person can do on the account itself (Admin manages people, teams and billing; Developer and Viewer do not); resource permissions come only from teams (`account/team-permissions`), so this page never grants a single permission to a person. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Inviting people to an account or organisation, choosing their role and assigning them to teams.
- Following pending invitations: resend or cancel.
- Removing a person's access.

## When not to use

- Defining what a team can do: use `account/team-permissions`.
- Credentials that act as a person: use `account/personal-tokens`.
- Who turned on multi-factor authentication: use `account/mfa-settings`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Users` and one sentence that says access comes from teams. Actions: Documentation and the primary `Invite User` at `size="large"`, which opens the invite drawer.

### B. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The table-view controls row (`view/table-view`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, email, role and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, and is disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden while the list failed to load.

### C. Users table — `Card`, `DataTable`, `Table`, `Avatar`, `Tag`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`, sortable by name, role and status. Name: a square `Avatar` with the initials and the name (or the email while the invitation is pending). Email in its own column, left to right in every language. Role is a small `Tag`: Owner (highlight), Admin (info), Developer and Viewer (secondary). Status is `Table.CellStatus`: Active (success), Invited (warning), Inactive (secondary). Last active is `Table.CellTime`, or `Not signed in yet` for an invitation.

### D. Teams per person — `MultiSelect`, `Tooltip` (required)

The Teams cell is a small `MultiSelect` named `Teams of <person>` whose value reads the team names. A change applies at once and raises a toast that names the new teams with Undo; clearing every team keeps the seat but removes all access, and the toast says so. The owner's teams are locked, with a `Tooltip` saying why; an inactive person's teams are disabled.

### E. Row actions — `DataTable`, `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the person. Everyone gets `View profile`; everyone but the owner gets `Edit role`. An invited person gets `Resend invitation` (toast: the earlier link stops working) and `Cancel invitation`; everyone else but the owner gets `Remove from account`. Both removals ask in a `ConfirmDialog` that says what the person loses and what stays.

### F. Profile and role dialogs — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `KeyValuePairs`, `Select` (required)

View profile opens a medium `Dialog` titled with the person's name and `Avatar`: `KeyValuePairs` with Email, Role, Teams, Status and Last active, then Close and, for anyone but the owner, `Edit role`. Edit role opens a small `Dialog` around a `form`: a role `Select` (Admin, Developer, Viewer; Owner is never assignable) whose `Field.Description` says what the chosen role allows, then Cancel and the primary `Save role`. Saving changes the Role tag at once and raises a toast with Undo; saving the same role closes without a toast.

### G. Invite drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `DrawerDescription`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Input`, `MultiSelect`, `Button` (required)

A large right `Drawer` around a `form`: a description of what the invitation does, a required Email `Field` and a required Teams `Field` with Developers preselected and a description saying permissions add up. Footer: Cancel and the primary `Send invitation`, which shows its loading state; the drawer cannot be dismissed while it sends. Errors follow `state/form-validation` (SectionRejected): nothing is red before the first Send; after it each field shows its own `Field.Error` and focus moves to the first invalid one.

### H. Only the owner, no match and load failure — `EmptyState`, `Alert` (conditional)

With only the owner, a small `EmptyState` under the table invites the first teammate. `No matching users` with Clear filters sits in the table's `#empty` slot. When the list fails to load, a danger `Alert` with Retry takes the table's place.

### Outcomes — through `toast`

Invitations, team changes, resends and removals end in a success toast. They are not deploys, so no toast carries Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

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
- Error: the list did not load; a danger Alert with Retry.

## Related

- `account/team-permissions` — what each team can do.
- `account/mfa-settings` — who has multi-factor authentication on.
- `account/activity-history` — where invitations and removals are audited.
- `state/form-validation` (SectionRejected) — the error pattern the invite form follows.

## Variants

- `Default` — primary (the code below)
- `Invite` — The Invite User drawer open over the list: Email and Teams (Developers preselected), Cancel and Send invitation; Send with an empty, malformed or existing email or no team shows the error on that field and focuses it.
- `EditRole` — The Edit role dialog open for Jordan Reyes: a role Select (Admin, Developer, Viewer) whose description says what the role allows, Cancel and Save role; saving changes the Role tag and raises a toast with Undo.
- `OnlyOwner` — An account with only its owner: the owner's row, then a small EmptyState that invites the first teammate.
- `Loading` — The first load: the controls row and the table's loading rows.
- `Error` — The users did not load: a danger Alert with Retry replaces the table; Retry loads them.

Each variant is the same screen in another state: `get_block("account/users", { variant })`, or the file under `blocks/account/users/variants/`.

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
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref } from 'vue'

  type UserStatus = 'Active' | 'Invited' | 'Inactive'
  type UserRole = 'Owner' | 'Admin' | 'Developer' | 'Viewer'

  interface User {
    id: string
    name: string
    email: string
    owner: boolean
    role: UserRole
    teams: string[]
    status: UserStatus
    lastActive: Date | null
  }

  const TEAMS = [
    { value: 'administrators', label: 'Administrators' },
    { value: 'developers', label: 'Developers' },
    { value: 'security', label: 'Security' },
    { value: 'finance', label: 'Finance' },
    { value: 'support', label: 'Support' }
  ]
  const teamLabel = (value: string): string =>
    TEAMS.find((team) => team.value === value)?.label ?? value
  const teamsLabel = (values: string[]): string =>
    values.length ? values.map(teamLabel).join(', ') : 'No team (no access)'

  const ROLES: { value: Exclude<UserRole, 'Owner'>; hint: string }[] = [
    { value: 'Admin', hint: 'Manages people, teams, billing and every account setting.' },
    { value: 'Developer', hint: 'Works on the resources their teams reach; no account settings.' },
    { value: 'Viewer', hint: 'Reads the resources their teams reach; changes nothing.' }
  ]
  const roleSeverity = (value: UserRole): TagSeverity | undefined =>
    value === 'Owner'
      ? undefined
      : (({ Admin: 'info', Developer: 'neutral', Viewer: 'neutral' } as const)[value] ?? 'neutral')
  const roleVariant = (value: UserRole): TagVariant | undefined =>
    value === 'Owner' ? 'highlight' : undefined

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)

  const seedUsers: User[] = [
    {
      id: 'u-1',
      name: 'Avery Stone',
      email: 'avery.stone@example.com',
      owner: true,
      role: 'Owner',
      teams: ['administrators'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 0.02 * DAY)
    },
    {
      id: 'u-2',
      name: 'Jordan Reyes',
      email: 'jordan.reyes@example.com',
      owner: false,
      role: 'Admin',
      teams: ['administrators', 'security'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 0.1 * DAY)
    },
    {
      id: 'u-3',
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      owner: false,
      role: 'Developer',
      teams: ['developers'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 1 * DAY)
    },
    {
      id: 'u-4',
      name: '',
      email: 'sam.okafor@example.com',
      owner: false,
      role: 'Developer',
      teams: ['developers', 'support'],
      status: 'Invited',
      lastActive: null
    },
    {
      id: 'u-5',
      name: 'Lena Fischer',
      email: 'lena.fischer@example.com',
      owner: false,
      role: 'Viewer',
      teams: ['finance'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 3 * DAY)
    },
    {
      id: 'u-6',
      name: 'Marco Bianchi',
      email: 'marco.bianchi@example.com',
      owner: false,
      role: 'Viewer',
      teams: [],
      status: 'Inactive',
      lastActive: new Date(REFERENCE - 64 * DAY)
    }
  ]

  const INVITE_ON_START = false
  const EDIT_ROLE_ON_START = ''
  const users = ref<User[]>(seedUsers)
  const loading = ref(false)
  const loadFailed = ref(false)

  const displayName = (user: User): string => user.name || user.email
  const statusSeverity = (value: UserStatus): TagSeverity =>
    (({ Active: 'success', Invited: 'warning', Inactive: 'neutral' }) as const)[value] ?? 'neutral'

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'email', header: 'Email', grow: 2, minWidth: 220 },
    { accessorKey: 'role', header: 'Role', sortable: true, minWidth: 120 },
    { accessorKey: 'teams', header: 'Teams', grow: 2, minWidth: 220 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110 },
    { accessorKey: 'lastActive', header: 'Last active', minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const optionsOf = (key: 'role' | 'status') =>
    [...new Set(seedUsers.map((user) => user[key]))].sort().map((value) => ({ value }))

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', options: optionsOf('role') },
    { key: 'status', label: 'Status', options: optionsOf('status') }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items: users,
      columns,
      filtering: { fields: ['name', 'email', 'role', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'account-users' }
    })

  const usersTableEl = ref<TableExposed<User> | null>(null)
  const exportCsv = () => usersTableEl.value?.exportCsv({ filename: 'users.csv' })

  const alone = computed(() => !loading.value && users.value.length === 1 && users.value[0].owner)

  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      users.value = seedUsers
      loading.value = false
    }, 700)
  }

  const refreshing = ref(false)
  const refresh = () => {
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const setTeams = (user: User, selected: unknown[]) => {
    const next = selected.map(String)
    const before = [...user.teams]
    user.teams = next
    toast.success(`Teams updated for ${displayName(user)}.`, {
      description: next.length
        ? `${teamsLabel(next)}. Access changes on their next request.`
        : 'They keep their seat but lose every permission until a team is added.',
      actions: [
        {
          label: 'Undo',
          onClick: () => {
            user.teams = before
          }
        }
      ]
    })
  }

  const pending = ref<User | null>(null)
  const removeOpen = ref(false)
  const profileOpen = ref(false)
  const roleOpen = ref(false)
  const nextRole = ref<UserRole>('Developer')
  const roleHint = computed(() => ROLES.find((role) => role.value === nextRole.value)?.hint ?? '')
  const openRole = (user: User) => {
    pending.value = user
    nextRole.value = user.role
    profileOpen.value = false
    roleOpen.value = true
  }
  const setRole = (id: string, role: UserRole) => {
    users.value = users.value.map((user) => (user.id === id ? { ...user, role } : user))
  }
  const saveRole = () => {
    const user = pending.value
    if (!user) return
    const before = user.role
    const after = nextRole.value
    roleOpen.value = false
    if (before === after) return
    setRole(user.id, after)
    toast.success(`${displayName(user)} is now ${after}.`, {
      description: 'The new role applies on their next request.',
      actions: [{ label: 'Undo', onClick: () => setRole(user.id, before) }]
    })
  }

  const editOnStart = users.value.find((user) => user.id === EDIT_ROLE_ON_START)
  if (editOnStart) openRole(editOnStart)

  const onAction = (value: DropdownMenuOptionValue, user: User) => {
    if (value === 'view') {
      pending.value = user
      profileOpen.value = true
      return
    }
    if (value === 'role') {
      openRole(user)
      return
    }
    if (value === 'resend') {
      toast.success(`Invitation sent again to ${user.email}.`, {
        description: 'The earlier link stops working.'
      })
      return
    }
    if (value === 'remove') {
      pending.value = user
      removeOpen.value = true
    }
  }
  const remove = () => {
    const user = pending.value
    if (!user) return
    users.value = users.value.filter((item) => item.id !== user.id)
    removeOpen.value = false
    toast.success(
      user.status === 'Invited'
        ? `Invitation to ${user.email} cancelled.`
        : `${displayName(user)} removed from the account.`
    )
  }

  const inviteOpen = ref(INVITE_ON_START)
  const invite = reactive({ email: '', teams: ['developers'] })
  const submitted = ref(false)
  const sending = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = computed<{ email?: string; teams?: string }>(() => {
    if (!submitted.value) return {}
    const email = invite.email.trim().toLowerCase()
    const out: { email?: string; teams?: string } = {}
    if (!email) out.email = 'Enter the email address to invite.'
    else if (!EMAIL.test(email)) out.email = 'Enter an email address like name@example.com.'
    else if (users.value.some((user) => user.email === email))
      out.email = 'This person is already in the account.'
    if (!invite.teams.length) out.teams = 'Choose at least one team, or they get no access.'
    return out
  })
  const openInvite = () => {
    invite.email = ''
    invite.teams = ['developers']
    submitted.value = false
    inviteOpen.value = true
  }
  const sendInvite = () => {
    submitted.value = true
    if (sending.value) return
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    sending.value = true
    setTimeout(() => {
      const email = invite.email.trim().toLowerCase()
      users.value = [
        ...users.value,
        {
          id: `u-${users.value.length + 1}-${email}`,
          name: '',
          email,
          owner: false,
          role: 'Developer',
          teams: [...invite.teams],
          status: 'Invited',
          lastActive: null
        }
      ]
      sending.value = false
      inviteOpen.value = false
      toast.success(`Invitation sent to ${email}.`, {
        description: `They join ${teamsLabel(invite.teams)} when they accept. The link expires in 7 days.`
      })
    }, 800)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Users"
        description="The people who can sign in to this account. What each one can do comes from their teams."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/users"
            target="_blank"
          />
          <Button
            label="Invite User"
            icon="ai ai-user-plus"
            variant="primary"
            size="large"
            @click="openInvite"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed"
          class="flex flex-wrap items-start gap-(--layout-group-gap)"
        >
          <div class="flex min-w-0 grow basis-(--container-2xs)">
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Filter users"
              aria-label="Filter users"
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
          The users could not be loaded. Nothing was changed; try again.
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
          v-else
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="usersTableEl"
              v-bind="tableProps"
              :loading="loading || refreshing"
              sortable
              :bordered="false"
              aria-label="Users"
            >
              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="displayName(row)"
                    size="small"
                    variant="square"
                  />
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-body-sm text-(--text-default)">{{
                      displayName(row)
                    }}</span>
                  </div>
                </div>
              </template>
              <template #cell-email="{ value }">
                <span
                  class="truncate"
                  dir="ltr"
                  >{{ value }}</span
                >
              </template>
              <template #cell-role="{ value }">
                <Tag
                  :label="value"
                  :variant="roleVariant(value)"
                  :severity="roleSeverity(value)"
                  size="small"
                />
              </template>
              <template #cell-teams="{ row }">
                <Tooltip
                  :content="row.owner ? 'The account owner is always an administrator.' : ''"
                  :disabled="!row.owner"
                  class="w-full"
                >
                  <MultiSelect
                    :model-value="row.teams"
                    size="small"
                    class="w-full"
                    placeholder="No team"
                    :disabled="row.owner || row.status === 'Inactive'"
                    :display-value="() => teamsLabel(row.teams)"
                    @update:model-value="(next) => setTeams(row, next)"
                  >
                    <MultiSelect.Trigger :aria-label="`Teams of ${displayName(row)}`" />
                    <MultiSelect.Content>
                      <MultiSelect.Option
                        v-for="team in TEAMS"
                        :key="team.value"
                        :value="team.value"
                      >
                        {{ team.label }}
                      </MultiSelect.Option>
                    </MultiSelect.Content>
                  </MultiSelect>
                </Tooltip>
              </template>
              <template #cell-status="{ value }">
                <Table.CellStatus
                  :label="value"
                  :severity="statusSeverity(value)"
                />
              </template>
              <template #cell-lastActive="{ row }">
                <Table.CellTime
                  v-if="row.lastActive"
                  :value="row.lastActive"
                />
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >Not signed in yet</span
                >
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <Table.CellActions
                  :name="displayName(row)"
                  @select="(_event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group key="profile">
                    <DropdownMenu.Item
                      value="view"
                      label="View profile"
                    />
                    <DropdownMenu.Item
                      v-if="!row.owner"
                      value="role"
                      label="Edit role"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group
                    v-if="row.status === 'Invited'"
                    key="invitation"
                  >
                    <DropdownMenu.Item
                      value="resend"
                      label="Resend invitation"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group
                    v-if="!row.owner"
                    key="remove"
                  >
                    <DropdownMenu.Item
                      value="remove"
                      :label="
                        row.status === 'Invited' ? 'Cancel invitation' : 'Remove from account'
                      "
                    />
                  </DropdownMenu.Group>
                </Table.CellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-search"
                  title="No matching users"
                  description="No user matches these filters."
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

        <EmptyState
          v-if="alone && !loadFailed"
          size="small"
          icon="ai ai-users"
          title="You are the only user"
          description="Invite the people you work with and choose the teams that give them access."
        >
          <template #actions>
            <Button
              label="Invite User"
              icon="ai ai-user-plus"
              variant="secondary"
              size="small"
              @click="openInvite"
            />
          </template>
        </EmptyState>
      </section>
    </div>

    <Drawer
      v-model:open="inviteOpen"
      side="end"
      size="large"
      :dismissible="!sending"
      :closable="!sending"
    >
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Invite User"
          novalidate
          @submit.prevent="sendInvite"
        >
          <PanelHeader class="w-full">
            <DrawerTitle>Invite User</DrawerTitle>
          </PanelHeader>
          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
              :disabled="sending"
            >
              <legend class="sr-only">Invite User</legend>
              <DrawerDescription>
                They get an email with a link to join this account. Their teams decide what they can
                see and change.
              </DrawerDescription>
              <Field
                required
                :invalid="Boolean(errors.email)"
              >
                <Field.Label for="invite-email">Email</Field.Label>
                <Input
                  id="invite-email"
                  v-model="invite.email"
                  type="email"
                  size="large"
                  autocomplete="off"
                  placeholder="name@example.com"
                />
                <Field.Error v-if="errors.email">{{ errors.email }}</Field.Error>
              </Field>
              <Field
                required
                :invalid="Boolean(errors.teams)"
              >
                <Field.Label for="invite-teams">Teams</Field.Label>
                <MultiSelect
                  v-model="invite.teams"
                  size="large"
                  class="w-full"
                  placeholder="Choose teams"
                  :display-value="() => teamsLabel(invite.teams)"
                >
                  <MultiSelect.Trigger
                    id="invite-teams"
                    aria-label="Teams"
                  />
                  <MultiSelect.Content>
                    <MultiSelect.Option
                      v-for="team in TEAMS"
                      :key="team.value"
                      :value="team.value"
                    >
                      {{ team.label }}
                    </MultiSelect.Option>
                  </MultiSelect.Content>
                </MultiSelect>
                <Field.Description v-if="!errors.teams"
                  >Permissions add up across teams. Change them later from the
                  list.</Field.Description
                >
                <Field.Error v-else>{{ errors.teams }}</Field.Error>
              </Field>
            </fieldset>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                :disabled="sending"
                @click="inviteOpen = false"
              />
              <Button
                type="submit"
                label="Send invitation"
                variant="primary"
                icon="ai ai-send"
                :loading="sending"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Dialog
      v-model:open="profileOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <Avatar
              :label="pending ? displayName(pending) : ''"
              size="medium"
              variant="square"
            />
            <DialogTitle>{{ pending ? displayName(pending) : '' }}</DialogTitle>
          </div>
        </PanelHeader>
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-md)">
            <DialogDescription>
              What this person can do comes from their role and their teams.
            </DialogDescription>
            <KeyValuePairs
              v-if="pending"
              :columns="2"
              aria-label="Profile"
            >
              <KeyValuePairs.Item label="Email">
                <span dir="ltr">{{ pending.email }}</span>
              </KeyValuePairs.Item>
              <KeyValuePairs.Item label="Role">
                <Tag
                  :label="pending.role"
                  :variant="roleVariant(pending.role)"
                  :severity="roleSeverity(pending.role)"
                  size="small"
                />
              </KeyValuePairs.Item>
              <KeyValuePairs.Item label="Teams">{{ teamsLabel(pending.teams) }}</KeyValuePairs.Item>
              <KeyValuePairs.Item label="Status">{{ pending.status }}</KeyValuePairs.Item>
              <KeyValuePairs.Item label="Last active">
                <Table.CellTime
                  v-if="pending.lastActive"
                  :value="pending.lastActive"
                />
                <span v-else>Not signed in yet</span>
              </KeyValuePairs.Item>
            </KeyValuePairs>
          </div>
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Close"
              variant="outline"
              size="medium"
              @click="profileOpen = false"
            />
            <Button
              v-if="pending && !pending.owner"
              label="Edit role"
              variant="primary"
              size="medium"
              @click="openRole(pending)"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      v-model:open="roleOpen"
      size="small"
    >
      <DialogContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Edit role"
          novalidate
          @submit.prevent="saveRole"
        >
          <PanelHeader class="w-full">
            <DialogTitle>Edit role</DialogTitle>
          </PanelHeader>
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-md)">
              <DialogDescription>
                Choose what {{ pending ? displayName(pending) : '' }} can do on the account. Their
                teams still decide which resources they reach.
              </DialogDescription>
              <Field>
                <Field.Label for="user-role">Role</Field.Label>
                <Select
                  v-model="nextRole"
                  size="large"
                  class="w-full"
                >
                  <Select.Trigger id="user-role" />
                  <Select.Content>
                    <Select.Option
                      v-for="role in ROLES"
                      :key="role.value"
                      :value="role.value"
                    >
                      {{ role.value }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <Field.Description>{{ roleHint }}</Field.Description>
              </Field>
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="roleOpen = false"
              />
              <Button
                type="submit"
                label="Save role"
                variant="primary"
                size="medium"
              />
            </div>
          </PanelFooter>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="removeOpen"
      :title="pending?.status === 'Invited' ? 'Cancel invitation' : 'Remove user'"
      :description="
        pending?.status === 'Invited'
          ? `The link sent to ${pending?.email ?? ''} stops working. You can invite them again later.`
          : `${pending ? displayName(pending) : ''} can no longer sign in to this account. Their teams and the resources they created stay.`
      "
      :confirm-label="pending?.status === 'Invited' ? 'Cancel invitation' : 'Remove user'"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
```
