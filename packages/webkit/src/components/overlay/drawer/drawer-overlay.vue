<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DrawerInjectionKey, DrawerMotionInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerOverlay',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const motionCtx = inject(DrawerMotionInjectionKey)
  const motionState = computed(() => motionCtx?.motionState.value ?? 'closed')

  const handleClick = () => {
    if (!ctx?.dismissible) return
    ctx.close()
  }
</script>

<template>
  <div
    :class="
      cn(
        'fixed inset-0 z-1000 bg-(--bg-backdrop) opacity-0 data-[state=open]:opacity-100 transition-opacity duration-slow-01 ease-productive-entrance data-[state=closed]:duration-slow-02 data-[state=closed]:ease-productive-exit motion-reduce:transition-none',
        attrs.class as string | undefined
      )
    "
    :data-state="motionState"
    :data-testid="`${ctx?.testId}__backdrop`"
    aria-hidden="true"
    @click="handleClick"
  />
</template>
