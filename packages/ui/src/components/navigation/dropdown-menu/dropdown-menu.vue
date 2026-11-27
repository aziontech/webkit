<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { useMenuRoot } from '../../../composables/use-menu-root'
  import { useOpenState } from '../../../composables/use-open-state'
  import { usePlacement } from '../../../composables/use-placement'
  import type { DropdownMenuAlign, DropdownMenuItemValue, DropdownMenuSide } from './injection-key'
  import { DropdownMenuInjectionKey } from './injection-key'
  import DropdownMenuPanel from './parts/dropdown-menu-panel.vue'

  export type {
    DropdownMenuAlign,
    DropdownMenuItemSeverity,
    DropdownMenuItemType,
    DropdownMenuItemValue,
    DropdownMenuSide
  } from './injection-key'

  defineOptions({
    name: 'DropdownMenu',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    header(): unknown
    footer(): unknown
  }>()

  export interface DropdownMenuProps {
    /** Side of the trigger the panel opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. */
    side?: DropdownMenuSide | 'auto'
    /** Alignment along the trigger edge. */
    align?: DropdownMenuAlign
    /** Pixel gap between the trigger and the panel. */
    sideOffset?: number
    /** Prevents the trigger from opening the panel and applies disabled tokens. */
    disabled?: boolean
    /** Initial open state when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<DropdownMenuProps>(), {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    disabled: false,
    defaultOpen: false
  })

  const emit = defineEmits<{
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  /** Controlled open state. Use with v-model:open; while unbound the menu is uncontrolled and starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const triggerEl = ref<globalThis.HTMLElement | null>(null)
  const panelEl = ref<globalThis.HTMLElement | null>(null)
  const bodyTargetEl = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu')

  const triggerId = `${uid}-trigger`
  const panelId = `${uid}-panel`

  const anchorEl = computed(() => {
    const anchor = triggerEl.value?.closest<globalThis.HTMLElement>(
      '[data-slot="dropdown-menu-anchor"]'
    )
    return anchor && rootEl.value?.contains(anchor) ? anchor : triggerEl.value
  })

  const disabledRef = computed(() => props.disabled)
  const { isOpen: isOpenRef, setOpen } = useOpenState(openModel, {
    defaultOpen: props.defaultOpen,
    disabled: disabledRef
  })
  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: anchorEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    side: () => props.side,
    align: () => props.align,
    sideOffset: () => props.sideOffset,
    autoSides: ['bottom', 'top'],
    onDismiss: () => setOpen(false)
  })

  function focusTrigger() {
    triggerEl.value?.focus({ preventScroll: true })
  }

  const { context, onPanelKeydown } = useMenuRoot({
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    side: resolvedSide,
    align: resolvedAlign,
    triggerId,
    panelId,
    triggerEl,
    panelEl,
    panelBodyEl: bodyTargetEl,
    setOpen,
    onSelect: (event, value) => emit('select', event, value),
    focusTrigger
  })

  provide(DropdownMenuInjectionKey, context)
</script>

<template>
  <div
    ref="rootEl"
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpenRef ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-side="side"
    :data-align="align"
    class="inline-block"
  >
    <slot />

    <DropdownMenuPanel
      :panel-style="panelStyle"
      :aria-labelledby="triggerEl?.id || triggerId"
      @keydown="onPanelKeydown"
    >
      <template
        v-if="$slots['header']"
        #header
      >
        <slot name="header" />
      </template>
      <template
        v-if="$slots['footer']"
        #footer
      >
        <slot name="footer" />
      </template>
    </DropdownMenuPanel>
  </div>
</template>
