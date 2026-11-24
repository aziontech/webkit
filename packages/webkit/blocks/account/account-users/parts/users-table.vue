<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/webkit/use-collection'
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
