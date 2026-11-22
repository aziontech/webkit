<script setup lang="ts">
  import { useElementSize, useMounted } from '@vueuse/core'
  import { computed, onMounted, ref, shallowRef, useAttrs, useId, watch } from 'vue'

  import { useChartEntrance } from '../../../composables/use-chart-entrance'
  import { useChartLabelling } from '../../../composables/use-chart-labelling'
  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { NETWORK_MAP_LAND, NETWORK_MAP_REGIONS } from '../../content/network-map/network-map-data'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import ChartDataTable, { type ChartDataTableRow } from '../chart/parts/chart-data-table.vue'
  import ChartFrame from '../chart/parts/chart-frame.vue'
  import ChartTooltipPanel from '../chart/parts/chart-tooltip-panel.vue'
  import {
    CHART_STATE_SLOTS,
    type ChartColor,
    colorToken,
    formatCompact,
    isFiniteNumber,
    maxOf,
    minOf,
    STEP_BACKWARD,
    STEP_FORWARD,
    stepIndex
  } from '../lib'

  defineOptions({ name: 'MapChart', inheritAttrs: false })

  export type MapChartView =
    | 'world'
    | 'americas'
    | 'north-america'
    | 'south-america'
    | 'europe'
    | 'africa'
    | 'asia'
    | 'oceania'

  export interface MapChartRegion {
    /** ISO 3166-1 alpha-2 country code, such as `BR`. */
    id: string
    /** Reading for the country; null leaves it unshaded. */
    value: number | null
    /** Display name; empty uses the locale's country name. */
    name?: string
  }

  export interface MapChartPoint {
    /** Stable id of the location. */
    id: string
    /** Display name, such as a city or a data center. */
    name: string
    /** Latitude in degrees. */
    lat: number
    /** Longitude in degrees. */
    lon: number
    /** Reading for the location; the bubble area follows it. */
    value: number
    /** Series slot, status or severity color of the bubble. */
    color?: ChartColor
  }

  export interface MapChartProps {
    /** Countries shaded by value on a five-step sequential scale. */
    regions?: MapChartRegion[]
    /** Locations drawn as bubbles sized by value. */
    points?: MapChartPoint[]
    /** Part of the world the map frames. */
    view?: MapChartView
    /** Formats values in the tooltip, legend and table. */
    formatValue?: (value: number) => string
    /** Renders a Skeleton sized to the map and suppresses interaction. */
    loading?: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching?: boolean
    /** Error message; when set, a danger Alert replaces the map. */
    error?: string
    /** Title of the empty state shown when no region or point has a value. Empty uses the locale catalog (`No data available`). */
    emptyTitle?: string
    /** Supporting line under the empty title: why the range is empty, or what to do next. */
    emptyDescription?: string
    /** Shows the data table in place of the map. The table is always present for assistive tech. */
    tableView?: boolean
    /** Accessible name of the map when it is not inside a ChartCard with a title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<MapChartProps>(), {
    regions: () => [],
    points: () => [],
    view: 'world',
    formatValue: formatCompact,
    loading: false,
    refetching: false,
    error: '',
    emptyTitle: '',
    emptyDescription: '',
    tableView: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'region-click': [event: MouseEvent | globalThis.KeyboardEvent, region: MapChartRegion]
    'point-click': [event: MouseEvent | globalThis.KeyboardEvent, point: MapChartPoint]
  }>()

  const activeKey = defineModel<string | null>('activeKey', { default: null })

  defineSlots<{
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Actions under the default EmptyState, such as a Clear filters button. */
    'empty-actions'(): unknown
    /** Replaces the default danger Alert. */
    error(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ mapChart: en.mapChart })
  const direction = useDirection()
  const mounted = useMounted()
  const uid = useId()
  const stageEl = ref<globalThis.HTMLElement | null>(null)
  const { width: stageWidth, height: stageHeight } = useElementSize(stageEl)
  const geometry = shallowRef<Readonly<Record<string, string>> | null>(null)

  const X0 = 741
  const KX = 4.83
  const Y0 = 605
  const RY = 276.7
  const BINS = 5
  const CELL = /M(\d+) (\d+)h(\d+)/g

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'map-chart')
  const summaryId = `${uid}-summary`
  const patternId = `${uid}-cell`

  const valueText = (value: number): string =>
    props.formatValue === formatCompact
      ? formatCompact(value, locale.value)
      : props.formatValue(value)

  const regionNames = computed(() => {
    try {
      return new Intl.DisplayNames([locale.value], { type: 'region' })
    } catch {
      return null
    }
  })
  const regionName = (region: MapChartRegion) => {
    if (region.name) return region.name
    try {
      return regionNames.value?.of(region.id.toUpperCase()) ?? region.id
    } catch {
      return region.id
    }
  }

  const project = (lat: number, lon: number): [number, number] => {
    const clamped = (Math.max(-80, Math.min(84, lat)) * Math.PI) / 180
    return [X0 + KX * lon, Y0 - RY * Math.log(Math.tan(Math.PI / 4 + clamped / 2))]
  }

  const box = computed(() => {
    const [x, y, width, height] = NETWORK_MAP_REGIONS[props.view].split(' ').map(Number)
    return { x: x ?? 0, y: y ?? 0, width: width ?? 1590, height: height ?? 940 }
  })
  const viewBox = computed(
    () => `${box.value.x} ${box.value.y} ${box.value.width} ${box.value.height}`
  )

  const shaded = computed(() =>
    props.regions.filter((region): region is MapChartRegion & { value: number } =>
      isFiniteNumber(region.value)
    )
  )
  const domain = computed(() => {
    const values = shaded.value.map((region) => region.value)
    return values.length
      ? { min: minOf(values, Infinity), max: maxOf(values, -Infinity) }
      : { min: 0, max: 0 }
  })
  const binOf = (value: number) => {
    const { min, max } = domain.value
    if (max <= min) return BINS - 1
    return Math.min(BINS - 1, Math.floor(((value - min) / (max - min)) * BINS))
  }
  const binColor = (bin: number) => `var(--chart-sequential-${bin + 3})`

  const anchorOf = (cells: string): [number, number] | null => {
    let sumX = 0
    let sumY = 0
    let count = 0
    for (const match of cells.matchAll(CELL)) {
      const width = Number(match[3])
      sumX += (Number(match[1]) + width / 2) * width
      sumY += (Number(match[2]) + 2.5) * width
      count += width
    }
    return count ? [sumX / count, sumY / count] : null
  }

  const shapes = computed(() => {
    const cells = geometry.value
    if (!cells) return []
    return shaded.value.flatMap((region) => {
      const d = cells[region.id.toUpperCase()]
      return d ? [{ id: region.id, d, bin: binOf(region.value) }] : []
    })
  })

  const maxPoint = computed(() =>
    maxOf(props.points.filter((point) => isFiniteNumber(point.value)).map((p) => p.value))
  )
  const bubbles = computed(() =>
    props.points
      .filter((point) => isFiniteNumber(point.value))
      .map((point) => {
        const [x, y] = project(point.lat, point.lon)
        const ratio = maxPoint.value > 0 ? Math.sqrt(Math.max(0, point.value) / maxPoint.value) : 0
        return {
          id: point.id,
          x,
          y,
          r: 8 + 24 * ratio,
          color: colorToken(point.color ?? 1),
          source: point
        }
      })
      .sort((a, b) => b.r - a.r)
  )

  interface MapItem {
    kind: 'region' | 'point'
    id: string
    name: string
    value: number
    anchor: [number, number] | null
    region?: MapChartRegion
    point?: MapChartPoint
  }

  const items = computed<MapItem[]>(() => {
    const cells = geometry.value
    const regionItems = [...shaded.value]
      .sort((a, b) => b.value - a.value)
      .map<MapItem>((region) => {
        const d = cells?.[region.id.toUpperCase()]
        return {
          kind: 'region',
          id: region.id,
          name: regionName(region),
          value: region.value,
          anchor: d ? anchorOf(d) : null,
          region
        }
      })
    const pointItems = [...props.points]
      .filter((point) => isFiniteNumber(point.value))
      .sort((a, b) => b.value - a.value)
      .map<MapItem>((point) => ({
        kind: 'point',
        id: point.id,
        name: point.name,
        value: point.value,
        anchor: project(point.lat, point.lon),
        point
      }))
    return [...regionItems, ...pointItems]
  })

  const active = computed(() => items.value.find((item) => item.id === activeKey.value) ?? null)
  const total = computed(() => items.value.reduce((sum, item) => sum + item.value, 0))

  const hasError = computed(() => props.error.length > 0)
  const isEmpty = computed(() => items.value.length === 0)
  const showMap = computed(
    () => !props.loading && !hasError.value && !isEmpty.value && !props.tableView
  )

  const legend = computed(() =>
    shaded.value.length
      ? {
          min: valueText(domain.value.min),
          max: valueText(domain.value.max),
          bins: Array.from({ length: BINS }, (_, bin) => binColor(bin))
        }
      : null
  )

  const tableColumns = computed(() => [t('mapChart.name'), t('mapChart.value')])
  const tableRows = computed(() =>
    items.value.map<ChartDataTableRow>((item) => ({
      key: `${item.kind}-${item.id}`,
      header: item.name,
      cells: [valueText(item.value)]
    }))
  )

  const summary = computed(() =>
    t('mapChart.summary', { count: items.value.length, total: valueText(total.value) })
  )
  const announcement = computed(() =>
    active.value ? `${active.value.name}: ${valueText(active.value.value)}` : ''
  )

  const readout = computed(() => {
    const item = active.value
    if (!item?.anchor || !stageWidth.value) return null
    const scale = Math.min(
      stageWidth.value / box.value.width,
      stageHeight.value / box.value.height || Number.POSITIVE_INFINITY
    )
    const offsetX = (stageWidth.value - box.value.width * scale) / 2
    const offsetY = (stageHeight.value - box.value.height * scale) / 2
    const x = offsetX + (item.anchor[0] - box.value.x) * scale
    const y = offsetY + (item.anchor[1] - box.value.y) * scale
    return {
      x,
      y,
      side: x < stageWidth.value / 2 ? 'end' : 'start',
      name: item.name,
      value: valueText(item.value)
    }
  })

  const { accessibleName, labelledBy, describedBy } = useChartLabelling(
    () => props.ariaLabel,
    summaryId
  )

  async function loadGeometry() {
    if (geometry.value || !props.regions.length) return
    const module = await import('./map-chart-countries')
    geometry.value = module.MAP_CHART_COUNTRIES
  }

  onMounted(() => {
    void loadGeometry()
  })

  watch(
    () => props.regions.length,
    () => {
      if (mounted.value) void loadGeometry()
    }
  )

  const { entered } = useChartEntrance({ show: showMap, ready: mounted })

  function setActive(id: string | null) {
    if (activeKey.value !== id) activeKey.value = id
  }

  function activate(event: MouseEvent | globalThis.KeyboardEvent, item: MapItem | null) {
    if (!item) return
    if (item.region) emit('region-click', event, item.region)
    else if (item.point) emit('point-click', event, item.point)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const last = items.value.length - 1
    if (last < 0) return
    const at = items.value.findIndex((item) => item.id === activeKey.value)
    const key = logicalArrowKey(event.key, direction.value)
    const pick = (index: number) => setActive(items.value[index]?.id ?? null)
    const target = stepIndex(key, at === -1 ? null : at, last, STEP_FORWARD, STEP_BACKWARD)
    if (target !== undefined) pick(target)
    else if (key === 'Escape') setActive(null)
    else if (key === 'Enter' || key === ' ') activate(event, active.value)
    else return
    event.preventDefault()
  }

  function onClick(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target : null
    const mark = target?.closest('[data-region], [data-point]')
    const id = mark?.getAttribute('data-region') ?? mark?.getAttribute('data-point')
    if (!id) return
    const item = items.value.find((entry) => entry.id === id) ?? null
    setActive(id)
    activate(event, item)
  }

  useElementListener(stageEl, 'keydown', onKeydown)
  useElementListener(stageEl, 'click', onClick)

  const dimmed = (id: string) => activeKey.value !== null && activeKey.value !== id

  const REGION_CLASS =
    'cursor-pointer opacity-0 transition-opacity duration-slow-01 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[entered]:opacity-100 data-[entered]:data-[dimmed]:opacity-40'

  const BUBBLE_CLASS =
    'cursor-pointer opacity-0 transition-opacity duration-slow-01 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[entered]:opacity-100 data-[entered]:data-[dimmed]:opacity-40'
