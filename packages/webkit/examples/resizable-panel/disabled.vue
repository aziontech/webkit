<script setup>
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
</script>

<template>
  <ResizablePanel
    aria-label="Workspace"
    class="h-64"
  >
    <ResizablePanel.Pane aria-label="Document">Document</ResizablePanel.Pane>
    <ResizablePanel.Handle
      aria-label="Resize the panel"
      disabled
    />
    <ResizablePanel.Pane
      :basis="240"
      aria-label="Panel"
      >Fixed while the handle is disabled</ResizablePanel.Pane
    >
  </ResizablePanel>
</template>
