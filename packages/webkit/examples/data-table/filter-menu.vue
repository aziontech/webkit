<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import DataTable from '@aziontech/webkit/data-table'
  import FilterMenu from '@aziontech/webkit/filter-menu'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableFilter from '@aziontech/webkit/table-filter'
  import { ref } from 'vue'

  const rows = [
    { id: '1', name: 'storefront', status: 'Active', region: 'us-east', modified: '2026-11-02' },
    {
      id: '2',
      name: 'image-optimizer',
      status: 'Pending',
      region: 'eu-west',
      modified: '2026-10-21'
    },
    { id: '3', name: 'docs-portal', status: 'Active', region: 'us-west', modified: '2026-09-30' },
    { id: '4', name: 'checkout-api', status: 'Failed', region: 'us-east', modified: '2026-11-09' },
    {
      id: '5',
      name: 'legacy-redirects',
      status: 'Inactive',
      region: 'ap-south',
      modified: '2026-06-14'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false },
    { accessorKey: 'status', header: 'Status', minWidth: 96 },
    { accessorKey: 'region', header: 'Region', minWidth: 96 },
    { accessorKey: 'modified', header: 'Last modified', minWidth: 120 }
  ]

  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Pending', 'Failed', 'Inactive'].map((value) => ({ label: value, value }))
    },
    {
      id: 'region',
      label: 'Region',
      type: 'multi-select',
      options: ['us-east', 'us-west', 'eu-west', 'ap-south'].map((value) => ({
        label: value,
        value
      }))
    },
    { id: 'modified', label: 'Last modified', type: 'date' }
  ]

  const filters = ref([
    { field: 'region', operator: 'in', value: ['us-east', 'us-west'], label: 'Region: us-east +1' }
  ])

  const severityOf = (status) =>
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'neutral'
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :data="rows"
    :columns="columns"
    :filter-fields="filterFields"
    row-key="id"
    aria-label="Workloads"
  >
    <template #title>Workloads</template>
    <template #toolbar>
      <TableFilter />
      <CollectionPreferences :sections="['columns']" />
    </template>
    <template #filters>
      <FilterMenu.ChipGroup />
    </template>
    <template #cell-status="{ value }">
      <TableCellStatus
        :label="value"
        :severity="severityOf(value)"
      />
    </template>
  </DataTable>
</template>
