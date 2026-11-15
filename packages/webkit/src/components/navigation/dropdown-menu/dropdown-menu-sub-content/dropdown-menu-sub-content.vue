<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, provide, ref, useAttrs, watch } from 'vue'

  import { resolveDirection } from '../../../../composables/use-direction'
  import { focusMenuItem, useMenuLevel } from '../../../../composables/use-menu-root'
  import { usePlacement } from '../../../../composables/use-placement'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import {
    DropdownMenuGroupInjectionKey,
    DropdownMenuInjectionKey,
    useDropdownContext,
    useDropdownSubContext
  } from '../injection-key'

  defineOptions({
    name: 'DropdownMenuSubContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const parent = useDropdownContext()
  const sub = useDropdownSubContext()
  const level = useMenuLevel()

  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const bodyRef = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${parent.testId}__sub-panel`
  )

  const isOpen = computed(() => sub.isOpen.value && parent.isOpen.value)

  const placement = computed(() =>
    resolveDirection(sub.triggerRef.value) === 'rtl' ? 'left-start' : 'right-start'
  )

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef: sub.triggerRef,
    panelRef,
    isOpen,
    placement,
    offset: 4,
    onDismiss: () => sub.setOpen(false)
  })

  const focusFirstOption = () => focusMenuItem(panelRef.value, 'first')

  function closeToTrigger() {
    sub.setOpen(false)
    sub.triggerRef.value?.focus({ preventScroll: true })
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const back = resolveDirection(panelRef.value) === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusMenuItem(panelRef.value, 'next')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusMenuItem(panelRef.value, 'prev')
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusFirstOption()
    } else if (event.key === 'End') {
      event.preventDefault()
      focusMenuItem(panelRef.value, 'last')
    } else if (event.key === 'Escape' || event.key === back) {
      event.preventDefault()
      closeToTrigger()
    } else if (event.key === 'Tab') {
      event.preventDefault()
      parent.setOpen(false)
      parent.focusTrigger()
    }
  }

  function onPointerenter() {
    parent.cancelSubClose()
    if (!sub.isOpen.value) sub.setOpen(true)
  }

  const unregisterPanel = parent.registerSubPanel(() => panelRef.value)

  watch(isOpen, async (open) => {
    if (!open) {
      level.setActiveSub(null)
      return
    }
    await nextTick()
    if (sub.focusOnOpen.value) {
      focusFirstOption()
      sub.focusOnOpen.value = false
    }
  })

  onBeforeUnmount(unregisterPanel)

  provide(DropdownMenuInjectionKey, {
    ...parent,
    panelBodyRef: bodyRef,
    focusFirstOption,
    focusLastOption: () => focusMenuItem(panelRef.value, 'last'),
    focusNextOption: () => focusMenuItem(panelRef.value, 'next'),
    focusPrevOption: () => focusMenuItem(panelRef.value, 'prev'),
    activeSub: level.activeSub,
    setActiveSub: level.setActiveSub,
    cancelSubClose: level.cancelSubClose
  })

  provide(DropdownMenuGroupInjectionKey, true)

  const portalLocale = usePortalLocale()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="isOpen"
        v-bind="attrs"
        ref="panelRef"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="testId"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-placement="resolvedPlacement"
        :style="panelStyle"
        class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
        @keydown="onKeydown"
        @pointerenter="onPointerenter"
      >
        <div
          :id="sub.contentId"
          ref="bodyRef"
          role="menu"
          tabindex="-1"
          :aria-labelledby="sub.triggerId"
          :data-testid="`${testId}__body`"
          class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
