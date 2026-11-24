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
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Dialog from '../dialog/dialog.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import PanelHeader from '../panel/panel-header.vue'
  import { useCommandActive } from './composables/use-command-active'
  import { useCommandOrder } from './composables/use-command-order'
  import { useCommandPages } from './composables/use-command-pages'
  import {
    CommandInjectionKey,
    type CommandItemValue,
    type CommandRegisteredItem
  } from './injection-key'
  import { matchesShortcut } from './lib/command-order'
  import { claimShortcut } from './shortcut-registry'

  defineOptions({
    name: 'Command',
    inheritAttrs: false
  })

  export interface CommandProps {
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
    /** When true, backdrop click and Escape close the palette. */
    dismissible?: boolean
    /** Global `'+'`-delimited shortcut that toggles the palette (matched against Ctrl on non-macOS). */
    shortcut?: string
  }

  const props = withDefaults(defineProps<CommandProps>(), {
    defaultOpen: false,
    dismissible: true,
    shortcut: 'meta+k'
  })

  const emit = defineEmits<{
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: CommandItemValue]
  }>()

  /** Controlled open state. Use with v-model:open; while unbound the palette starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  /** Current page name; `''` is the first page. Use with v-model:page-key. */
  const pageModel = defineModel<string>('pageKey', { default: '' })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ command: en.command })
  const uid = useId()
  const listId = `${uid}-list`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'command')

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value: boolean) => {
      openModel.value = value
    }
  })

  const query = ref('')
  const registry = new Set<CommandRegisteredItem>()
  const registryVersion = shallowRef(0)
  const items = computed<CommandRegisteredItem[]>(() => {
    void registryVersion.value
    return Array.from(registry)
  })
  const previousActiveEl = ref<HTMLElement | null>(null)
  let pageChangedWhileClosed = false

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const { ranking, capped, groupStats, visibleItems, navigableItems } = useCommandOrder(
    items,
    query
  )

  const pages = useCommandPages(pageModel, (name) => {
    pageModel.value = name
    query.value = ''
    nextTick(() => resetActive())
  })
  const active = useCommandActive(navigableItems, query, pages.popPage)
  const { activeValue, resetActive } = active

  function setOpen(value: boolean) {
    isOpen.set(value)
  }

  function registerItem(item: CommandRegisteredItem) {
    registry.add(item)
    registryVersion.value += 1
    return () => {
      registry.delete(item)
      registryVersion.value += 1
      if (activeValue.value !== item.value) return
      if (isOpen.value) resetActive()
      else active.setActive(null)
    }
  }

  function close() {
    setOpen(false)
  }

  useEventListener(defaultWindow, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!matchesShortcut(props.shortcut, event, isMac.value)) return
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
        previousActiveEl.value =
          typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
        query.value = ''
        if (!pageChangedWhileClosed) pageModel.value = ''
        pageChangedWhileClosed = false
        pages.resetPages()
        nextTick(() => resetActive())
      } else if (wasOpen) {
        nextTick(() => previousActiveEl.value?.focus?.())
      }
    }
  )

  watch(pageModel, () => {
    if (!isOpen.value) pageChangedWhileClosed = true
  })

  provide(CommandInjectionKey, {
    ...pages,
    ...active,
    testId: testId.value,
    query,
    setQuery: (value: string) => {
      query.value = value
    },
    isOpen: computed(() => isOpen.value),
    listId,
    close,
    select: (event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: CommandItemValue) => {
      emit('select', event, value)
      close()
    },
    registerItem,
    activeId,
    hasVisibleItems: computed(() => visibleItems.value.length > 0),
    groupHasVisibleItems: (groupId: string) => groupStats.value.get(groupId)?.visible ?? false,
    isCapped: (itemId: string) => capped.value.has(itemId),
    ranking,
    groupOrder: (groupId: string) => {
      const order = groupStats.value.get(groupId)?.order ?? 0
      return Number.isFinite(order) ? order : 0
    },
    leadingGroupId: computed(() =>
      ranking.value ? (visibleItems.value[0]?.groupId ?? null) : null
    )
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
    <DialogContent
      :data-testid="`${testId}__panel`"
      class="md:items-start md:pt-[15dvh]"
    >
      <PanelHeader class="py-(--spacing-xs) sm:hidden">
        <DialogTitle
          :data-testid="`${testId}__title`"
          class="sr-only"
          >{{ t('command.title') }}</DialogTitle
        >
      </PanelHeader>
      <div
        class="flex flex-col"
        role="presentation"
      >
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>
