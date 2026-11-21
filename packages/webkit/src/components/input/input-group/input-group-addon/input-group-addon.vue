<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'InputGroupAddon', inheritAttrs: false })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group-addon')

  const ROOT_CLASS =
    'flex items-center self-stretch shrink-0 bg-(--bg-canvas) text-label-sm text-(color:--text-muted) px-(--spacing-md) ' +
    '[[data-size=small]_&]:px-(--spacing-sm) [[data-size=large]_&]:px-(--spacing-md)'
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :class="ROOT_CLASS"
  >
    <slot />
  </span>
</template>
