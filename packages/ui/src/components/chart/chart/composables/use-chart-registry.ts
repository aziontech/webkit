import { computed, type ComputedRef, type Ref, shallowReactive } from 'vue'

import type {
  ChartAxisType,
  ChartMarkRegistration,
  ChartReferenceRegistration
} from '../injection-key'

export interface UseChartRegistryReturn {
  markList: ComputedRef<ChartMarkRegistration[]>
  axisKinds: ComputedRef<Set<ChartAxisType>>
  referenceList: ComputedRef<ChartReferenceRegistration[]>
  hasBrush: ComputedRef<boolean>
  registerMark: (read: () => ChartMarkRegistration) => () => void
  registerAxis: (read: () => ChartAxisType) => () => void
  registerBrush: () => () => void
  registerReference: (read: () => ChartReferenceRegistration | null) => () => void
}

function keep<T>(map: Map<symbol, T>, key: symbol, value: T): () => void {
  map.set(key, value)
  return () => {
    map.delete(key)
  }
}

export function useChartRegistry(mounted: Readonly<Ref<boolean>>): UseChartRegistryReturn {
  const marks = shallowReactive(new Map<symbol, () => ChartMarkRegistration>())
  const axes = shallowReactive(new Map<symbol, () => ChartAxisType>())
  const brushes = shallowReactive(new Set<symbol>())
  const references = shallowReactive(new Map<symbol, () => ChartReferenceRegistration | null>())

  return {
    markList: computed(() => [...marks.values()].map((read) => read())),
    axisKinds: computed(() => new Set([...axes.values()].map((read) => read()))),
    referenceList: computed(() =>
      mounted.value
        ? [...references.values()]
            .map((read) => read())
            .filter((entry): entry is ChartReferenceRegistration => entry !== null)
        : []
    ),
    hasBrush: computed(() => brushes.size > 0),
    registerMark: (read) => keep(marks, Symbol('mark'), read),
    registerAxis: (read) => keep(axes, Symbol('axis'), read),
    registerBrush: () => {
      const key = Symbol('brush')
      brushes.add(key)
      return () => {
        brushes.delete(key)
      }
    },
    registerReference: (read) => keep(references, Symbol('reference'), read)
  }
}
