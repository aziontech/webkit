<script setup>
  import UploadProgress from '@aziontech/ui/upload-progress'
  import { ref } from 'vue'

  const open = ref(false)

  const items = [
    { id: 'a', name: 'reports/2026-10.csv', size: 18_200, status: 'success' },
    { id: 'b', name: 'reports/2026-11.csv', size: 19_400, status: 'running', progress: 40 },
    { id: 'c', name: 'reports/summary.pdf', size: 402_000, status: 'pending' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <UploadProgress
      v-model:open="open"
      :items="items"
      operation="move"
      :floating="false"
    />
  </div>
</template>
