<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { PanelInjectionKey } from './injection-key'

  defineOptions({
    name: 'PanelHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PanelInjectionKey)

  const rootClasses = computed(() =>
    cn(
      'flex min-h-14 shrink-0 items-center justify-between gap-spacing-elements-xs',
      'border-b border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]',
      'pl-[var(--spacing-elements-xl)] pr-[var(--spacing-elements-md)] py-[var(--spacing-elements-md)]',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <header
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__header`"
  >
    <slot />
  </header>
</template>
