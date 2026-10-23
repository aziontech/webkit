<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import Table from '@aziontech/webkit/table'

  defineProps({
    /** Rows of { name, tailwind, css, raw }; any other fields reach the `sample` slot. */
    rows: {
      type: Array,
      default: () => []
    }
  })

  const columns = [
    { accessorKey: 'name', header: 'Sample', principal: true },
    { accessorKey: 'tailwind', header: 'Tailwind', minWidth: 200 },
    { accessorKey: 'css', header: 'CSS', minWidth: 200 },
    { accessorKey: 'raw', header: 'Raw', minWidth: 120 },
    { id: 'copy', header: 'Copy', kind: 'action' }
  ]
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    border
  >
    <template #header-copy>
      <span class="sr-only">Copy</span>
    </template>
    <template #cell-name="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-md) py-(--spacing-xs)">
        <slot
          name="sample"
          :row="row"
        />
      </span>
    </template>
    <template #cell-tailwind="{ value }">
      <code class="font-code text-body-sm text-(--text-default)">{{ value }}</code>
    </template>
    <template #cell-css="{ value }">
      <code class="font-code text-body-sm text-(--text-muted)">{{ value }}</code>
    </template>
    <template #cell-raw="{ value }">
      <code class="font-code text-body-xs text-(--text-muted)">{{ value }}</code>
    </template>
    <template #cell-copy="{ row }">
      <CopyButton
        :value="row.tailwind"
        :aria-label="`Copy ${row.tailwind}`"
      />
    </template>
  </Table>
</template>
