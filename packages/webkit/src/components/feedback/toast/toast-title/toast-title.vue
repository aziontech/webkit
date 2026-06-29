<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ToastTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__title'
  )
</script>

<template>
  <p
    v-bind="$attrs"
    :data-testid="testId"
    class="text-label-sm text-[var(--text-default)]"
  >
    <slot />
  </p>
</template>
