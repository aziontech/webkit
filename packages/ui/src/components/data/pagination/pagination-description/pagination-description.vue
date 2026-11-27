<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'PaginationDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pagination-description'
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
