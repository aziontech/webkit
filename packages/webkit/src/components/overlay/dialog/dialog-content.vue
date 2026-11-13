<script setup lang="ts">
  import { defaultDocument, useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { cn } from '../../../utils/cn'
  import { useOverlayMobile } from '../composables/use-overlay-mobile'
  import Panel from '../panel/panel.vue'
  import { dialogPanelSizeClasses } from '../panel/presets/sizes'
  import { DialogInjectionKey, DialogMotionInjectionKey } from './injection-key'
  import {
    dialogPanelTransitionClasses,
    getDialogResponsiveTransitionStyle
  } from './presets/transitions'

  defineOptions({
    name: 'DialogContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)
  const contentRef = ref<HTMLElement | null>(null)
  const isOpen = computed(() => ctx?.isOpen.value ?? false)
  const motionCtx = inject(DialogMotionInjectionKey)
  const motionState = computed(() => motionCtx?.motionState.value ?? 'closed')
  const isMobileOverlay = useOverlayMobile()
  const isScrollLocked = useScrollLock(defaultDocument?.body)

  watch(
    isOpen,
    (open) => {
      isScrollLocked.value = open
    },
    { immediate: true }
  )
  useFocusTrap(contentRef, isOpen)

  useEventListener(defaultDocument, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape' || event.defaultPrevented) return
    if (!ctx?.dismissible) return
    event.preventDefault()
    ctx.close()
  })

  watch(isOpen, async (open, wasOpen) => {
    if (open || !wasOpen || !ctx) return
    await nextTick()
    const target = ctx.triggerRef.value ?? ctx.returnFocusRef.value
    if (target?.isConnected) target.focus()
  })

  const shellClasses = computed(() =>
    cn(
      'fixed inset-0 z-1001 flex',
      'max-md:items-end max-md:justify-center max-md:p-0',
      'md:items-center md:justify-center md:p-(--spacing-md)',
      'pointer-events-none',
      attrs.class as string | undefined
    )
  )

  const panelMotionStyle = computed(() =>
    getDialogResponsiveTransitionStyle(motionState.value, 'panel', isMobileOverlay.value)
  )

  const panelMotionClasses = computed(() =>
    cn(
      'pointer-events-auto mx-auto w-full',
      dialogPanelSizeClasses[ctx?.size ?? 'medium'],
      'max-md:w-full',
      dialogPanelTransitionClasses
    )
  )
</script>

<template>
  <div
    ref="contentRef"
    :class="shellClasses"
    role="dialog"
    :aria-modal="true"
    :aria-labelledby="ctx?.titleId"
    :aria-describedby="ctx?.descriptionId"
    :data-testid="`${ctx?.testId}__panel`"
    tabindex="-1"
  >
    <div
      :class="panelMotionClasses"
      :style="panelMotionStyle"
      :data-state="motionState"
    >
      <Panel
        :size="ctx?.size ?? 'medium'"
        size-at-md
        class="max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card) max-md:w-full max-md:h-fit max-h-[80dvh] max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0"
        :data-testid="`${ctx?.testId}__panel-shell`"
      >
        <slot />
      </Panel>
    </div>
  </div>
</template>
