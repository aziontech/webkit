<script setup>
  import FileTokenGroup from '@aziontech/ui/file-token-group'

  const items = [
    { file: { name: 'invoice-2026-10.pdf', size: 184_000, type: 'application/pdf' } },
    { file: { name: 'usage-2026-10.csv', size: 52_000, type: 'text/csv' } }
  ]
</script>

<template>
  <FileTokenGroup
    class="w-full max-w-(--container-xs)"
    :items="items"
    readonly
    aria-label="Attached files"
  />
</template>
