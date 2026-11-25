<script setup lang="ts">
  import type { FilterMenuField } from '@aziontech/webkit/filter-menu'
  import FilterMenu from '@aziontech/webkit/filter-menu-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  import type { EventsExplorerFilters } from '../view-events-explorer.vue'

  export interface EventsToolbarProps {
    /** The fields of the filter menu. */
    menuFields: FilterMenuField[]
    /** IANA time zone the times are written in. */
    timeZone: string
    /** A request is in flight. */
    loading: boolean
    /** Download CSV is not available yet. */
    exportDisabled: boolean
    /** Nothing is loaded to filter: the filter and the search show, disabled. */
    disabled?: boolean
  }

  withDefaults(defineProps<EventsToolbarProps>(), { disabled: false })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    export: [event: MouseEvent]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const search = defineModel<string>('search', { required: true })
  const searchEl = ref<InstanceType<typeof Input> | null>(null)
  useShortcuts({
    keys: '/',
    label: 'Focus search',
    element: () => (searchEl.value?.$el as HTMLElement | null | undefined) ?? null,
    handler: () => searchEl.value?.focus()
  })
</script>

<template>
  <header class="flex flex-wrap items-center gap-x-(--layout-group-gap) gap-y-(--spacing-xs)">
    <div class="flex min-w-0 grow basis-(--container-3xs) items-center gap-(--spacing-xs)">
      <FilterMenu
        v-model="filters"
        :fields="menuFields"
        :disabled="disabled"
        class="shrink-0"
        data-testid="filter-button"
      />
      <div class="flex min-w-36 grow basis-(--container-2xs)">
        <Input
          ref="searchEl"
          v-model="search"
          size="medium"
          :disabled="disabled"
          placeholder="Search events, hosts, paths or addresses"
          aria-keyshortcuts="/"
          aria-label="Search events"
          class="w-full"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
    </div>
    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <span
        class="text-label-sm inline-flex items-center gap-(--spacing-2xs) whitespace-nowrap text-(--text-muted)"
        data-testid="events-time-zone"
      >
        <i
          class="az az-globe"
          aria-hidden="true"
        />
        Times in {{ timeZone }}
      </span>
      <Tooltip
        content="Refresh"
        class="shrink-0"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          :loading="loading"
          aria-label="Refresh"
          data-testid="refresh-button"
          @click="(event: MouseEvent) => emit('refresh', event)"
        />
      </Tooltip>
      <Tooltip
        content="Download CSV"
        class="shrink-0"
      >
        <IconButton
          icon="az az-download"
          variant="outline"
          size="medium"
          :disabled="exportDisabled"
          aria-label="Download CSV"
          data-testid="export-button"
          @click="(event: MouseEvent) => emit('export', event)"
        />
      </Tooltip>
    </div>
  </header>
</template>
