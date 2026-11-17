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
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

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

  const teamLabel = (value: string): string =>
    teamOptions.value.find((team) => team.value === value)?.label ?? value
  const teamsLabel = (values: string[]): string =>
    values.length ? values.map(teamLabel).join(', ') : 'No team (no access)'

  const ROLES: { value: Exclude<UsersRole, 'Owner'>; hint: string }[] = [
    { value: 'Admin', hint: 'Manages people, teams, billing and every account setting.' },
    { value: 'Developer', hint: 'Works on the resources their teams reach; no account settings.' },
    { value: 'Viewer', hint: 'Reads the resources their teams reach; changes nothing.' }
  ]
  const roleSeverity = (value: UsersRole): TagSeverity | undefined =>
    value === 'Owner'
      ? undefined
      : (({ Admin: 'info', Developer: 'neutral', Viewer: 'neutral' } as const)[value] ?? 'neutral')
  const roleVariant = (value: UsersRole): TagVariant | undefined =>
    value === 'Owner' ? 'highlight' : undefined

  const displayName = (user: UsersUser): string => user.name || user.email
  const statusSeverity = (value: UsersStatus): TagSeverity =>
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
    [...new Set(source.value.map((user) => user[key]))].sort().map((value) => ({ value }))

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', options: optionsOf('role') },
    { key: 'status', label: 'Status', options: optionsOf('status') }
  ])

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items,
      columns,
      filtering: { fields: ['name', 'email', 'role', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'account-users' }
    })

  const usersTableEl = ref<TableExposed<UsersUser> | null>(null)
  const exportCsv = () => usersTableEl.value?.exportCsv({ filename: 'users.csv' })

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
  const roleHint = computed(() => ROLES.find((role) => role.value === nextRole.value)?.hint ?? '')
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
  const invite = reactive({ email: '', teams: ['developers'] })
  const submitted = ref(false)
  const formEl = ref<HTMLFormElement | null>(null)
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = computed<{ email?: string; teams?: string }>(() => {
    if (!submitted.value) return {}
    const email = invite.email.trim().toLowerCase()
    const out: { email?: string; teams?: string } = {}
    if (!email) out.email = 'Enter the email address to invite.'
    else if (!EMAIL.test(email)) out.email = 'Enter an email address like name@example.com.'
    else if (items.value.some((user) => user.email === email))
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
  const sendInvite = (event: Event) => {
    submitted.value = true
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    const email = invite.email.trim().toLowerCase()
    const teams = [...invite.teams]
    items.value = [
      ...items.value,
      {
        id: `u-${items.value.length + 1}-${email}`,
        name: '',
        email,
        owner: false,
        role: 'Developer',
        teams,
        status: 'Invited',
        lastActive: null
      }
    ]
    inviteOpen.value = false
    emit('invite', event, { email, teams })
    toast.success(`Invitation sent to ${email}.`, {
      description: `They join ${teamsLabel(teams)} when they accept. The link expires in 7 days.`
    })
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
            size="large"
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

        <Card
          v-else
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="usersTableEl"
              v-bind="tableProps"
              :loading="loading"
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
                  @select="(event, value) => onAction(event, value, row)"
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
                      @click="clearFilters"
                    />
                  </template>
                </EmptyState>
              </template>
            </DataTable>
          </template>
        </Card>

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

    <Drawer
      v-model:open="inviteOpen"
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
                @click="inviteOpen = false"
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
              <KeyValueList.Item label="Teams">{{ teamsLabel(pending.teams) }}</KeyValueList.Item>
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
                      v-for="role in ROLES"
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
