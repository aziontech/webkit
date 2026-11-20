<script setup>
  import DataGrid from '@aziontech/webkit/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: '1', path: '/assets/logo.svg', size: 4096, cached: true },
    { id: '2', path: '/index.html', size: 18230, cached: false },
    { id: '3', path: '/app.js', size: 254880, cached: true }
  ])

  const columns = [
    { id: 'path', header: 'Path', width: 220 },
    { id: 'size', header: 'Size (bytes)', type: 'number', align: 'end', width: 140 },
    { id: 'cached', header: 'Cached', type: 'boolean', width: 120 }
  ]
</script>

<template>
  <DataGrid
    v-model="rows"
    :columns="columns"
    aria-label="Objects"
    readonly
  />
</template>
