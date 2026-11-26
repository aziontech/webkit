<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import TableFilter from '@aziontech/ui/table-filter'
  import { ref } from 'vue'

  const rows = [
    { id: '1', name: 'storefront', status: 'Active', protocol: 'HTTPS' },
    { id: '2', name: 'image-optimizer', status: 'Pending', protocol: 'HTTP & HTTPS' },
    { id: '3', name: 'docs-portal', status: 'Active', protocol: 'HTTPS' },
    { id: '4', name: 'checkout-api', status: 'Failed', protocol: 'HTTPS' },
    { id: '5', name: 'legacy-redirects', status: 'Inactive', protocol: 'HTTP' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'status', header: 'Status', minWidth: 96 },
    { accessorKey: 'protocol', header: 'Protocol', minWidth: 120 }
  ]

  const filterFields = [
    { id: 'name', label: 'Name', type: 'text' },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Pending', 'Failed', 'Inactive'].map((value) => ({ label: value, value }))
    },
    { id: 'protocol', label: 'Protocol', type: 'text' }
  ]

  const filters = ref([{ field: 'status', operator: 'eq', value: 'Active' }])

  const severityOf = (status) =>
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'neutral'
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    aria-label="Workloads"
  >
    <template #title>Workloads</template>
    <template #toolbar>
      <TableFilter
        v-model="filters"
        :fields="filterFields"
        type="property"
        title="Filter workloads"
      />
    </template>
    <template #cell-status="{ value }">
      <TableCellStatus
        :label="value"
        :severity="severityOf(value)"
      />
    </template>
  </DataTable>
</template>
