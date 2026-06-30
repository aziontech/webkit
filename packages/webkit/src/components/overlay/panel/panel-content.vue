<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import { DrawerInjectionKey, DrawerPanelScrollInjectionKey } from '../drawer/injection-key'
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
  const drawerCtx = inject(DrawerInjectionKey, null)
  const drawerScrollHost = inject(DrawerPanelScrollInjectionKey, false)

  const scrollAreaClasses = computed(() =>
    cn('min-h-0 min-w-0 flex-1', drawerScrollHost ? (attrs.class as string | undefined) : undefined)
  )

  const contentClasses = computed(() =>
    cn(
      'p-[var(--spacing-lg)]',
      !drawerScrollHost ? 'min-h-0 flex-1 overflow-y-auto' : undefined,
      !drawerScrollHost ? (attrs.class as string | undefined) : undefined
    )
  )

  const scrollTestId = computed(
    () => `${drawerCtx?.testId ?? ctx?.testId ?? 'overlay-panel'}__scroll`
  )
</script>

<template>
  <ScrollArea
    v-if="drawerScrollHost"
    :class="scrollAreaClasses"
    :data-testid="scrollTestId"
  >
    <div
      :class="contentClasses"
      :data-testid="`${ctx?.testId}__content`"
    >
      <slot />
    </div>
  </ScrollArea>
  <div
    v-else
    :class="contentClasses"
    :data-testid="`${ctx?.testId}__content`"
  >
    <slot />
  </div>
</template>
