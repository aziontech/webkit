<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { usePortalLocale } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import { registerShortcut } from './composables/shortcut-registry'
  import type {
    DropdownMenuOptionValue,
    DropdownMenuPlacement,
    DropdownMenuPlacementInput
  } from './injection-key'
  import { DropdownMenuInjectionKey } from './injection-key'

  export type {
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
    top(): unknown
    bottom(): unknown
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

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const panelBodyRef = ref<globalThis.HTMLElement | null>(null)
  const bodyTarget = ref<globalThis.HTMLElement | null>(null)

  watch(panelBodyRef, (el) => {
    if (el) bodyTarget.value = el
  })

  function onPanelAfterLeave() {
    bodyTarget.value = null
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
    triggerRef,
    panelRef,
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

  function getEnabledOptions(): globalThis.HTMLElement[] {
    const panel = panelRef.value
    if (!panel) return []
    const nodes = panel.querySelectorAll<globalThis.HTMLElement>(
      '[role^="menuitem"]:not([aria-disabled="true"])'
    )
    return Array.from(nodes)
  }

  function focusFirstOption() {
    const options = getEnabledOptions()
    if (options.length > 0) options[0].focus({ preventScroll: true })
  }

  function focusLastOption() {
    const options = getEnabledOptions()
    if (options.length > 0) options[options.length - 1].focus({ preventScroll: true })
  }

  function focusNextOption() {
    const options = getEnabledOptions()
    if (options.length === 0) return
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const index = active ? options.indexOf(active) : -1
    const next = options[(index + 1) % options.length]
    next.focus({ preventScroll: true })
  }

  function focusPrevOption() {
    const options = getEnabledOptions()
    if (options.length === 0) return
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const index = active ? options.indexOf(active) : -1
    const prev = options[(index <= 0 ? options.length : index) - 1]
    prev.focus({ preventScroll: true })
  }

  function focusTrigger() {
    triggerRef.value?.focus({ preventScroll: true })
  }

  function selectOption(
    value: DropdownMenuOptionValue,
    event: globalThis.MouseEvent | globalThis.KeyboardEvent
  ) {
    const wasOpen = isOpenState.value
    emit('select', event, value)
    if (wasOpen) {
      setOpen(false)
      focusTrigger()
    }
  }

  function onPanelKeydown(event: globalThis.KeyboardEvent) {
    const typing = (event.target as globalThis.HTMLElement | null)?.matches?.('input, textarea')
    if (typing && (event.key === 'Home' || event.key === 'End')) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusNextOption()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusPrevOption()
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusFirstOption()
    } else if (event.key === 'End') {
      event.preventDefault()
      focusLastOption()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    } else if (event.key === 'Tab') {
      if (event.shiftKey) event.preventDefault()
      setOpen(false)
      focusTrigger()
    } else if (
      !typing &&
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      typeahead(event)
    }
  }

  let typeaheadBuffer = ''
  let typeaheadAt = 0

  function typeahead(event: globalThis.KeyboardEvent) {
    const options = getEnabledOptions()
    if (options.length === 0) return
    typeaheadBuffer =
      event.timeStamp - typeaheadAt > 500 ? event.key : `${typeaheadBuffer}${event.key}`
    typeaheadAt = event.timeStamp
    const typed = typeaheadBuffer.toLocaleLowerCase()
    const query = Array.from(typed).every((char) => char === typed[0]) ? typed[0] : typed
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const start = active ? options.indexOf(active) : -1
    const ordered =
      query.length === 1
        ? [...options.slice(start + 1), ...options.slice(0, start + 1)]
        : [...options.slice(Math.max(start, 0)), ...options.slice(0, Math.max(start, 0))]
    const match = ordered.find((option) =>
      (option.textContent ?? '').trim().toLocaleLowerCase().startsWith(query)
    )
    if (match) {
      event.preventDefault()
      match.focus({ preventScroll: true })
    }
  }

  function registerCommand(
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ): () => void {
    return registerShortcut(command, () => !props.disabled, activate)
  }

  function onDocumentMousedown(event: globalThis.MouseEvent) {
    if (!isOpenState.value) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (triggerRef.value?.contains(target)) return
    if (panelRef.value?.contains(target)) return
    setOpen(false)
  }

  function listenOutside(active: boolean) {
    if (active) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  }

  watch(
    () => isOpenState.value,
    async (open) => {
      listenOutside(open)
      if (!open) return
      await nextTick()
      focusFirstOption()
    }
  )

  onMounted(() => {
    if (isOpenState.value) listenOutside(true)
  })

  onBeforeUnmount(() => {
    listenOutside(false)
  })

  provide(DropdownMenuInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    triggerId,
    panelId,
    triggerRef,
    panelRef,
    panelBodyRef: bodyTarget,
    setOpen,
    selectOption,
    registerCommand,
    focusFirstOption,
    focusLastOption,
    focusNextOption,
    focusPrevOption,
    focusTrigger
  })

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
          ref="panelRef"
          :aria-hidden="!isOpenRef || undefined"
          :data-testid="`${testId}__panel`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="resolvedPlacementRef"
          :style="panelStyle"
          class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            v-if="$slots['top']"
            :data-testid="`${testId}__top`"
            class="sticky top-0 z-10 bg-(--bg-surface) px-(--spacing-xxs) pb-(--spacing-xxs)"
          >
            <slot name="top" />
          </div>

          <div
            :id="panelId"
            ref="panelBodyRef"
            role="menu"
            tabindex="-1"
            :aria-labelledby="triggerRef?.id || triggerId"
            :data-testid="`${testId}__body`"
            class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
          />

          <div
            v-if="$slots['bottom']"
            :data-testid="`${testId}__bottom`"
            class="sticky bottom-0 z-10 bg-(--bg-surface) px-(--spacing-xxs) pt-(--spacing-xxs)"
          >
            <slot name="bottom" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
