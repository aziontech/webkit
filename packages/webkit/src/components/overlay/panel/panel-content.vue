<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { PanelInjectionKey } from './injection-key'

  defineOptions({
    name: 'PanelContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PanelInjectionKey)

  const rootClasses = computed(() =>
    cn('min-h-0 flex-1 overflow-y-auto p-spacing-elements-xl', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__content`"
  >
    <slot />
  </div>
</template>
