<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Input from '../../../input/input/input.vue'
  import Badge from '../../badge/badge.vue'

  defineOptions({ name: 'EventsSearchBar' })

  interface Props {
    /** Text of the filter button. */
    filterLabel: string
    /** Placeholder of the search field. */
    placeholder: string
    /** Accessible name of the search field. */
    ariaLabel?: string
    /** How many filters are applied, shown on the filter button. */
    applied?: number
  }

  withDefaults(defineProps<Props>(), { ariaLabel: '', applied: 1 })

  defineSlots<{
    /** Controls after the search field. */
    default(): unknown
  }>()
</script>

<template>
  <div class="flex items-center gap-(--spacing-xs)">
    <span class="relative shrink-0">
      <Button
        :label="filterLabel"
        variant="outline"
        size="medium"
        icon="az az-filter"
      />
      <Badge
        :label="String(applied)"
        variant="primary"
        size="small"
        aria-hidden="true"
        class="pointer-events-none absolute -top-2 -end-2 min-w-5"
      />
    </span>
    <Input
      model-value=""
      size="medium"
      :placeholder="placeholder"
      :aria-label="ariaLabel || undefined"
      class="min-w-0 grow"
    >
      <template #leading>
        <i
          class="az az-search"
          aria-hidden="true"
        />
      </template>
    </Input>
    <slot />
  </div>
</template>
