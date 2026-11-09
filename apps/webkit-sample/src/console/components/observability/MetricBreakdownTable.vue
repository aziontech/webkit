<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import { computed, ref } from 'vue'

  interface BreakdownField {
    id: string
    header: string
    align?: 'start' | 'center' | 'end'
    format?: (value: number) => string
  }

  interface ResolvedBreakdown {
    id: string
    label: string
    search: string
    fields: BreakdownField[]
    rows: Record<string, unknown>[]
    groups?: string[]
    groupOf?: (row: Record<string, unknown>) => string
    format: (value: number) => string
    emptyTitle?: string
    emptyDescription?: string
  }

  interface Props {
    report: ResolvedBreakdown
    pageSize?: number
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    pageSize: 5,
    loading: false
  })

  const ALL = 'all'

  const group = ref(ALL)
  const search = ref('')

  const groupOptions = computed(() =>
    props.report.groups?.length
      ? [
          { label: 'All', value: ALL },
          ...props.report.groups.map((value) => ({ label: value, value }))
        ]
      : []
  )

  const rows = computed(() =>
    group.value === ALL || !props.report.groupOf
      ? props.report.rows
      : props.report.rows.filter((row) => props.report.groupOf(row) === group.value)
  )

  const formattedFields = computed(() =>
    props.report.fields.filter((field) => field.format || field.id === 'requests')
  )

  const formatCell = (field: BreakdownField, value: unknown) =>
    (field.format ?? props.report.format)(Number(value))

  const columns = computed(() =>
    props.report.fields.map((field, index) => ({
      id: field.id,
      accessorKey: field.id,
      header: field.header,
      align: field.align ?? 'start',
      enableSorting: true,
      principal: index === 0
    }))
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="min-w-36 grow basis-(--container-3xs)">
        <InputText
          v-model="search"
          size="medium"
          :placeholder="report.search"
          :aria-label="report.search"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </div>
      <SegmentedButton
        v-if="groupOptions.length"
        v-model="group"
        :options="groupOptions"
        size="medium"
        :aria-label="`Filter ${report.label.toLowerCase()} by status class`"
      />
    </div>

    <TableRoot
      v-model:global-filter="search"
      :data="rows"
      :columns="columns"
      row-key="id"
      enable-sorting
      paginated
      :page-size="pageSize"
      :rows-per-page-options="[5, 10, 25]"
      header-kind="compact"
      border
      :loading="loading"
    >
      <template #empty>
        <EmptyState
          v-if="!report.rows.length"
          size="small"
          icon="pi pi-chart-line"
          :title="report.emptyTitle ?? 'No data available'"
          :description="report.emptyDescription ?? 'Nothing was recorded in this period.'"
        />
        <EmptyState
          v-else
          size="small"
          icon="pi pi-search"
          title="No matching rows"
          :description="
            groupOptions.length ? 'Change the search or the status class.' : 'Change the search.'
          "
        />
      </template>

      <template
        v-for="field in formattedFields"
        :key="field.id"
        #[`cell-${field.id}`]="{ row }"
      >
        <span class="tabular-nums">{{ formatCell(field, row[field.id]) }}</span>
      </template>
    </TableRoot>
  </div>
</template>
