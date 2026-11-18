<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { ref } from 'vue'

  import ErrorPage from '../error-page.vue'

  const retrying = ref(false)

  const retry = () => {
    retrying.value = true
    globalThis.location.reload()
  }
</script>

<template>
  <ErrorPage
    :code="500"
    error-code="INTERNAL_ERROR"
    title="Something went wrong on our side"
    description="This page could not load. Nothing you saved was lost. Retry in a moment; if it keeps failing, check the system status."
  >
    <template #actions>
      <Button
        label="Retry"
        variant="primary"
        size="medium"
        icon="az az-refresh"
        :loading="retrying"
        @click="retry"
      />
      <Button
        label="System status"
        variant="outline"
        icon="az az-external-link"
        size="medium"
        href="https://status.example.com"
        target="_blank"
      />
    </template>
  </ErrorPage>
</template>
