<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { ref } from 'vue'

  const reference = 'req_7f3c91ab'
  const retrying = ref(false)

  const retry = () => {
    retrying.value = true
    globalThis.location.reload()
  }
</script>

<template>
  <div
    class="flex w-full flex-1 flex-col items-center justify-center px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error 500</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        title="Something went wrong on our side"
        description="This page could not load. Nothing you saved was lost. Try again in a moment; if it keeps failing, check the system status."
        icon="pi pi-exclamation-triangle"
      >
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              label="Try again"
              kind="primary"
              size="medium"
              icon="pi pi-refresh"
              :loading="retrying"
              @click="retry"
            />
            <Button
              label="System status"
              kind="outlined"
              icon="pi pi-external-link"
              size="medium"
              href="https://status.example.com"
              target="_blank"
            />
          </div>
          <p class="m-0 text-body-xs text-(--text-muted)">
            Error reference: <bdi class="font-mono">{{ reference }}</bdi>
          </p>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
