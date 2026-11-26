<script setup>
  import Resizable from '@aziontech/ui/resizable'
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
      <Resizable.Pane aria-label="Code">
        <div class="h-full p-(--spacing-md)">
          <p class="m-0 text-label-md text-(--text-default)">main.js</p>
          <p class="mt-(--spacing-xs) mb-0 text-body-sm text-(--text-muted)">
            The function that answers every request to acme-store.
          </p>
        </div>
      </Resizable.Pane>
      <Resizable.Handle aria-label="Resize the logs" />
      <Resizable.Pane
        v-model:basis="basis"
        :min="160"
        :max="480"
        aria-label="Logs"
      >
        <div class="h-full p-(--spacing-md)">
          <p class="m-0 text-label-md text-(--text-default)">Logs</p>
          <p class="mt-(--spacing-xs) mb-0 text-body-sm text-(--text-muted)">
            GET /products returned 200 in 12 ms.
          </p>
        </div>
      </Resizable.Pane>
    </Resizable>
  </div>
</template>
