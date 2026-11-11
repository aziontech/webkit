<script setup lang="ts">
  import { useMutationObserver, useResizeObserver } from '@vueuse/core'
  import { computed, inject, ref, useAttrs } from 'vue'

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
      '@container/panel p-(--spacing-lg)',
      !drawerScrollHost
        ? 'min-h-0 flex-1 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'
        : undefined,
      !drawerScrollHost ? (attrs.class as string | undefined) : undefined
    )
  )

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

  const contentRef = ref<HTMLElement | null>(null)
  const needsFocus = ref(false)
  const measure = () => {
    const el = contentRef.value
    needsFocus.value = !!el && el.scrollHeight > el.clientHeight + 1 && !el.querySelector(FOCUSABLE)
  }
  useResizeObserver(contentRef, measure)
  useMutationObserver(contentRef, measure, { childList: true, subtree: true })

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
    ref="contentRef"
    :tabindex="needsFocus ? 0 : undefined"
    :class="contentClasses"
    :data-testid="`${ctx?.testId}__content`"
  >
    <slot />
  </div>
</template>
