<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type TableColumn } from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
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
  const onRowOpen = (event: MouseEvent | KeyboardEvent, user: UsersUser) => {
    if (event instanceof KeyboardEvent) onAction(event, 'view', user)
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
