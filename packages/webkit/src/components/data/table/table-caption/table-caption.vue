<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCaption',
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
      (ctx ? `${ctx.testId}__caption` : 'data-table__caption')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="caption"
    :data-testid="testId"
    class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-label-sm text-[var(--text-muted)]"
  >
    <slot />
  </div>
</template>
