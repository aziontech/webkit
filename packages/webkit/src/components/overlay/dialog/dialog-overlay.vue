<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useOverlayMobile } from '../composables/use-overlay-mobile'
  import { DialogInjectionKey, DialogMotionInjectionKey } from './injection-key'
  import {
    dialogOverlayTransitionClasses,
    getDialogResponsiveTransitionStyle
  } from './presets/transitions'

  defineOptions({
    name: 'DialogOverlay',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)
  const motionCtx = inject(DialogMotionInjectionKey)
  const motionState = computed(() => motionCtx?.motionState.value ?? 'closed')
  const isMobileOverlay = useOverlayMobile()

  const handleClick = () => {
    if (!ctx?.closable) return
    ctx.close()
  }

  const overlayTransitionStyle = computed(() =>
    getDialogResponsiveTransitionStyle(motionState.value, 'overlay', isMobileOverlay.value)
  )

  const rootClasses = computed(() =>
    cn(
      'fixed inset-0 z-[1000] bg-[var(--bg-backdrop)]',
      dialogOverlayTransitionClasses,
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    :class="rootClasses"
    :style="overlayTransitionStyle"
    :data-state="motionState"
    :data-testid="`${ctx?.testId}__backdrop`"
    aria-hidden="true"
    @click="handleClick"
  />
</template>
