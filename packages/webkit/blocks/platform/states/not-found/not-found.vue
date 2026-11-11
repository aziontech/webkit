<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Error404 from '@aziontech/webkit/svg/error-404'
</script>

<template>
  <main
    class="flex min-h-dvh w-full flex-col items-center justify-center bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error 404</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        title="Page not found"
        description="There is nothing deployed at this address. Check the URL or head back to the start."
      >
        <template #icon>
          <Error404 class="h-auto w-48 sm:w-64" />
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
              label="Docs"
              kind="outlined"
              icon="pi pi-book"
              size="medium"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
          </div>
        </template>
      </EmptyState>
    </div>
  </main>
</template>
