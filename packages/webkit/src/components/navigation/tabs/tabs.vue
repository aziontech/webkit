<script setup lang="ts">
  import { computed, onBeforeUnmount, provide, ref, shallowRef, useAttrs, useId } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { cn } from '../../../utils/cn'
  import {
    type TabsContext,
    TabsInjectionKey,
    type TabsTabRegistration,
    type TabsValue
  } from './injection-key'
  import type { TabsSlideDirection } from './presets/transitions'

  defineOptions({
    name: 'Tabs',
    inheritAttrs: false
  })

  /** How the arrow keys treat the active tab: select as focus moves, or only move focus until Enter or Space. */
  export type TabsActivationMode = 'automatic' | 'manual'

  export interface TabsProps {
    /** Initial active tab when uncontrolled. */
    defaultValue?: TabsValue | null
    /** `automatic` selects a tab as the arrow keys focus it; `manual` only moves focus, and Enter or Space selects. */
    activationMode?: TabsActivationMode
  }
  const props = withDefaults(defineProps<TabsProps>(), {
    defaultValue: null,
    activationMode: 'automatic'
  })

  defineSlots<{ default(): unknown }>()

  const valueModel = defineModel<TabsValue | null | undefined>({ default: undefined })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tabs')

  const valueProp = computed(() => valueModel.value)

  function inDomOrder(tabs: TabsTabRegistration[]) {
    return [...tabs].sort((a, b) => {
      const aEl = a.el.value
      const bEl = b.el.value
      if (!aEl || !bEl || aEl === bEl) return 0
      return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  }

  function getEnabledTabs(tabs: TabsTabRegistration[]) {
    return inDomOrder(tabs).filter((tab) => !tab.disabled)
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
  const dir = useDirection()

  const isControlled = computed(() => valueProp.value !== undefined)

  const activeValue = computed<TabsValue | null>({
    get: () => (isControlled.value ? (valueProp.value ?? null) : internalValue.value),
    set: (next) => {
      if (!isControlled.value) {
        internalValue.value = next
      }

      valueModel.value = next
    }
  })

  const resolveSlideDirection = (
    current: TabsValue | null,
    next: TabsValue | null
  ): TabsSlideDirection => {
    if (current === null || next === null || current === next) {
      return null
    }

    const ordered = inDomOrder(tabs.value)
    const currentIndex = ordered.findIndex((tab) => tab.value === current)
    const nextIndex = ordered.findIndex((tab) => tab.value === next)

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

  const idToken = (tabValue: TabsValue) =>
    String(tabValue).replace(
      /[^A-Za-z0-9-]/g,
      (char) => `_${char.codePointAt(0)?.toString(16) ?? ''}_`
    )
  const tabId = (tabValue: TabsValue) => `${baseId}-tab-${idToken(tabValue)}`
  const panelId = (tabValue: TabsValue) => `${baseId}-panel-${idToken(tabValue)}`

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
    const manual = props.activationMode === 'manual'
    const focused = manual
      ? (enabled.find((tab) => tab.el.value === globalThis.document?.activeElement)?.value ??
        activeValue.value)
      : activeValue.value

    switch (logicalArrowKey(event.key, dir.value)) {
      case 'ArrowRight':
        next = getNextTabValue(tabs.value, focused, 1)
        break
      case 'ArrowLeft':
        next = getNextTabValue(tabs.value, focused, -1)
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
      if (!manual) setValue(next)
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

  const passthroughAttrs = computed(() => {
    const { class: omittedClass, ...rest } = attrs
    void omittedClass
    return rest
  })
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :class="
      cn('relative isolate flex w-full flex-col items-start', attrs.class as string | undefined)
    "
    :data-testid="testId"
    data-tabs-root=""
    data-tab-view-root=""
    data-orientation="horizontal"
  >
    <slot />
  </div>
</template>
