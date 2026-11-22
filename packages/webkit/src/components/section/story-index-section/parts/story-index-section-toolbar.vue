<script setup lang="ts">
  import { defineAsyncComponent, ref, useId } from 'vue'

  import Button from '../../../action/button/button.vue'
  import Input from '../../../input/input/input.vue'

  defineOptions({ name: 'StoryIndexSectionToolbar' })

  /** One applied filter, drawn as a removable chip below the large breakpoint. */
  export type StoryIndexSectionToolbarChip = {
    /** Identity of the filter, handed back when its chip is removed. */
    key: string
    /** Visible label of the chip. */
    label: string
  }

  interface Props {
    /** Base of the test ids of the inner parts. */
    testId: string
    /** Draws the filter button and the panel that holds the selects. */
    filterable: boolean
    /** Label of the filter button below the large breakpoint. */
    filterLabel: string
    /** Draws the search field. */
    searchable: boolean
    /** Placeholder of the search field. */
    searchPlaceholder: string
    /** Accessible name of the search field. */
    searchAriaLabel: string
    /** The applied filters, drawn as removable chips below the large breakpoint. */
    applied: StoryIndexSectionToolbarChip[]
  }

  defineProps<Props>()

  /** The search query. */
  const query = defineModel<string>('query', { default: '' })

  const emit = defineEmits<{
    /** A chip was removed; `key` is the filter it stood for. */
    remove: [event: MouseEvent, key: string]
  }>()

  defineSlots<{
    /** The selects of the filter panel. */
    default(): unknown
  }>()

  const Chip = defineAsyncComponent(() => import('../../../input/chip/chip.vue'))

  const filtersOpen = ref(false)

  const panelId = useId()
</script>

<template>
  <div
    role="search"
    class="grid gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))]"
  >
    <div class="flex items-center gap-(--spacing-sm) lg:contents">
      <Button
        v-if="filterable"
        :data-testid="`${testId}__filter`"
        :label="filterLabel"
        variant="outline"
        size="large"
        icon="az az-filter"
        :aria-expanded="filtersOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        class="shrink-0 lg:hidden"
        @click="filtersOpen = !filtersOpen"
      />
      <Input
        v-if="searchable"
        v-model="query"
        size="large"
        type="text"
        :placeholder="searchPlaceholder"
        :aria-label="searchAriaLabel || undefined"
        class="min-w-0 flex-1"
      >
        <template #leading>
          <i class="az az-search text-(--text-muted)" />
        </template>
      </Input>
    </div>
    <div
      v-if="filterable"
      :id="panelId"
      :data-testid="`${testId}__filters`"
      :data-state="filtersOpen ? 'open' : 'closed'"
      class="flex flex-col gap-(--spacing-sm) max-lg:hidden max-lg:data-[state=open]:flex lg:contents"
    >
      <slot />
    </div>
    <div
      v-if="applied.length > 0"
      :data-testid="`${testId}__applied`"
      class="flex flex-wrap gap-(--spacing-xs) lg:hidden"
    >
      <Chip
        v-for="chip in applied"
        :key="chip.key"
        :label="chip.label"
        removable
        size="medium"
        @remove="(event: MouseEvent) => emit('remove', event, chip.key)"
      />
    </div>
  </div>
</template>
