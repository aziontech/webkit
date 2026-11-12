<script setup>
  import Resizable from '@aziontech/webkit/resizable'
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
    <div class="h-64">
      <Resizable
        class="h-full"
        aria-label="Workspace"
      >
        <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
        <Resizable.Handle aria-label="Resize the preview" />
        <Resizable.Pane
          v-model:collapsed="collapsed"
          :basis="240"
          :min="160"
          collapsible
          aria-label="Preview"
          >Preview</Resizable.Pane
        >
      </Resizable>
    </div>
  </div>
</template>
