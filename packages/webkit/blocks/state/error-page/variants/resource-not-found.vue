<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import ErrorPage from '../error-page.vue'

  const resourceId = '4821'
</script>

<template>
  <ErrorPage
    :code="404"
    error-code="RESOURCE_NOT_FOUND"
    :title="`Service ${resourceId} not found`"
    description="No service with this ID exists in the account. It may have been deleted, or the link may be out of date."
  >
    <template #actions>
      <Button
        label="Back to services"
        variant="primary"
        size="medium"
        icon="az az-arrow-left"
        href="/services"
      />
    </template>
  </ErrorPage>
</template>
