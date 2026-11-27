<script setup lang="ts">
  import { useMutationObserver, useResizeObserver } from '@vueuse/core'
  import { computed, inject, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import { DrawerPanelScrollInjectionKey } from '../drawer/injection-key'

  defineOptions({
    name: 'PanelBody',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const drawerScrollHost = inject(DrawerPanelScrollInjectionKey, false)

  const CONTENT_CLASS =
    '@container/panel min-h-24 p-(--spacing-lg) text-body-sm text-(--text-default)'

  const SCROLL_CONTENT_CLASS =
    CONTENT_CLASS +
    ' flex-1 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

  const contentEl = ref<HTMLElement | null>(null)
  const needsFocus = ref(false)
  const measure = () => {
    const el = contentEl.value
    needsFocus.value = !!el && el.scrollHeight > el.clientHeight + 1 && !el.querySelector(FOCUSABLE)
  }
  useResizeObserver(contentEl, measure)
  useMutationObserver(contentEl, measure, { childList: true, subtree: true })

  const testId = computed(() => String(attrs['data-testid'] ?? 'panel-body'))
</script>

<template>
  <ScrollArea
    v-if="drawerScrollHost"
    :class="cn('min-h-0 min-w-0 flex-1', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <div
      :class="CONTENT_CLASS"
      :data-testid="`${testId}__content`"
    >
      <slot />
    </div>
  </ScrollArea>
  <div
    v-else
    ref="contentEl"
    :tabindex="needsFocus ? 0 : undefined"
    :class="cn(SCROLL_CONTENT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
