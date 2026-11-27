<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { TableRowGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableBody',
    inheritAttrs: false
  })

  provide(TableRowGroupInjectionKey, { hoverable: true })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-body'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="rowgroup"
    :data-testid="testId"
    class="flex w-full flex-col [&>[role=row]:last-child]:border-b-0 [&>[role=row]:last-child]:before:hidden"
  >
    <slot />
  </div>
</template>
