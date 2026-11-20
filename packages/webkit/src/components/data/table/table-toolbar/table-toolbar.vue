<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'TableToolbar',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-toolbar'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
