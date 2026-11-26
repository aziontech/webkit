<script setup lang="ts">
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type {
    CollectionPreferencesProps,
    CollectionPropertyFilterProps
  } from '@aziontech/webkit/use-collection'

  withDefaults(
    defineProps<{
      propertyFilterProps: CollectionPropertyFilterProps
      preferencesProps: CollectionPreferencesProps
      label: string
      loading?: boolean
      disabled?: boolean
      downloadDisabled?: boolean
    }>(),
    { loading: false, disabled: false, downloadDisabled: false }
  )

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()
</script>

<template>
  <header class="flex items-start gap-(--layout-group-gap)">
    <div class="flex min-w-0 grow">
      <PropertyFilter
        v-bind="propertyFilterProps"
        :placeholder="label"
        :aria-label="label"
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
      <Tooltip
        content="Download CSV"
        class="shrink-0"
      >
        <IconButton
          icon="az az-download"
          variant="outline"
          size="medium"
          :disabled="downloadDisabled"
          aria-label="Download CSV"
          @click="(event: MouseEvent) => emit('download', event)"
        />
      </Tooltip>
      <CollectionPreferences
        v-bind="preferencesProps"
        title="Table preferences"
        :disabled="disabled"
      />
    </div>
  </header>
</template>
