import { computed, type ComputedRef, toValue } from 'vue'

import type { FilteringProperty } from '../lib/property-filter'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'

export interface UseCollectionSourcesReturn<T, C> {
  columns: ComputedRef<C[]>
  properties: ComputedRef<FilteringProperty[]>
  sourceItems: ComputedRef<readonly T[]>
}

export function useCollectionSources<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>
): UseCollectionSourcesReturn<T, C> {
  return {
    columns: computed<C[]>(() => [...(toValue(options.columns) ?? [])]),
    properties: computed<FilteringProperty[]>(() => [
      ...(toValue(options.propertyFiltering?.properties) ?? [])
    ]),
    sourceItems: computed<readonly T[]>(() => toValue(options.items) ?? [])
  }
}
