<script setup>
  import LogViewer from '@aziontech/ui/log-viewer'
</script>

<template>
  <div class="h-[320px]">
    <LogViewer
      :lines="[]"
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
    </LogViewer>
  </div>
</template>
