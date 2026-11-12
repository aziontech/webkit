<script setup>
  import Table from '@aziontech/webkit/table'
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
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'secondary'
</script>

<template>
  <Table
    v-model:filters="filters"
    :data="rows"
    :columns="columns"
    :filter-fields="filterFields"
    row-key="id"
    aria-label="Workloads"
  >
    <template #title>Workloads</template>
    <template #toolbar>
      <Table.Filter />
    </template>
    <template #filters>
      <Table.AppliedFilters />
    </template>
    <template #cell-status="{ value }">
      <Table.CellStatus
        :label="value"
        :severity="severityOf(value)"
      />
    </template>
  </Table>
</template>
