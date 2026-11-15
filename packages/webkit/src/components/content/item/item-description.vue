<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-description')
</script>

<template>
  <p
    v-bind="$attrs"
    data-slot="item-description"
    :data-testid="testId"
    class="line-clamp-2 text-balance text-body-sm text-(--text-muted)"
  >
    <slot />
  </p>
</template>
