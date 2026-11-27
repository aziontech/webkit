<script setup lang="ts">
  import CollectionPreferences from '@aziontech/ui/collection-preferences'
  import IconButton from '@aziontech/ui/icon-button'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import Select from '@aziontech/ui/select'
  import Tooltip from '@aziontech/ui/tooltip'
  import type {
    CollectionPreferencesProps,
    CollectionPropertyFilterProps
  } from '@aziontech/ui/use-collection'

  import type { TicketInboxView } from './view-ticket-inbox.vue'

  export interface InboxControlsProps {
    /** The saved views, in order, each with its ticket count. */
    views: TicketInboxView[]
    /** The filter bindings from the collection. */
    propertyFilterProps: CollectionPropertyFilterProps
    /** The preferences bindings from the collection. */
    preferencesProps: CollectionPreferencesProps
    /** A request is in flight. */
    loading?: boolean
    /** The list cannot be filtered yet (first load or failure). */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<InboxControlsProps>(), {
    loading: false,
    disabled: false
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
  }>()

  const viewKey = defineModel<string>('viewKey', { required: true })

  const labelOf = (view: TicketInboxView) =>
    view.urgent && view.count > 0
      ? `${view.label} (${view.count}, needs action)`
      : `${view.label} (${view.count})`

  const displayView = (key: string) => {
    const view = props.views.find((entry) => entry.key === key)
    return view ? labelOf(view) : ''
  }
</script>

<template>
  <div class="flex w-full flex-wrap items-start gap-(--spacing-xs)">
    <div class="w-full @2xl/controls:w-(--container-3xs) @2xl/controls:shrink-0">
      <Select
        v-model="viewKey"
        size="medium"
        placeholder="View"
        :disabled="!views.length"
        :display-value="displayView"
      >
        <Select.Trigger
          aria-label="View"
          class="w-full"
        />
        <Select.Content>
          <Select.Item
            v-for="view in views"
            :key="view.key"
            :value="view.key"
          >
            {{ labelOf(view) }}
          </Select.Item>
        </Select.Content>
      </Select>
    </div>
    <div class="flex min-w-0 flex-1 basis-(--container-3xs) items-start gap-(--spacing-xs)">
      <div class="flex min-w-0 grow">
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Filter tickets"
          aria-label="Filter tickets"
          :disabled="disabled"
        />
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
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
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </Tooltip>
        <CollectionPreferences
          v-bind="preferencesProps"
          title="Table preferences"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>
