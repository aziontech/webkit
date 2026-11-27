<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-content')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-content"
    :data-testid="testId"
    class="flex w-full min-w-0 flex-1 flex-col [&+[data-slot=item-content]]:w-auto [&+[data-slot=item-content]]:flex-none"
  >
    <slot />
  </div>
</template>
