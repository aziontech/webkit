import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type {
  CategoryLayout,
  ChartLabel,
  ChartMarkKind,
  LinearScale,
  NormalizedSeries
} from '../_lib'

export type ChartOrientation = 'vertical' | 'horizontal'

export type ChartAxisKind = 'x' | 'y'

export interface ChartPlotBox {
  left: number
  top: number
  width: number
  height: number
}

export interface ChartMarkRegistration {
  kind: ChartMarkKind
  stacked: boolean
  labeled: boolean
  ids: readonly string[]
}

export interface ChartContext {
  testId: string
  orientation: Readonly<Ref<ChartOrientation>>
  series: ComputedRef<NormalizedSeries[]>
  visibleSeries: ComputedRef<NormalizedSeries[]>
  hidden: ComputedRef<ReadonlySet<string>>
  labels: ComputedRef<ChartLabel[]>
  size: ComputedRef<{ width: number; height: number }>
  plot: ComputedRef<ChartPlotBox>
  valueScale: ComputedRef<LinearScale>
  valueTicks: ComputedRef<number[]>
  baseline: ComputedRef<number>
  category: ComputedRef<CategoryLayout>
  activeIndex: Readonly<Ref<number | null>>
  emphasized: Readonly<Ref<string | null>>
  entered: Readonly<Ref<boolean>>
  formatValue: (value: number) => string
  formatLabel: (label: ChartLabel) => string
  resolveSeries: (ids: readonly string[]) => NormalizedSeries[]
  markKindOf: (id: string) => ChartMarkKind
  setActiveIndex: (index: number | null) => void
  setEmphasized: (id: string | null) => void
  toggleSeries: (event: MouseEvent, id: string) => void
  registerMark: (read: () => ChartMarkRegistration) => () => void
  registerAxis: (read: () => ChartAxisKind) => () => void
}

export const ChartInjectionKey: InjectionKey<ChartContext> = Symbol('Chart')
