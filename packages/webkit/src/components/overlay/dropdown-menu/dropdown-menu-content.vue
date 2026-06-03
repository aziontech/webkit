<script setup lang="ts">
  import { computed, inject, nextTick, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DropdownMenuInjectionKey } from './injection-key'
  import { computeDropdownMenuPosition, type DropdownMenuResolvedSide } from './position-panel'
  import { DROPDOWN_MENU_PANEL_TRANSITION } from './presets/animations'
  import { dropdownMenuContentClasses } from './presets/styles'

  defineOptions({
    name: 'DropdownMenuContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DropdownMenuInjectionKey)
  const contentRef = ref<HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})
  const resolvedSide = ref<DropdownMenuResolvedSide>('bottom')

  const isOpen = computed(() => ctx?.isOpen.value ?? false)
  const panelId = computed(() => ctx?.menuId ?? undefined)

  const panelClasses = computed(() =>
    cn(
      dropdownMenuContentClasses,
      'webkit-dropdown-menu-panel-motion',
      attrs.class as string | undefined
    )
  )

  const updatePanelPosition = () => {
    const trigger = ctx?.triggerRef.value
    const panel = contentRef.value

    if (!trigger || !panel) {
      panelStyle.value = {}
      return
    }

    const anchorRect = trigger.getBoundingClientRect()
    const measuredRect = panel.getBoundingClientRect()
    const floatingRect = {
      ...measuredRect,
      width: measuredRect.width || panel.offsetWidth,
      height: measuredRect.height || panel.offsetHeight
    }

    if (!floatingRect.width || !floatingRect.height) {
      return
    }

    const position = computeDropdownMenuPosition({
      anchorRect,
      floatingRect,
      preferredSide: ctx?.side ?? 'auto',
      align: 'start',
      sideOffset: ctx?.sideOffset ?? 4,
      alignOffset: ctx?.alignOffset ?? 0
    })

    resolvedSide.value = position.resolvedSide
    panelStyle.value = {
      position: 'fixed',
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: '1100'
    }
  }

  const getEnabledMenuItems = (): HTMLElement[] => {
    if (!contentRef.value) return []

    return Array.from(
      contentRef.value.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      )
    )
  }

  const focusMenuItem = (index: number) => {
    const items = getEnabledMenuItems()
    items[index]?.focus()
  }

  const focusFirstMenuItem = () => {
    focusMenuItem(0)
  }

  const focusLastMenuItem = () => {
    const items = getEnabledMenuItems()
    focusMenuItem(items.length - 1)
  }

  const moveFocus = (direction: 1 | -1) => {
    const items = getEnabledMenuItems()
    if (items.length === 0) return

    const active = document.activeElement as HTMLElement | null
    const currentIndex = items.indexOf(active ?? items[0])
    const nextIndex =
      currentIndex === -1
        ? direction > 0
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length

    focusMenuItem(nextIndex)
  }

  const onClickOutside = (event: globalThis.MouseEvent) => {
    if (!isOpen.value || !ctx?.closeable) return

    const target = event.target as Node | null
    const trigger = ctx.triggerRef.value
    const panel = contentRef.value

    if (trigger?.contains(target) || panel?.contains(target)) {
      return
    }

    ctx.close()
  }

  const onDocumentKeydown = (event: globalThis.KeyboardEvent) => {
    if (!isOpen.value || !ctx) return

    switch (event.key) {
      case 'Escape':
        if (!ctx.closeable) return
        event.preventDefault()
        ctx.close()
        break
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(-1)
        break
      case 'Home':
        event.preventDefault()
        focusFirstMenuItem()
        break
      case 'End':
        event.preventDefault()
        focusLastMenuItem()
        break
      default:
        break
    }
  }

  watch(isOpen, async (open, wasOpen) => {
    if (open) {
      document.addEventListener('mousedown', onClickOutside)
      window.addEventListener('resize', updatePanelPosition)
      window.addEventListener('scroll', updatePanelPosition, true)
      await nextTick()
      updatePanelPosition()
      await nextTick()
      updatePanelPosition()
      focusFirstMenuItem()
      return
    }

    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('resize', updatePanelPosition)
    window.removeEventListener('scroll', updatePanelPosition, true)

    if (wasOpen && ctx) {
      await nextTick()
      ctx.triggerRef.value?.focus()
    }
  })

  onMounted(() => {
    if (isOpen.value) {
      document.addEventListener('mousedown', onClickOutside)
      updatePanelPosition()
    }

    document.addEventListener('keydown', onDocumentKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('resize', updatePanelPosition)
    window.removeEventListener('scroll', updatePanelPosition, true)
    document.removeEventListener('keydown', onDocumentKeydown)
  })
</script>

<template>
  <Transition :name="DROPDOWN_MENU_PANEL_TRANSITION">
    <div
      v-if="isOpen"
      :id="panelId"
      ref="contentRef"
      role="menu"
      aria-orientation="vertical"
      :class="panelClasses"
      :style="panelStyle"
      :data-side="resolvedSide"
      :data-state="isOpen ? 'open' : 'closed'"
      :data-testid="`${ctx?.testId}__content`"
      tabindex="-1"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
  .webkit-dropdown-menu-panel-motion {
    transform-origin: top center;
  }

  .webkit-dropdown-menu-panel-motion[data-side='top'] {
    transform-origin: bottom center;
  }

  .webkit-dropdown-menu-panel-motion[data-side='left'] {
    transform-origin: center right;
  }

  .webkit-dropdown-menu-panel-motion[data-side='right'] {
    transform-origin: center left;
  }

  .webkit-dropdown-menu-panel-enter-active,
  .webkit-dropdown-menu-panel-leave-active {
    transition:
      opacity 150ms ease,
      transform 150ms ease;
  }

  .webkit-dropdown-menu-panel-enter-from,
  .webkit-dropdown-menu-panel-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .webkit-dropdown-menu-panel-enter-to,
  .webkit-dropdown-menu-panel-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .webkit-dropdown-menu-panel-enter-active,
    .webkit-dropdown-menu-panel-leave-active {
      transition: opacity 100ms ease;
    }

    .webkit-dropdown-menu-panel-enter-from,
    .webkit-dropdown-menu-panel-leave-to {
      transform: none;
    }
  }
</style>
