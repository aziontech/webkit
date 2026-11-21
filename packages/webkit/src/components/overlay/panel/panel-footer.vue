<script setup lang="ts">
  import { inject, useAttrs } from 'vue'

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

  const ROOT_CLASS =
    'flex min-h-16 shrink-0 items-center gap-(--spacing-sm) border-0 border-t border-t-(length:--border-width-default) border-t-(--border-muted) bg-(--bg-surface) px-(--spacing-lg) ' +
    'py-(--spacing-md) max-sm:flex-wrap max-sm:pb-[max(var(--spacing-md),env(safe-area-inset-bottom))] max-sm:*:flex-1'
</script>

<template>
  <footer
    role="none"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="`${ctx?.testId}__footer`"
  >
    <slot />
  </footer>
</template>
