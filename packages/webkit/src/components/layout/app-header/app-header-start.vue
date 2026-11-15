<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'AppHeaderStart',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-start')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 shrink items-center justify-end gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
