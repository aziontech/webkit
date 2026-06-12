<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { PanelInjectionKey } from './injection-key'

  defineOptions({
    name: 'PanelFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PanelInjectionKey)

  const rootClasses = computed(() =>
    cn(
      'flex min-h-16 shrink-0 items-center gap-[var(--spacing-sm)]',
      'border-0 border-t border-t-[length:var(--border-width-default)] border-t-[var(--border-muted)] bg-[var(--bg-surface)]',
      'px-[var(--spacing-lg)] py-[var(--spacing-md)]',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <footer
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__footer`"
  >
    <slot />
  </footer>
</template>
