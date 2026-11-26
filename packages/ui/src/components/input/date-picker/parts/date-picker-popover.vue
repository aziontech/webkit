<script setup lang="ts">
  import { onScopeDispose, ref, watch } from 'vue'

  import { useElementListener } from '../../../../composables/use-element-listener'
  import { useFocusTrap } from '../../../../composables/use-focus-trap'
  import { useOverlayLayer } from '../../../../composables/use-overlay-layer'
  import { usePlacement } from '../../../../composables/use-placement'
  import { useTeleportReady } from '../../../../composables/use-teleport-ready'
  import { usePortalLocale } from '../../../../composables/use-translate'

  defineOptions({
    name: 'DatePickerPopover',
    inheritAttrs: false
  })

  interface DatePickerPopoverProps {
    /** Root data-testid; the panel and its backdrop derive their ids from it. */
    testId: string
    /** Whether the panel is shown. */
    open?: boolean
    /** Element the panel is placed against and that does not count as an outside click. */
    anchor?: globalThis.HTMLElement | null
  }

  const props = withDefaults(defineProps<DatePickerPopoverProps>(), {
    open: false,
    anchor: null
  })

  const emit = defineEmits<{
    close: [event: Event | null]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const panelEl = ref<globalThis.HTMLElement | null>(null)
  const isOpen = () => props.open

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: () => props.anchor,
    panelRef: panelEl,
    isOpen,
    side: 'bottom',
    align: 'start',
    sideOffset: 6,
    onDismiss: () => emit('close', null)
  })

  useFocusTrap(panelEl, isOpen)
  const { isInsideHigherLayer } = useOverlayLayer(isOpen, { element: panelEl })

  const onDocumentMousedown = (event: globalThis.MouseEvent) => {
    const target = event.target as globalThis.Node | null
    if (!target || !props.open || isInsideHigherLayer(target)) return
    if (!props.anchor?.contains(target) && !panelEl.value?.contains(target)) emit('close', event)
  }

  const onPanelKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault()
      emit('close', event)
    }
  }

  useElementListener(panelEl, 'keydown', onPanelKeydown)

  watch(
    isOpen,
    (open) => {
      if (open) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
      else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  })

  const portalLocale = usePortalLocale()

  const POPOVER_CLASS =
    'flex flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)] ' +
    'max-sm:inset-x-0! max-sm:top-auto! max-sm:bottom-0! max-sm:w-full! max-sm:max-w-none! max-sm:max-h-[85dvh]! max-sm:translate-none! max-sm:rounded-b-none ' +
    'max-sm:border-x-0 max-sm:border-b-0 max-sm:pb-[env(safe-area-inset-bottom)] max-sm:[transform-origin:bottom_center]'

  const teleportReady = useTeleportReady()
</script>

<template>
  <Teleport
    to="body"
    :disabled="!teleportReady"
  >
    <div
      v-if="open"
      aria-hidden="true"
      :data-testid="`${testId}__backdrop`"
      class="fixed inset-0 z-1099 bg-(--bg-backdrop) sm:hidden"
    />
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="open"
        v-bind="$attrs"
        ref="panelEl"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        role="dialog"
        :data-testid="`${testId}__popover`"
        :data-state="open ? 'open' : 'closed'"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="panelStyle"
        :class="POPOVER_CLASS"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
