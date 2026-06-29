<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { PaginatorInjectionKey } from '../injection-key'

  defineOptions({
    name: 'PaginatorInfo',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PaginatorInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__info` : 'data-paginator__info')
  )
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    class="truncate text-label-sm text-[var(--text-muted)]"
  >
    <slot />
  </span>
</template>
