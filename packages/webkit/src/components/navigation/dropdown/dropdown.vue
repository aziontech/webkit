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
  import type { DropdownOptionValue, DropdownPlacement } from './injection-key'
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
    /** Where the panel opens relative to the trigger. */
    placement?: DropdownPlacement
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

  export interface DropdownSelectPayload {
    value: DropdownOptionValue
    event: globalThis.MouseEvent | globalThis.KeyboardEvent
  }

  const emit = defineEmits<{
    'update:open': [value: boolean]
    select: [payload: DropdownSelectPayload]
  }>()

  const openModel = defineModel<boolean>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const panelBodyRef = ref<globalThis.HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})
  const groupCount = ref(0)

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
      emit('update:open', value)
    }
  })

  const isOpenRef = computed(() => isOpenState.value)
  const disabledRef = computed(() => props.disabled)
  const placementRef = computed(() => props.placement)

  function setOpen(value: boolean) {
    if (value && props.disabled) return
    isOpenState.set(value)
  }

  function getPopupOrigin(side: DropdownPlacement): string {
    if (side === 'top-start') return 'bottom left'
    if (side === 'top-end') return 'bottom right'
    if (side === 'bottom-end') return 'top right'
    return 'top left'
  }

  function updatePosition() {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) {
      panelStyle.value = {}
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const gap = props.offset
    const collisionPadding = 8
    const viewport = {
      width: globalThis.innerWidth ?? 0,
      height: globalThis.innerHeight ?? 0
    }

    let top = 0
    let left = 0
    const side = props.placement

    if (side === 'bottom-start') {
      top = triggerRect.bottom + gap
      left = triggerRect.left
    } else if (side === 'bottom-end') {
      top = triggerRect.bottom + gap
      left = triggerRect.right - panelRect.width
    } else if (side === 'top-start') {
      top = triggerRect.top - panelRect.height - gap
      left = triggerRect.left
    } else {
      top = triggerRect.top - panelRect.height - gap
      left = triggerRect.right - panelRect.width
    }

    const maxLeft = viewport.width - panelRect.width - collisionPadding
    const maxTop = viewport.height - panelRect.height - collisionPadding
    left = Math.min(Math.max(left, collisionPadding), Math.max(collisionPadding, maxLeft))
    top = Math.min(Math.max(top, collisionPadding), Math.max(collisionPadding, maxTop))

    panelStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '1100',
      '--popup-origin': getPopupOrigin(side)
    }
  }

  /** Returns the list of focusable, enabled option elements inside the panel, in DOM order. */
  function getEnabledOptions(): globalThis.HTMLElement[] {
    const panel = panelRef.value
    if (!panel) return []
    const nodes = panel.querySelectorAll<globalThis.HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])'
    )
    return Array.from(nodes)
  }

  function focusFirstOption() {
    const options = getEnabledOptions()
    if (options.length > 0) options[0].focus()
  }

  function focusLastOption() {
    const options = getEnabledOptions()
    if (options.length > 0) options[options.length - 1].focus()
  }

  function focusNextOption() {
    const options = getEnabledOptions()
    if (options.length === 0) return
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const index = active ? options.indexOf(active) : -1
    const next = options[(index + 1) % options.length]
    next.focus()
  }

  function focusPrevOption() {
    const options = getEnabledOptions()
    if (options.length === 0) return
    const active = globalThis.document?.activeElement as globalThis.HTMLElement | null
    const index = active ? options.indexOf(active) : -1
    const prev = options[(index <= 0 ? options.length : index) - 1]
    prev.focus()
  }

  function focusTrigger() {
    triggerRef.value?.focus()
  }

  function selectOption(
    value: DropdownOptionValue,
    event: globalThis.MouseEvent | globalThis.KeyboardEvent
  ) {
    emit('select', { value, event })
    setOpen(false)
    focusTrigger()
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
      setOpen(false)
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

  function onWindowResize() {
    if (!isOpenState.value) return
    updatePosition()
  }

  function onDocumentScroll() {
    if (!isOpenState.value) return
    updatePosition()
  }

  watch(
    () => isOpenState.value,
    async (open) => {
      if (!open) return
      await nextTick()
      updatePosition()
      await nextTick()
      updatePosition()
      focusFirstOption()
    }
  )

  watch(
    () => props.placement,
    () => {
      if (isOpenState.value) {
        nextTick(() => updatePosition())
      }
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
    globalThis.window?.addEventListener('resize', onWindowResize)
    globalThis.document?.addEventListener('scroll', onDocumentScroll, true)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    globalThis.window?.removeEventListener('resize', onWindowResize)
    globalThis.document?.removeEventListener('scroll', onDocumentScroll, true)
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
    placement: placementRef,
    triggerId,
    panelId,
    triggerRef,
    panelRef,
    panelBodyRef,
    setOpen,
    selectOption,
    registerGroup,
    focusFirstOption,
    focusLastOption,
    focusNextOption,
    focusPrevOption,
    focusTrigger
  })
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
      >
        <div
          v-if="isOpenRef"
          :id="panelId"
          ref="panelRef"
          role="menu"
          tabindex="-1"
          :aria-labelledby="triggerId"
          :data-testid="`${testId}__panel`"
          :data-state="isOpenRef ? 'open' : 'closed'"
          :data-placement="placement"
          :style="panelStyle"
          class="flex min-w-[var(--container-3xs)] max-w-[var(--container-2xs)] flex-col overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xxs)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            v-if="$slots['top']"
            :data-testid="`${testId}__top`"
            class="sticky top-0 z-10 bg-[var(--bg-surface)] pb-[var(--spacing-xxs)]"
          >
            <slot name="top" />
          </div>

          <div
            ref="panelBodyRef"
            :data-testid="`${testId}__body`"
            class="flex flex-1 flex-col overflow-y-auto"
          />

          <div
            v-if="$slots['bottom']"
            :data-testid="`${testId}__bottom`"
            class="sticky bottom-0 z-10 bg-[var(--bg-surface)] pt-[var(--spacing-xxs)]"
          >
            <slot name="bottom" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