</script>

<template>
  <ChartFrame
    v-bind="$attrs"
    data-plain-ground
    :data-testid="testId"
    :data-view="view"
    :data-active="activeKey !== null || null"
    :data-geometry="regions.length ? (geometry ? 'ready' : 'loading') : null"
    :loading="loading"
    :refetching="refetching"
    :error="error"
    :drawable="!isEmpty"
    :table-view="tableView"
    :empty-title="emptyTitle || t('mapChart.emptyTitle')"
    :empty-description="emptyDescription"
    empty-icon="az az-globe"
    state-class="not-data-[error]:min-h-60"
    :summary-id="summaryId"
    :summary="summary"
    :announcement="announcement"
    :test-id="testId"
    class="flex flex-col gap-(--spacing-sm) transition-opacity duration-moderate-01 motion-reduce:transition-none data-[refetching]:opacity-60"
  >
    <template #loading>
      <div
        :style="{ aspectRatio: `${box.width} / ${box.height}` }"
        class="w-full"
      >
        <Skeleton
          width="100%"
          height="100%"
          :data-testid="`${testId}__loading`"
        />
      </div>
    </template>
    <template #table>
      <div class="min-h-0 overflow-auto">
        <ChartDataTable
          :data-testid="`${testId}__table`"
          :caption="ariaLabel || summary"
          :columns="tableColumns"
          :rows="tableRows"
        />
      </div>
    </template>
    <div
      ref="stageEl"
      role="group"
      :aria-roledescription="t('mapChart.roleDescription')"
      tabindex="0"
      :aria-label="accessibleName"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :data-testid="`${testId}__plot`"
      :style="{ aspectRatio: `${box.width} / ${box.height}` }"
      class="relative w-full min-w-0 rounded-(--shape-control) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    >
      <svg
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        class="absolute inset-0 block size-full"
        @pointerleave="setActive(null)"
      >
        <defs>
          <pattern
            :id="`${patternId}-land`"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="5"
              height="5"
              fill="var(--chart-axis)"
            />
          </pattern>
          <pattern
            v-for="(color, bin) in legend ? legend.bins : []"
            :id="`${patternId}-${bin}`"
            :key="bin"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="5"
              height="5"
              :fill="color"
            />
          </pattern>
        </defs>
        <path
          :d="NETWORK_MAP_LAND"
          :fill="`url(#${patternId}-land)`"
        />
        <path
          v-for="shape in shapes"
          :key="shape.id"
          :d="shape.d"
          :fill="`url(#${patternId}-${shape.bin})`"
          stroke="transparent"
          stroke-width="5"
          :data-region="shape.id"
          :data-bin="shape.bin"
          :data-dimmed="dimmed(shape.id) || null"
          :data-entered="entered || null"
          :class="REGION_CLASS"
          @pointerenter="setActive(shape.id)"
        />
        <circle
          v-for="bubble in bubbles"
          :key="bubble.id"
          :cx="bubble.x"
          :cy="bubble.y"
          :r="bubble.r"
          :fill="bubble.color"
          fill-opacity="0.75"
          :stroke="activeKey === bubble.id ? 'var(--text-default)' : 'var(--bg-surface)'"
          :stroke-width="activeKey === bubble.id ? 2 : 1"
          vector-effect="non-scaling-stroke"
          :data-point="bubble.id"
          :data-dimmed="dimmed(bubble.id) || null"
          :data-entered="entered || null"
          :class="BUBBLE_CLASS"
          @pointerenter="setActive(bubble.id)"
        />
      </svg>
      <div
        v-if="readout"
        aria-hidden="true"
        :style="{ left: '0', translate: `${readout.x}px ${readout.y}px` }"
        :data-testid="`${testId}__tooltip`"
        class="pointer-events-none absolute top-0"
      >
        <ChartTooltipPanel
          :title="readout.name"
          :side="readout.side"
          class="-translate-y-1/2"
        >
          <span class="px-(--spacing-sm) py-(--spacing-xs) text-label-code-md tabular-nums">
            {{ readout.value }}
          </span>
        </ChartTooltipPanel>
      </div>
    </div>
    <div
      v-if="legend"
      :data-testid="`${testId}__legend`"
      class="flex items-center gap-(--spacing-xs) text-label-sm tabular-nums text-(--text-muted)"
    >
      <span aria-hidden="true">{{ legend.min }}</span>
      <span
        aria-hidden="true"
        class="flex overflow-hidden rounded-(--shape-control)"
      >
        <span
          v-for="color in legend.bins"
          :key="color"
          :style="{ '--map-chart-key': color }"
          class="h-2.5 w-6 bg-(--map-chart-key)"
        />
      </span>
      <span aria-hidden="true">{{ legend.max }}</span>
      <span class="sr-only">{{ t('mapChart.legend', { min: legend.min, max: legend.max }) }}</span>
    </div>
    <template #twin>
      <ChartDataTable
        :data-testid="`${testId}__twin`"
        :caption="ariaLabel || summary"
        :columns="tableColumns"
        :rows="tableRows"
      />
    </template>
    <template
      v-for="name in CHART_STATE_SLOTS.filter((slot) => $slots[slot])"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ChartFrame>
</template>
