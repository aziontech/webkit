<script setup>
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <ResizablePanel
      orientation="horizontal"
      aria-label="Side by side"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
      <ResizablePanel.Handle aria-label="Resize the preview" />
      <ResizablePanel.Pane
        :basis="200"
        :min="120"
        :max="400"
        aria-label="Preview"
        >Preview</ResizablePanel.Pane
      >
    </ResizablePanel>
    <ResizablePanel
      orientation="vertical"
      aria-label="Stacked"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
      <ResizablePanel.Handle aria-label="Resize the terminal" />
      <ResizablePanel.Pane
        :basis="96"
        :min="48"
        :max="200"
        aria-label="Terminal"
        >Terminal</ResizablePanel.Pane
      >
    </ResizablePanel>
  </div>
</template>
