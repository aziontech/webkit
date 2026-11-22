<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'

  import type { ShellConsoleSwitchAccount } from '../sample'

  /** One row of the account tree, with its depth and its level's look. */
  export interface ShellConsoleAccountRow extends ShellConsoleSwitchAccount {
    /** Nesting depth in the tree. */
    depth: number
    /** The account has child accounts. */
    hasChildren: boolean
    /** Its children are shown. */
    expanded: boolean
    /** The level's name. */
    typeLabel: string
    /** Icon class of the level. */
    typeIcon: string
    /** Tag severity of the level. */
    typeSeverity?: TagSeverity
    /** Tag variant of the level. */
    typeVariant?: TagVariant
  }

  defineProps<{ rows: ShellConsoleAccountRow[]; loading: boolean; currentId: string }>()

  const emit = defineEmits<{
    toggle: [event: MouseEvent, row: ShellConsoleAccountRow]
    choose: [event: MouseEvent, row: ShellConsoleAccountRow]
  }>()

  const accountQuery = defineModel<string>('query', { required: true })

  const accountColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'typeLabel', header: 'Type', minWidth: 140 },
    { accessorKey: 'id', header: 'ID', minWidth: 120 },
    { accessorKey: 'clientId', header: 'Client ID', minWidth: 120 }
  ]
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        :data="rows"
        :columns="accountColumns"
        row-key="id"
        :bordered="false"
        paginated
        :page-size="10"
        :loading="loading"
        aria-label="Accounts"
      >
        <template #cell-name="{ row }">
          <div
            :data-depth="row.depth"
            class="flex w-full min-w-0 items-center gap-(--spacing-2xs) data-[depth=1]:ps-(--spacing-lg) data-[depth=2]:ps-(--spacing-2xl)"
          >
            <IconButton
              v-if="row.hasChildren"
              :icon="row.expanded ? 'az az-chevron-down' : 'az az-chevron-right'"
              variant="ghost"
              size="small"
              :aria-label="row.expanded ? `Collapse ${row.name}` : `Expand ${row.name}`"
              :aria-expanded="row.expanded"
              :disabled="Boolean(accountQuery.trim())"
              @click="(event: MouseEvent) => emit('toggle', event, row)"
            />
            <span
              v-else
              class="size-7 shrink-0"
              aria-hidden="true"
            />
            <i
              :class="row.typeIcon"
              class="shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <Button
              :label="row.name"
              variant="link"
              size="small"
              class="min-w-0"
              :aria-current="row.id === currentId ? 'true' : undefined"
              @click="(event: MouseEvent) => emit('choose', event, row)"
            />
            <Tag
              v-if="row.id === currentId"
              label="Current"
              severity="success"
              size="small"
            />
          </div>
        </template>
        <template #cell-typeLabel="{ row }">
          <TableCellStatus
            :label="row.typeLabel"
            :icon="row.typeIcon"
            :variant="row.typeVariant"
            :severity="row.typeSeverity"
          />
        </template>
        <template #cell-id="{ value }">
          <TableCellId
            :value="value"
            resource="account"
          />
        </template>
        <template #cell-clientId="{ value }">
          <TableCellId
            :value="value"
            resource="client"
          />
        </template>
        <template #empty>
          <EmptyState
            size="small"
            icon="az az-search"
            title="No accounts match your search"
            :description="`Nothing in this tree matches “${accountQuery}”.`"
          >
            <template #actions>
              <Button
                label="Clear search"
                variant="outline"
                size="small"
                @click="accountQuery = ''"
              />
            </template>
          </EmptyState>
        </template>
      </DataTable>
    </template>
  </Card>
</template>
