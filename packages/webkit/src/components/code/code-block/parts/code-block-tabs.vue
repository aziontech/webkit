<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch
  } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../../composables/use-direction'
  import type { CodeBlockTab } from '../code-block.vue'
  import { layoutScale, tabTarget } from '../lib/layout'
  import { getCodeBlockIndicatorTransitionStyle } from '../presets/transitions'

  defineOptions({ name: 'CodeBlockTabs', inheritAttrs: false })

  interface Props {
    /** The tabs, in order. */
    tabs: CodeBlockTab[]
    /** Value of the selected tab. */
    value: string
    /** Prefix of the tab ids; each tab appends its index. */
    idPrefix: string
    /** Id of the panel the selected tab controls. */
    panelId: string
    /** Test id of the owning CodeBlock; each part appends its own name. */
    testId: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    select: [event: Event, value: string]
  }>()

  defineSlots<{
    'tab-icon'(props: { tab: CodeBlockTab }): unknown
  }>()

  const dir = useDirection()
  const listEl = ref<HTMLElement | null>(null)
  const tabEls = ref<HTMLElement[]>([])
  const visible = ref(false)
  const width = ref(0)
  const offset = ref(0)
  const valueIndex = computed(() => props.tabs.findIndex((tab) => tab.value === props.value))
  const selected = computed(() =>
    valueIndex.value === -1 && props.tabs.length ? 0 : valueIndex.value
  )
  const transition = getCodeBlockIndicatorTransitionStyle()
  let observer: ResizeObserver | null = null

  const setTabEl = (element: Element | ComponentPublicInstance | null, index: number) => {
    const el =
      element instanceof HTMLElement ? element : (element as ComponentPublicInstance | null)?.$el
    if (el instanceof HTMLElement) tabEls.value[index] = el
  }

  function sync(): void {
    const list = listEl.value
    const tab = tabEls.value[valueIndex.value]
    if (!list || !tab || valueIndex.value < 0) {
      visible.value = false
      return
    }
    const scale = layoutScale(list)
    width.value = tab.getBoundingClientRect().width / scale
    offset.value = (tab.getBoundingClientRect().left - list.getBoundingClientRect().left) / scale
    visible.value = true
  }

  function observe(): void {
    if (typeof ResizeObserver === 'undefined') return
    observer?.disconnect()
    observer = new ResizeObserver(sync)
    if (listEl.value) observer.observe(listEl.value)
    for (const element of tabEls.value) if (element) observer.observe(element)
  }

  const schedule = () =>
    void nextTick(() => {
      sync()
      observe()
    })

  function select(event: Event, value: string | undefined, focus: boolean): void {
    if (!value) return
    if (value !== props.value) emit('select', event, value)
    if (focus) tabEls.value[props.tabs.findIndex((tab) => tab.value === value)]?.focus()
  }

  function onKeydown(event: KeyboardEvent, value: string): void {
    const confirm = event.key === 'Enter' || event.key === ' '
    const target = confirm
      ? value
      : tabTarget(logicalArrowKey(event.key, dir.value), props.tabs, valueIndex.value)
    if (target === null) return
    event.preventDefault()
    select(event, target, !confirm)
  }

  onMounted(() => {
    schedule()
    observe()
  })
  watch(
    () => props.tabs,
    (tabs) => {
      tabEls.value = tabEls.value.slice(0, tabs.length)
      schedule()
    }
  )
  watch(() => props.value, schedule)
  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  const TAB_CLASS =
    'relative z-2 inline-flex h-8 shrink-0 items-center justify-center rounded-(--shape-control) px-(--spacing-sm) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ' +
    'ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[state=active]:text-(--text-default) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    class="relative shrink-0 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-2xs)"
    :data-testid="`${testId}__header`"
  >
    <div
      ref="listEl"
      role="tablist"
      class="relative flex items-center gap-(--spacing-2xs)"
      :data-testid="`${testId}__tabs`"
    >
      <span
        v-show="visible"
        class="pointer-events-none absolute inset-y-0 z-1 rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm) motion-reduce:transition-none"
        :style="[
          transition,
          { left: '0', width: `${width}px`, transform: `translate3d(${offset}px, 0, 0)` }
        ]"
        :data-testid="`${testId}__indicator`"
        aria-hidden="true"
      />
      <button
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :ref="(element) => setTabEl(element, index)"
        type="button"
        role="tab"
        :id="`${idPrefix}-${index}`"
        :class="TAB_CLASS"
        :aria-selected="index === selected"
        :aria-controls="index === selected ? panelId : undefined"
        :tabindex="index === selected ? 0 : -1"
        :data-testid="`${testId}__tab`"
        :data-state="index === selected ? 'active' : 'inactive'"
        @click="(event: MouseEvent) => select(event, tab.value, false)"
        @keydown="onKeydown($event, tab.value)"
      >
        <span
          v-if="$slots['tab-icon']"
          class="me-(--spacing-xs) flex size-3.5 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <slot
            name="tab-icon"
            :tab="tab"
          />
        </span>
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
