<script setup>
  import Resizable from '@aziontech/webkit/resizable'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <Resizable
      orientation="horizontal"
      aria-label="Side by side"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
      <Resizable.Handle aria-label="Resize the preview" />
      <Resizable.Pane
        :basis="200"
        :min="120"
        :max="400"
        aria-label="Preview"
        >Preview</Resizable.Pane
      >
    </Resizable>
    <Resizable
      orientation="vertical"
      aria-label="Stacked"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
      <Resizable.Handle aria-label="Resize the terminal" />
      <Resizable.Pane
        :basis="96"
        :min="48"
        :max="200"
        aria-label="Terminal"
        >Terminal</Resizable.Pane
      >
    </Resizable>
  </div>
</template>
