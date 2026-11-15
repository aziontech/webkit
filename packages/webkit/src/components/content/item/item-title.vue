<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-title')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-title"
    :data-testid="testId"
    class="flex w-fit items-center gap-(--spacing-xs) text-body-sm text-(--text-default) group-data-[variant=option]/item:text-body-md"
  >
    <slot />
  </div>
</template>
