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
  import { useMounted } from '../../../composables/use-mounted'
  import { usePlacement } from '../../../composables/use-placement'
  import type {
    DropdownOptionValue,
    DropdownPlacement,
    DropdownPlacementInput
  } from './injection-key'
  import { DropdownInjectionKey } from './injection-key'

  defineOptions({
    name: 'Dropdown',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    top(): unknown
    bottom(): unknown
  }>()

  interface Props {
    /** Controlled open state. Use with v-model:open or update:open. When omitted, the component is uncontrolled. */
    open?: boolean
    /** Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time. */
    placement?: DropdownPlacementInput
    /** Pixel gap between the trigger and the panel. */
    offset?: number
    /** Prevents the trigger from opening the panel and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    open: undefined,
    placement: 'bottom-start',
    offset: 4,
    disabled: false
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: DropdownOptionValue]
  }>()

  const openModel = defineModel<boolean | undefined>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const menuRef = ref<globalThis.HTMLElement | null>(null)
  const topRef = ref<globalThis.HTMLElement | null>(null)
  const bottomRef = ref<globalThis.HTMLElement | null>(null)
  const panelBodyRef = ref<globalThis.HTMLElement | null>(null)
  const bodyTarget = ref<globalThis.HTMLElement | null>(null)
  const groupCount = ref(0)
  const selectedKeys = ref(new Set<symbol>())

  const hasSelection = computed(() => selectedKeys.value.size > 0)

  function setOptionSelected(key: symbol, selected: boolean) {
    if (selected) selectedKeys.value.add(key)
    else selectedKeys.value.delete(key)
  }

  watch(panelBodyRef, (el) => {
    if (el) bodyTarget.value = el
  })

  function onPanelAfterLeave() {
    bodyTarget.value = null
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-dropdown'
  )

  const triggerId = `${uid}-trigger`
  const panelId = `${uid}-panel`

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpenState = useControllable<boolean>({
    prop: openProp,
    defaultProp: false,
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

  const resolvedPlacementRef = computed(() => resolvedPlacement.value as DropdownPlacement)

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  const OPTION_SELECTOR =
    '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])'

  const TABBABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function getEnabledOptions(): globalThis.HTMLElement[] {
    const menu = menuRef.value
    if (!menu) return []
    return Array.from(menu.querySelectorAll<globalThis.HTMLElement>(OPTION_SELECTOR))
  }

  function getActiveElement(): globalThis.HTMLElement | null {
    return (globalThis.document?.activeElement as globalThis.HTMLElement | null) ?? null
  }

  function getSelectedOption(options: globalThis.HTMLElement[]): globalThis.HTMLElement | null {
    return options.find((option) => option.getAttribute('aria-checked') === 'true') ?? null
  }

  function focusFirstOption() {
    const options = getEnabledOptions()
    if (options.length > 0) options[0].focus({ preventScroll: true })
  }

  function focusInitialOption() {
    const options = getEnabledOptions()
    const target = getSelectedOption(options) ?? options[0]
    target?.focus({ preventScroll: true })
  }

  function getRegionTabbables(region: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
    if (!region) return []
    return Array.from(region.querySelectorAll<globalThis.HTMLElement>(TABBABLE_SELECTOR))
  }

  function getMenuStop(): globalThis.HTMLElement | null {
    const options = getEnabledOptions()
    const active = getActiveElement()
    if (active && options.includes(active)) return active
    return getSelectedOption(options) ?? options[0] ?? null
  }

  function onPanelTab(event: globalThis.KeyboardEvent) {
    const menuStop = getMenuStop()
    const stops = [
      ...getRegionTabbables(topRef.value),
      ...(menuStop ? [menuStop] : []),
      ...getRegionTabbables(bottomRef.value)
    ]
    const active = getActiveElement()
    const inMenu = active !== null && menuRef.value?.contains(active) === true
    const focused = inMenu ? menuStop : active
    const index = focused ? stops.indexOf(focused) : -1
    if (index === -1 && stops.length > 0) {
      event.preventDefault()
      stops[event.shiftKey ? stops.length - 1 : 0].focus({ preventScroll: true })
      return
    }
    const nextIndex = index + (event.shiftKey ? -1 : 1)
    if (nextIndex < 0 || nextIndex >= stops.length) {
      setOpen(false)
      return
    }
    event.preventDefault()
    stops[nextIndex].focus({ preventScroll: true })
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
    value: DropdownOptionValue,
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
      onPanelTab(event)
    }
  }

  interface ParsedShortcut {
    meta: boolean
    ctrl: boolean
    shift: boolean
    alt: boolean
    key: string
  }

  function parseCommand(command: string): ParsedShortcut | null {
    let meta = false
    let ctrl = false
    let shift = false
    let alt = false
    let key = ''
    const tokens = command.split(/\s*\+\s*/).flatMap((part) => Array.from(part))
    for (const token of tokens) {
      const lower = token.toLowerCase()
      if (token === '⌘' || lower === 'cmd' || lower === 'meta') meta = true
      else if (token === '⌃' || lower === 'ctrl' || lower === 'control') ctrl = true
      else if (token === '⇧' || lower === 'shift') shift = true
      else if (token === '⌥' || lower === 'alt' || lower === 'option' || lower === 'opt') alt = true
      else key += token
    }
    if (!key) return null
    return { meta, ctrl, shift, alt, key: key.toLowerCase() }
  }

  function matchesShortcut(event: globalThis.KeyboardEvent, parsed: ParsedShortcut): boolean {
    return (
      event.metaKey === parsed.meta &&
      event.ctrlKey === parsed.ctrl &&
      event.shiftKey === parsed.shift &&
      event.altKey === parsed.alt &&
      event.key.toLowerCase() === parsed.key
    )
  }

  interface CommandEntry {
    parsed: ParsedShortcut
    activate: (event: globalThis.KeyboardEvent) => void
  }

  const commands = new Set<CommandEntry>()

  function registerCommand(
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ): () => void {
    const parsed = parseCommand(command)
    if (!parsed) return () => {}
    const entry: CommandEntry = { parsed, activate }
    commands.add(entry)
    return () => {
      commands.delete(entry)
    }
  }

  function onWindowKeydown(event: globalThis.KeyboardEvent) {
    if (props.disabled) return
    for (const { parsed, activate } of commands) {
      if (matchesShortcut(event, parsed)) {
        event.preventDefault()
        activate(event)
        return
      }
    }
  }

  function onDocumentMousedown(event: globalThis.MouseEvent) {
    if (!isOpenState.value) return
    const target = event.target as globalThis.Node | null
    if (!target) return
    if (triggerRef.value?.contains(target)) return
    if (panelRef.value?.contains(target)) return
    setOpen(false)
  }

  watch(
    () => isOpenState.value,
    async (open) => {
      if (!open) return
      for (let attempt = 0; attempt < 3 && getEnabledOptions().length === 0; attempt += 1) {
        await nextTick()
      }
      focusInitialOption()
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    globalThis.window?.addEventListener('keydown', onWindowKeydown)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    globalThis.window?.removeEventListener('keydown', onWindowKeydown)
  })

  function registerGroup(): number {
    const index = groupCount.value
    groupCount.value = index + 1
    return index
  }

  provide(DropdownInjectionKey, {
    testId: testId.value,
    isOpen: isOpenRef,
    disabled: disabledRef,
    placement: resolvedPlacementRef,
    triggerId,
    panelId,
    triggerRef,
    panelRef,
    panelBodyRef: bodyTarget,
    hasSelection,
    setOptionSelected,
    setOpen,
    selectOption,
    registerGroup,
    registerCommand,
    focusFirstOption,
    focusLastOption,
    focusNextOption,
    focusPrevOption,
    focusTrigger
  })

  const teleportReady = useMounted()
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

    <Teleport
      to="body"
      :disabled="!teleportReady"
    >
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
        @after-leave="onPanelAfterLeave"
      >
        <div
          v-if="isOpenRef"
          ref="panelRef"
          tabindex="-1"
          :data-testid="`${testId}__popup`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="resolvedPlacementRef"
          :style="panelStyle"
          class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            v-if="$slots['top']"
            ref="topRef"
            :data-testid="`${testId}__top`"
            class="sticky top-0 z-10 bg-(--bg-surface) px-(--spacing-xxs) pb-(--spacing-xxs)"
          >
            <slot name="top" />
          </div>

          <div
            :id="panelId"
            ref="menuRef"
            role="menu"
            :aria-labelledby="triggerId"
            :data-testid="`${testId}__panel`"
            :data-state="isOpenRef ? 'open' : 'closed'"
            :data-placement="resolvedPlacementRef"
            class="flex min-h-0 flex-1 flex-col"
          >
            <div
              ref="panelBodyRef"
              :data-testid="`${testId}__body`"
              class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
            />
          </div>

          <div
            v-if="$slots['bottom']"
            ref="bottomRef"
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
