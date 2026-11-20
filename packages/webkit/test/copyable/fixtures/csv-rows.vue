<script setup lang="ts">
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'

  interface Domain {
    id: string
    name: string
    hits: number
  }

  const domains: readonly Domain[] = [{ id: 'd1', name: 'storefront', hits: 3 }]
  const columns = [
    { id: 'name', header: 'Name' },
    { id: 'hits', header: 'Hits' }
  ] as const satisfies readonly CsvColumn[]

  const exportDomains = (): void => downloadCsv('domains.csv', toCsv({ columns, rows: domains }))
  // @ts-expect-error rows are objects, not strings
  const broken = toCsv({ columns, rows: ['storefront'] })
</script>

<template>
  <button
    type="button"
    :data-csv="broken"
    @click="exportDomains"
  >
    Export
  </button>
</template>
