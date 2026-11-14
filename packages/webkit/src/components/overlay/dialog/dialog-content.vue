<script setup lang="ts">
  import { defaultDocument, useEventListener, useScrollLock } from '@vueuse/core'
  import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { cn } from '../../../utils/cn'
  import Panel from '../panel/panel.vue'
  import { DialogInjectionKey, DialogMotionInjectionKey } from './injection-key'

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
  const isScrollLocked = useScrollLock(defaultDocument?.body)
  const { isTop } = useOverlayLayer(isOpen)

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
  useFocusTrap(contentRef, isOpen, isTop)

  useEventListener(defaultDocument, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape' || event.defaultPrevented) return
    if (!isTop.value) return
    if (!ctx?.dismissible) return
    event.preventDefault()
    ctx.close()
  })

  watch(isOpen, async (open, wasOpen) => {
    if (open || !wasOpen || !ctx) return
    await nextTick()
    const target = ctx.triggerRef.value ?? ctx.returnFocusRef.value
    if (target?.isConnected) target.focus()
  })
</script>

<template>
  <div
    ref="contentRef"
    role="dialog"
    v-bind="forwardedAttrs"
    :class="
      cn(
        'pointer-events-none fixed inset-0 z-1001 flex max-md:items-end max-md:justify-center max-md:p-0 md:items-center md:justify-center md:p-(--spacing-md)',
        attrs.class as string | undefined
      )
    "
    :aria-modal="true"
    :aria-labelledby="ctx?.titleId"
    :aria-describedby="ctx?.hasDescription.value ? ctx.descriptionId : undefined"
    :data-testid="`${ctx?.testId}__panel`"
    tabindex="-1"
  >
    <div
      :data-state="motionState"
      :data-size="ctx?.size ?? 'medium'"
      class="pointer-events-auto mx-auto w-full max-md:w-full data-[size=small]:md:max-w-(--container-sm) data-[size=medium]:md:max-w-(--container-xl) data-[size=large]:md:max-w-(--container-2xl) transition-[translate,scale,opacity] motion-reduce:transition-none max-md:translate-x-0 max-md:duration-slow-02 max-md:ease-expressive-entrance max-md:data-[state=closed]:translate-y-full max-md:data-[state=closed]:duration-slow-01 max-md:data-[state=closed]:ease-expressive-exit max-md:data-[state=open]:translate-y-0 md:origin-center md:translate-y-0 md:scale-90 md:opacity-0 md:duration-moderate-01 md:ease-productive-entrance md:data-[state=closed]:ease-productive-exit md:data-[state=open]:scale-100 md:data-[state=open]:opacity-100"
    >
      <Panel
        :size="ctx?.size ?? 'medium'"
        size-at-md
        class="max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card) max-md:w-full max-md:h-fit max-h-[80dvh] max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0"
        :data-testid="`${ctx?.testId}__panel-shell`"
      >
        <slot />
      </Panel>
    </div>
  </div>
</template>
