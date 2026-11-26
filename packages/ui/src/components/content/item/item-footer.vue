<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-footer')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-footer"
    :data-testid="testId"
    class="flex basis-full items-center justify-between gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
