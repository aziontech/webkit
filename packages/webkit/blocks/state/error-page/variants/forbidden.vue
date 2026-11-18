<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import ErrorPage from '../error-page.vue'
</script>

<template>
  <ErrorPage
    :code="403"
    error-code="FORBIDDEN"
    title="You don't have access to this page"
    description="Your role in this account does not include this page. Ask an account admin for access, or switch to an account that has it."
  >
    <template #actions>
      <Button
        label="Request access"
        variant="primary"
        size="medium"
        icon="az az-mail"
      />
      <Button
        label="Switch account"
        variant="outline"
        size="medium"
        icon="az az-users"
      />
    </template>
  </ErrorPage>
</template>
