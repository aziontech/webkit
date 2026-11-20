<script setup lang="ts">
  import { computed, defineAsyncComponent, inject, ref, useAttrs, watch } from 'vue'

  import type { PropertyFilterQuery } from '../../../../composables/use-collection/lib/property-filter'
  import { useFilterMenuLabels } from '../../filter-menu/composables/use-filter-menu-labels'
  import type FilterMenuComponent from '../../filter-menu/filter-menu.vue'
  import type { FilterMenuModel } from '../../filter-menu/types'
  import {
    fromQuery,
    toAppliedFilters,
    toMenuFields,
    toMenuModel,
    toProperties,
    toQuery
  } from '../filter-menu-bridge'
  import {
    type TableAppliedFilter,
    type TableFilterField,
    type TableFilterType,
    TableInjectionKey
  } from '../injection-key'

  defineOptions({
    name: 'TableFilter',
    inheritAttrs: false
  })

  export interface TableFilterProps {
    /** Fields to filter on; empty uses the table's `filterFields`. */
    fields?: TableFilterField[]
    /** Trigger text of the menu, accessible name of the property filter. Empty uses the locale catalog. */
    title?: string
    /** `menu` hosts FilterMenu (facets picked from known values); `property` hosts PropertyFilter (typed conditions with operators). */
    type?: TableFilterType
  }

  const props = withDefaults(defineProps<TableFilterProps>(), {
    fields: () => [],
    title: '',
    type: 'menu'
  })

  const emit = defineEmits<{
    apply: [event: Event, filters: TableAppliedFilter[]]
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-filter'
  )

  const fields = computed<TableFilterField[]>(() =>
    props.fields.length ? props.fields : (ctx?.filterFields.value ?? [])
  )
  const local = ref<TableAppliedFilter[]>([])
  const applied = computed<TableAppliedFilter[]>(() => ctx?.appliedFilters.value ?? local.value)
  const commit = (event: Event, list: TableAppliedFilter[]): void => {
    local.value = list
    ctx?.applyFilters(event, list)
    emit('apply', event, list)
  }

  const FilterMenu = defineAsyncComponent(() => import('../../filter-menu/filter-menu.vue'))
  const PropertyFilter = defineAsyncComponent(
    () => import('../../property-filter/property-filter.vue')
  )

  const menuEl = ref<InstanceType<typeof FilterMenuComponent> | null>(null)
  const menuLabels = useFilterMenuLabels()
  const menuFields = computed(() => toMenuFields(fields.value))
  const menuModel = computed<FilterMenuModel>(() => toMenuModel(applied.value, menuFields.value))
  const onMenuChange = (next: FilterMenuModel): void => {
    const ids = new Set(menuFields.value.map((field) => field.id))
    commit(new Event('change'), [
      ...applied.value.filter((filter) => !ids.has(filter.field)),
      ...toAppliedFilters(next, menuFields.value, (field) => menuLabels.summaryText(next, field))
    ])
  }

  const properties = computed(() => toProperties(fields.value))
  const query = computed<PropertyFilterQuery>(() => toQuery(applied.value, fields.value))
  const onQueryChange = (next: PropertyFilterQuery): void => {
    commit(new Event('change'), fromQuery(next, applied.value, fields.value))
  }

  watch(
    () => ctx?.editingFilter.value ?? null,
    (filter) => {
      if (!filter || props.type !== 'menu') return
      menuEl.value?.open(filter.field)
      if (ctx) ctx.editingFilter.value = null
    }
  )
</script>

<template>
  <FilterMenu
    v-if="type === 'menu'"
    ref="menuEl"
    v-bind="$attrs"
    :data-testid="testId"
    :fields="menuFields"
    :label="title"
    :model-value="menuModel"
    @update:model-value="onMenuChange"
  />
  <PropertyFilter
    v-else
    v-bind="$attrs"
    :data-testid="testId"
    :properties="properties"
    :aria-label="title"
    :free-text="false"
    :show-operations="false"
    :query="query"
    class="min-w-0 flex-1"
    @update:query="onQueryChange"
  />
</template>
