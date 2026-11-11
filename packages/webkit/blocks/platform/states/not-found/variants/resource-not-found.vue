<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'

  const resourceId = '4821'
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col">
      <h1 class="sr-only">Error 404</h1>
      <EmptyState
        :title="`Service ${resourceId} not found`"
        description="No service with this ID exists in the account. It may have been deleted, or the link may be out of date."
        icon="pi pi-search"
        bordered
      >
        <template #actions>
          <Button
            label="Back to services"
            kind="primary"
            size="medium"
            href="/services"
          />
        </template>
      </EmptyState>
    </main>
  </div>
</template>
