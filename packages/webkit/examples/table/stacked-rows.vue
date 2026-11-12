<script setup>
  import TableRoot from '@aziontech/webkit/table-root'

  const rows = [
    { id: 'r1', name: 'Edge Functions 2.4', area: 'Build', released: 'Jan 14, 2026' },
    { id: 'r2', name: 'Real-Time Events filters', area: 'Observe', released: 'Jan 9, 2026' },
    { id: 'r3', name: 'WAF tuning presets', area: 'Secure', released: 'Dec 18, 2025' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Release', principal: true },
    { accessorKey: 'area', header: 'Area' },
    { accessorKey: 'released', header: 'Released' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <TableRoot
      :data="rows"
      :columns="columns"
      row-key="id"
      stackable
    />
  </div>
</template>
