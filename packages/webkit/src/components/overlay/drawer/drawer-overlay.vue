<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DrawerInjectionKey, DrawerMotionInjectionKey } from './injection-key'
  import { drawerOverlayTransitionClasses, getDrawerTransitionStyle } from './presets/transitions'

  defineOptions({
    name: 'DrawerOverlay',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const motionCtx = inject(DrawerMotionInjectionKey)
  const motionState = computed(() => motionCtx?.motionState.value ?? 'closed')

  const handleClick = () => {
    if (!ctx?.closable) return
    ctx.close()
  }

  const overlayTransitionStyle = computed(() =>
    getDrawerTransitionStyle(motionState.value, 'overlay')
  )

  const rootClasses = computed(() =>
    cn(
      'fixed inset-0 z-[1000] bg-[var(--bg-backdrop)]',
      drawerOverlayTransitionClasses,
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
