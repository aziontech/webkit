<script setup>
  import Button from '@aziontech/ui/button'
  import DataTable from '@aziontech/ui/data-table'

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 }
  ]
</script>

<template>
  <DataTable
    :data="[]"
    :columns="columns"
    row-key="id"
    error="The workloads service did not answer. Check your connection and try again."
    bordered
  >
    <template #error="{ message }">
      <div class="flex flex-col items-center gap-(--spacing-sm) p-(--spacing-lg) text-center">
        <p class="text-body-sm text-(--text-default)">Could not load the workloads</p>
        <p class="text-body-sm text-(--text-muted)">{{ message }}</p>
        <Button
          label="Try again"
          variant="secondary"
          size="small"
          icon="az az-refresh"
        />
      </div>
    </template>
  </DataTable>
</template>
