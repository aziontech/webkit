<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLogViewContext } from './composables/use-log-view-context'

  defineOptions({
    name: 'LogViewFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useLogViewContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__footer`
  )
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
