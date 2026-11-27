<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import EmptyState from '@aziontech/ui/empty-state'
  import { type TableColumn } from '@aziontech/ui/table'
  import TableCellActions from '@aziontech/ui/table-cell-actions'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import Tag from '@aziontech/ui/tag'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/ui/use-collection'
  import { useLocale } from '@aziontech/ui/use-locale'

  import type {
    CannedResponsesResponse,
    CannedResponsesVisibility
  } from '../settings-canned-responses.vue'

  /** What a row action does to its response. */
  export type CannedResponsesAction = 'edit' | 'duplicate' | 'remove'

  defineProps<{
    tableProps: CollectionTableProps<CannedResponsesResponse, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
    visibilityLabels: Record<CannedResponsesVisibility, string>
  }>()

  const emit = defineEmits<{
    action: [
      event: MouseEvent | KeyboardEvent,
      action: CannedResponsesAction,
      response: CannedResponsesResponse
    ]
    clear: []
  }>()

  const visibilityIcons: Record<CannedResponsesVisibility, string> = {
    personal: 'az az-user',
    team: 'az az-users',
    everyone: 'az az-building'
  }

  const { formatNumber, plural } = useLocale()

  const usesOf = (count: number) => plural(count, { one: '{count} use', other: '{count} uses' })

  const plainText = (line: string) =>
    line
      .replace(/^(?:>|[-*]|\d+\.)\s+/, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\*\*|__|`/g, '')

  const excerpt = (body: string) =>
    plainText(
      body
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(1, 2)
        .join(' ')
    )

  const onSelect = (
    event: MouseEvent | KeyboardEvent,
    value: DropdownMenuItemValue,
    response: CannedResponsesResponse
  ) => {
    if (value === 'edit' || value === 'duplicate' || value === 'remove')
      emit('action', event, value, response)
  }

  const onRowClick = (event: MouseEvent | KeyboardEvent, response: CannedResponsesResponse) => {
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest('a, button, input')) return
    emit('action', event, 'edit', response)
  }
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        v-bind="tableProps"
        :loading="loading"
        sortable
        :bordered="false"
        aria-label="Canned responses"
        @row-click="onRowClick"
        @row-remove="(event, row) => emit('action', event, 'remove', row)"
      >
        <template #cell-title="{ row }">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) sm:max-w-(--container-xs)">
            <span
              dir="auto"
              class="truncate text-label-sm text-(--text-default)"
              >{{ row.title }}</span
            >
            <span
              v-if="excerpt(row.body)"
              dir="auto"
              class="truncate text-body-xs text-(--text-muted)"
              >{{ excerpt(row.body) }}</span
            >
            <div
              aria-hidden="true"
              data-slot="narrow-summary"
              class="flex flex-wrap items-center gap-(--spacing-xs) sm:hidden"
            >
              <Tag
                v-if="row.folder"
                :label="row.folder"
                dir="auto"
                severity="neutral"
                size="small"
              />
              <span class="text-body-xs text-(--text-muted)">
                {{ visibilityLabels[row.visibility] }} · {{ usesOf(row.usageCount) }}
              </span>
            </div>
          </div>
        </template>
        <template #cell-folder="{ row }">
          <Tag
            v-if="row.folder"
            :label="row.folder"
            dir="auto"
            severity="neutral"
            size="small"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >No folder</span
          >
        </template>
        <template #cell-visibility="{ row }">
          <span
            class="inline-flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <i
              :class="visibilityIcons[row.visibility]"
              class="text-(--text-muted)"
              aria-hidden="true"
            />
            {{ visibilityLabels[row.visibility] }}
          </span>
        </template>
        <template #cell-lastUsedAt="{ row }">
          <TableCellTime
            v-if="row.lastUsedAt"
            :value="row.lastUsedAt"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >Never used</span
          >
        </template>
        <template #cell-usageCount="{ row }">
          <span class="text-body-sm text-(--text-default) tabular-nums">{{
            formatNumber(row.usageCount)
          }}</span>
        </template>
        <template #header-actions>
          <span class="sr-only">Actions</span>
        </template>
        <template #cell-actions="{ row }">
          <TableCellActions
            :name="row.title"
            @select="(event, value) => onSelect(event, value, row)"
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
                value="remove"
                label="Delete"
                severity="danger"
              />
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
        <template #empty>
          <EmptyState
            size="small"
            icon="az az-filter-off"
            title="No matching responses"
            description="No canned response matches this search or these filters."
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
