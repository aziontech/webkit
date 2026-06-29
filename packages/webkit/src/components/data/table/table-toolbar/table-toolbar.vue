<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableToolbar',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__toolbar-actions` : 'data-table__toolbar-actions')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-1 items-center justify-end gap-[var(--spacing-xs)]"
  >
    <slot />
  </div>
</template>
