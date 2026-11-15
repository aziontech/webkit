<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
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
        description="This page could not load. Nothing you saved was lost. Retry in a moment; if it keeps failing, check the system status."
        icon="ai ai-exclamation-triangle"
      >
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              label="Retry"
              kind="primary"
              size="medium"
              icon="ai ai-refresh"
              :loading="retrying"
              @click="retry"
            />
            <Button
              label="System status"
              kind="outlined"
              icon="ai ai-external-link"
              size="medium"
              href="https://status.example.com"
              target="_blank"
            />
          </div>
          <p
            class="m-0 flex items-center justify-center gap-(--spacing-xxs) text-body-xs text-(--text-muted)"
          >
            Error reference:
            <bdi class="text-label-code-sm text-(--text-default)">{{ reference }}</bdi>
            <CopyButton
              :value="reference"
              aria-label="Copy the error reference"
              copied-label="Error reference copied"
              size="small"
            />
          </p>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
