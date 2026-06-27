<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ToastDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__description'
  )
</script>

<template>
  <p
    v-bind="$attrs"
    :data-testid="testId"
    class="text-body-xs text-[var(--text-muted)]"
  >
    <slot />
  </p>
</template>
