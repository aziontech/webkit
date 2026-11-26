<script setup>
  import LogViewer from '@aziontech/ui/log-viewer'
  import { ref } from 'vue'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    {
      id: '3',
      time: '13:47:42',
      type: 'folder',
      message: 'dist/index.js',
      folderType: 'asset',
      size: '12.4 kB',
      gzipSize: '4.1 kB'
    },
    {
      id: '4',
      time: '13:47:43',
      type: 'text',
      level: 'warn',
      message: 'Bundle larger than recommended'
    }
  ]
  const search = ref('')
  const level = ref('')
</script>

<template>
  <div class="h-[640px]">
    <LogViewer
      :lines="lines"
      loading
      v-model:search="search"
      v-model:level="level"
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
    </LogViewer>
  </div>
</template>
