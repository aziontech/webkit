<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useMenuRoot } from '../../../composables/use-menu-root'
  import { usePlacement } from '../../../composables/use-placement'
  import { usePortalLocale } from '../../../composables/use-translate'
  import type {
    DropdownMenuOptionValue,
    DropdownMenuPlacement,
    DropdownMenuPlacementInput
  } from './injection-key'
  import { DropdownMenuInjectionKey } from './injection-key'

  export type {
    DropdownMenuOptionType,
    DropdownMenuOptionValue,
    DropdownMenuPlacement,
    DropdownMenuPlacementInput
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

  interface Props {
    /** Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time. */
    placement?: DropdownMenuPlacementInput
    /** Pixel gap between the trigger and the panel. */
    offset?: number
    /** Prevents the trigger from opening the panel and applies disabled tokens. */
    disabled?: boolean
    /** Initial open state when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placement: 'bottom-start',
    offset: 4,
    disabled: false,
    defaultOpen: false
  })

  const emit = defineEmits<{
    select: [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuOptionValue
    ]
  }>()

  /** Controlled open state. Use with v-model:open; while unbound the menu is uncontrolled and starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()

  const triggerEl = ref<globalThis.HTMLElement | null>(null)
  const panelEl = ref<globalThis.HTMLElement | null>(null)
  const panelBodyEl = ref<globalThis.HTMLElement | null>(null)
  const bodyTargetEl = ref<globalThis.HTMLElement | null>(null)

  watch(panelBodyEl, (el) => {
    if (el) bodyTargetEl.value = el
  })

  function onPanelAfterLeave() {
    bodyTargetEl.value = null
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-dropdown-menu'
  )

  const triggerId = `${uid}-trigger`
  const panelId = `${uid}-panel`

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const isOpenRef = computed(() => isOpenState.value)
  const disabledRef = computed(() => props.disabled)
  const placementRef = computed(() => props.placement)
  const offsetRef = computed(() => props.offset)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef: triggerEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    placement: placementRef,
    offset: offsetRef,
    autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    onDismiss: () => setOpen(false)
  })

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as DropdownMenuPlacement)

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  function focusTrigger() {
    triggerEl.value?.focus({ preventScroll: true })
  }

  const { context, onPanelKeydown } = useMenuRoot({
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
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

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpenRef ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-placement="placement"
    class="inline-block"
  >
    <slot />

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
        @after-leave="onPanelAfterLeave"
      >
        <div
          v-if="isOpenRef"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          ref="panelEl"
          :aria-hidden="!isOpenRef || undefined"
          :data-testid="`${testId}__panel`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="resolvedPlacementRef"
          :style="panelStyle"
          class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            v-if="$slots['header']"
            :data-testid="`${testId}__header`"
            class="sticky top-0 z-10 bg-(--bg-surface) px-(--spacing-2xs) pb-(--spacing-2xs)"
          >
            <slot name="header" />
          </div>

          <div
            :id="panelId"
            ref="panelBodyEl"
            role="menu"
            tabindex="-1"
            :aria-labelledby="triggerEl?.id || triggerId"
            :data-testid="`${testId}__body`"
            class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
          />

          <div
            v-if="$slots['footer']"
            :data-testid="`${testId}__footer`"
            class="sticky bottom-0 z-10 bg-(--bg-surface) px-(--spacing-2xs) pt-(--spacing-2xs)"
          >
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
