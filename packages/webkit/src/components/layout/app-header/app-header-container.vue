<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'AppHeaderContainer',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'app-header-container'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 shrink-0 items-center gap-(--spacing-md)"
  >
    <slot />
  </div>
</template>
