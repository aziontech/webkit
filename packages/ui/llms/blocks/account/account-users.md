# AccountUsers (`account/account-users`)

> The people who can sign in to an account. A `PageHeader` with Documentation and the primary Invite User over the view-table controls row (`PropertyFilter` over name, email, role and status, Refresh and Download CSV as `IconButton`s, `CollectionPreferences`) and a flush `Card` holding a `DataTable` on one `useCollection`: Name (square `Avatar`, the name or the invited email), Email, Role as a `Tag` (Owner, Admin, Developer, Viewer), Teams as an inline `MultiSelect` per person that applies at once with an Undo toast (disabled for the owner and inactive people), Status as `TableCellStatus` (Active, Invited, Inactive), Last active as `TableCellTime` or `Not signed in yet`, and `TableCellActions` with View profile (a `Dialog` with `KeyValueList`), Edit role (a `Dialog` with a role `Select` and an Undo toast), Resend invitation for invited people and Remove from account (or Cancel invitation) behind a `ConfirmDialog`. Invite User opens a large `Drawer` form with Email and a Teams `MultiSelect`, errors after Send, and a toast that names the teams. Built from `PageHeader`, `Button`, `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences`, `Card`, `DataTable`, `Avatar`, `Tag`, `MultiSelect`, `DropdownMenu`, `Dialog` and its parts, `KeyValueList`, `Select`, `ConfirmDialog`, `Drawer` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `Field`, `Input`, `EmptyState`, `Alert`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/account-users/account-users.vue` in `@aziontech/ui`
- MCP: `get_block("account/account-users")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [KeyValueList](../../components/key-value-list.md), [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [Select](../../components/select.md), [Table](../../components/table.md), `TableCellActions`, `TableCellStatus`, `TableCellTime`, [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `azion-ui-lists`, `azion-ui-tables`, `azion-ui-form`, `azion-ui-states`, `azion-ui-microcopy`

## Asked as

users; users management; invite user; invite teammates; members; account members; assign teams; resend invitation; remove user; usuários; gerenciar usuários; convidar usuário; membros da conta; atribuir times; edit role; change role; user roles; view profile; alterar papel; papel do usuário

Who can sign in to the account, with which role and through which teams. An admin invites a teammate by email, chooses their teams, sees who has not accepted yet, resends or cancels an invitation, changes a person's role, moves a person between teams and removes people who left. The role decides what a person can do on the account itself (Admin manages people, teams and billing; Developer and Viewer do not); resource permissions come only from teams (`account/account-team-permissions`), so this page never grants a single permission to a person. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Inviting people to an account or organisation, choosing their role and assigning them to teams.
- Following pending invitations: resend or cancel.
- Removing a person's access.

## When not to use

- Defining what a team can do: use `account/account-team-permissions`.
- Credentials that act as a person: use `account/account-personal-tokens`.
- Who turned on multi-factor authentication: use `account/account-mfa-settings`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Users` and one sentence that names both sources of access: the role decides what a person can do on the account, their teams which resources they reach. Actions: Documentation and the primary `Invite User` at `size="medium"`, which opens the invite drawer.

### B. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The view-table controls row (`view/view-table`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, email, role and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, and is disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden while the list failed to load.

### C. Users table — `Card`, `DataTable`, `TableCellActions`, `TableCellStatus`, `TableCellTime`, `Avatar`, `Tag`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`, sortable by name, role and status. Name: a square `Avatar` with the initials and the name (or the email while the invitation is pending). Email in its own column, left to right in every language. Role is a small `Tag`: Owner (`variant="primary"`, the one orange value), Admin (info), Developer and Viewer (neutral). Status is `TableCellStatus`: Active (success), Invited (warning), Inactive (secondary). Last active is `TableCellTime`, or `Not signed in yet` for an invitation.

### D. Teams per person — `MultiSelect`, `Tooltip` (required)

The Teams cell is a small `MultiSelect` named `Teams of <person>` whose value reads the team names. Ticking teams edits a draft while the menu is open; the change applies once, when the menu closes, and raises one toast (one per person, a later change replaces it) that names the new teams with Undo, so a person's access never changes on every click; clearing every team keeps the seat but removes all access, and the toast says so. The owner's teams are locked, with a `Tooltip` saying why; an inactive person's teams are disabled.

### E. Row actions — `DataTable`, `DropdownMenu`, `ConfirmDialog` (required)

`TableCellActions` named after the person. Everyone gets `View profile`; everyone but the owner gets `Edit role`. An invited person gets `Resend invitation` (toast: the earlier link stops working) and `Cancel invitation`; everyone else but the owner gets `Remove from account`. Both removals ask in a `ConfirmDialog` that says what the person loses and what stays.

### F. Profile and role dialogs — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `KeyValueList`, `Select` (required)

View profile opens a medium `Dialog` titled with the person's name and `Avatar`: `KeyValueList` with Email, Role, Teams, Status and Last active, then Close and, for anyone but the owner, `Edit role`. Edit role opens a small `Dialog` around a `form`: a role `Select` (Admin, Developer, Viewer; Owner is never assignable) whose `Field.Description` says what the chosen role allows, then Cancel and the primary `Save role`. Saving changes the Role tag at once and raises a toast with Undo; saving the same role closes without a toast.

### G. Invite drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `DrawerDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Field`, `Input`, `MultiSelect`, `Button` (required)

A large right `Drawer` around a `form`: a description of what the invitation does, a required Email `Field`, a required Role `Select` (Admin, Developer or Viewer, Developer preselected, its hint under it, so the role is always chosen and seen before sending) and a required Teams `Field` with Developers preselected and a description saying permissions add up. Footer: Cancel and the primary `Send invitation`, which shows its loading state; the drawer cannot be dismissed while it sends. Errors follow `state/state-form-validation` (SectionRejected): nothing is red before the first Send; after it each field shows its own `Field.Error` and focus moves to the first invalid one.

### H. Only the owner, no match and load failure — `EmptyState`, `Alert` (conditional)

With only the owner, a small `EmptyState` under the table invites the first teammate. `No matching users` with Clear filters sits in the table's `#empty` slot. When the list fails to load, a danger `Alert` with Retry takes the table's place.

### Outcomes — through `toast`

Invitations, team changes, resends and removals end in a success toast. They are not deploys, so no toast carries Edit or Redeploy. This page body only calls `toast` from `@aziontech/ui/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its records through props and emits every action; it fetches nothing. `UsersUser`, `UsersTeam`, `UsersInvitation` and `UsersProps` are exported from `account-users.vue`, and `sample.ts` holds the people and teams the block renders when `users` or `teams` is left out (and never while `loading` or `error` is set).

| Prop                | Type          | What it does                                                                                                        |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `users`             | `UsersUser[]` | The people of the account; filtered, sorted and paged in the browser. The owner alone shows the invite empty state. |
| `teams`             | `UsersTeam[]` | Every team, the options of the Teams pickers.                                                                       |
| `loading`           | `boolean`     | A request is in flight. With no rows it is the first load; with rows it is a refresh.                               |
| `error`             | `string`      | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table.               |
| `defaultInviteOpen` | `boolean`     | Opens the invite drawer on mount.                                                                                   |
| `defaultEditRoleId` | `string`      | Opens the Edit role dialog for the user with this id on mount.                                                      |

| Event               | Payload                           | When                                                                                    |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| `invite`            | `(event, { email, role, teams })` | Send invitation passed validation; the person is already in the list as Invited.        |
| `refresh`           | `(event)`                         | Refresh.                                                                                |
| `retry`             | `(event)`                         | Retry in the error alert.                                                               |
| `role-change`       | `(event, { user, role })`         | Save role, or Undo in its toast; the row already shows the new role.                    |
| `teams-change`      | `({ user, teams })`               | A row's Teams picker closed with a different set of teams, or Undo in its toast.        |
| `resend-invitation` | `(event, user)`                   | Resend invitation in the row menu.                                                      |
| `remove`            | `(event, user)`                   | Remove user or Cancel invitation was confirmed; the row is already gone from the table. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import AccountUsers from './account-users.vue'

  const { data, teams, pending, error, refresh, invite, setRole, setTeams, remove } = useUsers()
  const loadError = 'The users could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountUsers
    :users="data ?? []"
    :teams="teams"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
    @invite="(event, values) => invite(values)"
    @role-change="(event, { user, role }) => setRole(user.id, role)"
    @teams-change="({ user, teams }) => setTeams(user.id, teams)"
    @remove="(event, user) => remove(user.id)"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- Follow `skills/azion-ui-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The filter is named Filter users; Refresh and Download CSV are icon buttons with an accessible name and a tooltip.
- Each Teams control is named `Teams of <person>`; the row menu is named `Actions for <person>`.
- The role form is a `form` named Edit role; the `Select` is labelled Role and described by what the role allows.
- The invite form is a `form` named Invite User; each `Field` ties its label, description and error to the control, and `Field.Error` is announced when it appears.
- After a failed Send, focus moves to the first invalid control.
- The owner's locked controls are disabled and the reason is on the tooltip, not only in color.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.
- The rows are one tab stop: Arrow Up and Arrow Down move between rows, Home and End jump to the first and last, Enter opens the person's profile, and Delete or Backspace opens the remove (or cancel invitation) dialog; the owner's row ignores Delete. After a removal, focus lands on the next row.

## States

- Default: six people (the owner, four active or inactive, one invited) with the property filter, Refresh, Download CSV, preferences, inline team changes, View profile, Edit role, resend, cancel and remove wired.
- Invite: the invite drawer open (`defaultInviteOpen`).
- EditRole: the Edit role dialog open for Jordan Reyes (`defaultEditRoleId`).
- OnlyOwner: the owner alone (`users` holds only the owner) and the invite empty state.
- Loading: the first load (`loading` with no `users`).
- Error: the list did not load (`error` is set); a danger Alert with the message and Retry.

## Related

- `account/account-team-permissions` — what each team can do.
- `account/account-mfa-settings` — who has multi-factor authentication on.
- `account/account-activity-history` — where invitations and removals are audited.
- `state/state-form-validation` (SectionRejected) — the error pattern the invite form follows.

## Variants

- `Default` — primary (the code below)
- `Invite` — The Invite User drawer open over the list: Email and Teams (Developers preselected), Cancel and Send invitation; Send with an empty, malformed or existing email or no team shows the error on that field and focuses it.
- `EditRole` — The Edit role dialog open for Jordan Reyes: a role Select (Admin, Developer, Viewer) whose description says what the role allows, Cancel and Save role; saving changes the Role tag and raises a toast with Undo.
- `OnlyOwner` — An account with only its owner: the owner's row, then a small EmptyState that invites the first teammate.
- `Loading` — The first load: the controls row and the table's loading rows.
- `Error` — The users did not load: a danger Alert with Retry replaces the table; Retry loads them.

Each variant is the same screen in another state: `get_block("account/account-users", { variant })`, or the file under `blocks/account/account-users/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import CollectionPreferences from '@aziontech/ui/collection-preferences'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import EmptyState from '@aziontech/ui/empty-state'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import { type TableColumn } from '@aziontech/ui/table'
  import { toast } from '@aziontech/ui/toast'
  import Tooltip from '@aziontech/ui/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/ui/use-collection'
  import { computed, ref, watch } from 'vue'

  import { displayName, teamsLabelOf } from './account-users-format'
  import InviteUserDrawer from './parts/invite-user-drawer.vue'
  import UserProfileDialog from './parts/user-profile-dialog.vue'
  import UserRoleDialog from './parts/user-role-dialog.vue'
  import UsersTable from './parts/users-table.vue'
  import { sampleTeams, sampleUsers } from './sample'

  /** Whether a person can sign in yet. */
  export type UsersStatus = 'Active' | 'Invited' | 'Inactive'
  /** What a person can do on the account. */
  export type UsersRole = 'Owner' | 'Admin' | 'Developer' | 'Viewer'

  /** One person of the account. */
  export interface UsersUser {
    /** Stable key. */
    id: string
    /** Display name; empty until an invited person accepts. */
    name: string
    /** Sign-in email. */
    email: string
    /** The account owner, who cannot be edited or removed. */
    owner: boolean
    /** What they can do on the account. */
    role: UsersRole
    /** Values of the teams they belong to. */
    teams: string[]
    /** Whether they can sign in yet. */
    status: UsersStatus
    /** When they were last active; null when never signed in. */
    lastActive: Date | null
  }

  /** A team people can join. */
  export interface UsersTeam {
    /** Stable key stored in a user's teams. */
    value: string
    /** Display name. */
    label: string
  }

  /** What the invite form sends. */
  export interface UsersInvitation {
    /** The address to invite, trimmed and lowercased. */
    email: string
    /** What they can do on the account, chosen in the form. */
    role: Exclude<UsersRole, 'Owner'>
    /** Values of the teams they join. */
    teams: string[]
  }

  export interface UsersProps {
    /** The people of the account. Left out, the sample renders. */
    users?: UsersUser[]
    /** Every team of the account. Left out, the sample renders. */
    teams?: UsersTeam[]
    /** A request is in flight: with no rows it is the first load, with rows a refresh. */
    loading?: boolean
    /** Why the users could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** Opens the invite drawer on mount. */
    defaultInviteOpen?: boolean
    /** Opens the Edit role dialog for the user with this id on mount. */
    defaultEditRoleId?: string
  }

  const props = withDefaults(defineProps<UsersProps>(), {
    users: undefined,
    teams: undefined,
    loading: false,
    error: '',
    defaultInviteOpen: false,
    defaultEditRoleId: ''
  })

  const emit = defineEmits<{
    invite: [event: Event, values: UsersInvitation]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'role-change': [event: Event, payload: { user: UsersUser; role: UsersRole }]
    'teams-change': [payload: { user: UsersUser; teams: string[] }]
    'resend-invitation': [event: Event, user: UsersUser]
    remove: [event: Event, user: UsersUser]
  }>()

  const source = computed<UsersUser[]>(
    () => props.users ?? (props.loading || props.error ? [] : sampleUsers)
  )
  const items = ref<UsersUser[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )
  const teamOptions = computed<UsersTeam[]>(() => props.teams ?? sampleTeams)

  const teamsLabel = (values: string[]): string => teamsLabelOf(teamOptions.value, values)

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'email', header: 'Email', grow: 2, minWidth: 220 },
    { accessorKey: 'role', header: 'Role', sortable: true, minWidth: 120, narrow: false },
    { accessorKey: 'teams', header: 'Teams', grow: 2, minWidth: 220 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110, narrow: false },
    { accessorKey: 'lastActive', header: 'Last active', minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const optionsOf = (key: 'role' | 'status') =>
    [...new Set(source.value.map((user) => user[key]))].sort().map((value) => ({ value }))

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', options: optionsOf('role') },
    { key: 'status', label: 'Status', options: optionsOf('status') }
  ])

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    matchingItems,
    clearFilters
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['name', 'email', 'role', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { storageKey: 'account-users' }
  })

  const usersTableEl = ref<InstanceType<typeof UsersTable> | null>(null)
  const exportCsv = () => usersTableEl.value?.exportCsv()

  const alone = computed(() => !props.loading && items.value.length === 1 && items.value[0].owner)

  const replaceUser = (id: string, patch: Partial<UsersUser>): UsersUser | undefined => {
    let updated: UsersUser | undefined
    items.value = items.value.map((user) => {
      if (user.id !== id) return user
      updated = { ...user, ...patch }
      return updated
    })
    return updated
  }

  const changeTeams = (id: string, teams: string[]) => {
    const user = replaceUser(id, { teams })
    if (user) emit('teams-change', { user, teams })
  }

  const setTeams = (user: UsersUser, selected: unknown[]) => {
    const next = selected.map(String)
    const before = [...user.teams]
    changeTeams(user.id, next)
    toast.success(`Teams updated for ${displayName(user)}.`, {
      description: next.length
        ? `${teamsLabel(next)}. Access changes on their next request.`
        : 'They keep their seat but lose every permission until a team is added.',
      id: `teams-${user.id}`,
      actions: [
        {
          label: 'Undo',
          onClick: () => changeTeams(user.id, before)
        }
      ]
    })
  }

  const pending = ref<UsersUser | null>(null)
  const removeOpen = ref(false)
  const profileOpen = ref(false)
  const roleOpen = ref(false)
  const nextRole = ref<UsersRole>('Developer')
  const openRole = (user: UsersUser) => {
    pending.value = user
    nextRole.value = user.role
    profileOpen.value = false
    roleOpen.value = true
  }
  const setRole = (event: Event, id: string, role: UsersRole) => {
    const user = replaceUser(id, { role })
    if (user) emit('role-change', event, { user, role })
  }
  const saveRole = (event: Event) => {
    const user = pending.value
    if (!user) return
    const before = user.role
    const after = nextRole.value
    roleOpen.value = false
    if (before === after) return
    setRole(event, user.id, after)
    toast.success(`${displayName(user)} is now ${after}.`, {
      description: 'The new role applies on their next request.',
      actions: [{ label: 'Undo', onClick: (undo: MouseEvent) => setRole(undo, user.id, before) }]
    })
  }

  const editOnStart = props.defaultEditRoleId
    ? items.value.find((user) => user.id === props.defaultEditRoleId)
    : undefined
  if (editOnStart) openRole(editOnStart)

  const onAction = (event: Event, value: DropdownMenuItemValue, user: UsersUser) => {
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
      emit('resend-invitation', event, user)
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
  const ROW_CONTROLS = 'a, button, input, select, textarea, [role="combobox"], [role="button"]'
  const fromRowControl = (event: MouseEvent | KeyboardEvent): boolean =>
    event instanceof MouseEvent &&
    (event.target instanceof Element ? event.target.closest(ROW_CONTROLS) !== null : true)
  const onRowOpen = (event: MouseEvent | KeyboardEvent, user: UsersUser) => {
    if (fromRowControl(event)) return
    if (event instanceof MouseEvent && window.getSelection()?.toString()) return
    onAction(event, 'view', user)
  }
  const onRowRemove = (event: KeyboardEvent, user: UsersUser) => {
    if (!user.owner) onAction(event, 'remove', user)
  }
  const remove = (event: Event) => {
    const user = pending.value
    if (!user) return
    items.value = items.value.filter((item) => item.id !== user.id)
    removeOpen.value = false
    emit('remove', event, user)
    toast.success(
      user.status === 'Invited'
        ? `Invitation to ${user.email} cancelled.`
        : `${displayName(user)} removed from the account.`
    )
  }

  const inviteOpen = ref(props.defaultInviteOpen)
  const openInvite = () => {
    inviteOpen.value = true
  }
  const sendInvite = (event: Event, { email, role, teams }: UsersInvitation) => {
    items.value = [
      ...items.value,
      {
        id: `u-${items.value.length + 1}-${email}`,
        name: '',
        email,
        owner: false,
        role,
        teams,
        status: 'Invited',
        lastActive: null
      }
    ]
    inviteOpen.value = false
    emit('invite', event, { email, role, teams })
    toast.success(`Invitation sent to ${email}.`, {
      description: `They join as ${role} in ${teamsLabel(teams)} when they accept. The link expires in 7 days.`
    })
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Users"
        description="The people who can sign in to this account. Their role decides what they can do on the account; their teams decide which resources they reach."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/users"
            target="_blank"
          />
          <Button
            label="Invite User"
            icon="az az-user-plus"
            variant="primary"
            size="medium"
            @click="openInvite"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!error"
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
                icon="az az-refresh"
                variant="outline"
                size="medium"
                :loading="loading"
                aria-label="Refresh"
                @click="emit('refresh', $event)"
              />
            </Tooltip>
            <Tooltip
              content="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="az az-download"
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
          v-if="error"
          severity="danger"
        >
          {{ error }}
          <template #actions>
            <Button
              label="Retry"
              variant="secondary"
              size="small"
              @click="emit('retry', $event)"
            />
          </template>
        </Alert>

        <UsersTable
          v-else
          ref="usersTableEl"
          :table-props="tableProps"
          :pagination-props="paginationProps"
          :loading="loading"
          :team-options="teamOptions"
          @row-click="onRowOpen"
          @row-remove="onRowRemove"
          @action="onAction"
          @teams="setTeams"
          @clear="clearFilters"
        />

        <EmptyState
          v-if="alone && !error"
          size="small"
          icon="az az-users"
          title="You are the only user"
          description="Invite the people you work with and choose the teams that give them access."
        >
          <template #actions>
            <Button
              label="Invite User"
              icon="az az-user-plus"
              variant="secondary"
              size="small"
              @click="openInvite"
            />
          </template>
        </EmptyState>
      </section>
    </div>

    <InviteUserDrawer
      v-model:open="inviteOpen"
      :team-options="teamOptions"
      :emails="items.map((user) => user.email)"
      @send="sendInvite"
    />

    <UserProfileDialog
      v-model:open="profileOpen"
      :pending="pending"
      :team-options="teamOptions"
      @edit-role="openRole"
    />

    <UserRoleDialog
      v-model:open="roleOpen"
      v-model:role="nextRole"
      :pending="pending"
      @save="saveRole"
    />

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

## `sample.ts`

```ts
import type { UsersTeam, UsersUser } from './account-users.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleTeams: UsersTeam[] = [
  { value: 'administrators', label: 'Administrators' },
  { value: 'developers', label: 'Developers' },
  { value: 'security', label: 'Security' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Support' }
]

export const sampleUsers: UsersUser[] = [
  {
    id: 'u-1',
    name: 'Avery Stone',
    email: 'avery.stone@example.com',
    owner: true,
    role: 'Owner',
    teams: ['administrators'],
    status: 'Active',
    lastActive: new Date(referenceTime - 0.02 * DAY)
  },
  {
    id: 'u-2',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    owner: false,
    role: 'Admin',
    teams: ['administrators', 'security'],
    status: 'Active',
    lastActive: new Date(referenceTime - 0.1 * DAY)
  },
  {
    id: 'u-3',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    owner: false,
    role: 'Developer',
    teams: ['developers'],
    status: 'Active',
    lastActive: new Date(referenceTime - 1 * DAY)
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
    lastActive: new Date(referenceTime - 3 * DAY)
  },
  {
    id: 'u-6',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    owner: false,
    role: 'Viewer',
    teams: [],
    status: 'Inactive',
    lastActive: new Date(referenceTime - 64 * DAY)
  }
]
```

## `account-users-format.ts`

```ts
import type { TagSeverity, TagVariant } from '@aziontech/ui/tag'

import type { UsersRole, UsersStatus, UsersTeam, UsersUser } from './account-users.vue'

export const USERS_ROLES: { value: Exclude<UsersRole, 'Owner'>; hint: string }[] = [
  { value: 'Admin', hint: 'Manages people, teams, billing and every account setting.' },
  { value: 'Developer', hint: 'Works on the resources their teams reach; no account settings.' },
  { value: 'Viewer', hint: 'Reads the resources their teams reach; changes nothing.' }
]

export const roleSeverity = (value: UsersRole): TagSeverity | undefined =>
  value === 'Owner'
    ? undefined
    : (({ Admin: 'info', Developer: 'neutral', Viewer: 'neutral' } as const)[value] ?? 'neutral')

export const roleVariant = (value: UsersRole): TagVariant | undefined =>
  value === 'Owner' ? 'primary' : undefined

export const displayName = (user: UsersUser): string => user.name || user.email

export const statusSeverity = (value: UsersStatus): TagSeverity =>
  (({ Active: 'success', Invited: 'warning', Inactive: 'neutral' }) as const)[value] ?? 'neutral'

export const teamsLabelOf = (teams: UsersTeam[], values: string[]): string =>
  values.length
    ? values.map((value) => teams.find((team) => team.value === value)?.label ?? value).join(', ')
    : 'No team (no access)'
```

## `parts/invite-user-drawer.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import MultiSelect from '@aziontech/ui/multi-select'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import type { UsersInvitation, UsersRole, UsersTeam } from '../account-users.vue'
  import { teamsLabelOf, USERS_ROLES } from '../account-users-format'

  const props = defineProps<{ teamOptions: UsersTeam[]; emails: string[] }>()

  const emit = defineEmits<{ send: [event: Event, invitation: UsersInvitation] }>()

  const open = defineModel<boolean>('open', { required: true })

  const invite = reactive<{ email: string; role: Exclude<UsersRole, 'Owner'>; teams: string[] }>({
    email: '',
    role: 'Developer',
    teams: ['developers']
  })
  const roleHint = computed(
    () => USERS_ROLES.find((role) => role.value === invite.role)?.hint ?? ''
  )
  const submitted = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = computed<{ email?: string; teams?: string }>(() => {
    if (!submitted.value) return {}
    const email = invite.email.trim().toLowerCase()
    const out: { email?: string; teams?: string } = {}
    if (!email) out.email = 'Enter the email address to invite.'
    else if (!EMAIL.test(email)) out.email = 'Enter an email address like name@example.com.'
    else if (props.emails.includes(email)) out.email = 'This person is already in the account.'
    if (!invite.teams.length) out.teams = 'Choose at least one team, or they get no access.'
    return out
  })

  watch(open, (now) => {
    if (!now) return
    invite.email = ''
    invite.role = 'Developer'
    invite.teams = ['developers']
    submitted.value = false
  })

  const sendInvite = (event: Event) => {
    submitted.value = true
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    emit('send', event, {
      email: invite.email.trim().toLowerCase(),
      role: invite.role,
      teams: [...invite.teams]
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    side="end"
    size="large"
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
        <PanelBody>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Invite User</legend>
            <DrawerDescription>
              They get an email with a link to join this account. Their role decides what they can
              do on the account; their teams decide which resources they reach.
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
            <Field required>
              <Field.Label for="invite-role">Role</Field.Label>
              <Select
                v-model="invite.role"
                size="large"
                class="w-full"
              >
                <Select.Trigger id="invite-role" />
                <Select.Content>
                  <Select.Item
                    v-for="role in USERS_ROLES"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.value }}
                  </Select.Item>
                </Select.Content>
              </Select>
              <Field.Description>{{ roleHint }}</Field.Description>
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
                :display-value="() => teamsLabelOf(teamOptions, invite.teams)"
              >
                <MultiSelect.Trigger
                  id="invite-teams"
                  aria-label="Teams"
                />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="team in teamOptions"
                    :key="team.value"
                    :value="team.value"
                  >
                    {{ team.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
              <Field.Description v-if="!errors.teams"
                >Permissions add up across teams. Change them later from the
                list.</Field.Description
              >
              <Field.Error v-else>{{ errors.teams }}</Field.Error>
            </Field>
          </fieldset>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              @click="open = false"
            />
            <Button
              type="submit"
              label="Send invitation"
              variant="primary"
              icon="az az-send"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `parts/user-profile-dialog.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import Tag from '@aziontech/ui/tag'

  import type { UsersTeam, UsersUser } from '../account-users.vue'
  import { displayName, roleSeverity, roleVariant, teamsLabelOf } from '../account-users-format'

  defineProps<{ pending: UsersUser | null; teamOptions: UsersTeam[] }>()

  const emit = defineEmits<{ 'edit-role': [user: UsersUser] }>()

  const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Dialog
    v-model:open="open"
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
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DialogDescription>
            What this person can do comes from their role and their teams.
          </DialogDescription>
          <KeyValueList
            v-if="pending"
            :columns="2"
            aria-label="Profile"
          >
            <KeyValueList.Item label="Email">
              <span dir="ltr">{{ pending.email }}</span>
            </KeyValueList.Item>
            <KeyValueList.Item label="Role">
              <Tag
                :label="pending.role"
                :variant="roleVariant(pending.role)"
                :severity="roleSeverity(pending.role)"
                size="small"
              />
            </KeyValueList.Item>
            <KeyValueList.Item label="Teams">{{
              teamsLabelOf(teamOptions, pending.teams)
            }}</KeyValueList.Item>
            <KeyValueList.Item label="Status">{{ pending.status }}</KeyValueList.Item>
            <KeyValueList.Item label="Last active">
              <TableCellTime
                v-if="pending.lastActive"
                :value="pending.lastActive"
              />
              <span v-else>Not signed in yet</span>
            </KeyValueList.Item>
          </KeyValueList>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Close"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            v-if="pending && !pending.owner"
            label="Edit role"
            variant="primary"
            size="medium"
            @click="emit('edit-role', pending)"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
```

## `parts/user-role-dialog.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import Field from '@aziontech/ui/field'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'
  import { computed } from 'vue'

  import type { UsersRole, UsersUser } from '../account-users.vue'
  import { displayName, USERS_ROLES } from '../account-users-format'

  defineProps<{ pending: UsersUser | null }>()

  const emit = defineEmits<{ save: [event: Event] }>()

  const open = defineModel<boolean>('open', { required: true })
  const nextRole = defineModel<UsersRole>('role', { required: true })

  const roleHint = computed(
    () => USERS_ROLES.find((role) => role.value === nextRole.value)?.hint ?? ''
  )
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
  >
    <DialogContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Edit role"
        novalidate
        @submit.prevent="emit('save', $event)"
      >
        <PanelHeader class="w-full">
          <DialogTitle>Edit role</DialogTitle>
        </PanelHeader>
        <PanelBody>
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
                  <Select.Item
                    v-for="role in USERS_ROLES"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.value }}
                  </Select.Item>
                </Select.Content>
              </Select>
              <Field.Description>{{ roleHint }}</Field.Description>
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              @click="open = false"
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
</template>
```

## `parts/users-table.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import EmptyState from '@aziontech/ui/empty-state'
  import MultiSelect from '@aziontech/ui/multi-select'
  import { type TableColumn, type TableExposed } from '@aziontech/ui/table'
  import TableCellActions from '@aziontech/ui/table-cell-actions'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import Tag from '@aziontech/ui/tag'
  import Tooltip from '@aziontech/ui/tooltip'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/ui/use-collection'
  import { reactive, ref } from 'vue'

  import type { UsersTeam, UsersUser } from '../account-users.vue'
  import {
    displayName,
    roleSeverity,
    roleVariant,
    statusSeverity,
    teamsLabelOf
  } from '../account-users-format'

  defineProps<{
    tableProps: CollectionTableProps<UsersUser, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
    teamOptions: UsersTeam[]
  }>()

  const emit = defineEmits<{
    'row-click': [event: MouseEvent | KeyboardEvent, user: UsersUser]
    'row-remove': [event: KeyboardEvent, user: UsersUser]
    action: [event: Event, value: DropdownMenuItemValue, user: UsersUser]
    teams: [user: UsersUser, selected: unknown[]]
    clear: []
  }>()

  const usersTableEl = ref<TableExposed<UsersUser> | null>(null)

  const drafts = reactive<Record<string, string[]>>({})
  const teamsOf = (row: UsersUser): string[] => drafts[row.id] ?? row.teams
  const sameTeams = (a: string[], b: string[]) =>
    a.length === b.length && a.every((team) => b.includes(team))

  const commitTeams = (row: UsersUser) => {
    const draft = drafts[row.id]
    delete drafts[row.id]
    if (draft && !sameTeams(draft, row.teams)) emit('teams', row, draft)
  }

  defineExpose({ exportCsv: () => usersTableEl.value?.exportCsv({ filename: 'users.csv' }) })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        ref="usersTableEl"
        v-bind="tableProps"
        :loading="loading"
        sortable
        :bordered="false"
        aria-label="Users"
        @row-click="(event, row) => emit('row-click', event, row)"
        @row-remove="(event, row) => emit('row-remove', event, row)"
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
              <div
                aria-hidden="true"
                data-slot="narrow-summary"
                class="mt-(--spacing-2xs) flex flex-wrap items-center gap-(--spacing-xs) sm:hidden"
              >
                <Tag
                  :label="row.role"
                  :variant="roleVariant(row.role)"
                  :severity="roleSeverity(row.role)"
                  size="small"
                />
                <TableCellStatus
                  :label="row.status"
                  :severity="statusSeverity(row.status)"
                />
              </div>
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
              :model-value="teamsOf(row)"
              size="small"
              class="w-full"
              placeholder="No team"
              :disabled="row.owner || row.status === 'Inactive'"
              :display-value="() => teamsLabelOf(teamOptions, teamsOf(row))"
              @update:model-value="(next) => (drafts[row.id] = next.map(String))"
              @update:open="(now) => now || commitTeams(row)"
            >
              <MultiSelect.Trigger :aria-label="`Teams of ${displayName(row)}`" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="team in teamOptions"
                  :key="team.value"
                  :value="team.value"
                >
                  {{ team.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </Tooltip>
        </template>
        <template #cell-status="{ value }">
          <TableCellStatus
            :label="value"
            :severity="statusSeverity(value)"
          />
        </template>
        <template #cell-lastActive="{ row }">
          <TableCellTime
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
          <TableCellActions
            :name="displayName(row)"
            @select="(event, value) => emit('action', event, value, row)"
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
                :label="row.status === 'Invited' ? 'Cancel invitation' : 'Remove from account'"
                severity="danger"
              />
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
        <template #empty>
          <EmptyState
            size="small"
            icon="az az-search"
            title="No matching users"
            description="No user matches these filters."
          >
            <template #actions>
              <Button
                label="Clear filters"
                variant="outline"
                size="small"
                @click="emit('clear')"
              />
            </template>
          </EmptyState>
        </template>
        <template #footer>
          <DataTablePagination
            v-bind="paginationProps"
            manual
          />
        </template>
      </DataTable>
    </template>
  </Card>
</template>
```
