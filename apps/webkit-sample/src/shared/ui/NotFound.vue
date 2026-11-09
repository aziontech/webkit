<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { useRouter } from 'vue-router'

  import LineFigure from './line-figure/LineFigure.vue'

  defineOptions({ name: 'NotFound' })

  const router = useRouter()

  function goHome(event: MouseEvent) {
    event.preventDefault()
    router.push('/')
  }
</script>

<template>
  <main
    data-testid="shared-not-found"
    class="flex min-h-dvh w-full items-center justify-center bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xl)"
  >
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        title="Page not found"
        description="There is nothing deployed at this address. Check the URL or head back to the start."
      >
        <template #icon>
          <div class="w-64 sm:w-80">
            <LineFigure
              name="azion-404"
              play
            />
          </div>
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              label="Go to home"
              kind="primary"
              size="medium"
              href="/"
              @click="goHome"
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
