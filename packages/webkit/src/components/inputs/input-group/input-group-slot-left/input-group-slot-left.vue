<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'InputGroupSlotLeft', inheritAttrs: false })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-group-slot-left'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex items-center self-stretch shrink-0 bg-[var(--bg-canvas)] px-[var(--spacing-md)] text-label-sm text-[color:var(--text-muted)] border-r border-[color:var(--border-default)]"
  >
    <slot />
  </div>
</template>
