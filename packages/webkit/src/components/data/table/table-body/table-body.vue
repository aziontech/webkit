<script setup lang="ts">
  import { computed, inject, provide, useAttrs } from 'vue'

  import { TableInjectionKey, TableRowGroupKey } from '../injection-key'

  defineOptions({
    name: 'TableBody',
    inheritAttrs: false
  })

  provide(TableRowGroupKey, { hoverable: true })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__body` : 'data-table__body')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="rowgroup"
    :data-testid="testId"
    class="flex w-full flex-col [&>[role=row]:last-child]:border-b-0"
  >
    <slot />
  </div>
</template>
