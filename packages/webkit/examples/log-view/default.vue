<script setup>
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogViewHeader from '@aziontech/webkit/log-view-header'
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
    { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
  ]
  const search = ref('')
  const warningsOnly = ref(false)
</script>

<template>
  <div class="h-[640px]">
    <LogView
      :lines="lines"
      v-model:search="search"
      v-model:warnings-only="warningsOnly"
      class="h-full"
    >
      <LogViewHeader />
      <LogViewContent />
    </LogView>
  </div>
</template>
