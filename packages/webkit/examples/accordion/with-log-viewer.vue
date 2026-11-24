<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import LogViewerContent from '@aziontech/webkit/log-viewer-content'
  import LogViewerHeader from '@aziontech/webkit/log-viewer-header'
  import LogViewer from '@aziontech/webkit/log-viewer-root'
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
  <Accordion
    type="single"
    collapsible
    default-value="deploy-482"
    class="w-full max-w-[48rem]"
  >
    <Accordion.Item value="deploy-482">
      <Accordion.Trigger>Deploy #482 — production</Accordion.Trigger>
      <Accordion.Content :padded="false">
        <LogViewer
          :lines="lines"
          v-model:search="search"
          v-model:level="level"
          :bordered="false"
          class="max-h-[420px]"
        >
          <LogViewerHeader />
          <LogViewerContent />
        </LogViewer>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="deploy-481">
      <Accordion.Trigger>Deploy #481 — production</Accordion.Trigger>
      <Accordion.Content>Completed at 12:04. No warnings.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
