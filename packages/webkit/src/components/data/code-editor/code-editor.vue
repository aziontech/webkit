<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../utils/cn'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import {
    codeEditorEnterOffsetClasses,
    type CodeEditorSlideDirection,
    getCodeEditorIndicatorTransitionStyle,
    getCodeEditorPanelTransitionStyle
  } from './presets/transitions'
  import {
    type CodeEditorHighlightToken,
    formatLineNumber,
    getHighlightTokenClass,
    highlightCode
  } from './utils/highlight-code'

  export type CodeEditorTab = {
    label: string
    value: string
    code: string
    language?: string
  }

  defineOptions({
    name: 'CodeEditor',
    inheritAttrs: false
  })

  interface Props {
    /** Tab definitions with label, value, code, and optional language for highlighting. */
    tabs?: CodeEditorTab[]
    /** Controlled active tab value (`v-model:value`). */
    value?: string
    /** Initial active tab when uncontrolled. */
    defaultValue?: string
    /** Shows a fixed-width gutter with line numbers before each code line. */
    showLineNumbers?: boolean
    /** Accessible name for the copy IconButton. */
    copyAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    tabs: () => [],
    value: undefined,
    defaultValue: undefined,
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  })

  const emit = defineEmits<{
    'update:value': [value: string]
    'value-change': [value: string]
    copy: [code: string]
  }>()

  const valueModel = defineModel<string>('value', { default: undefined })

  const attrs = useAttrs()
  const tabListRef = ref<HTMLElement | null>(null)
  const tabRefs = ref<HTMLElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorOffsetX = ref(0)
  const internalValue = ref('')
  const slideDirection = ref<CodeEditorSlideDirection>(null)
  const panelMotionReady = ref(true)
  const copyFeedback = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'data-code-editor')

  const normalizedTabs = computed(() =>
    props.tabs.filter((tab): tab is CodeEditorTab => Boolean(tab && tab.value && tab.code))
  )

  const isControlled = computed(() => valueModel.value !== undefined || props.value !== undefined)

  const activeValue = computed({
    get: () => {
      if (isControlled.value) {
        return valueModel.value ?? props.value ?? ''
      }

      return internalValue.value
    },
    set: (next: string) => {
      if (!isControlled.value) {
        internalValue.value = next
      }

      valueModel.value = next
      emit('update:value', next)
      emit('value-change', next)
    }
  })

  const activeTab = computed(
    () =>
      normalizedTabs.value.find((tab) => tab.value === activeValue.value) ??
      normalizedTabs.value[0] ??
      null
  )

  const activeIndex = computed(() =>
    normalizedTabs.value.findIndex((tab) => tab.value === activeValue.value)
  )

  const highlightedLines = computed(() => {
    if (!activeTab.value) {
      return [] as CodeEditorHighlightToken[][]
    }

    return highlightCode(activeTab.value.code, activeTab.value.language)
  })

  const indicatorTransitionStyle = computed(() => getCodeEditorIndicatorTransitionStyle())

  const indicatorTransformStyle = computed(() => ({
    width: `${indicatorWidth.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, 0, 0)`
  }))

  const panelTransitionStyle = computed(() => getCodeEditorPanelTransitionStyle())

  const panelEnterOffsetClass = computed(() => {
    if (slideDirection.value === 'right') {
      return codeEditorEnterOffsetClasses.right
    }

    if (slideDirection.value === 'left') {
      return codeEditorEnterOffsetClasses.left
    }

    return codeEditorEnterOffsetClasses.none
  })

  const panelMotionClasses = computed(() =>
    cn(
      'w-full transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
      panelMotionReady.value
        ? 'translate-x-0 opacity-100'
        : cn(panelEnterOffsetClass.value, 'opacity-0')
    )
  )

  const resolveTabElement = (
    element: globalThis.Element | ComponentPublicInstance | null
  ): HTMLElement | null => {
    if (!element) {
      return null
    }

    if (element instanceof HTMLElement) {
      return element
    }

    const el = (element as ComponentPublicInstance).$el

    return el instanceof HTMLElement ? el : null
  }

  const setTabRef = (
    element: globalThis.Element | ComponentPublicInstance | null,
    index: number
  ) => {
    const el = resolveTabElement(element)

    if (!el) {
      return
    }

    tabRefs.value[index] = el
  }

  const resolveSlideDirection = (
    currentIndex: number,
    nextIndex: number
  ): CodeEditorSlideDirection => {
    if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) {
      return null
    }

    return nextIndex > currentIndex ? 'right' : 'left'
  }

  const runPanelMotion = () => {
    panelMotionReady.value = false
    nextTick(() => {
      globalThis.requestAnimationFrame(() => {
        panelMotionReady.value = true
      })
    })
  }

  const setActiveTab = (nextValue: string) => {
    if (!nextValue || nextValue === activeValue.value) {
      return
    }

    const currentIndex = activeIndex.value
    const nextIndex = normalizedTabs.value.findIndex((tab) => tab.value === nextValue)

    slideDirection.value = resolveSlideDirection(currentIndex, nextIndex)
    activeValue.value = nextValue
    runPanelMotion()
    scheduleIndicatorSync()
  }

  const getNextTabValue = (direction: 1 | -1): string | null => {
    const tabs = normalizedTabs.value

    if (!tabs.length) {
      return null
    }

    const currentIndex = activeIndex.value === -1 ? 0 : activeIndex.value
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length

    return tabs[nextIndex]?.value ?? null
  }

  const onTabKeydown = (event: globalThis.KeyboardEvent, tabValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveTab(tabValue)
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const next = getNextTabValue(1)

      if (next) {
        setActiveTab(next)
        focusTab(next)
      }

      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      const next = getNextTabValue(-1)

      if (next) {
        setActiveTab(next)
        focusTab(next)
      }

      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      const first = normalizedTabs.value[0]?.value

      if (first) {
        setActiveTab(first)
        focusTab(first)
      }

      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      const last = normalizedTabs.value[normalizedTabs.value.length - 1]?.value

      if (last) {
        setActiveTab(last)
        focusTab(last)
      }
    }
  }

  const focusTab = (tabValue: string) => {
    const index = normalizedTabs.value.findIndex((tab) => tab.value === tabValue)
    tabRefs.value[index]?.focus()
  }

  const syncIndicator = () => {
    const listEl = tabListRef.value
    const activeTabEl = tabRefs.value[activeIndex.value]

    if (!listEl || !activeTabEl || activeIndex.value < 0) {
      indicatorVisible.value = false
      return
    }

    const listRect = listEl.getBoundingClientRect()
    const tabRect = activeTabEl.getBoundingClientRect()

    indicatorWidth.value = tabRect.width
    indicatorOffsetX.value = tabRect.left - listRect.left
    indicatorVisible.value = true
  }

  const scheduleIndicatorSync = () => {
    nextTick(() => {
      syncIndicator()
    })
  }

  const copyActiveCode = async () => {
    const code = activeTab.value?.code ?? ''

    if (!code) {
      return
    }

    try {
      await globalThis.navigator.clipboard.writeText(code)
      copyFeedback.value = true
      emit('copy', code)
      globalThis.setTimeout(() => {
        copyFeedback.value = false
      }, 1200)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (!normalizedTabs.value.length) {
      return
    }

    if (!activeValue.value) {
      internalValue.value = props.defaultValue ?? normalizedTabs.value[0]?.value ?? ''
    }

    scheduleIndicatorSync()

    if (typeof ResizeObserver !== 'undefined' && tabListRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncIndicator()
      })
      resizeObserver.observe(tabListRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  watch(
    normalizedTabs,
    (tabs) => {
      if (!tabs.length) {
        return
      }

      const hasActive = tabs.some((tab) => tab.value === activeValue.value)

      if (!hasActive) {
        const next = props.defaultValue ?? tabs[0]?.value ?? ''
        internalValue.value = next
        valueModel.value = next
      }

      tabRefs.value = tabRefs.value.slice(0, tabs.length)
      scheduleIndicatorSync()
    },
    { immediate: true }
  )

  watch(activeValue, scheduleIndicatorSync)
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full flex-col overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <div
      class="relative shrink-0 border-b border-[var(--border-default)] px-[var(--spacing-sm)]"
      :data-testid="`${testId}__header`"
    >
      <div
        ref="tabListRef"
        role="tablist"
        class="relative flex items-end gap-[var(--spacing-xs)]"
        :data-testid="`${testId}__tabs`"
      >
        <span
          v-show="indicatorVisible"
          class="pointer-events-none absolute bottom-0 left-0 z-[1] h-[2px] rounded-full bg-[var(--border-selected)] motion-reduce:transition-none"
          :style="[indicatorTransitionStyle, indicatorTransformStyle]"
          :data-testid="`${testId}__indicator`"
          aria-hidden="true"
        />
        <button
          v-for="(tab, index) in normalizedTabs"
          :key="tab.value"
          :ref="(element) => setTabRef(element, index)"
          type="button"
          role="tab"
          :id="`${testId}-tab-${tab.value}`"
          :class="
            cn(
              'relative z-[2] inline-flex h-10 shrink-0 items-center justify-center px-[var(--spacing-xs)] py-[var(--spacing-xs)]',
              'text-overline-sm uppercase transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
              tab.value === activeValue
                ? 'text-[var(--text-default)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-default)]'
            )
          "
          :aria-selected="tab.value === activeValue"
          :aria-controls="`${testId}-panel-${tab.value}`"
          :tabindex="tab.value === activeValue ? 0 : -1"
          :data-testid="`${testId}__tab`"
          :data-state="tab.value === activeValue ? 'active' : 'inactive'"
          @click="setActiveTab(tab.value)"
          @keydown="onTabKeydown($event, tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div
      class="relative min-h-[320px] max-h-[320px] shrink-0 overflow-x-clip overflow-y-auto p-[var(--spacing-sm)]"
      :data-testid="`${testId}__content`"
    >
      <div class="absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)] z-[2]">
        <IconButton
          :icon="copyFeedback ? 'pi pi-check' : 'pi pi-copy'"
          :ariaLabel="copyAriaLabel"
          kind="outlined"
          size="small"
          :data-testid="`${testId}__copy`"
          @click="copyActiveCode"
        />
      </div>

      <div
        v-if="activeTab"
        role="tabpanel"
        :id="`${testId}-panel-${activeTab.value}`"
        :aria-labelledby="`${testId}-tab-${activeTab.value}`"
        :class="panelMotionClasses"
        :style="panelTransitionStyle"
        :data-testid="`${testId}__panel`"
      >
        <div
          class="flex flex-col gap-[var(--spacing-xs)] pr-[var(--spacing-xl)]"
          :data-testid="`${testId}__lines`"
        >
          <div
            v-for="(lineTokens, lineIndex) in highlightedLines"
            :key="`${activeTab.value}-${lineIndex}`"
            class="flex items-center gap-[var(--spacing-xs)]"
            :data-testid="`${testId}__line`"
          >
            <span
              v-if="showLineNumbers"
              class="text-label-code-sm w-4 shrink-0 text-center text-[var(--code-sintax-line-number)]"
              :data-testid="`${testId}__line-number`"
            >
              {{ formatLineNumber(lineIndex + 1) }}
            </span>
            <code
              class="text-label-code-sm min-w-0 flex-1 whitespace-pre-wrap break-words"
              :data-testid="`${testId}__line-content`"
            >
              <span
                v-for="(token, tokenIndex) in lineTokens"
                :key="tokenIndex"
                :class="getHighlightTokenClass(token.type)"
              >
                {{ token.text }}
              </span>
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
