<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import { useCollection } from '@aziontech/ui/use-collection'

  const workloads = Array.from({ length: 36 }, (_, i) => ({
    id: String(1001 + i),
    name: `workload-${String(i + 1).padStart(2, '0')}`,
    status: ['Active', 'Paused', 'Degraded'][i % 3],
    region: ['us-east', 'us-west', 'eu-west'][i % 3],
    requests: (i * 137) % 1000
  }))

  const properties = [
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Paused' }, { value: 'Degraded' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'us-east' }, { value: 'us-west' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', sortable: true },
    { accessorKey: 'status', header: 'Status', sortable: true },
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'requests', header: 'Requests', sortable: true, align: 'end' }
  ]

  const { paginationProps, propertyFilterProps, tableProps } = useCollection({
    items: workloads,
    columns,
    propertyFiltering: {
      properties,
      defaultQuery: {
        tokens: [],
        operation: 'and',
        groups: [
          {
            operation: 'or',
            tokens: [
              { propertyKey: 'status', operator: '=', value: 'Active' },
              { propertyKey: 'status', operator: '=', value: 'Degraded' }
            ]
          },
          {
            operation: 'or',
            tokens: [
              { propertyKey: 'region', operator: '=', value: 'us-east' },
              { propertyKey: 'region', operator: '=', value: 'eu-west' }
            ]
          }
        ]
      }
    },
    pagination: { pageSize: 10 }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <PropertyFilter
      v-bind="propertyFilterProps"
      grouped
    />
    <DataTable v-bind="tableProps">
      <template #footer>
        <DataTablePagination
          v-bind="paginationProps"
          manual
        />
      </template>
    </DataTable>
  </div>
</template>
