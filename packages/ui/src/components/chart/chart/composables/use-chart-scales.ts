import { computed, type ComputedRef, type Ref } from 'vue'

import {
  type CategoryLayout,
  type ChartLabel,
  type ChartLabelScale,
  type ChartRange,
  type LinearScale,
  maxOf,
  niceTicks,
  type NormalizedSeries
} from '../../lib'
import type { ChartPlotBox } from '../injection-key'
import {
  categoryFor,
  clampRange,
  dataMaxOf,
  plotBox,
  plotInsets,
  valueScaleFor
} from '../lib/chart-layout'
import type { UseChartRegistryReturn } from './use-chart-registry'

export interface UseChartScalesOptions {
  registry: UseChartRegistryReturn
  labels: Readonly<Ref<ChartLabel[]>>
  count: Readonly<Ref<number>>
  resolveSeries: (ids: readonly string[]) => NormalizedSeries[]
  min: () => number
  max: () => number | undefined
  vertical: Readonly<Ref<boolean>>
  rtl: Readonly<Ref<boolean>>
  labelScale: () => ChartLabelScale
  width: Readonly<Ref<number>>
  height: Readonly<Ref<number>>
  span: () => ChartRange | null
  valueText: (value: number) => string
  labelText: (label: ChartLabel) => string
}

export interface UseChartScalesReturn {
  size: ComputedRef<{ width: number; height: number }>
  plot: ComputedRef<ChartPlotBox>
  valueTicks: ComputedRef<number[]>
  valueScale: ComputedRef<LinearScale>
  baseline: ComputedRef<number>
  category: ComputedRef<CategoryLayout>
  selection: ComputedRef<ChartRange | null>
}

function useValueDomain(options: UseChartScalesOptions): {
  domainMax: ComputedRef<number>
  valueTicks: ComputedRef<number[]>
} {
  const { markList, referenceList } = options.registry
  const extentMax = computed(() =>
    Math.max(
      dataMaxOf(markList.value, options.resolveSeries, options.count.value),
      maxOf(referenceList.value.map((entry) => entry.high))
    )
  )
  const ticks = computed(() => niceTicks(options.min(), options.max() ?? extentMax.value, 4))
  const domainMax = computed(() => {
    const max = options.max()
    if (max !== undefined) return max
    const fitted = markList.value.some((mark) => mark.fit)
    return fitted && extentMax.value > options.min() ? extentMax.value : ticks.value.max
  })
  const valueTicks = computed(() =>
    ticks.value.ticks.filter((tick) => tick >= options.min() && tick <= domainMax.value)
  )
  return { domainMax, valueTicks }
}

export function useChartScales(options: UseChartScalesOptions): UseChartScalesReturn {
  const { markList, axisKinds } = options.registry
  const { labels, count } = options
  const size = computed(() => ({ width: options.width.value, height: options.height.value }))
  const { domainMax, valueTicks } = useValueDomain(options)
  const plot = computed(() => {
    const insets = plotInsets({
      hasX: axisKinds.value.has('x'),
      hasY: axisKinds.value.has('y'),
      vertical: options.vertical.value,
      rtl: options.rtl.value,
      labeled: markList.value.some((mark) => mark.labeled),
      valueChars: Math.max(1, ...valueTicks.value.map((tick) => options.valueText(tick).length)),
      categoryChars: maxOf(
        labels.value.map((label) => options.labelText(label).length),
        1
      )
    })
    return plotBox(insets, size.value)
  })
  const valueScale = computed(() =>
    valueScaleFor(
      options.vertical.value,
      options.rtl.value,
      [options.min(), domainMax.value],
      plot.value
    )
  )
  const category = computed(() =>
    categoryFor(
      options.vertical.value,
      options.rtl.value,
      options.labelScale(),
      labels.value,
      !options.vertical.value || markList.value.some((mark) => mark.type === 'bar'),
      plot.value
    )
  )
  return {
    size,
    plot,
    valueTicks,
    valueScale,
    baseline: computed(() => valueScale.value(options.min())),
    category,
    selection: computed(() => clampRange(options.span(), count.value))
  }
}
