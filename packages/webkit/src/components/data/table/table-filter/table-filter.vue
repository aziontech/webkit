<script setup lang="ts">
  import { computed, defineAsyncComponent, inject, ref, useAttrs, watch } from 'vue'

  import type { PropertyFilterQuery } from '../../../../composables/use-collection/property-filter'
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
    type AppliedFilter,
    type FilterField,
    type TableFilterKind,
    TableInjectionKey
  } from '../injection-key'

  defineOptions({
    name: 'TableFilter',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Fields to filter on; empty uses the table's `filterFields`. */
      fields?: FilterField[]
      /** Trigger text of the menu, accessible name of the property filter. Empty uses the locale catalog. */
      title?: string
      /** `menu` hosts FilterMenu (facets picked from known values); `property` hosts PropertyFilter (typed conditions with operators). */
      kind?: TableFilterKind
    }>(),
    {
      fields: () => [],
      title: '',
      kind: 'menu'
    }
  )

  const emit = defineEmits<{
    apply: [event: Event, filters: AppliedFilter[]]
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__filter` : 'data-table__filter')
  )

  const fields = computed<FilterField[]>(() =>
    props.fields.length ? props.fields : (ctx?.filterFields.value ?? [])
  )
  const local = ref<AppliedFilter[]>([])
  const applied = computed<AppliedFilter[]>(() => ctx?.appliedFilters.value ?? local.value)
  const commit = (event: Event, list: AppliedFilter[]): void => {
    local.value = list
    ctx?.applyFilters(event, list)
    emit('apply', event, list)
  }

  const FilterMenu = defineAsyncComponent(() => import('../../filter-menu/filter-menu.vue'))
  const PropertyFilter = defineAsyncComponent(
    () => import('../../property-filter/property-filter.vue')
  )

  const menuRef = ref<InstanceType<typeof FilterMenuComponent> | null>(null)
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
      if (!filter || props.kind !== 'menu') return
      menuRef.value?.open(filter.field)
      if (ctx) ctx.editingFilter.value = null
    }
  )
</script>

<template>
  <FilterMenu
    v-if="kind === 'menu'"
    ref="menuRef"
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
