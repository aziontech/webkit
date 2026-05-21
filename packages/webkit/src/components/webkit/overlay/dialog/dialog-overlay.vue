<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogOverlay',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)

  const handleClick = () => {
    if (!ctx?.closeable) return
    ctx.close()
  }

  const rootClasses = computed(() =>
    cn(
      'fixed inset-0 z-[1000] bg-[var(--bg-mask)]',
      'animate-fade-in motion-reduce:animate-none',
      'data-[state=closed]:animate-fade-out',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    :class="rootClasses"
    :data-state="ctx?.isOpen.value ? 'open' : 'closed'"
    :data-testid="`${ctx?.testId}__backdrop`"
    aria-hidden="true"
    @click="handleClick"
  />
</template>
