<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuEmpty',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__empty`
  )
</script>

<template>
  <div
    v-show="!ctx.hasVisibleItems.value"
    v-bind="attrs"
    :data-testid="testId"
    class="p-[var(--spacing-sm)] text-label-sm text-[var(--text-muted)]"
  >
    <slot>No results found.</slot>
  </div>
</template>
