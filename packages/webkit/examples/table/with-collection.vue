<script setup>
  import Input from '@aziontech/webkit/input'
  import Table from '@aziontech/webkit/table'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const all = Array.from({ length: 87 }, (_, i) => ({
    id: String(i + 1),
    name: `domain-${String(i + 1).padStart(2, '0')}.example.com`,
    status: i % 4 ? 'Active' : 'Inactive'
  }))

  const fetchDomains = async ({ filteringText, sort, page, pageSize, signal }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (signal.aborted) return { items: [], total: 0 }
    const needle = filteringText.toLowerCase()
    const matching = all.filter((row) => row.name.includes(needle))
    const sorted = sort[0]?.desc ? [...matching].reverse() : matching
    return { items: sorted.slice((page - 1) * pageSize, page * pageSize), total: matching.length }
  }

  const columns = [
    { accessorKey: 'name', header: 'Domain', enableSorting: true },
    { accessorKey: 'status', header: 'Status' }
  ]

  const { filterProps, tableProps } = useCollection({
    fetch: fetchDomains,
    columns,
    pagination: { pageSize: 10 },
    selection: {}
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Input
      v-bind="filterProps"
      placeholder="Search domains"
      aria-label="Search domains"
    />
    <Table v-bind="tableProps" />
  </div>
</template>
