<script setup>
  import Resizable from '@aziontech/webkit/resizable'
  import { ref } from 'vue'

  const basis = ref(240)
</script>

<template>
  <div class="h-64">
    <Resizable
      class="h-full"
      orientation="horizontal"
      aria-label="Workspace"
    >
      <Resizable.Pane aria-label="Document"
        >Flexible — no basis, so it takes what is left.</Resizable.Pane
      >
      <Resizable.Handle aria-label="Resize the panel" />
      <Resizable.Pane
        v-model:basis="basis"
        :min="160"
        :max="480"
        aria-label="Panel"
        >Sized</Resizable.Pane
      >
    </Resizable>
  </div>
</template>
