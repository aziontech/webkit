<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DialogInjectionKey, DialogMotionInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogOverlay',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)
  const motionCtx = inject(DialogMotionInjectionKey)
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
        'fixed inset-0 z-1000 bg-(--bg-backdrop) opacity-0 data-[state=open]:opacity-100 transition-opacity motion-reduce:transition-none max-md:duration-slow-01 max-md:ease-productive-entrance max-md:data-[state=closed]:duration-slow-02 max-md:data-[state=closed]:ease-productive-exit md:duration-moderate-01 md:ease-productive-entrance md:data-[state=closed]:ease-productive-exit',
        attrs.class as string | undefined
      )
    "
    :data-state="motionState"
    :data-testid="`${ctx?.testId}__backdrop`"
    aria-hidden="true"
    @click="handleClick"
  />
</template>
