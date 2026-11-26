<script setup lang="ts">
  import EmptyState from '../../../feedback/empty-state/empty-state.vue'
  import SlotOutlet from '../../table/parts/slot-outlet'
  import { useDataTableContext } from '../composables/use-data-table-context'

  defineOptions({ name: 'DataTableStates' })

  const { view } = useDataTableContext()
  const { testId, slots, hasSlot, t, props, rowTotal } = view
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="!props.loading && props.error"
      role="alert"
      :data-testid="`${testId}__error`"
      class="sticky start-0 w-full"
    >
      <SlotOutlet
        v-if="hasSlot('error')"
        :slots="slots"
        name="error"
        :scope="{ message: props.error }"
      />
      <EmptyState
        v-else
        size="small"
        icon="az az-triangle-alert"
        :title="t('table.errorTitle')"
        :description="props.error"
      />
    </div>
    <div
      v-else-if="!props.loading && rowTotal === 0"
      :data-testid="`${testId}__empty`"
      class="sticky start-0 w-full"
    >
      <SlotOutlet
        v-if="hasSlot('empty')"
        :slots="slots"
        name="empty"
      />
      <EmptyState
        v-else
        size="small"
        icon="az az-table"
        :title="t('table.emptyTitle')"
        :description="t('table.emptyDescription')"
      />
    </div>
  </Transition>
</template>
