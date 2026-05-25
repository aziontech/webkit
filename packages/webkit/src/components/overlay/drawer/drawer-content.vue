<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { cn } from '../../../utils/cn'
  import Panel from '../panel/panel.vue'
  import {
    drawerPanelPositionClasses,
    drawerShellPositionClasses
  } from '../presets/mobile-position'
  import { useDrawerMotionState } from './composables/use-drawer-motion-state'
  import { DrawerInjectionKey } from './injection-key'
  import { drawerSizeClasses } from './presets/sizes'
  import {
    drawerPanelStateClasses,
    drawerPanelTransitionClasses,
    getDrawerTransitionStyle
  } from './presets/transitions'

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
  const { motionState } = useDrawerMotionState(isOpen)

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
  const sideKey = computed(() => (isLeft.value ? 'left' : 'right'))
  const drawerSize = computed(() => ctx?.size ?? 'medium')

  const shellClasses = computed(() =>
    cn(
      'fixed z-[1001] flex p-0',
      drawerShellPositionClasses,
      isLeft.value ? 'md:left-0 md:justify-start' : 'md:right-0 md:justify-end',
      'pointer-events-none',
      drawerPanelTransitionClasses,
      drawerPanelStateClasses[sideKey.value],
      attrs.class as string | undefined
    )
  )

  const shellTransitionStyle = computed(() => getDrawerTransitionStyle(motionState.value, 'panel'))

  const panelClasses = computed(() =>
    cn(
      'pointer-events-auto flex w-full flex-col',
      drawerSizeClasses[drawerSize.value],
      drawerPanelPositionClasses,
      isLeft.value
        ? 'md:rounded-r-[var(--shape-card)] md:rounded-l-[var(--shape-flat)]'
        : 'md:rounded-l-[var(--shape-card)] md:rounded-r-[var(--shape-flat)]'
    )
  )
</script>

<template>
  <div
    ref="contentRef"
    :class="shellClasses"
    :style="shellTransitionStyle"
    role="dialog"
    :aria-modal="true"
    :aria-labelledby="ctx?.titleId"
    :aria-describedby="ctx?.descriptionId"
    :data-state="motionState"
    :data-testid="`${ctx?.testId}__panel`"
    tabindex="-1"
  >
    <Panel
      :class="panelClasses"
      :data-testid="`${ctx?.testId}__panel-shell`"
    >
      <slot />
    </Panel>
  </div>
</template>
