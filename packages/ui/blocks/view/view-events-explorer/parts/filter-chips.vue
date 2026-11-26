<script setup lang="ts">
  import Chip from '@aziontech/ui/chip'
  import FilterMenu, { type FilterMenuField, type FilterMenuValue } from '@aziontech/ui/filter-menu'

  import type { EventsExplorerExclusionChip } from '../composables/use-events-explorer-log'
  import type { EventsExplorerFilters } from '../view-events-explorer.vue'

  export interface FilterChipsProps {
    /** The fields of the filter menu. */
    menuFields: FilterMenuField[]
    /** One chip per exclusion. */
    exclusionChips: EventsExplorerExclusionChip[]
  }

  defineProps<FilterChipsProps>()

  const emit = defineEmits<{
    'remove-exclusion': [id: string, value: FilterMenuValue]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
</script>

<template>
  <div
    v-if="exclusionChips.length"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
  >
    <FilterMenu.ChipGroup
      v-model="filters"
      :fields="menuFields"
      data-testid="filter-chips"
    />
    <span
      v-for="chip in exclusionChips"
      :key="chip.key"
      class="inline-flex w-fit max-w-full"
    >
      <Chip
        :label="`${chip.label} is not ${chip.text}`"
        variant="filled"
        size="medium"
        removable
        data-testid="exclusion-chip"
        @remove="emit('remove-exclusion', chip.id, chip.value)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
          <span class="truncate text-(--text-muted)">{{ chip.label }} is not</span>
          <span class="truncate">{{ chip.text }}</span>
        </span>
      </Chip>
    </span>
  </div>
  <FilterMenu.ChipGroup
    v-else
    v-model="filters"
    :fields="menuFields"
    data-testid="filter-chips"
  />
</template>
