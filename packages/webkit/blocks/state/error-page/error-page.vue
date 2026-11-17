<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import LineFigure from '@aziontech/webkit/line-figure'

  export interface ErrorPageProps {
    /** What happened, in the user's words. */
    title?: string
    /** Why it may have happened and what to do next. */
    description?: string
    /** Where Go to home goes. */
    homeHref?: string
    /** Where Docs goes; it opens in a new tab. */
    docsHref?: string
  }

  withDefaults(defineProps<ErrorPageProps>(), {
    title: 'Page not found',
    description:
      'There is nothing deployed at this address. Check the URL or head back to the start.',
    homeHref: '/',
    docsHref: 'https://example.com/docs'
  })

  const emit = defineEmits<{
    home: [event: MouseEvent]
  }>()
</script>

<template>
  <div
    class="flex w-full flex-1 flex-col items-center justify-center px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error 404</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        :title="title"
        :description="description"
      >
        <template #icon>
          <div class="w-(--container-3xs) sm:w-(--container-2xs)">
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
              variant="primary"
              size="medium"
              :href="homeHref"
              @click="(event: MouseEvent) => emit('home', event)"
            />
            <Button
              label="Docs"
              variant="outline"
              icon="az az-book"
              size="medium"
              :href="docsHref"
              target="_blank"
            />
          </div>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
