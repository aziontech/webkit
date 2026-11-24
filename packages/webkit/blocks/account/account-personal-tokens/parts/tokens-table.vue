<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import type { PersonalTokensToken } from '../account-personal-tokens.vue'

  /** One row of the tokens table. */
  export type PersonalTokensRow = PersonalTokensToken & { status: string; expires: string }

  defineProps<{
    tableProps: CollectionTableProps<PersonalTokensRow, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
    statusOf: (token: PersonalTokensToken) => { label: string; severity: TagSeverity }
  }>()

  const emit = defineEmits<{
    action: [value: DropdownMenuItemValue, row: PersonalTokensRow]
    clear: []
  }>()

  const removalOf = (row: PersonalTokensRow): DropdownMenuItemValue =>
    !row.revoked && row.status !== 'Expired' ? 'revoke' : 'delete'

  const tokensTableEl = ref<TableExposed<PersonalTokensRow> | null>(null)

  defineExpose({
    exportCsv: () => tokensTableEl.value?.exportCsv({ filename: 'personal-tokens.csv' })
  })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        ref="tokensTableEl"
        v-bind="tableProps"
        :loading="loading"
        sortable
        :bordered="false"
        aria-label="Personal tokens"
        @row-remove="(_event, row) => emit('action', removalOf(row), row)"
      >
        <template #cell-name="{ row, value }">
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-label-sm text-(--text-default)">{{ value }}</span>
            <div
              aria-hidden="true"
              data-slot="narrow-summary"
              class="mt-(--spacing-2xs) w-fit sm:hidden"
            >
              <TableCellStatus
                :label="row.status"
                :severity="statusOf(row).severity"
              />
            </div>
          </div>
        </template>
        <template #cell-description="{ value }">
          <span
            v-if="value"
            class="truncate text-body-sm text-(--text-muted)"
            >{{ value }}</span
          >
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >No description</span
          >
        </template>
        <template #cell-status="{ row }">
          <TableCellStatus
            :label="row.status"
            :severity="statusOf(row).severity"
          />
        </template>
        <template #cell-expires="{ row, value }">
          <span
            class="text-body-sm text-(--text-default) data-[ended]:text-(--text-muted)"
            :data-ended="row.revoked || row.status === 'Expired' || null"
            >{{ value }}</span
          >
        </template>
        <template #cell-lastUsedAt="{ value }">
          <TableCellTime
            v-if="value"
            :value="value"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >Never used</span
          >
        </template>
        <template #cell-createdAt="{ row }">
          <TableCellTime
            :value="row.createdAt"
            :author="row.createdBy"
          />
        </template>
        <template #header-actions>
          <span class="sr-only">Actions</span>
        </template>
        <template #cell-actions="{ row }">
          <TableCellActions
            :name="row.name"
            @select="(_event, value) => emit('action', value, row)"
          >
            <DropdownMenu.Group
              key="dropdown-menu.group-1"
              v-if="!row.revoked && row.status !== 'Expired'"
            >
              <DropdownMenu.Item
                value="revoke"
                label="Revoke"
              />
            </DropdownMenu.Group>
            <DropdownMenu.Group
              key="dropdown-menu.group-2"
              v-else
            >
              <DropdownMenu.Item
                value="delete"
                label="Delete"
              />
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
        <template #empty>
          <EmptyState
            size="small"
            icon="az az-search"
            title="No matching tokens"
            description="No token matches these filters."
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
