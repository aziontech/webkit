<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../../composables/use-focus-trap'
  import { cn } from '../../../../utils/cn'
  import Panel from '../panel/panel.vue'
  import { DialogInjectionKey } from './injection-key'

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

  useScrollLock(document.body, isOpen)
  useFocusTrap(contentRef, isOpen)

  useEventListener(document, 'keydown', (event) => {
    if (!isOpen.value || event.key !== 'Escape') return
    if (!ctx?.closeable) return
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
      'fixed inset-0 z-[1001] flex items-center justify-center p-[var(--spacing-4)]',
      'pointer-events-none motion-reduce:transition-none',
      attrs.class as string | undefined
    )
  )

  const panelClasses = computed(() =>
    cn(
      'pointer-events-auto w-full',
      'animate-fade-in motion-reduce:animate-none',
      'data-[state=closed]:animate-fade-out'
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
    :data-state="isOpen ? 'open' : 'closed'"
    :data-testid="`${ctx?.testId}__panel`"
    tabindex="-1"
  >
    <Panel
      :size="ctx?.size ?? 'medium'"
      :class="panelClasses"
      :data-state="isOpen ? 'open' : 'closed'"
      :data-testid="`${ctx?.testId}__panel-shell`"
    >
      <slot />
    </Panel>
  </div>
</template>
