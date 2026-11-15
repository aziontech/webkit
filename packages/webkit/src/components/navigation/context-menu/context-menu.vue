<script setup lang="ts">
  import { computed, nextTick, provide, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { resolveDirection } from '../../../composables/use-direction'
  import { type MenuPlacement, useMenuRoot } from '../../../composables/use-menu-root'
  import { usePlacement } from '../../../composables/use-placement'
  import { usePortalLocale } from '../../../composables/use-translate'
  import type { DropdownMenuItemValue } from '../dropdown-menu/injection-key'
  import { DropdownMenuInjectionKey } from '../dropdown-menu/injection-key'
  import { ContextMenuInjectionKey } from './injection-key'

  export type { DropdownMenuItemType, DropdownMenuItemValue } from '../dropdown-menu/injection-key'

  defineOptions({
    name: 'ContextMenu',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface ContextMenuProps {
    /** Leaves the area to the browser's native context menu and never opens the panel. */
    disabled?: boolean
    /** Accessible name of the menu panel; when empty the panel has no name of its own. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ContextMenuProps>(), {
    disabled: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  /** Controlled open state. Use with v-model:open; while unbound the menu is uncontrolled and starts closed. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const anchorEl = ref<globalThis.HTMLElement | null>(null)
  const areaEl = ref<globalThis.HTMLElement | null>(null)
  const panelEl = ref<globalThis.HTMLElement | null>(null)
  const panelBodyEl = ref<globalThis.HTMLElement | null>(null)
  const bodyTargetEl = ref<globalThis.HTMLElement | null>(null)
  const point = ref<{ x: number; y: number } | null>(null)
  let returnFocus: globalThis.Element | null = null

  watch(panelBodyEl, (el) => {
    if (el) bodyTargetEl.value = el
  })

  function onPanelAfterLeave() {
    bodyTargetEl.value = null
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-context-menu'
  )

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: false,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value)
  const disabledRef = computed(() => props.disabled)

  const autoPlacements = computed<MenuPlacement[]>(() =>
    resolveDirection(areaEl.value) === 'rtl'
      ? ['bottom-end', 'bottom-start', 'top-end', 'top-start']
      : ['bottom-start', 'bottom-end', 'top-start', 'top-end']
  )

  const { resolvedPlacement, panelStyle, updatePosition } = usePlacement({
    triggerRef: anchorEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    placement: () => autoPlacements.value[0],
    offset: 2
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as MenuPlacement)

  const anchorStyle = computed(() =>
    point.value ? { left: `${point.value.x}px`, top: `${point.value.y}px` } : undefined
  )

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  function areaCorner(): { x: number; y: number } {
    const rect = areaEl.value?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: resolveDirection(areaEl.value) === 'rtl' ? rect.right : rect.left, y: rect.top }
  }

  function openAt(x: number, y: number, source: globalThis.Element | null) {
    if (props.disabled) return
    const active = globalThis.document?.activeElement ?? null
    returnFocus = active && areaEl.value?.contains(active) ? active : source
    point.value = { x, y }
    setOpen(true)
    nextTick(() => {
      if (isOpenState.value) updatePosition()
    })
  }

  function focusTrigger() {
    const target = returnFocus as globalThis.HTMLElement | null
    returnFocus = null
    if (target?.isConnected && typeof target.focus === 'function') {
      target.focus({ preventScroll: true })
    }
  }

  watch(isOpenRef, (open) => {
    if (open && !point.value) point.value = areaCorner()
    if (!open) point.value = null
  })

  const { context, onPanelKeydown } = useMenuRoot({
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    triggerId: `${uid}-anchor`,
    panelId: `${uid}-panel`,
    triggerEl: anchorEl,
    panelEl,
    panelBodyEl: bodyTargetEl,
    setOpen,
    onSelect: (event, value) => emit('select', event, value),
    focusTrigger
  })

  provide(DropdownMenuInjectionKey, context)

  provide(ContextMenuInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    areaEl,
    openAt
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpenRef ? 'open' : 'closed'"
    :data-disabled="disabled || null"
  >
    <slot />

    <Teleport to="body">
      <span
        v-if="isOpenRef"
        ref="anchorEl"
        aria-hidden="true"
        :style="anchorStyle"
        class="pointer-events-none fixed size-0"
      />
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
        @after-leave="onPanelAfterLeave"
      >
        <div
          v-if="isOpenRef"
          ref="panelEl"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          :data-testid="`${testId}__panel`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="resolvedPlacementRef"
          :style="panelStyle"
          class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            :id="`${uid}-panel`"
            ref="panelBodyEl"
            role="menu"
            tabindex="-1"
            :aria-label="ariaLabel || undefined"
            :data-testid="`${testId}__body`"
            class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
