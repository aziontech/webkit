<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'AppHeaderEnd',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-end')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex shrink-0 items-center justify-end gap-(--spacing-sm)"
  >
    <slot />
  </div>
</template>
