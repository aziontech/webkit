<script setup>
  import Button from '@aziontech/webkit/button'
  import TableRoot from '@aziontech/webkit/table-root'

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 }
  ]
</script>

<template>
  <TableRoot
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
          kind="secondary"
          size="small"
          icon="pi pi-refresh"
        />
      </div>
    </template>
  </TableRoot>
</template>
