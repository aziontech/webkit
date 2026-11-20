<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import StateErrorPage from '../state-error-page.vue'

  const reload = () => globalThis.location.reload()
</script>

<template>
  <StateErrorPage
    :code="503"
    error-code="MAINTENANCE"
    title="Back soon: scheduled maintenance"
    description="The console is being updated until 15:00 UTC. Your applications keep serving traffic; only the console is paused."
  >
    <template #actions>
      <Button
        label="Retry"
        variant="primary"
        size="medium"
        icon="az az-refresh"
        @click="reload"
      />
      <Button
        label="Status page"
        variant="outline"
        size="medium"
        icon="az az-external-link"
        href="https://status.example.com"
        target="_blank"
      />
    </template>
  </StateErrorPage>
</template>
