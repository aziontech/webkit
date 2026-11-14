<script setup lang="ts">
  import { defaultWindow, useEventListener } from '@vueuse/core'
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    shallowRef,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Dialog from '../dialog/dialog.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogOverlay from '../dialog/dialog-overlay.vue'
  import DialogPortal from '../dialog/dialog-portal.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import {
    CommandInjectionKey,
    type CommandItemValue,
    type CommandRegisteredItem
  } from './injection-key'
  import { claimShortcut } from './shortcut-registry'

  defineOptions({
    name: 'Command',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** When true, backdrop click and Escape close the palette. */
      dismissible?: boolean
      /** Global `'+'`-delimited shortcut that toggles the palette (matched against Ctrl on non-macOS). */
      shortcut?: string
    }>(),
    {
      defaultOpen: false,
      dismissible: true,
      shortcut: 'meta+k'
    }
  )

  const emit = defineEmits<{
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: CommandItemValue]
  }>()

  /** Controlled open state. Use with v-model:open; while unbound the palette starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ command: en.command })
  const uid = useId()
  const listId = `${uid}-list`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-command')

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value: boolean) => {
      openModel.value = value
    }
  })

  const query = ref('')
  const activeValue = ref<CommandItemValue | null>(null)
  const registry = new Set<CommandRegisteredItem>()
  const registryVersion = shallowRef(0)
  const items = computed<CommandRegisteredItem[]>(() => {
    void registryVersion.value
    return Array.from(registry)
  })
  const previousActiveElement = ref<HTMLElement | null>(null)

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const precedes = (left: HTMLElement | null, right: HTMLElement | null) =>
    !left || !right || !(left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_PRECEDING)

  const orderedItems = computed<CommandRegisteredItem[]>(() => {
    const list = items.value
    const inOrder = list.every(
      (item, index) => index === 0 || precedes(list[index - 1]!.el.value, item.el.value)
    )
    if (inOrder) return list
    return list
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const left = a.item.el.value
        const right = b.item.el.value
        if (!left || !right) return a.index - b.index
        const position = left.compareDocumentPosition(right)
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
        return a.index - b.index
      })
      .map((entry) => entry.item)
  })

  const navigableItems = computed(() =>
    orderedItems.value.filter((item) => item.isVisible.value && !item.disabled.value)
  )

  const visibleGroups = computed(() => {
    const groups = new Set<string | null>()
    for (const item of items.value) if (item.isVisible.value) groups.add(item.groupId)
    return groups
  })

  const hasVisibleItems = computed(() => visibleGroups.value.size > 0)

  function setOpen(value: boolean) {
    isOpen.set(value)
  }

  function setQuery(value: string) {
    query.value = value
  }

  function setActive(value: CommandItemValue | null) {
    activeValue.value = value
  }

  function isActive(value: CommandItemValue) {
    return activeValue.value === value
  }

  function groupHasVisibleItems(groupId: string) {
    return visibleGroups.value.has(groupId)
  }

  function resetActive() {
    const first = navigableItems.value[0]
    activeValue.value = first ? first.value : null
  }

  function registerItem(item: CommandRegisteredItem) {
    registry.add(item)
    registryVersion.value += 1
    return () => {
      registry.delete(item)
      registryVersion.value += 1
      if (activeValue.value !== item.value) return
      if (isOpen.value) resetActive()
      else activeValue.value = null
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
    value: CommandItemValue
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

  useEventListener(defaultWindow, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!matchesShortcut(event)) return
    event.preventDefault()
    setOpen(!isOpen.value)
  })

  let releaseShortcut = () => {}

  onMounted(() => {
    watch(
      () => props.shortcut,
      (shortcut) => {
        releaseShortcut()
        releaseShortcut = claimShortcut(shortcut)
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => releaseShortcut())

  const activeId = computed(() => items.value.find((item) => item.value === activeValue.value)?.id)

  watch(activeValue, (value) => {
    if (value === null) return
    void nextTick(() => {
      const item = items.value.find((entry) => entry.value === value)
      item?.el.value?.scrollIntoView?.({ block: 'nearest' })
    })
  })

  watch(query, () => {
    resetActive()
    nextTick(() => resetActive())
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

  provide(CommandInjectionKey, {
    testId: testId.value,
    query,
    setQuery,
    isOpen: computed(() => isOpen.value),
    listId,
    close,
    select,
    registerItem,
    activeValue,
    activeId,
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
    @update:open="(value) => setOpen(value)"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle class="sr-only">{{ t('command.title') }}</DialogTitle>
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
