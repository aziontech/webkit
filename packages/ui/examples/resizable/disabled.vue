<script setup>
  import Resizable from '@aziontech/webkit/resizable'
</script>

<template>
  <div class="h-64">
    <Resizable
      class="h-full"
      aria-label="Workspace"
    >
      <Resizable.Pane aria-label="Document">Document</Resizable.Pane>
      <Resizable.Handle
        aria-label="Resize the panel"
        disabled
      />
      <Resizable.Pane
        :basis="240"
        aria-label="Panel"
        >Fixed while the handle is disabled</Resizable.Pane
      >
    </Resizable>
  </div>
</template>
