<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import DataTable, { type TableColumn } from '@aziontech/ui/data-table'
  import Link from '@aziontech/ui/link'
  import Tag, { type TagSeverity } from '@aziontech/ui/tag'

  import { sampleSummaryActivity, type SummaryOperation } from '../sample'

  const activity = sampleSummaryActivity

  const activityColumns: TableColumn[] = [
    {
      id: 'date',
      accessorKey: 'date',
      header: 'Date',
      principal: true,
      grow: 1,
      hideable: false
    },
    { id: 'operation', accessorKey: 'operation', header: 'Operation', minWidth: 120 },
    { id: 'type', accessorKey: 'type', header: 'Type' },
    { id: 'resource', accessorKey: 'resource', header: 'Resource' },
    { id: 'email', accessorKey: 'email', header: 'Author email' }
  ]

  const operationSeverity: Record<SummaryOperation, TagSeverity> = {
    Created: 'success',
    Deleted: 'danger',
    Edited: 'neutral'
  }
</script>

<template>
  <section
    aria-labelledby="summary-activity"
    class="flex min-w-0 flex-col gap-(--layout-group-gap)"
  >
    <h2
      id="summary-activity"
      class="text-title-sm text-(--text-default)"
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
          stackable
          :bordered="false"
        >
          <template #cell-date="{ value }">
            <span class="min-w-0 truncate tabular-nums">{{ value }}</span>
          </template>
          <template #cell-operation="{ row }">
            <Tag
              :label="row.operation"
              :severity="operationSeverity[row.operation]"
              size="small"
            />
          </template>
          <template #cell-resource="{ value }">
            <span class="min-w-0 truncate">{{ value }}</span>
          </template>
          <template #cell-email="{ value }">
            <span
              class="min-w-0 truncate"
              dir="ltr"
              >{{ value }}</span
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
