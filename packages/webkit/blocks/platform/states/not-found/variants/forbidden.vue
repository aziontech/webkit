<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Error403 from '@aziontech/webkit/svg/error-403'
</script>

<template>
  <main
    class="flex min-h-dvh w-full flex-col items-center justify-center bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error 403</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        title="You don't have access to this page"
        description="Your role in this account does not include this page. Ask an account admin for access, or switch to an account that has it."
      >
        <template #icon>
          <Error403 class="h-auto w-48 sm:w-64" />
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              label="Go to home"
              kind="primary"
              size="medium"
              href="/"
            />
            <Button
              label="Switch account"
              kind="outlined"
              icon="pi pi-sync"
              size="medium"
            />
          </div>
        </template>
      </EmptyState>
    </div>
  </main>
</template>
