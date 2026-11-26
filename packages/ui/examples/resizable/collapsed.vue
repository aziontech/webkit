<script setup>
  import Button from '@aziontech/webkit/button'
  import Resizable from '@aziontech/webkit/resizable'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Button
      class="self-start"
      :label="`${open ? 'Hide' : 'Show'} the preview`"
      variant="outline"
      size="medium"
      @click="open = !open"
    />
    <div class="h-64">
      <Resizable
        class="h-full"
        aria-label="Workspace"
      >
        <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
        <Resizable.Handle aria-label="Resize the preview" />
        <Resizable.Pane
          v-model:open="open"
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
