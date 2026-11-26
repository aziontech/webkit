<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Progress from '@aziontech/webkit/progress'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { BreakdownDashboardContributor } from '../dashboard-breakdown.vue'

  export interface ContributorsTableProps {
    /** The resources that cost the most this month. */
    contributors: BreakdownDashboardContributor[]
    /** The rows are loading. */
    loading: boolean
  }

  defineProps<ContributorsTableProps>()

  const contributorColumns: TableColumn[] = [
    {
      accessorKey: 'rank',
      header: 'Rank',
      align: 'start',
      sortable: true,
      minWidth: 64
    },
    {
      accessorKey: 'name',
      header: 'Name',
      align: 'start',
      sortable: true,
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      align: 'end',
      sortable: true,
      minWidth: 104
    },
    {
      accessorKey: 'share',
      header: 'Share of total',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      accessorKey: 'change',
      header: 'Change',
      align: 'end',
      sortable: true,
      minWidth: 104
    }
  ]

  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const formatters = {
    amount: (value: number) =>
      formatNumber(value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    share: (value: number) => `${fixed(value, 1)}%`,
    change: (value: number) => `${value > 0 ? '+' : ''}${fixed(value, 1)}%`
  }
</script>

<template>
  <DataTable
    :data="contributors"
    :columns="contributorColumns"
    row-key="id"
    sortable
    density="compact"
    stackable
    bordered
    :loading="loading"
  >
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-chart-bar"
        title="No spend in this range"
        description="Nothing was billed to the organization in the selected period."
      />
    </template>

    <template #cell-rank="{ row }">
      <span class="tabular-nums text-(--text-muted)">{{ row.rank }}</span>
    </template>

    <template #cell-name="{ row }">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <i
          :class="row.icon"
          class="shrink-0 text-body-lg text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate">{{ row.name }}</span>
      </div>
    </template>

    <template #cell-category="{ row }">
      <Tag
        :label="row.category"
        severity="neutral"
        size="small"
      />
    </template>

    <template #cell-amount="{ row }">
      <span class="tabular-nums">{{ formatters.amount(row.amount) }}</span>
    </template>

    <template #cell-share="{ row }">
      <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
        <div class="w-16 shrink-0">
          <Progress
            :value="row.share"
            size="small"
            :aria-label="row.name + ' share of total'"
          />
        </div>
        <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
      </div>
    </template>

    <template #cell-change="{ row }">
      <Tag
        :label="formatters.change(row.change)"
        :severity="row.change > 0 ? 'danger' : row.change < 0 ? 'success' : 'neutral'"
        :icon="
          row.change > 0
            ? 'az az-arrow-up-right'
            : row.change < 0
              ? 'az az-arrow-down-right'
              : 'az az-minus'
        "
        size="small"
      />
    </template>
  </DataTable>
</template>
