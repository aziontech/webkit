<script setup lang="ts">
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../composables/use-locale'
  import * as en from '../../../i18n/messages/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { type ChartColor, colorToken, formatCompact, isFiniteNumber } from '../_lib'

  defineOptions({ name: 'BarList', inheritAttrs: false })

  /** Row order of the list. */
  export type BarListSort = 'descending' | 'ascending' | 'none'

  /** One ranked row. */
  export interface BarListItem {
    /** Stable key for the row; falls back to the name and position. */
    id?: string
    /** Row label, drawn over the bar. */
    name: string
    /** Row value; sets the bar length against the largest value. */
    value: number
    /** When set, the row renders as a link to this URL. */
    href?: string
  }

  interface Props {
    /** Rows to rank. An item with href renders as a link. */
    items?: BarListItem[]
    /** Row order; none keeps the order of items. */
    sort?: BarListSort
    /** Hue of the bars: a categorical slot (1 to 6), other, or a status. The fill is that hue tinted over the surface. */
    color?: ChartColor
    /** Renders rows without an href as buttons that emit item-click. */
    clickable?: boolean
    /** Formats the value column. */
    formatValue?: (value: number) => string
    /** Renders Skeleton rows in place of the list. */
    loading?: boolean
    /** Title of the empty state shown when items is empty. Empty uses the locale catalog (`No data available`). */
    emptyTitle?: string
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    sort: 'descending',
    color: 1,
    clickable: false,
    formatValue: formatCompact,
    loading: false,
    emptyTitle: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** A row activated: a clickable row, or a link row (the link still navigates). */
    'item-click': [event: MouseEvent, item: BarListItem]
  }>()

  const attrs = useAttrs()
  const { t, locale } = useLocale({ barList: en.barList })
  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)
  const reducedMotion = usePreferredReducedMotion()
  const entered = ref(false)
  let frame = 0

  const SKELETON_WIDTHS = ['100%', '72%', '48%', '30%', '16%']

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-bar-list')

  const fill = computed(() => ({ '--bar-list-fill': colorToken(props.color) }))

  const magnitude = (value: number) => (isFiniteNumber(value) ? value : 0)

  const rows = computed(() => {
    const ordered = props.items.map((item, index) => ({ item, index }))
    if (props.sort === 'descending') {
      ordered.sort((a, b) => magnitude(b.item.value) - magnitude(a.item.value))
    } else if (props.sort === 'ascending') {
      ordered.sort((a, b) => magnitude(a.item.value) - magnitude(b.item.value))
    }
    const max = Math.max(0, ...ordered.map(({ item }) => magnitude(item.value)))
    return ordered.map(({ item, index }) => {
      const value = magnitude(item.value)
      const share = value > 0 && max > 0 ? Math.max(2, (value / max) * 100) : 0
      const href = item.href ?? ''
      return {
        key: item.id ?? `${item.name}-${index}`,
        item,
        href,
        tag: href ? 'a' : props.clickable ? 'button' : 'div',
        interactive: Boolean(href) || props.clickable,
        width: `${entered.value ? share : 0}%`,
        label: isFiniteNumber(item.value) ? valueText(item.value) : '–'
      }
    })
  })

  const isEmpty = computed(() => !props.loading && rows.value.length === 0)

  function onRowClick(event: MouseEvent, item: BarListItem, interactive: boolean) {
    if (!interactive) return
    emit('item-click', event, item)
  }

  onMounted(() => {
    if (reducedMotion.value === 'reduce') {
      entered.value = true
      return
    }
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0
        entered.value = true
      })
    })
  })

  onScopeDispose(() => {
    if (frame) globalThis.cancelAnimationFrame(frame)
  })
</script>

<template>
  <ol
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :aria-label="ariaLabel || undefined"
    :aria-busy="loading || undefined"
    :style="fill"
    class="flex min-w-0 list-none flex-col gap-(--spacing-xxs)"
  >
    <li
      v-if="loading"
      :data-testid="`${testId}__skeleton`"
      class="flex flex-col gap-(--spacing-xxs)"
    >
      <Skeleton
        v-for="width in SKELETON_WIDTHS"
        :key="width"
        :width="width"
        height="2rem"
      />
    </li>
    <li
      v-else-if="isEmpty"
      class="flex items-stretch"
    >
      <EmptyState
        :title="emptyTitle || t('barList.emptyTitle')"
        icon="pi pi-chart-bar"
        size="small"
        bordered
        :data-testid="`${testId}__empty`"
      />
    </li>
    <template v-else>
      <li
        v-for="row in rows"
        :key="row.key"
        class="min-w-0"
      >
        <component
          :is="row.tag"
          :href="row.href || undefined"
          :type="row.tag === 'button' ? 'button' : undefined"
          :data-interactive="row.interactive || null"
          :data-testid="`${testId}__row`"
          class="flex w-full min-w-0 items-center gap-(--spacing-md) rounded-(--shape-elements) pe-(--spacing-xs) text-start text-(--text-default) no-underline transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 data-[interactive]:cursor-pointer data-[interactive]:hover:bg-(--bg-hover)"
          @click="onRowClick($event, row.item, row.interactive)"
        >
          <span class="relative flex h-8 min-w-0 flex-1 items-center">
            <span
              aria-hidden="true"
              :data-testid="`${testId}__bar`"
              :style="{ width: row.width }"
              class="absolute inset-y-0 start-0 rounded-(--shape-elements) bg-[color-mix(in_srgb,var(--bar-list-fill)_24%,transparent)] transition-[width] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
            />
            <span class="relative min-w-0 truncate px-(--spacing-xs) text-label-md">
              {{ row.item.name }}
            </span>
          </span>
          <span class="sr-only">, </span>
          <span
            :data-testid="`${testId}__value`"
            class="shrink-0 text-end text-label-md tabular-nums"
          >
            {{ row.label }}
          </span>
        </component>
      </li>
    </template>
  </ol>
</template>
