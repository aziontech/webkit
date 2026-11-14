<script setup lang="ts">
  import { defaultDocument, useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, provide, ref, unref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { cn } from '../../../utils/cn'
  import Panel from '../panel/panel.vue'
  import {
    DrawerInjectionKey,
    DrawerMotionInjectionKey,
    DrawerPanelScrollInjectionKey
  } from './injection-key'

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
  const motionCtx = inject(DrawerMotionInjectionKey)
  const motionState = computed(() => motionCtx?.motionState.value ?? 'closed')
  const isScrollLocked = useScrollLock(defaultDocument?.body)
  const { isTop, isFocusTop } = useOverlayLayer(isOpen, { element: contentRef })

  const forwardedAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'))
  )

  watch(
    isOpen,
    (open) => {
      isScrollLocked.value = open
    },
    { immediate: true }
  )
  useFocusTrap(contentRef, isOpen, isFocusTop)

  useEventListener(defaultDocument, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape' || event.defaultPrevented) return
    if (!isTop.value) return
    if (!ctx?.dismissible) return
    event.preventDefault()
    ctx.dismiss()
  })

  watch(isOpen, async (open, wasOpen) => {
    if (open || !wasOpen || !ctx) return
    await nextTick()
    const target = ctx.triggerRef.value ?? ctx.returnFocusRef.value
    if (target?.isConnected) target.focus()
  })

  const side = computed(() => (ctx?.side === 'left' ? 'left' : 'right'))
  const drawerSize = computed(() => unref(ctx?.size) ?? 'medium')

  provide(DrawerPanelScrollInjectionKey, true)
</script>

<template>
  <div
    ref="contentRef"
    role="dialog"
    v-bind="forwardedAttrs"
    :class="
      cn(
        'pointer-events-none fixed z-1001 flex p-0 transition-[translate] duration-slow-02 ease-expressive-entrance data-[state=closed]:duration-slow-01 data-[state=closed]:ease-expressive-exit motion-reduce:transition-none max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:h-fit max-md:max-h-[80dvh] max-md:w-full max-md:justify-center max-md:translate-x-0 max-md:data-[state=closed]:translate-y-full max-md:data-[state=open]:translate-y-0 max-sm:top-0 max-sm:h-dvh max-sm:max-h-dvh md:inset-y-0 md:h-full md:min-h-full md:w-full md:translate-y-0 md:data-[state=open]:translate-x-0 data-[side=left]:md:start-0 data-[side=left]:md:justify-start data-[side=left]:md:data-[state=closed]:-translate-x-full data-[side=left]:rtl:md:data-[state=closed]:translate-x-full data-[side=right]:md:end-0 data-[side=right]:md:justify-end data-[side=right]:md:data-[state=closed]:translate-x-full data-[side=right]:rtl:md:data-[state=closed]:-translate-x-full data-[size=small]:md:max-w-(--container-sm) data-[size=medium]:md:max-w-(--container-xl) data-[size=large]:md:max-w-(--container-4xl)',
        attrs.class as string | undefined
      )
    "
    :aria-modal="true"
    :aria-labelledby="ctx?.titleId"
    :aria-describedby="ctx?.hasDescription.value ? ctx.descriptionId : undefined"
    :data-state="motionState"
    :data-side="side"
    :data-size="drawerSize"
    :data-testid="`${ctx?.testId}__panel`"
    tabindex="-1"
  >
    <Panel
      data-fluid
      :data-side="side"
      class="pointer-events-auto flex h-full min-h-0 flex-col max-md:h-fit max-md:max-h-[80dvh] max-md:w-full max-md:max-w-none max-md:rounded-t-(--shape-card) max-md:rounded-b-(--shape-flat) max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0 md:h-full md:max-h-full md:min-h-0 data-[side=left]:md:rounded-s-(--shape-flat) data-[side=left]:md:rounded-e-(--shape-card) data-[side=right]:md:rounded-s-(--shape-card) data-[side=right]:md:rounded-e-(--shape-flat)"
      :data-testid="`${ctx?.testId}__panel-shell`"
    >
      <slot />
    </Panel>
  </div>
</template>
