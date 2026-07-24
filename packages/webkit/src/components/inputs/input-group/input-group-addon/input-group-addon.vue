<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'InputGroupAddon', inheritAttrs: false })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group-addon')
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    class="flex items-center self-stretch shrink-0 bg-[var(--bg-canvas)] text-label-sm text-[color:var(--text-muted)] px-[var(--spacing-md)] [[data-size=small]_&]:px-[var(--spacing-sm)] [[data-size=large]_&]:px-[var(--spacing-md)]"
  >
    <slot />
  </span>
</template>
