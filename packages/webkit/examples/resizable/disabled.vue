<script setup>
  import Resizable from '@aziontech/webkit/resizable'
</script>

<template>
  <Resizable
    aria-label="Workspace"
    class="h-64"
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
</template>
