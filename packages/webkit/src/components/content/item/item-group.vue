<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-item-group'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="list"
    data-slot="item-group"
    :data-testid="testId"
    class="group/item-group flex flex-col"
  >
    <slot />
  </div>
</template>
