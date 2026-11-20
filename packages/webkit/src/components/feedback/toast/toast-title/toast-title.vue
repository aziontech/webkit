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
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'toast-title')
</script>

<template>
  <p
    v-bind="$attrs"
    :data-testid="testId"
    class="text-title-sm text-(--text-default)"
  >
    <slot />
  </p>
</template>
