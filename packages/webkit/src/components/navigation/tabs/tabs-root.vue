<script setup lang="ts">
  import { computed, onBeforeUnmount, provide, ref, shallowRef, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    type TabsContext,
    TabsInjectionKey,
    type TabsTabRegistration,
    type TabsValue
  } from './injection-key'
  import type { TabsSlideDirection } from './presets/transitions'

  defineOptions({
    name: 'TabsRoot',
    inheritAttrs: false
  })

  interface Props {
    /** Controlled active tab (`v-model:value`). */
    value?: TabsValue | null
    /** Initial active tab when uncontrolled. */
    defaultValue?: TabsValue | null
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    defaultValue: null
  })

  const emit = defineEmits<{
    'update:value': [value: TabsValue | null]
  }>()

  defineSlots<{ default(): unknown }>()

  const valueModel = defineModel<TabsValue | null | undefined>('value', { default: undefined })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-tabs')

  const valueProp = computed(() => valueModel.value ?? props.value)

  function getEnabledTabs(tabs: TabsTabRegistration[]) {
    return tabs.filter((tab) => !tab.disabled)
  }

  function getNextTabValue(
    tabs: TabsTabRegistration[],
    current: TabsValue | null,
    direction: 1 | -1
  ): TabsValue | null {
    const enabled = getEnabledTabs(tabs)

    if (!enabled.length) {
      return null
    }

    const currentIndex = enabled.findIndex((tab) => tab.value === current)
    const startIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex = (startIndex + direction + enabled.length) % enabled.length

    return enabled[nextIndex]?.value ?? null
  }

  const baseId = useId()
  const internalValue = ref<TabsValue | null>(props.defaultValue)
  const tabs = shallowRef<TabsTabRegistration[]>([])
  const slideDirection = ref<TabsSlideDirection>(null)

  const isControlled = computed(() => valueProp.value !== undefined)

  const activeValue = computed<TabsValue | null>({
    get: () => (isControlled.value ? (valueProp.value ?? null) : internalValue.value),
    set: (next) => {
      if (!isControlled.value) {
        internalValue.value = next
      }

      valueModel.value = next
      emit('update:value', next)
    }
  })

  const resolveSlideDirection = (
    current: TabsValue | null,
    next: TabsValue | null
  ): TabsSlideDirection => {
    if (current === null || next === null || current === next) {
      return null
    }

    const currentIndex = tabs.value.findIndex((tab) => tab.value === current)
    const nextIndex = tabs.value.findIndex((tab) => tab.value === next)

    if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) {
      return null
    }

    return nextIndex > currentIndex ? 'right' : 'left'
  }

  const setValue = (next: TabsValue | null) => {
    slideDirection.value = resolveSlideDirection(activeValue.value, next)
    activeValue.value = next
  }

  const registerTab = (registration: TabsTabRegistration) => {
    const existing = tabs.value.filter((tab) => tab.value !== registration.value)
    tabs.value = [...existing, registration]

    if (activeValue.value === null && !registration.disabled) {
      setValue(registration.value)
    }
  }

  const unregisterTab = (tabValue: TabsValue) => {
    tabs.value = tabs.value.filter((tab) => tab.value !== tabValue)

    if (activeValue.value === tabValue) {
      const next = getEnabledTabs(tabs.value)[0]?.value ?? null
      setValue(next)
    }
  }

  const focusTab = (tabValue: TabsValue) => {
    const tab = tabs.value.find((entry) => entry.value === tabValue)
    tab?.el.value?.focus()
  }

  const tabId = (tabValue: TabsValue) => `${baseId}-tab-${String(tabValue)}`
  const panelId = (tabValue: TabsValue) => `${baseId}-panel-${String(tabValue)}`

  const panels = ref<TabsValue[]>([])

  const registerPanel = (tabValue: TabsValue) => {
    if (!panels.value.includes(tabValue)) panels.value = [...panels.value, tabValue]
  }

  const unregisterPanel = (tabValue: TabsValue) => {
    panels.value = panels.value.filter((entry) => entry !== tabValue)
  }

  const onListKeydown = (event: globalThis.KeyboardEvent) => {
    const enabled = getEnabledTabs(tabs.value)

    if (!enabled.length) {
      return
    }

    let next: TabsValue | null = null

    switch (event.key) {
      case 'ArrowRight':
        next = getNextTabValue(tabs.value, activeValue.value, 1)
        break
      case 'ArrowLeft':
        next = getNextTabValue(tabs.value, activeValue.value, -1)
        break
      case 'Home':
        next = enabled[0]?.value ?? null
        break
      case 'End':
        next = enabled[enabled.length - 1]?.value ?? null
        break
      default:
        return
    }

    event.preventDefault()

    if (next !== null) {
      setValue(next)
      focusTab(next)
    }
  }

  const context: TabsContext = {
    testId: testId.value,
    baseId,
    value: activeValue,
    slideDirection,
    setValue,
    registerTab,
    unregisterTab,
    tabs,
    focusTab,
    onListKeydown,
    tabId,
    panelId,
    panels,
    registerPanel,
    unregisterPanel
  }

  provide(TabsInjectionKey, context)

  onBeforeUnmount(() => {
    tabs.value = []
  })

  const rootClasses = computed(() =>
    cn('relative isolate flex w-full flex-col items-start', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="testId"
    data-tab-view-root=""
    data-orientation="horizontal"
  >
    <slot />
  </div>
</template>
