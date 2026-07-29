<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, nextTick, provide, ref, shallowRef, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import Dialog from '../dialog/dialog.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogOverlay from '../dialog/dialog-overlay.vue'
  import DialogPortal from '../dialog/dialog-portal.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import {
    CommandMenuInjectionKey,
    type CommandMenuItemValue,
    type CommandMenuRegisteredItem
  } from './injection-key'

  defineOptions({
    name: 'CommandMenu',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Controlled open state. Use with `v-model:open` or `@update:open`. */
      open?: boolean
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** When true, backdrop click and Escape close the palette. */
      dismissible?: boolean
      /** Global `'+'`-delimited shortcut that toggles the palette (matched against Ctrl on non-macOS). */
      shortcut?: string
    }>(),
    {
      open: undefined,
      defaultOpen: false,
      dismissible: true,
      shortcut: 'meta+k'
    }
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: CommandMenuItemValue]
  }>()

  const openModel = defineModel<boolean | undefined>('open', { default: undefined })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const listId = `${uid}-list`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'overlay-command-menu'
  )

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value: boolean) => {
      openModel.value = value
      emit('update:open', value)
    }
  })

  const query = ref('')
  const activeValue = ref<CommandMenuItemValue | null>(null)
  // shallowRef so the inner `disabled` / `isVisible` Refs are NOT unwrapped
  // (a deep `ref([])` unwraps nested Refs, breaking `.value` access + reactivity).
  const items = shallowRef<CommandMenuRegisteredItem[]>([])
  const previousActiveElement = ref<HTMLElement | null>(null)

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const navigableItems = computed(() =>
    items.value.filter((item) => item.isVisible.value && !item.disabled.value)
  )

  const hasVisibleItems = computed(() => items.value.some((item) => item.isVisible.value))

  function setOpen(value: boolean) {
    isOpen.set(value)
  }

  function setQuery(value: string) {
    query.value = value
  }

  function setActive(value: CommandMenuItemValue | null) {
    activeValue.value = value
  }

  function isActive(value: CommandMenuItemValue) {
    return activeValue.value === value
  }

  function groupHasVisibleItems(groupId: string) {
    return items.value.some((item) => item.groupId === groupId && item.isVisible.value)
  }

  function resetActive() {
    const first = navigableItems.value[0]
    activeValue.value = first ? first.value : null
  }

  function registerItem(item: CommandMenuRegisteredItem) {
    items.value = [...items.value, item]
    return () => {
      items.value = items.value.filter((entry) => entry !== item)
      if (activeValue.value === item.value) resetActive()
    }
  }

  function moveActive(delta: number) {
    const list = navigableItems.value
    if (!list.length) {
      activeValue.value = null
      return
    }
    const currentIndex = list.findIndex((item) => item.value === activeValue.value)
    let next = currentIndex + delta
    if (next < 0) next = list.length - 1
    if (next >= list.length) next = 0
    activeValue.value = list[next].value
  }

  function onInputKeydown(event: globalThis.KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home': {
        event.preventDefault()
        const first = navigableItems.value[0]
        if (first) activeValue.value = first.value
        break
      }
      case 'End': {
        event.preventDefault()
        const list = navigableItems.value
        if (list.length) activeValue.value = list[list.length - 1].value
        break
      }
      case 'Enter': {
        event.preventDefault()
        const active = navigableItems.value.find((item) => item.value === activeValue.value)
        if (active) active.activate(event)
        break
      }
      default:
        break
    }
  }

  function close() {
    setOpen(false)
  }

  function select(
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: CommandMenuItemValue
  ) {
    emit('select', event, value)
    close()
  }

  function matchesShortcut(event: globalThis.KeyboardEvent) {
    const tokens = props.shortcut
      .toLowerCase()
      .split('+')
      .map((token) => token.trim())
      .filter(Boolean)
    if (!tokens.length) return false
    const key = tokens[tokens.length - 1]
    const modifiers = tokens.slice(0, -1)
    if (event.key.toLowerCase() !== key) return false
    if (modifiers.includes('meta') && !(isMac.value ? event.metaKey : event.ctrlKey)) return false
    if (modifiers.includes('ctrl') && !event.ctrlKey) return false
    if (modifiers.includes('shift') && !event.shiftKey) return false
    if (modifiers.includes('alt') && !event.altKey) return false
    return true
  }

  useEventListener(window, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!matchesShortcut(event)) return
    event.preventDefault()
    setOpen(!isOpen.value)
  })

  watch(query, () => {
    resetActive()
  })

  watch(
    () => isOpen.value,
    (open, wasOpen) => {
      if (open) {
        previousActiveElement.value =
          typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
        query.value = ''
        nextTick(() => resetActive())
      } else if (wasOpen) {
        nextTick(() => previousActiveElement.value?.focus?.())
      }
    }
  )

  provide(CommandMenuInjectionKey, {
    testId: testId.value,
    query,
    setQuery,
    isOpen: computed(() => isOpen.value),
    listId,
    close,
    select,
    registerItem,
    activeValue,
    setActive,
    isActive,
    hasVisibleItems,
    groupHasVisibleItems,
    onInputKeydown
  })
</script>

<template>
  <Dialog
    v-bind="$attrs"
    :open="isOpen"
    :dismissible="dismissible"
    :data-testid="testId"
    @update:open="(value) => setOpen(Boolean(value))"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle class="sr-only">Command menu</DialogTitle>
        <div
          class="flex flex-col"
          role="presentation"
        >
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
