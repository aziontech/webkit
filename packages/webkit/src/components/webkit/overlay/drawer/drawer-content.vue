<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../../composables/use-focus-trap'
  import { cn } from '../../../../utils/cn'
  import Panel from '../panel/panel.vue'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
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

  const isLeft = computed(() => ctx?.side === 'left')

  const shellClasses = computed(() =>
    cn(
      'fixed inset-y-0 z-[1001] flex p-0',
      isLeft.value ? 'left-0 justify-start' : 'right-0 justify-end',
      'pointer-events-none motion-reduce:transition-none',
      attrs.class as string | undefined
    )
  )

  const panelClasses = computed(() =>
    cn(
      'pointer-events-auto h-full max-h-none w-full',
      'transition-transform duration-[220ms] ease-in-out motion-reduce:transition-none motion-reduce:transform-none',
      isLeft.value
        ? 'rounded-r-[var(--shape-card)] rounded-l-[var(--shape-flat)] data-[state=closed]:-translate-x-full'
        : 'rounded-l-[var(--shape-card)] rounded-r-[var(--shape-flat)] data-[state=closed]:translate-x-full',
      'data-[state=open]:translate-x-0'
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
      :class="panelClasses"
      :data-state="isOpen ? 'open' : 'closed'"
      :data-testid="`${ctx?.testId}__panel-shell`"
      :size="ctx?.size ?? 'medium'"
    >
      <slot />
    </Panel>
  </div>
</template>
