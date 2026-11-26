<script setup>
  import Resizable from '@aziontech/ui/resizable'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <div class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <Resizable
        orientation="horizontal"
        aria-label="Side by side"
        class="h-full"
      >
        <Resizable.Pane aria-label="Editor">
          <p class="p-(--spacing-sm)">Editor</p>
        </Resizable.Pane>
        <Resizable.Handle aria-label="Resize the preview" />
        <Resizable.Pane
          :basis="200"
          :min="120"
          :max="400"
          aria-label="Preview"
        >
          <p class="p-(--spacing-sm)">Preview</p>
        </Resizable.Pane>
      </Resizable>
    </div>
    <div class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <Resizable
        orientation="vertical"
        aria-label="Stacked"
        class="h-full"
      >
        <Resizable.Pane aria-label="Editor">
          <p class="p-(--spacing-sm)">Editor</p>
        </Resizable.Pane>
        <Resizable.Handle aria-label="Resize the terminal" />
        <Resizable.Pane
          :basis="96"
          :min="48"
          :max="200"
          aria-label="Terminal"
        >
          <p class="p-(--spacing-sm)">Terminal</p>
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
