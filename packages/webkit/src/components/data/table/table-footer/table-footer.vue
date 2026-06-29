<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableFooter',
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
      (ctx ? `${ctx.testId}__footer` : 'data-table__footer')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="rowgroup"
    :data-testid="testId"
    class="flex min-w-full flex-col bg-[var(--bg-surface)] text-[var(--text-muted)] border-t-[length:var(--border-width-default)] border-solid border-[var(--border-default)]"
  >
    <slot />
  </div>
</template>
