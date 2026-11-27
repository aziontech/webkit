<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemActions',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-actions')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-actions"
    :data-testid="testId"
    class="flex w-fit shrink-0 items-center gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
