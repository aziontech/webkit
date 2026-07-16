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
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import {
    codeBlockEnterOffsetClasses,
    codeBlockLineEnterMotion,
    type CodeBlockSlideDirection,
    getCodeBlockIndicatorTransitionStyle,
    getCodeBlockLineTransitionStyle,
    getCodeBlockPanelTransitionStyle
  } from './presets/transitions'
  import { resolveFileIcon } from './utils/file-icon'
  import {
    type CodeBlockHighlightToken,
    formatLineNumber,
    getHighlightTokenClass,
    highlightCode
  } from './utils/highlight-code'
  import {
    buildLineChangeMap,
    type CodeBlockLineChange,
    type CodeBlockLineState,
    getDiffMarker,
    resolveLineState
  } from './utils/line-decorations'

  export type { CodeBlockLineChange }

  export type CodeBlockTab = {
    label: string
    value: string
    code: string
    language?: string
    fileName?: string
    fileIcon?: string
    highlightedLine?: number
    lineChanges?: CodeBlockLineChange[]
  }

  defineOptions({
    name: 'CodeBlock',
    inheritAttrs: false
  })

  interface Props {
    /** Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata. */
    tabs?: CodeBlockTab[]
    /** Controlled active tab value (`v-model:value`). */
    value?: string
    /** Initial active tab when uncontrolled. */
    defaultValue?: string
    /** Shows a fixed-width gutter with zero-padded line numbers before each code line. */
    showLineNumbers?: boolean
    /** Accessible name for the copy control (forwarded to CopyButton's aria-label). */
    copyAriaLabel?: string
    /** Staggered line entrance for website / marketing layouts (opacity + slide from -8 px). */
    animateLines?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tabs: () => [],
    value: undefined,
    defaultValue: undefined,
    showLineNumbers: true,
    copyAriaLabel: 'Copy code',
    animateLines: false
  })

  const emit = defineEmits<{
    'update:value': [value: string]
    copy: [code: string]
  }>()

  const valueModel = defineModel<string | undefined>('value', { default: undefined })

  const attrs = useAttrs()
  const tabListRef = ref<HTMLElement | null>(null)
  const tabRefs = ref<HTMLElement[]>([])
  const indicatorVisible = ref(false)
  const indicatorWidth = ref(0)
  const indicatorOffsetX = ref(0)
  const internalValue = ref('')
  const slideDirection = ref<CodeBlockSlideDirection>(null)
  const panelMotionReady = ref(true)
  const linesMotionReady = ref(!props.animateLines)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'data-code-block')

  const normalizedTabs = computed(() =>
    props.tabs.filter((tab): tab is CodeBlockTab => Boolean(tab && tab.value && tab.code))
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

  const showTabHeader = computed(() => normalizedTabs.value.length > 1)

  const showFileNameBar = computed(() => Boolean(activeTab.value?.fileName))

  const showDiffGutter = computed(() => (activeTab.value?.lineChanges?.length ?? 0) > 0)

  const activeLineChangeMap = computed(() => buildLineChangeMap(activeTab.value?.lineChanges))

  const activeFileIcon = computed(() =>
    resolveFileIcon(activeTab.value?.language, activeTab.value?.fileIcon)
  )

  const highlightedLines = computed(() => {
    if (!activeTab.value) {
      return [] as CodeBlockHighlightToken[][]
    }

    return highlightCode(activeTab.value.code, activeTab.value.language)
  })

  const getLineState = (lineNumber: number): CodeBlockLineState =>
    resolveLineState(lineNumber, activeLineChangeMap.value, activeTab.value?.highlightedLine)

  const indicatorTransitionStyle = computed(() => getCodeBlockIndicatorTransitionStyle())

  const indicatorTransformStyle = computed(() => ({
    width: `${indicatorWidth.value}px`,
    transform: `translate3d(${indicatorOffsetX.value}px, 0, 0)`
  }))

  const panelTransitionStyle = computed(() => getCodeBlockPanelTransitionStyle())

  const panelEnterOffsetClass = computed(() => {
    if (slideDirection.value === 'right') {
      return codeBlockEnterOffsetClasses.right
    }

    if (slideDirection.value === 'left') {
      return codeBlockEnterOffsetClasses.left
    }

    return codeBlockEnterOffsetClasses.none
  })

  const panelMotionClasses = computed(() =>
    cn(
      'w-full transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
      panelMotionReady.value
        ? 'translate-x-0 opacity-100'
        : cn(panelEnterOffsetClass.value, 'opacity-0')
    )
  )

  const getLineMotionClasses = () =>
    cn(
      props.animateLines &&
        'transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
      props.animateLines &&
        (linesMotionReady.value
          ? 'translate-x-0 opacity-100'
          : cn(codeBlockLineEnterMotion.offsetClass, 'opacity-0'))
    )

  const getLineMotionStyle = (lineIndex: number) =>
    props.animateLines ? getCodeBlockLineTransitionStyle(lineIndex) : undefined

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
  ): CodeBlockSlideDirection => {
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

  const runLinesMotion = () => {
    if (!props.animateLines) {
      linesMotionReady.value = true
      return
    }

    linesMotionReady.value = false
    nextTick(() => {
      globalThis.requestAnimationFrame(() => {
        linesMotionReady.value = true
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
    runLinesMotion()
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

  const handleCopy = (code: string) => {
    emit('copy', code)
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

    if (props.animateLines) {
      runLinesMotion()
    }

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

  watch(
    () => props.animateLines,
    (enabled) => {
      if (enabled) {
        runLinesMotion()
        return
      }

      linesMotionReady.value = true
    }
  )
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
      v-if="showTabHeader"
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
              'relative z-[2] inline-flex h-12 shrink-0 items-center justify-center px-[var(--spacing-xs)] py-[var(--spacing-xs)]',
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
      v-if="showFileNameBar && activeTab"
      class="flex h-10 shrink-0 items-center gap-[var(--spacing-xs)] overflow-hidden border-b border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-sm)]"
      :data-testid="`${testId}__filename`"
    >
      <span
        class="flex size-4 shrink-0 items-center justify-center"
        :data-testid="`${testId}__filename-icon`"
      >
        <i
          :class="cn(activeFileIcon, 'text-label-code-sm text-[var(--text-default)]')"
          aria-hidden="true"
        />
      </span>
      <span
        class="text-label-code-sm min-w-0 flex-1 text-[var(--text-muted)]"
        :data-testid="`${testId}__filename-label`"
      >
        {{ activeTab.fileName }}
      </span>
    </div>

    <div
      class="relative flex h-[320px] shrink-0 flex-col"
      :data-testid="`${testId}__content`"
    >
      <div
        class="absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)] z-[2]"
        :data-testid="`${testId}__copy-anchor`"
      >
        <CopyButton
          :value="activeTab?.code ?? ''"
          :ariaLabel="copyAriaLabel"
          kind="outlined"
          size="small"
          :data-testid="`${testId}__copy`"
          @copy="handleCopy"
        />
      </div>

      <ScrollArea
        orientation="both"
        :class="
          cn(
            'min-h-0 min-w-0 flex-1 py-[var(--spacing-sm)]',
            'focus-visible:ring-offset-[var(--bg-surface)]'
          )
        "
        :data-testid="`${testId}__scroll`"
      >
        <div
          v-if="activeTab"
          :role="showTabHeader ? 'tabpanel' : undefined"
          :id="showTabHeader ? `${testId}-panel-${activeTab.value}` : undefined"
          :aria-labelledby="showTabHeader ? `${testId}-tab-${activeTab.value}` : undefined"
          :class="cn(panelMotionClasses, 'min-w-full w-max')"
          :style="panelTransitionStyle"
          :data-testid="`${testId}__panel`"
        >
          <div
            class="flex min-w-full w-max flex-col"
            :data-testid="`${testId}__lines`"
          >
            <div
              v-for="(lineTokens, lineIndex) in highlightedLines"
              :key="`${activeTab.value}-${lineIndex}`"
              :class="
                cn(
                  'group relative flex min-w-full w-max shrink-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-lg)] py-[var(--spacing-xxs)] text-label-code-sm',
                  'data-[state=added]:bg-[var(--success)] data-[state=removed]:bg-[var(--danger)] data-[state=highlighted]:bg-[var(--info)]',
                  getLineMotionClasses()
                )
              "
              :style="getLineMotionStyle(lineIndex)"
              :data-testid="`${testId}__line`"
              :data-state="getLineState(lineIndex + 1)"
            >
              <span
                class="pointer-events-none absolute inset-0 z-0 bg-[var(--bg-hover)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none group-hover:opacity-100"
                aria-hidden="true"
              />
              <span
                v-if="showDiffGutter"
                class="relative z-[1] w-2 shrink-0 text-center group-data-[state=added]:text-[var(--success-contrast)] group-data-[state=removed]:text-[var(--danger-contrast)]"
                :data-testid="`${testId}__diff-marker`"
                aria-hidden="true"
              >
                {{ getDiffMarker(getLineState(lineIndex + 1)) }}
              </span>
              <span
                v-if="showLineNumbers"
                class="relative z-[1] w-4 shrink-0 text-center text-[var(--code-sintax-line-number)]"
                :data-testid="`${testId}__line-number`"
              >
                {{ formatLineNumber(lineIndex + 1) }}
              </span>
              <code
                class="text-label-code-sm relative z-[1] shrink-0 whitespace-pre pr-[var(--spacing-xl)]"
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
              <span
                v-if="getLineState(lineIndex + 1) !== 'default'"
                :class="
                  cn(
                    'pointer-events-none absolute bottom-0 left-0 top-0 z-[2] w-[2px]',
                    'group-data-[state=added]:bg-[var(--success-border)] group-data-[state=removed]:bg-[var(--danger-border)] group-data-[state=highlighted]:bg-[var(--info-border)]'
                  )
                "
                aria-hidden="true"
                :data-testid="`${testId}__line-indicator`"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
