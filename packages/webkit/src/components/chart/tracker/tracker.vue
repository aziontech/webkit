<script setup lang="ts">
  import { useElementSize } from '@vueuse/core'
  import { computed, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { categoryLayout, type ChartSemanticSeverity, colorToken } from '../lib'
  import { bucketCapacity, bucketOf, trackerBuckets } from './lib/tracker-buckets'

  defineOptions({ name: 'Tracker', inheritAttrs: false })

  /** One period of the strip. */
  export interface TrackerItem {
    /** Stable key for the period. */
    id?: string
    /** State of the period. No severity renders a neutral no-data block. */
    severity?: ChartSemanticSeverity
    /** Period plus state, read in the readout and announced to assistive tech. */
    label: string
  }

  export interface TrackerProps {
    /** One block per period, oldest first; each item is { id?: string; severity?: ChartSemanticSeverity; label: string }. No severity renders a neutral no-data block. */
    items?: TrackerItem[]
    /** Renders a Skeleton strip in place of the blocks. */
    loading?: boolean
    /** Error message; when set, the strip renders it inline in place of the blocks. */
    error?: string
    /** Accessible name of the strip. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<TrackerProps>(), {
    items: () => [],
    loading: false,
    error: '',
    ariaLabel: ''
  })

  /** Index of the active block, or null. Supports v-model:active-index to sync with a sibling chart. */
  const activeIndex = defineModel<number | null>('activeIndex', { default: null })

  defineSlots<{
    /** Replaces the inline error banner shown in place of the blocks while `error` is set. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const dir = useDirection()
  const { t } = useTranslate({ tracker: en.tracker })
  const rootEl = ref<globalThis.HTMLDivElement | null>(null)
  const stripEl = ref<globalThis.HTMLDivElement | null>(null)
  const { width: stripWidth } = useElementSize(stripEl)

  const uid = useId()
  const summaryId = `${uid}-summary`
  const shownIndex = ref<number | null>(null)
  const moving = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tracker')
  const hasError = computed(() => !props.loading && props.error.length > 0)
  const buckets = computed(() =>
    trackerBuckets(
      props.items.map((item) => item.severity),
      stripWidth.value ? bucketCapacity(stripWidth.value) : props.items.length
    )
  )
  const count = computed(() => (props.loading || hasError.value ? 0 : buckets.value.length))
  const activeBucket = computed(() => bucketOf(buckets.value, activeIndex.value))
  const bucketLabel = (index: number): string => {
    const bucket = buckets.value[index]
    if (!bucket) return ''
    const label = props.items[bucket.worst]?.label ?? ''
    if (bucket.start === bucket.end) return label
    return t('tracker.summaryWorst', { count: bucket.end - bucket.start + 1, label })
  }
  const isEmpty = computed(() => !props.loading && !hasError.value && props.items.length === 0)
  const statusOf = (item: TrackerItem): ChartSemanticSeverity | undefined => item.severity

  const WORST: ChartSemanticSeverity[] = ['danger', 'warning', 'info', 'success']
  const summary = computed<string>(() => {
    if (props.loading || hasError.value || isEmpty.value) return ''
    const statuses = props.items.map(statusOf)
    const worst = WORST.find((status) => statuses.includes(status))
    const worstItem = worst ? props.items.find((item) => statusOf(item) === worst) : undefined
    return worstItem
      ? t('tracker.summaryWorst', { count: props.items.length, label: worstItem.label })
      : t('tracker.summary', { count: props.items.length })
  })

  const blocks = computed(() =>
    buckets.value.map((bucket) => {
      const item = props.items[bucket.worst]
      return {
        key: props.items[bucket.start]?.id ?? String(bucket.start),
        severity: (item && statusOf(item)) ?? 'none',
        color: colorToken((item && statusOf(item)) ?? 'other')
      }
    })
  )

  const announcement = computed(() => {
    if (props.loading) return ''
    if (isEmpty.value) return t('tracker.noData')
    return activeBucket.value === null ? '' : bucketLabel(activeBucket.value)
  })

  const readout = computed(() => {
    const index = bucketOf(buckets.value, shownIndex.value)
    if (index === null || count.value === 0) return null
    const logical = categoryLayout(count.value, 0, stripWidth.value, true).position(index)
    const center = dir.value === 'rtl' ? stripWidth.value - logical : logical
    return {
      label: bucketLabel(index),
      translate: `clamp(0rem, calc(${center}px - 50%), calc(${stripWidth.value}px - 100%)) 0`
    }
  })

  watch(activeIndex, (next, previous) => {
    moving.value = next !== null && previous !== null
    if (next !== null) shownIndex.value = next
  })

  watch(
    () => props.items,
    () => {
      activeIndex.value = null
      shownIndex.value = null
    }
  )

  function setActiveIndex(index: number | null) {
    if (activeIndex.value !== index) activeIndex.value = index
  }

  const setActiveBucket = (index: number) => setActiveIndex(buckets.value[index]?.worst ?? null)

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = count.value - 1
    if (last < 0) return
    const current = activeBucket.value
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') setActiveBucket(current === null ? 0 : Math.min(last, current + 1))
    else if (key === 'ArrowLeft')
      setActiveBucket(current === null ? last : Math.max(0, current - 1))
    else if (event.key === 'Home') setActiveBucket(0)
    else if (event.key === 'End') setActiveBucket(last)
    else if (event.key === 'Escape') setActiveIndex(null)
    else return
    event.preventDefault()
  }

  useElementListener(rootEl, 'keydown', onKeydown)

  function onPointermove(event: globalThis.PointerEvent) {
    const strip = stripEl.value
    if (!strip || !count.value) return
    const rect = strip.getBoundingClientRect()
    setActiveBucket(
      categoryLayout(count.value, 0, rect.width, true).indexAt(
        dir.value === 'rtl' ? rect.right - event.clientX : event.clientX - rect.left
      )
    )
  }

  let release = (): void => {}

  function onTapOutside(event: globalThis.PointerEvent) {
    if (event.target instanceof globalThis.Node && rootEl.value?.contains(event.target)) return
    release()
    setActiveIndex(null)
  }

  function onPointerdown(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') {
      release()
      globalThis.document.addEventListener('pointerdown', onTapOutside, true)
      release = () => globalThis.document.removeEventListener('pointerdown', onTapOutside, true)
    }
    onPointermove(event)
  }

  onScopeDispose(() => release())

  function onPointerleave(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') return
    setActiveIndex(null)
  }

  const ERROR_CLASS =
    'flex h-8 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--danger-border) bg-(--danger) px-(--spacing-sm) text-label-sm text-(--danger-foreground) ' +
    'forced-color-adjust-none'

  const READOUT_CLASS =
    'pointer-events-none absolute bottom-full mb-(--spacing-xs) w-max max-w-(--container-3xs) rounded-(--shape-control) border border-(--chart-tooltip-border) bg-(--chart-tooltip-bg) ' +
    'px-(--spacing-sm) py-(--spacing-xs) text-label-md text-(--chart-tooltip-text) opacity-0 shadow-(--shadow-sm) transition-opacity duration-fast-02 ease-productive-entrance ' +
    'data-[moving]:transition-[translate,opacity] ' +
    'data-[state=open]:opacity-100 ' +
    'motion-reduce:transition-none motion-reduce:data-[moving]:transition-none'

  const EMPTY_CLASS =
    'flex h-full min-w-0 flex-1 items-center justify-center rounded-(--shape-control) border border-dashed border-(--border-default) ' +
    'text-label-sm text-(--text-muted)'

  const BLOCK_CLASS =
    'h-full min-w-0 flex-1 bg-(--tracker-block) forced-color-adjust-none transition-opacity duration-fast-02 ease-productive-entrance ' +
    'first:rounded-s-(--shape-control) last:rounded-e-(--shape-control) ' +
    'data-[dimmed]:opacity-40 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    data-plain-ground
    :data-loading="loading || null"
    :aria-busy="loading || undefined"
    role="group"
    :aria-roledescription="t('tracker.roleDescription')"
    :aria-label="ariaLabel || undefined"
    :aria-describedby="summary ? summaryId : undefined"
    :data-error="hasError || null"
    tabindex="0"
    class="relative w-full min-w-0 rounded-(--shape-control) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)"
  >
    <Skeleton
      v-if="loading"
      width="100%"
      height="2rem"
      :data-testid="`${testId}__loading`"
    />
    <template v-else-if="hasError">
      <slot name="error">
        <p
          role="alert"
          :data-testid="`${testId}__error`"
          :class="ERROR_CLASS"
        >
          <i
            class="az az-triangle-alert shrink-0"
            aria-hidden="true"
          />
          <span class="min-w-0 truncate">{{ error }}</span>
        </p>
      </slot>
    </template>
    <template v-else>
      <div
        v-if="readout"
        :data-testid="`${testId}__readout`"
        :data-state="activeIndex !== null ? 'open' : 'closed'"
        :data-moving="moving || null"
        aria-hidden="true"
        :style="{ left: 0, translate: readout.translate }"
        :class="READOUT_CLASS"
      >
        {{ readout.label }}
      </div>
      <div
        ref="stripEl"
        :data-testid="`${testId}__strip`"
        class="flex h-8 w-full touch-pan-y gap-0.5"
        @pointerdown="onPointerdown"
        @pointermove="onPointermove"
        @pointerleave="onPointerleave"
      >
        <span
          v-if="isEmpty"
          :data-testid="`${testId}__block`"
          data-severity="none"
          :class="EMPTY_CLASS"
          >{{ t('tracker.noData') }}</span
        >
        <template v-else>
          <span
            v-for="(block, index) in blocks"
            :key="block.key"
            :data-testid="`${testId}__block`"
            :data-severity="block.severity"
            :data-active="(activeBucket !== null && index === activeBucket) || null"
            :data-dimmed="(activeBucket !== null && index !== activeBucket) || null"
            :style="{ '--tracker-block': block.color }"
            :class="BLOCK_CLASS"
          />
        </template>
      </div>
    </template>
    <p
      v-if="summary"
      :id="summaryId"
      class="sr-only"
      :data-testid="`${testId}__summary`"
    >
      {{ summary }}
    </p>
    <ul
      v-if="!loading && !hasError && items.length"
      class="sr-only"
      :data-testid="`${testId}__list`"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id ?? String(index)"
      >
        {{ item.label }}
      </li>
    </ul>
    <p
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
  </div>
</template>
