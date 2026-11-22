<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import Link from '@aziontech/webkit/link'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'

  import { sampleSummaryActivity, type SummaryOperation } from '../sample'

  const activity = sampleSummaryActivity

  const activityColumns: TableColumn[] = [
    { id: 'date', accessorKey: 'date', header: 'Date', principal: true, hideable: false },
    { id: 'operation', accessorKey: 'operation', header: 'Operation', minWidth: 120 },
    { id: 'type', accessorKey: 'type', header: 'Type' },
    { id: 'resource', accessorKey: 'resource', header: 'Resource', grow: 2 },
    { id: 'email', accessorKey: 'email', header: 'Author email', minWidth: 184 }
  ]

  const operationSeverity: Record<SummaryOperation, TagSeverity | null> = {
    Created: 'success',
    Deleted: 'danger',
    Edited: null
  }
</script>

<template>
  <section
    aria-labelledby="summary-activity"
    class="flex min-w-0 flex-col gap-(--layout-group-gap)"
  >
    <h2
      id="summary-activity"
      class="text-heading-xs text-(--text-default)"
    >
      Recent activity
    </h2>

    <Card :padded="false">
      <template #default>
        <DataTable
          :data="activity"
          :columns="activityColumns"
          row-key="id"
          density="compact"
          :bordered="false"
        >
          <template #cell-date="{ value }">
            <span class="min-w-0 truncate tabular-nums">{{ value }}</span>
          </template>
          <template #cell-operation="{ row }">
            <Tag
              v-if="operationSeverity[row.operation]"
              :label="row.operation"
              :severity="operationSeverity[row.operation] ?? undefined"
              size="small"
            />
            <span
              v-else
              class="text-(--text-default)"
              >{{ row.operation }}</span
            >
          </template>
        </DataTable>
      </template>
      <template #footer>
        <Link
          label="View all activity"
          size="medium"
          href="#"
        />
      </template>
    </Card>
  </section>
</template>
