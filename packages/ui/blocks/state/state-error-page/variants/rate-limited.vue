<script setup lang="ts">
  import Button from '@aziontech/ui/button'

  import StateErrorPage from '../state-error-page.vue'

  const reload = () => globalThis.location.reload()
</script>

<template>
  <StateErrorPage
    :code="429"
    error-code="RATE_LIMITED"
    title="Too many requests"
    description="This account sent more requests than the limit allows. Wait a moment and try again; nothing was lost."
  >
    <template #actions>
      <Button
        label="Try again"
        variant="secondary"
        size="medium"
        icon="az az-refresh"
        @click="reload"
      />
      <Button
        label="About rate limits"
        aria-label="About rate limits (opens in a new tab)"
        variant="outline"
        size="medium"
        icon="az az-book"
        href="https://example.com/docs/rate-limits"
        target="_blank"
      />
    </template>
  </StateErrorPage>
</template>
