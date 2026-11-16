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
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import { sampleTeams } from './sample'

  /** Whether a team grants its permissions. */
  export type TeamPermissionsStatus = 'Active' | 'Inactive'

  /** One team of the account. */
  export interface TeamPermissionsTeam {
    /** Stable key, used in the team's page link. */
    id: string
    /** Display name. */
    name: string
    /** One line under the name. */
    description: string
    /** Permission keys the team grants, such as applications.view. */
    permissions: string[]
    /** How many people belong to the team. */
    members: number
    /** Whether the team grants its permissions. */
    status: TeamPermissionsStatus
  }

  export interface TeamPermissionsProps {
    /** The teams to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    teams?: TeamPermissionsTeam[]
    /** A request is in flight: with no teams it is the first load, with teams a refresh. */
    loading?: boolean
    /** Why the teams could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<TeamPermissionsProps>(), {
    teams: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; team: TeamPermissionsTeam }
    ]
    delete: [event: MouseEvent, team: TeamPermissionsTeam]
  }>()

  type TeamRow = TeamPermissionsTeam & { permissionNames: string[] }

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

  const source = computed<TeamPermissionsTeam[]>(
    () => props.teams ?? (props.loading || props.error ? [] : sampleTeams)
  )
  const items = ref<TeamPermissionsTeam[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const rows = computed<TeamRow[]>(() =>
    items.value.map((team) => ({
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

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      options: [...new Set(rows.value.map((row) => row.status))].sort().map((value) => ({ value }))
    }
  ])

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

  const statusSeverity = (value: TeamPermissionsStatus): TagSeverity =>
    value === 'Active' ? 'success' : 'neutral'

  const loadFailed = computed(() => props.error !== '')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const pending = ref<TeamPermissionsTeam | null>(null)
  const deleteOpen = ref(false)

  const onAction = (event: Event, value: DropdownMenuItemValue, row: TeamRow) => {
    const team = items.value.find((item) => item.id === row.id)
    if (!team) return
    if (value === 'delete') {
      pending.value = team
      deleteOpen.value = true
      return
    }
    emit('row-action', event, { value, team })
  }

  const remove = (event: MouseEvent) => {
    const team = pending.value
    if (!team) return
    items.value = items.value.filter((item) => item.id !== team.id)
    deleteOpen.value = false
    emit('delete', event, team)
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
                @click="emit('refresh', $event)"
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
              :loading="loading"
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
                  @select="(event, value) => onAction(event, value, row)"
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
