<script setup lang="ts">
  import { useElementSize } from '@vueuse/core'
  import { computed, ref, useAttrs, watch } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { categoryLayout, type ChartStatus, colorToken } from '../_lib'

  defineOptions({ name: 'Tracker', inheritAttrs: false })

  /** One period of the strip. */
  export interface TrackerItem {
    /** Stable key for the period. */
    id?: string
    /** State of the period. No severity renders a neutral no-data block. */
    severity?: ChartStatus
    /** Period plus state, read in the readout and announced to assistive tech. */
    label: string
  }

  interface Props {
    /** One block per period, oldest first; each item is { id?: string; severity?: ChartStatus; label: string }. No severity renders a neutral no-data block. */
    items?: TrackerItem[]
    /** Renders a Skeleton strip in place of the blocks. */
    loading?: boolean
    /** Accessible name of the strip. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    loading: false,
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const dir = useDirection()
  const { t } = useTranslate({ tracker: en.tracker })
  const stripRef = ref<globalThis.HTMLDivElement | null>(null)
  const { width: stripWidth } = useElementSize(stripRef)

  const activeIndex = ref<number | null>(null)
  const shownIndex = ref<number | null>(null)
  const moving = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-tracker')
  const count = computed(() => (props.loading ? 0 : props.items.length))
  const isEmpty = computed(() => !props.loading && props.items.length === 0)

  const blocks = computed(() =>
    isEmpty.value
      ? [{ key: 'empty', severity: 'none', color: colorToken('other') }]
      : props.items.map((item, index) => ({
          key: item.id ?? String(index),
          severity: item.severity ?? 'none',
          color: colorToken(item.severity ?? 'other')
        }))
  )

  const announcement = computed(() => {
    if (props.loading) return ''
    if (isEmpty.value) return t('tracker.noData')
    return activeIndex.value === null ? '' : (props.items[activeIndex.value]?.label ?? '')
  })

  const readout = computed(() => {
    const index = shownIndex.value
    if (index === null || count.value === 0) return null
    const logical = categoryLayout(count.value, 0, stripWidth.value, true).position(index)
    const center = dir.value === 'rtl' ? stripWidth.value - logical : logical
    return {
      label: props.items[index]?.label ?? '',
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

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = count.value - 1
    if (last < 0) return
    const current = activeIndex.value
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') setActiveIndex(current === null ? 0 : Math.min(last, current + 1))
    else if (key === 'ArrowLeft') setActiveIndex(current === null ? last : Math.max(0, current - 1))
    else if (event.key === 'Home') setActiveIndex(0)
    else if (event.key === 'End') setActiveIndex(last)
    else if (event.key === 'Escape') setActiveIndex(null)
    else return
    event.preventDefault()
  }

  function onPointerMove(event: globalThis.PointerEvent) {
    const strip = stripRef.value
    if (!strip || !count.value) return
    const rect = strip.getBoundingClientRect()
    setActiveIndex(
      categoryLayout(count.value, 0, rect.width, true).indexAt(
        dir.value === 'rtl' ? rect.right - event.clientX : event.clientX - rect.left
      )
    )
  }

  function onPointerLeave() {
    setActiveIndex(null)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :aria-busy="loading || undefined"
    role="group"
    :aria-roledescription="t('tracker.roleDescription')"
    :aria-label="ariaLabel || undefined"
    tabindex="0"
    class="relative w-full min-w-0 rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)"
    @keydown="onKeydown"
  >
    <Skeleton
      v-if="loading"
      width="100%"
      height="2rem"
      :data-testid="`${testId}__skeleton`"
    />
    <template v-else>
      <div
        v-if="readout"
        :data-testid="`${testId}__readout`"
        :data-visible="activeIndex !== null || null"
        :data-moving="moving || null"
        aria-hidden="true"
        :style="{ left: 0, translate: readout.translate }"
        class="pointer-events-none absolute bottom-full mb-(--spacing-xs) w-max max-w-(--container-3xs) rounded-(--shape-elements) border border-(--chart-tooltip-border) bg-(--chart-tooltip-bg) px-(--spacing-sm) py-(--spacing-xs) text-label-md text-(--chart-tooltip-text) opacity-0 shadow-(--shadow-sm) transition-opacity duration-fast-02 ease-productive-entrance data-[moving]:transition-[translate,opacity] data-[visible]:opacity-100 motion-reduce:transition-none motion-reduce:data-[moving]:transition-none"
      >
        {{ readout.label }}
      </div>
      <div
        ref="stripRef"
        :data-testid="`${testId}__strip`"
        class="flex h-8 w-full gap-0.5"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <span
          v-for="(block, index) in blocks"
          :key="block.key"
          :data-testid="`${testId}__block`"
          :data-severity="block.severity"
          :data-active="(activeIndex !== null && index === activeIndex) || null"
          :data-dimmed="(activeIndex !== null && index !== activeIndex) || null"
          :style="{ '--tracker-block': block.color }"
          class="h-full min-w-0 flex-1 bg-(--tracker-block) forced-color-adjust-none transition-opacity duration-fast-02 ease-productive-entrance first:rounded-s-(--shape-elements) last:rounded-e-(--shape-elements) data-[dimmed]:opacity-40 motion-reduce:transition-none"
        />
      </div>
    </template>
    <p
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
  </div>
</template>
