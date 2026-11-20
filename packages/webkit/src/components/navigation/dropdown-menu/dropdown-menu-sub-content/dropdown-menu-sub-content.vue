<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, provide, ref, useAttrs, watch } from 'vue'

  import { resolveDirection } from '../../../../composables/use-direction'
  import { focusMenuItem, useMenuLevel } from '../../../../composables/use-menu-root'
  import { usePlacement } from '../../../../composables/use-placement'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import { useDropdownContext } from '../composables/use-dropdown-context'
  import { useDropdownSubContext } from '../composables/use-dropdown-sub-context'
  import { DropdownMenuGroupInjectionKey, DropdownMenuInjectionKey } from '../injection-key'

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

  const panelEl = ref<globalThis.HTMLElement | null>(null)
  const bodyEl = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu-sub-content'
  )

  const isOpen = computed(() => sub.isOpen.value && parent.isOpen.value)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: sub.triggerEl,
    panelRef: panelEl,
    isOpen,
    side: 'auto',
    autoSides: ['end', 'start', 'bottom', 'top'],
    align: 'start',
    sideOffset: 4,
    onDismiss: () => sub.setOpen(false)
  })

  const focusFirstOption = () => focusMenuItem(panelEl.value, 'first')

  function closeToTrigger() {
    sub.setOpen(false)
    sub.triggerEl.value?.focus({ preventScroll: true })
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const back = resolveDirection(panelEl.value) === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusMenuItem(panelEl.value, 'next')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusMenuItem(panelEl.value, 'prev')
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusFirstOption()
    } else if (event.key === 'End') {
      event.preventDefault()
      focusMenuItem(panelEl.value, 'last')
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

  const unregisterPanel = parent.registerSubPanel(() => panelEl.value)

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
    panelBodyEl: bodyEl,
    focusFirstOption,
    focusLastOption: () => focusMenuItem(panelEl.value, 'last'),
    focusNextOption: () => focusMenuItem(panelEl.value, 'next'),
    focusPrevOption: () => focusMenuItem(panelEl.value, 'prev'),
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
        ref="panelEl"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="testId"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="panelStyle"
        class="flex min-w-(--container-3xs) max-w-[min(var(--container-2xs),calc(100vw-2*var(--spacing-xs)))] flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
        @keydown="onKeydown"
        @pointerenter="onPointerenter"
      >
        <div
          :id="sub.contentId"
          ref="bodyEl"
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
