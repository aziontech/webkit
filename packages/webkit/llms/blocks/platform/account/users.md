# Users (`platform/account/users`)

> The people who can sign in to an account. A `PageHeader` with Documentation and the primary Invite User over a search `Input` and a flush `Card` holding a `Table` on one `useCollection`: Name (square `Avatar`, the name or the invited email, the owner marked with a highlight `Tag`, the email under it), Teams as an inline `MultiSelect` per person that applies at once with an Undo toast (disabled for the owner and inactive people), Status as `Table.CellStatus` (Active, Invited, Inactive), Last active as `Table.CellTime` or `Not signed in yet`, and `Table.CellActions` with Resend invitation for invited people and Remove from account (or Cancel invitation) behind a `ConfirmDialog`. Invite User opens a medium `Drawer` form with Email and a Teams `MultiSelect`, errors after Send, and a toast that names the teams. Built from `PageHeader`, `Button`, `Input`, `Card`, `Table`, `Avatar`, `Tag`, `MultiSelect`, `Tooltip`, `DropdownMenu`, `ConfirmDialog`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `EmptyState`, `Alert` and `Toaster`.

- Surface: product
- Source: `blocks/platform/account/users/users.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/users")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [MultiSelect](../../../components/multi-select.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Table](../../../components/table.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

users; users management; invite user; invite teammates; members; account members; assign teams; resend invitation; remove user; usuários; gerenciar usuários; convidar usuário; membros da conta; atribuir times

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

### C. Users table — `Card`, `Table`, `Avatar`, `Tag`, `useCollection` (required)

`Table` with `v-bind="tableProps"` in a flush `Card`, sortable by name. Name: a square `Avatar` with the initials, the name (or the email while the invitation is pending), an `Owner` `Tag` (`severity="highlight"`, small) after the owner's name, and the email under it. Status is `Table.CellStatus`: Active (success), Invited (warning), Inactive (secondary). Last active is `Table.CellTime`, or `Not signed in yet` for an invitation.

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

## Variants

- `Default` — primary (the code below)
- `Invite` — The Invite User drawer open over the list: Email and Teams (Developers preselected), Cancel and Send invitation; Send with an empty, malformed or existing email or no team shows the error on that field and focuses it.
- `OnlyOwner` — An account with only its owner: the owner's row, then a small EmptyState that invites the first teammate.
- `Loading` — The first load: the search row and the table's loading rows.
- `Failed` — The users did not load: a danger Alert with Retry replaces the table; Retry loads them.

Each variant is the same screen in another state: `get_pattern("platform/account/users", { variant })`, or the file under `blocks/platform/account/users/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref } from 'vue'

  const TEAMS = [
    { value: 'administrators', label: 'Administrators' },
    { value: 'developers', label: 'Developers' },
    { value: 'security', label: 'Security' },
    { value: 'finance', label: 'Finance' },
    { value: 'support', label: 'Support' }
  ]
  const teamLabel = (value) => TEAMS.find((team) => team.value === value)?.label ?? value
  const teamsLabel = (values) =>
    values.length ? values.map(teamLabel).join(', ') : 'No team (no access)'

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)

  const seedUsers = [
    {
      id: 'u-1',
      name: 'Avery Stone',
      email: 'avery.stone@example.com',
      owner: true,
      teams: ['administrators'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 0.02 * DAY)
    },
    {
      id: 'u-2',
      name: 'Jordan Reyes',
      email: 'jordan.reyes@example.com',
      owner: false,
      teams: ['administrators', 'security'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 0.1 * DAY)
    },
    {
      id: 'u-3',
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      owner: false,
      teams: ['developers'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 1 * DAY)
    },
    {
      id: 'u-4',
      name: '',
      email: 'sam.okafor@example.com',
      owner: false,
      teams: ['developers', 'support'],
      status: 'Invited',
      lastActive: null
    },
    {
      id: 'u-5',
      name: 'Lena Fischer',
      email: 'lena.fischer@example.com',
      owner: false,
      teams: ['finance'],
      status: 'Active',
      lastActive: new Date(REFERENCE - 3 * DAY)
    },
    {
      id: 'u-6',
      name: 'Marco Bianchi',
      email: 'marco.bianchi@example.com',
      owner: false,
      teams: [],
      status: 'Inactive',
      lastActive: new Date(REFERENCE - 64 * DAY)
    }
  ]

  const INVITE_ON_START = false
  const users = ref(seedUsers)
  const loading = ref(false)
  const loadFailed = ref(false)

  const displayName = (user) => user.name || user.email
  const statusSeverity = (value) =>
    ({ Active: 'success', Invited: 'warning', Inactive: 'secondary' })[value] ?? 'secondary'

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'teams', header: 'Teams', grow: 2, minWidth: 220 },
    { accessorKey: 'status', header: 'Status', minWidth: 110 },
    { accessorKey: 'lastActive', header: 'Last active', minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const { filterProps, tableProps, clearFilters } = useCollection({
    items: users,
    columns,
    filtering: { fields: ['name', 'email', 'status'] },
    pagination: { pageSize: 10 }
  })

  const alone = computed(() => !loading.value && users.value.length === 1 && users.value[0].owner)

  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      users.value = seedUsers
      loading.value = false
    }, 700)
  }

  const setTeams = (user, next) => {
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

  const pending = ref(null)
  const removeOpen = ref(false)
  const onAction = (value, user) => {
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
  const formEl = ref(null)
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = computed(() => {
    if (!submitted.value) return {}
    const email = invite.email.trim().toLowerCase()
    const out = {}
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
      nextTick(() => formEl.value?.querySelector('[aria-invalid="true"]')?.focus())
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
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Users"
        description="The people who can sign in to this account. What each one can do comes from their teams."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/users"
            target="_blank"
          />
          <Button
            label="Invite User"
            icon="pi pi-user-plus"
            kind="primary"
            size="large"
            @click="openInvite"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed"
          class="flex items-center gap-(--layout-group-gap)"
        >
          <div class="min-w-0 grow">
            <Input
              v-bind="filterProps"
              placeholder="Search users"
              aria-label="Search users"
              class="w-full"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </header>

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          The users could not be loaded. Nothing was changed; try again.
          <template #action>
            <Button
              label="Retry"
              kind="secondary"
              size="small"
              @click="retryLoad"
            />
          </template>
        </Alert>

        <Card
          v-else
          :padded="false"
        >
          <template #content>
            <Table
              v-bind="tableProps"
              :loading="loading"
              enable-sorting
              :bordered="false"
              aria-label="Users"
            >
              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="displayName(row)"
                    size="small"
                    kind="square"
                  />
                  <div class="flex min-w-0 flex-col">
                    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        displayName(row)
                      }}</span>
                      <Tag
                        v-if="row.owner"
                        label="Owner"
                        severity="highlight"
                        size="small"
                        class="shrink-0"
                      />
                    </span>
                    <span
                      v-if="row.name"
                      class="truncate text-body-xs text-(--text-muted)"
                      >{{ row.email }}</span
                    >
                  </div>
                </div>
              </template>
              <template #cell-teams="{ row }">
                <Tooltip
                  :text="row.owner ? 'The account owner is always an administrator.' : ''"
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
                  :disabled="row.owner"
                  @select="(event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group v-if="row.status === 'Invited'">
                    <DropdownMenu.Option
                      value="resend"
                      label="Resend invitation"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
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
                  icon="pi pi-search"
                  title="No matching users"
                  description="No user matches this search."
                >
                  <template #actions>
                    <Button
                      label="Clear search"
                      kind="outlined"
                      size="small"
                      @click="clearFilters"
                    />
                  </template>
                </EmptyState>
              </template>
            </Table>
          </template>
        </Card>

        <EmptyState
          v-if="alone && !loadFailed"
          size="small"
          icon="pi pi-users"
          title="You are the only user"
          description="Invite the people you work with and choose the teams that give them access."
        >
          <template #actions>
            <Button
              label="Invite User"
              icon="pi pi-user-plus"
              kind="secondary"
              size="small"
              @click="openInvite"
            />
          </template>
        </EmptyState>
      </section>
    </main>

    <Drawer
      v-model:open="inviteOpen"
      side="right"
      size="medium"
      :dismissible="!sending"
    >
      <DrawerPortal>
        <DrawerOverlay />
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
              <DrawerClose />
            </PanelHeader>
            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
                :disabled="sending"
              >
                <legend class="sr-only">Invite User</legend>
                <DrawerDescription>
                  They get an email with a link to join this account. Their teams decide what they
                  can see and change.
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
                  kind="outlined"
                  :disabled="sending"
                  @click="inviteOpen = false"
                />
                <Button
                  type="submit"
                  label="Send invitation"
                  kind="primary"
                  icon="pi pi-send"
                  :loading="sending"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <ConfirmDialog
      v-model:open="removeOpen"
      :title="pending?.status === 'Invited' ? 'Cancel invitation' : 'Remove user'"
      :description="
        pending?.status === 'Invited'
          ? `The link sent to ${pending?.email ?? ''} stops working. You can invite them again later.`
          : `${pending ? displayName(pending) : ''} can no longer sign in to this account. Their teams and the resources they created stay.`
      "
      :confirm-label="pending?.status === 'Invited' ? 'Cancel invitation' : 'Remove user'"
      @confirm="remove"
    />

    <Toaster position="bottom-right" />
  </div>
</template>
```
