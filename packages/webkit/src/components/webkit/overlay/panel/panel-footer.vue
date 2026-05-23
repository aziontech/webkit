<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
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
      'flex min-h-16 shrink-0 items-center gap-spacing-elements-sm',
      'border-t border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]',
      'px-[var(--spacing-elements-xl)] py-[var(--spacing-elements-md)]',
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
