<script setup lang="ts">
  import { defaultDocument, useEventListener, useScrollLock } from '@vueuse/core'
  import {
    computed,
    inject,
    nextTick,
    onBeforeUnmount,
    provide,
    ref,
    unref,
    useAttrs,
    watch
  } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { usePortalLocale } from '../../../composables/use-locale/use-translate'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { cn } from '../../../utils/cn'
  import { PanelHeaderEndInjectionKey } from '../panel/injection-key'
  import Panel from '../panel/panel.vue'
  import { useDrawerMotionState } from './composables/use-drawer-motion-state'
  import DrawerClose from './drawer-close.vue'
  import { DrawerInjectionKey, DrawerPanelScrollInjectionKey } from './injection-key'
  import { DRAWER_EXIT_MS } from './presets/transitions'

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
  const isModal = computed(() => ctx?.modal ?? true)
  const { motionState } = useDrawerMotionState(isOpen)
  const portalLocale = usePortalLocale()
  const isScrollLocked = useScrollLock(defaultDocument?.body)
  const { isTop, isFocusTop } = useOverlayLayer(isOpen, { element: contentRef })
  const testId = computed(() => ctx?.testId ?? 'overlay-drawer')

  const forwardedAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'))
  )

  provide(PanelHeaderEndInjectionKey, {
    panelTestId: `${testId.value}__panel-shell`,
    component: computed(() => (ctx?.closable ? DrawerClose : null))
  })
  provide(DrawerPanelScrollInjectionKey, true)

  const isPresent = ref(isOpen.value)
  let exitTimer: ReturnType<typeof setTimeout> | undefined

  const clearExitTimer = () => {
    if (!exitTimer) return
    clearTimeout(exitTimer)
    exitTimer = undefined
  }

  watch(
    isOpen,
    (open) => {
      clearExitTimer()
      if (open) {
        isPresent.value = true
        return
      }
      if (!isPresent.value) return
      exitTimer = setTimeout(() => {
        isPresent.value = false
        exitTimer = undefined
      }, DRAWER_EXIT_MS)
    },
    { flush: 'sync' }
  )

  onBeforeUnmount(clearExitTimer)

  watch(
    [isOpen, isModal],
    ([open, modal]) => {
      isScrollLocked.value = open && modal
    },
    { immediate: true }
  )
  useFocusTrap(contentRef, isOpen, () => isModal.value && isFocusTop.value)

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

  const onOverlayClick = () => {
    if (!ctx?.dismissible) return
    ctx.dismiss()
  }
</script>

<template>
  <Teleport
    v-if="isPresent"
    to="body"
  >
    <div
      :data-testid="`${testId}__portal`"
      class="contents"
      :dir="portalLocale.dir"
      :lang="portalLocale.lang"
    >
      <div
        v-if="isModal"
        class="fixed inset-0 z-1000 bg-(--bg-backdrop) opacity-0 data-[state=open]:opacity-100 transition-opacity duration-slow-01 ease-productive-entrance data-[state=closed]:duration-slow-02 data-[state=closed]:ease-productive-exit motion-reduce:transition-none"
        :data-state="motionState"
        :data-testid="`${testId}__backdrop`"
        aria-hidden="true"
        @click="onOverlayClick"
      />
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
        :aria-modal="isModal"
        :aria-labelledby="ctx?.titleId"
        :aria-describedby="ctx?.hasDescription.value ? ctx.descriptionId : undefined"
        :data-state="motionState"
        :data-side="side"
        :data-size="drawerSize"
        :data-testid="`${testId}__panel`"
        tabindex="-1"
      >
        <Panel
          data-fluid
          :data-side="side"
          class="pointer-events-auto flex h-full min-h-0 flex-col max-md:h-fit max-md:max-h-[80dvh] max-md:w-full max-md:max-w-none max-md:rounded-t-(--shape-card) max-md:rounded-b-(--shape-flat) max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0 md:h-full md:max-h-full md:min-h-0 data-[side=left]:md:rounded-s-(--shape-flat) data-[side=left]:md:rounded-e-(--shape-card) data-[side=right]:md:rounded-s-(--shape-card) data-[side=right]:md:rounded-e-(--shape-flat)"
          :data-testid="`${testId}__panel-shell`"
        >
          <slot />
        </Panel>
      </div>
    </div>
  </Teleport>
</template>
