<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLogViewerContext } from './composables/use-log-viewer-context'

  defineOptions({
    name: 'LogViewerFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  useLogViewerContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'log-viewer-footer')
</script>

<template>
  <footer
    v-bind="attrs"
    :data-testid="testId"
    class="text-label-sm flex shrink-0 flex-col items-stretch gap-(--spacing-md) border-t border-(--border-muted) bg-(--bg-surface) p-(--spacing-md) sm:flex-row sm:flex-wrap sm:items-center"
  >
    <slot />
  </footer>
</template>
