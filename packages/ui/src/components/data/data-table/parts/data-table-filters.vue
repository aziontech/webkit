<script setup lang="ts">
  import SlotOutlet from '../../table/parts/slot-outlet'
  import { useDataTableContext } from '../composables/use-data-table-context'

  defineOptions({ name: 'DataTableFilters' })

  const { view, toolbar } = useDataTableContext()
  const { testId, slots, hasSlot } = view
  const { scope, filterCount } = toolbar
</script>

<template>
  <div
    v-if="hasSlot('filters') && filterCount > 0"
    role="presentation"
    :data-testid="`${testId}__filters`"
    class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
  >
    <SlotOutlet
      :slots="slots"
      name="filters"
      :scope="scope"
    />
  </div>
</template>
