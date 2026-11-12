<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { PaginationInjectionKey } from '../injection-key'

  defineOptions({
    name: 'PaginationInfo',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PaginationInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__info` : 'data-pagination__info')
  )
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    class="truncate text-body-xs text-(--text-muted)"
  >
    <slot />
  </span>
</template>
