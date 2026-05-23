<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableActions',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__actions`
  )
</script>

<template>
  <div
    v-bind="attrs"
    class="flex items-center gap-spacing-elements-xs"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
