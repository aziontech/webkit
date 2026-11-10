<script setup>
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import { ref } from 'vue'

  const basis = ref(240)
</script>

<template>
  <ResizablePanel
    orientation="horizontal"
    aria-label="Workspace"
    class="h-64"
  >
    <ResizablePanel.Pane aria-label="Document"
      >Flexible — no basis, so it takes what is left.</ResizablePanel.Pane
    >
    <ResizablePanel.Handle aria-label="Resize the panel" />
    <ResizablePanel.Pane
      v-model:basis="basis"
      :min="160"
      :max="480"
      aria-label="Panel"
      >Sized</ResizablePanel.Pane
    >
  </ResizablePanel>
</template>
