<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import { ref } from 'vue'

  import StateErrorPage from '../state-error-page.vue'

  const retrying = ref(false)

  const retry = () => {
    retrying.value = true
    globalThis.location.reload()
  }
</script>

<template>
  <StateErrorPage
    :code="500"
    error-code="INTERNAL_ERROR"
    title="Something went wrong on our side"
    description="This page could not load. Nothing you saved was lost. Retry in a moment; if it keeps failing, check the system status."
  >
    <template #actions>
      <Button
        label="Retry"
        variant="secondary"
        size="medium"
        icon="az az-refresh"
        :loading="retrying"
        @click="retry"
      />
      <Button
        label="System status"
        aria-label="System status (opens in a new tab)"
        variant="outline"
        icon="az az-external-link"
        size="medium"
        href="https://status.example.com"
        target="_blank"
      />
    </template>
  </StateErrorPage>
</template>
