<script setup lang="ts">
  import { defaultWindow, useEventListener } from '@vueuse/core'
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    type Ref,
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

  /** Current page name; `''` is the first page. Use with v-model:page. */
  const pageModel = defineModel<string>('page', { default: '' })

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
  const pageStack = ref<string[]>([])
  const pageHeadings = shallowRef(new Map<string, Ref<string>>())
  let pageChangedWhileClosed = false

  const ranking = computed(() => query.value.trim().length > 0)
  const page = computed(() => pageModel.value)
  const pageHeading = computed(
    () => pageHeadings.value.get(pageModel.value)?.value || pageModel.value
  )

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const groupStats = computed(() => {
    const stats = new Map<string, { visible: boolean; order: number }>()
    for (const item of items.value) {
      if (item.groupId === null) continue
      const current = stats.get(item.groupId) ?? { visible: false, order: Infinity }
      if (item.isVisible.value) {
        current.visible = true
        current.order = Math.min(current.order, item.order.value)
      }
      stats.set(item.groupId, current)
    }
    return stats
  })

  function topOrder(item: CommandRegisteredItem) {
    if (item.groupId === null) return item.order.value
    return groupStats.value.get(item.groupId)?.order ?? item.order.value
  }

  function domOrder(left: HTMLElement | null, right: HTMLElement | null) {
    if (!left || !right) return 0
    const position = left.compareDocumentPosition(right)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  }

  const visibleItems = computed(() => {
    const visible = items.value.filter((item) => item.isVisible.value)
    const ranked = ranking.value
    const inOrder =
      !ranked &&
      visible.every(
        (item, index) => index === 0 || domOrder(visible[index - 1]!.el.value, item.el.value) <= 0
      )
    if (inOrder) return visible
    return visible
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        if (ranked) {
          const byTop = topOrder(a.item) - topOrder(b.item)
          if (byTop !== 0) return byTop
          if (a.item.groupId !== null && a.item.groupId === b.item.groupId) {
            const byOwn = a.item.order.value - b.item.order.value
            if (byOwn !== 0) return byOwn
          }
        }
        return domOrder(a.item.el.value, b.item.el.value) || a.index - b.index
      })
      .map((entry) => entry.item)
  })

  const navigableItems = computed(() => visibleItems.value.filter((item) => !item.disabled.value))

  const leadingGroupId = computed(() =>
    ranking.value ? (visibleItems.value[0]?.groupId ?? null) : null
  )

  const hasVisibleItems = computed(() => visibleItems.value.length > 0)

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
    return groupStats.value.get(groupId)?.visible ?? false
  }

  function groupOrder(groupId: string) {
    const order = groupStats.value.get(groupId)?.order ?? 0
    return Number.isFinite(order) ? order : 0
  }

  function goToPage(name: string) {
    pageModel.value = name
    query.value = ''
    nextTick(() => resetActive())
  }

  function pushPage(name: string) {
    if (!name || name === pageModel.value) return
    pageStack.value = [...pageStack.value, pageModel.value]
    goToPage(name)
  }

  function popPage() {
    if (pageModel.value === '') return false
    const stack = [...pageStack.value]
    const previous = stack.pop() ?? ''
    pageStack.value = stack
    goToPage(previous)
    return true
  }

  function registerPage(name: string, heading: Ref<string>) {
    const next = new Map(pageHeadings.value)
    next.set(name, heading)
    pageHeadings.value = next
    return () => {
      const rest = new Map(pageHeadings.value)
      if (rest.get(name) === heading) rest.delete(name)
      pageHeadings.value = rest
    }
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
      case 'Backspace':
        if (query.value === '' && popPage()) event.preventDefault()
        break
      case 'Escape':
        if (popPage()) event.preventDefault()
        break
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
        if (!pageChangedWhileClosed) pageModel.value = ''
        pageChangedWhileClosed = false
        pageStack.value = []
        nextTick(() => resetActive())
      } else if (wasOpen) {
        nextTick(() => previousActiveElement.value?.focus?.())
      }
    }
  )

  watch(pageModel, () => {
    if (!isOpen.value) pageChangedWhileClosed = true
  })

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
    ranking,
    groupOrder,
    leadingGroupId,
    page,
    pageHeading,
    pushPage,
    popPage,
    registerPage,
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
