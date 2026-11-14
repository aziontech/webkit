<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
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
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
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
  const roleSeverity = (value: UserRole): TagSeverity =>
    (({ Owner: 'highlight', Admin: 'info', Developer: 'secondary', Viewer: 'secondary' }) as const)[
      value
    ] ?? 'secondary'

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

  const INVITE_ON_START = true
  const EDIT_ROLE_ON_START = ''
  const users = ref<User[]>(seedUsers)
  const loading = ref(false)
  const loadFailed = ref(false)

  const displayName = (user: User): string => user.name || user.email
  const statusSeverity = (value: UserStatus): TagSeverity =>
    (({ Active: 'success', Invited: 'warning', Inactive: 'secondary' }) as const)[value] ??
    'secondary'

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'email', header: 'Email', grow: 2, minWidth: 220 },
    { accessorKey: 'role', header: 'Role', enableSorting: true, minWidth: 120 },
    { accessorKey: 'teams', header: 'Teams', grow: 2, minWidth: 220 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 110 },
    { accessorKey: 'lastActive', header: 'Last active', minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
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

  const usersTable = ref<TableExposed<User> | null>(null)
  const exportCsv = () => usersTable.value?.exportCsv({ filename: 'users.csv' })

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
              text="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-refresh"
                kind="outlined"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="refresh"
              />
            </Tooltip>
            <Tooltip
              text="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-download"
                kind="outlined"
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
              ref="usersTable"
              v-bind="tableProps"
              :loading="loading || refreshing"
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
                  :severity="roleSeverity(value)"
                  size="small"
                />
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
                  icon="pi pi-search"
                  title="No matching users"
                  description="No user matches these filters."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
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
    </div>

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

    <Dialog
      v-model:open="profileOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <Avatar
                :label="pending ? displayName(pending) : ''"
                size="medium"
                kind="square"
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
                    :severity="roleSeverity(pending.role)"
                    size="small"
                  />
                </KeyValuePairs.Item>
                <KeyValuePairs.Item label="Teams">{{
                  teamsLabel(pending.teams)
                }}</KeyValuePairs.Item>
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
                kind="outlined"
                size="medium"
                @click="profileOpen = false"
              />
              <Button
                v-if="pending && !pending.owner"
                label="Edit role"
                kind="primary"
                size="medium"
                @click="openRole(pending)"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <Dialog
      v-model:open="roleOpen"
      size="small"
    >
      <DialogPortal>
        <DialogOverlay />
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
                  kind="outlined"
                  size="medium"
                  @click="roleOpen = false"
                />
                <Button
                  type="submit"
                  label="Save role"
                  kind="primary"
                  size="medium"
                />
              </div>
            </PanelFooter>
          </form>
        </DialogContent>
      </DialogPortal>
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
      @confirm="remove"
    />
  </div>
</template>
