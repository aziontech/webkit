<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
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

  const rootClasses = computed(() =>
    cn('text-heading-sm text-[var(--text-default)]', attrs.class as string | undefined)
  )
</script>

<template>
  <h2
    :id="ctx?.titleId"
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__title`"
  >
    <slot />
  </h2>
</template>
