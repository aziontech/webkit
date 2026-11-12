<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Table from '@aziontech/webkit/table'
  import type { TableColumn } from '@aziontech/webkit/table-root'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
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
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'permissionNames', header: 'Permissions', grow: 2 },
    { accessorKey: 'members', header: 'Members', enableSorting: true, minWidth: 100 },
    { accessorKey: 'status', header: 'Status', minWidth: 110 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const { filterProps, tableProps, status, clearFilters } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'description', 'status'] },
    pagination: { pageSize: 10 }
  })

  const statusSeverity = (value: TeamStatus): TagSeverity =>
    value === 'Active' ? 'success' : 'secondary'

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

  const onAction = (value: string | number, row: TeamRow) => {
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
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/teams"
            target="_blank"
          />
          <Button
            label="Create Team"
            icon="pi pi-plus"
            kind="primary"
            size="large"
            href="/account/teams/new"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed && (loading || status !== 'empty')"
          class="flex items-center gap-(--layout-group-gap)"
        >
          <div class="min-w-0 grow">
            <Input
              v-bind="filterProps"
              placeholder="Search teams"
              aria-label="Search teams"
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
        </header>

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          The teams could not be loaded. Nothing was changed; try again.
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
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #content>
            <EmptyState
              size="medium"
              icon="pi pi-users"
              title="No teams yet"
              description="Create a team for each role in your organisation, then add people to it."
            >
              <template #actions>
                <Button
                  label="Create Team"
                  icon="pi pi-plus"
                  kind="secondary"
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
          <template #content>
            <Table
              v-bind="tableProps"
              :loading="loading || refreshing"
              enable-sorting
              :bordered="false"
              aria-label="Teams"
            >
              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :label="row.name"
                    size="small"
                    kind="square"
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
                    <DropdownMenu.Option
                      value="edit"
                      label="Edit"
                    />
                    <DropdownMenu.Option
                      value="duplicate"
                      label="Duplicate"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="delete"
                      label="Delete"
                    />
                  </DropdownMenu.Group>
                </Table.CellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-search"
                  title="No matching teams"
                  description="No team matches this search."
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
      @confirm="remove"
    />

    <Toaster position="bottom-right" />
  </div>
</template>
