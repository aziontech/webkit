<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)
  const testId = computed(() => String(attrs['data-testid'] ?? 'dialog-title'))
</script>

<template>
  <h2
    :id="ctx?.titleId"
    :class="cn('text-title-lg text-(--text-default)', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </h2>
</template>
