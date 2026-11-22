<script setup lang="ts">
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { computed } from 'vue'

  import type { SecuritySourceIp } from '../dashboard-security.vue'
  import { ipColumns } from '../security-cards'

  export interface SourceIpSearchProps {
    /** The Top source IPs rows. */
    rows: SecuritySourceIp[]
    /** Writes a request count. */
    formatCount: (value: number) => string
    /** The period is loading. */
    loading: boolean
  }

  const props = defineProps<SourceIpSearchProps>()

  const search = defineModel<string>('search', { default: '' })
  const matchingRows = computed(() =>
    props.rows.filter((row) =>
      matchesText(
        row,
        search.value,
        ipColumns.flatMap((column) => column.accessorKey ?? [])
      )
    )
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="min-w-36 grow basis-(--container-3xs)">
        <Input
          v-model="search"
          size="medium"
          placeholder="Search addresses, networks or attacks"
          aria-label="Search addresses, networks or attacks"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
    </div>
    <DataTable
      :data="matchingRows"
      :columns="ipColumns"
      row-key="id"
      sortable
      density="compact"
      bordered
      :loading="loading"
    >
      <template #empty>
        <EmptyState
          size="small"
          icon="az az-search"
          title="No matching rows"
          description="Change the search."
        />
      </template>
      <template #cell-requests="{ row }">
        <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
      </template>
      <template #footer>
        <DataTablePagination
          :page-size="5"
          :page-size-options="[5, 10, 25]"
        />
      </template>
    </DataTable>
  </div>
</template>
