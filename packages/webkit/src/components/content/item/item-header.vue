<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-header')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-header"
    :data-testid="testId"
    class="flex basis-full items-center justify-between gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
