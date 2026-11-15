<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { PanelHeaderEndInjectionKey, PanelInjectionKey } from './injection-key'

  defineOptions({
    name: 'PanelHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PanelInjectionKey)
  const headerEnd = inject(PanelHeaderEndInjectionKey, null)
  const endComponent = computed(() =>
    headerEnd && headerEnd.panelTestId === ctx?.testId ? headerEnd.component.value : null
  )

  const ROOT_CLASS =
    'flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-0 border-b border-b-(length:--border-width-default) border-b-(--border-muted) bg-(--bg-surface) ps-(--spacing-lg) pe-(--spacing-md) py-(--spacing-md)'
</script>

<template>
  <header
    role="none"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="`${ctx?.testId}__header`"
  >
    <template v-if="endComponent">
      <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
        <slot />
      </div>
      <component :is="endComponent" />
    </template>
    <slot v-else />
  </header>
</template>
