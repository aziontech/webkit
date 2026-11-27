import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import type {
  FilteringProperty,
  PropertyFilterOperator,
  PropertyFilterOption
} from '../../../../composables/use-collection/lib/property-filter'

export type PropertyFilterValueStage = {
  property: FilteringProperty
  operator: PropertyFilterOperator
  value: string
}

export type PropertyFilterValueLoader = (
  property: FilteringProperty,
  text: string
) => Promise<PropertyFilterOption[]>

export interface UsePropertyFilterValuesOptions {
  stage: MaybeRefOrGetter<PropertyFilterValueStage | null>
  loadValues: MaybeRefOrGetter<PropertyFilterValueLoader | undefined>
}

export interface UsePropertyFilterValuesReturn {
  loadedValues: Readonly<Ref<readonly PropertyFilterOption[] | null>>
  valueRows: ComputedRef<'loading' | 'error' | null>
  loadedLabel: (propertyKey: string, value: string) => string | undefined
}

const labelKey = (propertyKey: string, value: string): string => `${propertyKey}\u0000${value}`

export function usePropertyFilterValues(
  options: UsePropertyFilterValuesOptions
): UsePropertyFilterValuesReturn {
  const loadedValues = ref<PropertyFilterOption[] | null>(null)
  const valuesLoading = ref<boolean>(false)
  const valuesFailed = ref<boolean>(false)
  const loadedLabels = new Map<string, string>()
  let loadId = 0
  const remoteStage = (): PropertyFilterValueStage | null => {
    const stage = toValue(options.stage)
    return stage && toValue(options.loadValues) && !stage.property.customValue ? stage : null
  }

  watch(
    () => {
      const stage = remoteStage()
      return stage ? labelKey(stage.property.key, stage.value) : null
    },
    async (key) => {
      const id = ++loadId
      const stage = toValue(options.stage)
      const loader = toValue(options.loadValues)
      valuesLoading.value = key !== null && Boolean(stage && loader)
      valuesFailed.value = false
      if (!valuesLoading.value || !stage || !loader) {
        loadedValues.value = null
        return
      }
      try {
        const values = await loader(stage.property, stage.value)
        if (id !== loadId) return
        values.forEach((option) => {
          if (option.label)
            loadedLabels.set(labelKey(stage.property.key, option.value), option.label)
        })
        loadedValues.value = values
      } catch {
        if (id !== loadId) return
        loadedValues.value = []
        valuesFailed.value = true
      } finally {
        if (id === loadId) valuesLoading.value = false
      }
    }
  )

  const valueRows = computed<'loading' | 'error' | null>(() => {
    if (!remoteStage()) return null
    if (valuesLoading.value) return 'loading'
    return valuesFailed.value ? 'error' : null
  })

  return {
    loadedValues: readonly(loadedValues),
    valueRows,
    loadedLabel: (propertyKey, value) => loadedLabels.get(labelKey(propertyKey, value))
  }
}
