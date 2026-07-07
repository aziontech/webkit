<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { cn } from '../../../utils/cn'
  import { useOverlayMobile } from '../composables/use-overlay-mobile'
  import Panel from '../panel/panel.vue'
  import { dialogPanelSizeClasses } from '../panel/presets/sizes'
  import {
    dialogPanelPositionClasses,
    dialogPanelShapeClasses,
    dialogShellPositionClasses
  } from '../presets/mobile-position'
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
  const isScrollLocked = useScrollLock(document.body)

  watch(
    isOpen,
    (open) => {
      isScrollLocked.value = open
    },
    { immediate: true }
  )
  useFocusTrap(contentRef, isOpen)

  useEventListener(document, 'keydown', (event) => {
    if (!isOpen.value || event.key !== 'Escape') return
    if (!ctx?.closable) return
    event.preventDefault()
    ctx.close()
  })

  watch(isOpen, async (open, wasOpen) => {
    if (open || !wasOpen || !ctx) return
    await nextTick()
    ctx.triggerRef.value?.focus()
  })

  const shellClasses = computed(() =>
    cn(
      'fixed inset-0 z-[1001] flex',
      dialogShellPositionClasses,
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
      dialogPanelPositionClasses,
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
        :class="dialogPanelShapeClasses"
        :data-testid="`${ctx?.testId}__panel-shell`"
      >
        <slot />
      </Panel>
    </div>
  </div>
</template>
