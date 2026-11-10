<script setup>
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import { ref } from 'vue'

  const collapsed = ref(true)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <button
      type="button"
      @click="collapsed = !collapsed"
    >
      {{ collapsed ? 'Show' : 'Hide' }} the preview
    </button>
    <ResizablePanel
      aria-label="Workspace"
      class="h-64"
    >
      <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
      <ResizablePanel.Handle aria-label="Resize the preview" />
      <ResizablePanel.Pane
        v-model:collapsed="collapsed"
        :basis="240"
        :min="160"
        collapsible
        aria-label="Preview"
        >Preview</ResizablePanel.Pane
      >
    </ResizablePanel>
  </div>
</template>
