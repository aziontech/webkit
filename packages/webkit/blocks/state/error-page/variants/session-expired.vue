<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import ErrorPage from '../error-page.vue'
</script>

<template>
  <ErrorPage
    :code="401"
    error-code="SESSION_EXPIRED"
    title="Your session expired"
    description="For your security you were signed out after 12 hours. Sign in again to go back to this page."
  >
    <template #actions>
      <Button
        label="Sign in"
        variant="primary"
        size="medium"
        icon="az az-log-in"
        href="/sign-in"
      />
    </template>
  </ErrorPage>
</template>
