<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table-root'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const workloads = Array.from({ length: 36 }, (_, i) => ({
    id: String(1001 + i),
    name: `workload-${String(i + 1).padStart(2, '0')}`,
    status: ['Active', 'Inactive', 'Degraded'][i % 3],
    region: ['sa-east', 'us-east', 'eu-west'][i % 3],
    requests: (i * 137) % 1000
  }))

  const properties = [
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Inactive' }, { value: 'Degraded' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'requests', header: 'Requests', enableSorting: true, align: 'end' }
  ]

  const { propertyFilterProps, tableProps } = useCollection({
    items: workloads,
    columns,
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <PropertyFilter v-bind="propertyFilterProps" />
    <Table v-bind="tableProps" />
  </div>
</template>
