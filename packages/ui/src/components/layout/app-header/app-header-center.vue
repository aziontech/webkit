<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'AppHeaderCenter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-center')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-0 min-w-0 flex-1 items-center justify-center"
  >
    <slot />
  </div>
</template>
