<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import type { QueryEditorRow, QueryEditorTable } from '../types'

  export interface TableDataViewProps {
    /** The table whose rows the view shows. */
    table: QueryEditorTable
    /** The rows are loading: the table shows its loading state. */
    loading?: boolean
    /** Why the rows could not load; a danger alert with Retry replaces them. */
    error?: string
  }

  const props = withDefaults(defineProps<TableDataViewProps>(), { loading: false, error: '' })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'insert-row': [event: MouseEvent, table: QueryEditorTable]
    'import-csv': [event: Event, table: QueryEditorTable]
    'delete-row': [event: MouseEvent, row: QueryEditorRow]
    'delete-selected': []
  }>()

  /** The selected rows, by row key. */
  const selectedKeys = defineModel<string[]>('selectedKeys', { required: true })

  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (props.table?.columns ?? []).map((column) => column.name)
    return names.length ? `Filter by ${names.slice(0, 3).join(', ')}` : 'Filter rows'
  })
  const tableRows = computed(() => props.table?.rows ?? [])
  const filteredRows = computed(() => {
    const term = rowFilter.value.trim().toLowerCase()
    if (!term) return tableRows.value
    return tableRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) =>
          String(value ?? '')
            .toLowerCase()
            .includes(term)
        )
    )
  })
  const dataColumns = computed<TableColumn[]>(() => [
    ...(props.table?.columns ?? []).map((column) => ({
      accessorKey: column.name,
      id: column.name,
      header: column.name,
      sortable: true,
      minWidth: 160
    })),
    { id: '__actions', type: 'action', hideable: false }
  ])
  const isNull = (value: unknown) => value === null || value === undefined || value === ''
  const displayCell = (value: unknown) => (isNull(value) ? 'NULL' : String(value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
    >
      <div class="flex min-w-0 flex-1 md:max-w-(--container-lg)">
        <Input
          v-model="rowFilter"
          size="medium"
          class="w-full"
          :placeholder="filterPlaceholder"
          aria-label="Filter rows"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <div class="ms-auto flex items-center gap-(--spacing-xs)">
        <Button
          label="Sort"
          variant="outline"
          size="medium"
          icon="az az-sort"
        />
        <Tooltip content="Refresh">
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </Tooltip>
        <Button
          label="Insert"
          variant="primary"
          size="medium"
          icon="az az-plus"
          @click="(event: MouseEvent) => emit('insert-row', event, table)"
        />
      </div>
    </div>

    <div
      v-if="selectedKeys.length && !error"
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-default)">{{ selectedKeys.length }} selected</span>
      <Button
        label="Clear selection"
        variant="ghost"
        size="small"
        @click="selectedKeys = []"
      />
      <div class="ms-auto flex items-center gap-(--spacing-xs)">
        <Button
          :label="`Delete ${selectedKeys.length} ${selectedKeys.length === 1 ? 'row' : 'rows'}`"
          variant="outline"
          size="small"
          icon="az az-trash"
          @click="emit('delete-selected')"
        />
      </div>
    </div>
    <div
      v-if="error"
      class="p-(--spacing-md)"
    >
      <Alert
        severity="danger"
        :label="error"
        action-label="Retry"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
    </div>
    <div
      v-else
      class="min-h-0 flex-1 overflow-auto"
    >
      <DataTable
        v-model:selected-keys="selectedKeys"
        :data="filteredRows"
        :columns="dataColumns"
        row-key="__k"
        selectable
        sortable
        paginated
        :page-size="25"
        :page-size-options="[25, 50, 100]"
        density="compact"
        :loading="loading"
        :bordered="false"
        :aria-label="`Rows of ${table.name}`"
      >
        <template
          v-for="column in table.columns"
          :key="column.id"
          #[`header-${column.name}`]
        >
          <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
            <span class="truncate">{{ column.name }}</span>
            <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
            <i
              v-if="column.primaryKey"
              class="az az-key shrink-0 text-(--primary)"
              role="img"
              aria-label="Primary key"
            />
          </span>
        </template>
        <template
          v-for="column in table.columns"
          :key="column.id"
          #[`cell-${column.name}`]="{ value }"
        >
          <span
            :data-null="isNull(value) || null"
            class="truncate font-code text-label-code-sm text-(--text-default) data-null:italic data-null:text-(--text-muted)"
            >{{ displayCell(value) }}</span
          >
        </template>
        <template #cell-__actions="{ row }">
          <Tooltip :content="`Delete row ${row['id'] ?? row.__k}`">
            <IconButton
              icon="az az-trash"
              variant="ghost"
              size="small"
              :aria-label="`Delete row ${row['id'] ?? row.__k}`"
              @click="(event: MouseEvent) => emit('delete-row', event, row)"
            />
          </Tooltip>
        </template>
        <template #empty>
          <EmptyState
            key="empty-state-1"
            v-if="!tableRows.length"
            size="small"
            @dragover.prevent
            @drop.prevent="(event: DragEvent) => emit('import-csv', event, table)"
            icon="az az-table"
            title="This table is empty"
            description="Insert a row, import a CSV file or drop one here."
          >
            <template #actions>
              <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                <Button
                  label="Insert row"
                  variant="secondary"
                  size="medium"
                  icon="az az-plus"
                  @click="(event: MouseEvent) => emit('insert-row', event, table)"
                />
                <Button
                  label="Import data from CSV"
                  variant="outline"
                  size="medium"
                  icon="az az-upload"
                  @click="(event: MouseEvent) => emit('import-csv', event, table)"
                />
              </div>
            </template>
          </EmptyState>
          <EmptyState
            key="empty-state-2"
            v-else
            size="small"
            icon="az az-search"
            :title="`No rows match “${rowFilter}”`"
            description="Change the filter to see the rows."
          >
            <template #actions>
              <Button
                label="Clear filter"
                variant="outline"
                size="small"
                @click="rowFilter = ''"
              />
            </template>
          </EmptyState>
        </template>
      </DataTable>
    </div>
  </div>
</template>
