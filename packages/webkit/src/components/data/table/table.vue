<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useId
  } from 'vue'

  import { type AppliedFilter, type TableDensity, TableInjectionKey } from './injection-key'

  defineOptions({
    name: 'Table',
    inheritAttrs: false
  })

  interface Props {
    /** Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic. */
    maxHeight?: string
    /** Draw the outer card border around the table (off by default; the table is typically framed by a surrounding surface). */
    bordered?: boolean
    /** Density of the body cells: `compact` shrinks their height and padding. */
    density?: TableDensity
    /** Cell text wraps onto several lines instead of truncating. */
    wrapLines?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    maxHeight: '',
    bordered: false,
    density: 'comfortable',
    wrapLines: false
  })

  defineSlots<{
    /** The scrollable region: TableCaption, TableHeader, TableBody. */
    default(): unknown
    /** Title text at the start of the toolbar band. */
    title(): unknown
    /** Toolbar action band beside the title. */
    toolbar(): unknown
    /** Footer region below the scroll viewport. */
    footer(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table'
  )

  const captionId = `${useId()}-caption`
  const captions = ref<number>(0)
  const registerCaption = (): (() => void) => {
    captions.value++
    return () => captions.value--
  }
  const splitAttrs = computed<Record<string, unknown>[]>(() => {
    const frame: Record<string, unknown> = {}
    const own: Record<string, unknown> = {}
    for (const name in attrs) (name.startsWith('aria-') ? own : frame)[name] = attrs[name]
    return [frame, own]
  })
  const tableAttrs = computed<Record<string, unknown>>(() => {
    const own = splitAttrs.value[1]
    return captions.value && !own['aria-label'] && !own['aria-labelledby']
      ? { ...own, 'aria-labelledby': captionId }
      : own
  })

  const viewportHeightVar = computed<Record<string, string> | undefined>(() =>
    props.maxHeight ? { '--table-viewport-height': props.maxHeight } : undefined
  )

  const noop = (): void => {}
  provide(TableInjectionKey, {
    testId: testId.value,
    table: computed(() => null),
    selectedRows: computed(() => []),
    selectedCount: computed(() => 0),
    clearSelection: noop,
    loading: computed(() => false),
    filterFields: computed(() => []),
    appliedFilters: computed(() => []),
    applyFilters: noop,
    removeFilter: noop,
    clearFilters: noop,
    editingFilter: ref<AppliedFilter | null>(null),
    editFilter: noop,
    exportCsv: () => Promise.resolve(),
    reload: noop,
    captionId,
    registerCaption
  })

  const viewportEl = ref<HTMLElement | null>(null)
  const overflowStart = ref<boolean>(false)
  const overflowEnd = ref<boolean>(false)
  const measureEdges = (): void => {
    const el = viewportEl.value
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    overflowStart.value = offset > 1
    overflowEnd.value = el.scrollWidth - el.clientWidth - offset > 1
  }
  let edgeObserver: ResizeObserver | null = null
  onMounted(() => {
    void nextTick(() => {
      measureEdges()
      const el = viewportEl.value
      if (!el || typeof ResizeObserver === 'undefined') return
      edgeObserver = new ResizeObserver(measureEdges)
      edgeObserver.observe(el)
      if (el.firstElementChild) edgeObserver.observe(el.firstElementChild)
    })
  })
  onBeforeUnmount(() => edgeObserver?.disconnect())
</script>

<template>
  <div
    v-bind="splitAttrs[0]"
    :data-testid="testId"
    :data-bordered="bordered || null"
    :data-density="density"
    :data-wrap="wrapLines || null"
    :style="viewportHeightVar"
    class="@container/table data-[density=compact]:[&_[role=cell]]:min-h-9 data-[density=compact]:[&_[role=cell]]:py-(--spacing-2xs) data-[wrap]:[&_[role=cell]]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:break-words flex w-full flex-col overflow-hidden rounded-(--shape-control) bg-(--bg-surface) text-(--text-default) text-body-sm data-[bordered]:border-(length:--border-width-default) data-[bordered]:border-solid data-[bordered]:border-(--border-default)"
  >
    <div
      v-if="$slots['title'] || $slots['toolbar']"
      role="presentation"
      :data-testid="`${testId}__toolbar`"
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
    >
      <div
        v-if="$slots['title']"
        class="text-label-md text-(--text-default)"
      >
        <slot name="title" />
      </div>
      <div
        v-if="$slots['toolbar']"
        class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-(--spacing-xs) @max-md/table:basis-full @max-md/table:justify-start"
      >
        <slot name="toolbar" />
      </div>
    </div>

    <div
      ref="viewportEl"
      tabindex="0"
      :data-scroll="maxHeight ? 'both' : 'horizontal'"
      :data-testid="`${testId}__viewport`"
      class="relative min-h-0 min-w-0 max-h-(--table-viewport-height) overflow-x-auto overflow-y-hidden data-[scroll=both]:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--border-default) motion-reduce:scroll-auto"
      @scroll.passive="measureEdges"
    >
      <div
        class="group/table flex w-max min-w-full flex-col"
        :data-overflow-start="overflowStart || undefined"
        :data-overflow-end="overflowEnd || undefined"
      >
        <div
          v-bind="tableAttrs"
          role="table"
          :data-testid="`${testId}__table`"
          class="flex w-full flex-col"
        >
          <slot />
        </div>
      </div>
    </div>

    <slot name="footer" />
  </div>
</template>
